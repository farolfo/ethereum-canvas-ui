'use strict';

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

/**
 * You will get a window with a size of WINDOW_SIZE x WINDOW_SIZE.
 *
 * @type {number}
 */
const WINDOW_SIZE = 20;

/**
 * Each pixel's size.
 *
 * @type {number}
 */
const PIXEL_SIZE = 3;

/**
 * The global smart contract.
 */
var contract;

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
  const eth = new Eth(web3.currentProvider);
  const ethContract = new EthContract(eth);

  initContract(ethContract);
  initWindow();

  listenPurchaseEvents();
  setInterval(refreshWindow, 1000);
}

/**
 * Initializes the smart contract with the given EthContract instance.
 *
 * @param ethContract The EthContract instance to be used.
 */
function initContract(ethContract) {
  const EthMillonDollarHomepage = ethContract(smartContractConfig.abi);
  contract = EthMillonDollarHomepage.at(smartContractConfig.address);
}

/**
 * Initializes the window grid.
 */
function initWindow() {
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(buildTooltipHtml);

    var window = d3.select('#window').append('svg');

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
            .attr('loading', 'true')
            .attr('id', d => 'pixel-' + d.x + "-" + d.y)
            .attr('onclick', d => 'openBuyPixelModal(' + d.x + ',' + d.y + ');')
            .style('fill', 'black')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
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
 * Forces a refresh in the window, calling the smart contract one call per pixel.
 */
function refreshWindow() {
  for (let x = 0; x < WINDOW_SIZE; x++) {
    for (let y = 0; y < WINDOW_SIZE; y++) {
      getPixel(x, y).then(p => updatePixel(p, x, y));
    }
  }
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
 * Calls the smart contract and returns the pixel information.
 *
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @returns {*} The Pixel object.
 */
function getPixel(x, y) {
    return contract.checkPixel(x, y);
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
 *
 * @param x The x coordinate.
 * @param y The y coordinate.
 */
function openBuyPixelModal(x, y) {
    targetX = x;
    targetY = y;
    $('#targetPixel').text('(' + x + ',' + y + ')');
    $('#buyPixelModal').modal('show');
}

/**
 * Updates the pixel at (x,y) with the color and price given in the pixel attribute.
 *
 * @param pixel The updated pixel.
 * @param x The x coordinate.
 * @param y The y coordinate.
 */
function updatePixel(pixel, x, y) {
    d3.select('#pixel-' + x + '-' + y)
      .attr('loading', null)
      .attr('price', pixel.price ? web3.fromWei(pixel.price, 'ether') : '')
      .style('fill', pixel.color ? pixel.color : 'black');
}

/**
 * Listens to the Purchase events since the beginning of time.
 */
function listenPurchaseEvents() {
  const events = contract.Purchase({}, { fromBlock: 0, toBlock: 'latest' });

  events.watch(function (error, result) {
    if (!error){
      console.log('The event is ' + result);
    } else {
      console.error('Got error watching Purchase event: ' + error);
    }
  });
}

window.openBuyPixelModal = openBuyPixelModal;
window.buyPixel = buyPixel;