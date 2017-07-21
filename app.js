const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

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
}

const abi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "x",
          "type": "uint256"
        },
        {
          "name": "y",
          "type": "uint256"
        }
      ],
      "name": "checkPixel",
      "outputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "price",
          "type": "uint256"
        },
        {
          "name": "color",
          "type": "string"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "uint256"
        },
        {
          "name": "y",
          "type": "uint256"
        },
        {
          "name": "color",
          "type": "string"
        }
      ],
      "name": "buyPixel",
      "outputs": [],
      "payable": true,
      "type": "function"
    }
  ];

const address = '0xbca6fa8b17f355a92b2c272d6403185f433ab8db';

const WINDOW_SIZE = 4;
const PIXEL_SIZE = 20;

var contract;

function initWindow() {
    d3.select('#window').append('svg')
        .attr('height', WINDOW_SIZE*PIXEL_SIZE)
        .attr('width', WINDOW_SIZE*PIXEL_SIZE)
        .selectAll('rect')
            .data(getInitialEmptyWindowGrid())
        	.enter()
            .append('rect')
            .attr('x', d => d.x * PIXEL_SIZE)
        	.attr('y', d => d.y * PIXEL_SIZE)
        	.attr('width', PIXEL_SIZE)
            .attr('height', PIXEL_SIZE)
            .attr('id', d => 'pixel-' + d.x + "-" + d.y)
            .attr('onclick', d => 'openBuyPixelModal(' + d.x + ',' + d.y + ');')
            .style('fill', 'black');
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

function initContract(ethContract) {
  const EthMillonDollarHomepage = ethContract(abi);
  contract = EthMillonDollarHomepage.at(address);
}

function refreshWindow() {
//    for (var x = 0; x < WINDOW_SIZE; x++) {
//        for (var y = 0; y < WINDOW_SIZE; y++) {
//            getPixel(x, y).then(p => updatePixel(p, x, y));
//        }
//    }

    // ^^
    // The for loop doesn't works but this does, digging why
    getPixel(0, 0).then(p => updatePixel(p, 0, 0));
    getPixel(0, 1).then(p => updatePixel(p, 0, 1));
    getPixel(0, 2).then(p => updatePixel(p, 0, 2));
    getPixel(0, 3).then(p => updatePixel(p, 0, 3));
    getPixel(1, 0).then(p => updatePixel(p, 1, 0));
    getPixel(1, 1).then(p => updatePixel(p, 1, 1));
    getPixel(1, 2).then(p => updatePixel(p, 1, 2));
    getPixel(1, 3).then(p => updatePixel(p, 1, 3));
    getPixel(2, 0).then(p => updatePixel(p, 2, 0));
    getPixel(2, 1).then(p => updatePixel(p, 2, 1));
    getPixel(2, 2).then(p => updatePixel(p, 2, 2));
    getPixel(2, 3).then(p => updatePixel(p, 2, 3));
    getPixel(3, 0).then(p => updatePixel(p, 3, 0));
    getPixel(3, 1).then(p => updatePixel(p, 3, 1));
    getPixel(3, 2).then(p => updatePixel(p, 3, 2));
    getPixel(3, 3).then(p => updatePixel(p, 3, 3));
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
    console.log('Pixel at (' + x + ',' + y + ') has color ' + pixel.color);
    d3.select('#pixel-' + x + '-' + y).style('fill', pixel.color ? pixel.color : 'black');
}

window.openBuyPixelModal = openBuyPixelModal;
window.buyPixel = buyPixel;