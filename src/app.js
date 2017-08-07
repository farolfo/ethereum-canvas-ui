'use strict';

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

const WINDOW_SIZE = 20;
const PIXEL_SIZE = 5;

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

function startApp() {
  const eth = new Eth(web3.currentProvider);
  const ethContract = new EthContract(eth);

  initContract(ethContract);
  initWindow();

  setInterval(refreshWindow, 1000);
  listenPurchaseEvents();
}

function initContract(ethContract) {
  const EthMillonDollarHomepage = ethContract(smartContractConfig.abi);
  contract = EthMillonDollarHomepage.at(smartContractConfig.address);
}

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

function initWindow() {
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          var elem = d3.select(this);
          var message = '<strong>Pixel (' + d.x + ',' + d.y + ')</strong><br>';

          if (!elem.attr('price')) {
            message += "<span style='color:green'>FREE!</span>";
          } else {
            message += "<span style='color:green'>ETH " + elem.attr('price') + "</span>";
          }
          
          return message;
        });

    var window = d3.select('#window').append('svg');

    window.call(tip);

    window.attr('height', WINDOW_SIZE*PIXEL_SIZE)
        .attr('width', WINDOW_SIZE*PIXEL_SIZE)
        .selectAll('rect')
          .data(getInitialEmptyWindowGrid())
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

function refreshWindow() {
  for (let x = 0; x < WINDOW_SIZE; x++) {
    for (let y = 0; y < WINDOW_SIZE; y++) {
      getPixel(x, y).then(p => updatePixel(p, x, y));
    }
  }
}

function getInitialEmptyWindowGrid() {
    var resp = [];
    for (var x = 0; x < WINDOW_SIZE; x++) {
        for (var y = 0; y < WINDOW_SIZE; y++) {
            resp.push({x: x, y: y});
        }
    }
    return resp;
}

function getPixel(x, y) {
    return contract.checkPixel(x, y);
}

function buyPixel() {
    var price = $('#price').val();
    var color = $('#color').val();

    return contract.buyPixel(targetX, targetY, color, {
        from: web3.eth.accounts[0],
        value: web3.toWei(price, 'ether')
    });
}

var targetX, targetY;

function openBuyPixelModal(x, y) {
    targetX = x;
    targetY = y;
    $('#targetPixel').text('(' + x + ',' + y + ')');
    $('#buyPixelModal').modal('show');
}

function updatePixel(pixel, x, y) {
    d3.select('#pixel-' + x + '-' + y)
      .attr('price', pixel.price ? web3.fromWei(pixel.price, 'ether') : '')
      .style('fill', pixel.color ? pixel.color : 'black');
}

window.openBuyPixelModal = openBuyPixelModal;
window.buyPixel = buyPixel;