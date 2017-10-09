'use strict';

/**
 * You will get a window with a size of WINDOW_SIZE x WINDOW_SIZE.
 *
 * @type {number}
 */
const WINDOW_SIZE = 300;

/**
 * Each pixel's size.
 *
 * @type {number}
 */
const PIXEL_SIZE = 1;

/**
 * Key used in the localStorage to save the known pixels.
 * @type {string}
 */
const LOCAL_STORAGE_WINDOW_KEY = "localWindow";

/**
 * Key used in the localStorage to save the last checked block number.
 * @type {string}
 */
const LOCAL_STORAGE_LAST_CHECKED_BLOCK_KEY = "lastCheckedBlock";

/**
 * The global smart contract.
 */
var contract;

/**
 * We must wait to have the web3 element injected by the browser.
 */
window.addEventListener('load', function() {

  // Check if Web3 has been injected by the browser:
  if (typeof web3 !== 'undefined') {
    // You have a web3 browser! Continue below!
    startApp();
  } else {
     // Warn the user that they need to get a web3 browser
     // Or install MetaMask, maybe with a nice graphic.
  }

});

/**
 * Starts the application, initializing the smart contract, the window gird and starting the respective event listeners.
 */
function startApp() {
  initWindow();
  updateWindowFromLocalStorage();

  initContract().then(function(instance) {
    contract = instance;
    listenPurchaseEvents();
  });
}

/**
 * Initializes the smart contract with the given EthContract instance.
 *
 * @param ethContract The EthContract instance to be used.
 */
function initContract() {
  var truffleContract = TruffleContract(smartContractConfig.build);

  truffleContract.setProvider(web3.currentProvider);
  truffleContract.at(smartContractConfig.address);

  return truffleContract.deployed();
}

/**
 * Initializes the window grid.
 */
function initWindow() {
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(buildTooltipHtml);

    var window = d3.select('#window').append('svg').attr('onclick', d => 'openBuyPixelModal();');

    window.call(tip);

    window.attr('height', WINDOW_SIZE*PIXEL_SIZE)
        .attr('width', WINDOW_SIZE*PIXEL_SIZE)
        .selectAll('rect')
          .data(buildInitialEmptyWindowData())
        	.enter()
            .append('rect')
            .classed('pixel', true)
            .attr('x', d => d.x * PIXEL_SIZE)
        	  .attr('y', d => d.y * PIXEL_SIZE)
        	  .attr('width', PIXEL_SIZE)
            .attr('height', PIXEL_SIZE)
            .attr('id', d => 'pixel-' + d.x + "-" + d.y)
            .attr('onclick', d => 'openBuyPixelModal(' + d.x + ',' + d.y + ');')
            .style('fill', 'black')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
}

function updateWindowFromLocalStorage() {
  var localWindow = JSON.parse(localStorage.getItem(LOCAL_STORAGE_WINDOW_KEY));

  if (localWindow) {
    _.forEach(localWindow, function(val, key) {
      console.log('Update via localStorage:');
      let x = key.split(',')[0];
      let y = key.split(',')[1];
      updatePixel(x, y, val.color, val.price);
    });
  }
}

/**
 * Returns the tooltip html of the given pixel.
 *
 * @param p An object with x and y attributes with the pixel coordinates.
 * @returns {string} The tooltip html.
 */
function buildTooltipHtml(p) {
  var elem = d3.select(this);

  if (elem.attr('loading')) {
    return '<strong>Loading...</strong>';
  }

  var message = '<strong>Pixel (' + p.x + ',' + p.y + ')</strong><br>';

  if (!elem.attr('price') || elem.attr('price') == '0') {
    message += "<span style='color:green'>FREE!</span>";
  } else {
    message += "<span style='color:green'>ETH " + elem.attr('price') + "</span>";
  }

  return message;
}

/**
 * Returns a plain initial window grid data object to be used by D3 to initialize the window.
 *
 * @returns {Array} The array of pixel objects.
 */
function buildInitialEmptyWindowData() {
    var resp = [];
    for (var x = 0; x < WINDOW_SIZE; x++) {
        for (var y = 0; y < WINDOW_SIZE; y++) {
            resp.push({x: x, y: y});
        }
    }
    return resp;
}

/**
 * Variables used to share the pixel coordinates to purchase.
 */
var targetX, targetY;

/**
 * Performs the purchase of the pixel in the (targetX, targetY) coordinates.
 *
 * @returns {*} The transaction response.
 */
function buyPixel() {
    var price = $('#price').val();
    var color = $('#color').val();

    return contract.buyPixel(targetX, targetY, color, {
        from: web3.eth.accounts[0],
        value: web3.toWei(price, 'ether')
    });
}

/**
 * Configures the purchase modal header and opens the modal.
 */
function openBuyPixelModal() {
    targetX = event.target.getAttribute('x');
    targetY = event.target.getAttribute('y');
    $('#targetPixel').text('(' + targetX + ',' + targetY + ')');
    $('#buyPixelModal').modal('show');
}

/**
 * Updates the pixel at (x,y) with the color and price given in the pixel attribute.
 *
 * @param pixel The updated pixel.
 * @param x The x coordinate.
 * @param y The y coordinate.
 */
function updatePixel(x, y, color, price) {
  console.log('Updating pixel at (' + x + ',' + y + ') with color ' + color + ' and price ' + price);

  d3.select('#pixel-' + x + '-' + y)
      .attr('loading', null)
      .attr('price', price ? web3.fromWei(price, 'ether') : '')
      .style('fill', color ? color : 'black');
}

/**
 * Listens to the Purchase events since the beginning of time and update the window accordingly.
 */
function listenPurchaseEvents() {
  const fromBlock = localStorage.getItem(LOCAL_STORAGE_LAST_CHECKED_BLOCK_KEY) || 0;
  const events = contract.Purchase({}, { fromBlock: fromBlock, toBlock: 'latest' });

  console.log('Listening events from block ' + fromBlock + '...');

  events.watch(function (error, result) {
    if (!error){
      localStorage.setItem(LOCAL_STORAGE_LAST_CHECKED_BLOCK_KEY, result.blockNumber);
      updateLocalStorageWindow(result.args.x, result.args.y, result.args.color, result.args.price);

      updatePixel(result.args.x, result.args.y, result.args.color, result.args.price);
    } else {
      console.error('Got error watching the Purchase event: ' + error);
    }
  });
}

function updateLocalStorageWindow(x, y, color, price) {
  var localWindow = JSON.parse(localStorage.getItem(LOCAL_STORAGE_WINDOW_KEY)) || {};
  localWindow[x + ',' + y] = {color: color, price: price};
  localStorage.setItem(LOCAL_STORAGE_WINDOW_KEY, JSON.stringify(localWindow));
}

window.openBuyPixelModal = openBuyPixelModal;
window.buyPixel = buyPixel;