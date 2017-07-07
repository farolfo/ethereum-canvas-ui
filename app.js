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

  initWindow();
  initContract(ethContract);
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
        },
        {
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "buyPixel",
      "outputs": [],
      "payable": true,
      "type": "function"
    }
  ];

const address = '0x341fb0cef01bdaec38771442b6d18a21b45bbbb2';

const WINDOW_SIZE = 4;
const PIXEL_SIZE = 20;

var contract;

var _x, _y;

function initWindow() {
    var root = $('#window');

    root.css('width', (WINDOW_SIZE*PIXEL_SIZE) + 'px');
    root.css('height', (WINDOW_SIZE*PIXEL_SIZE) + 'px');

    for (var x = 0; x < WINDOW_SIZE; x++) {
        for (var y = 0; y < WINDOW_SIZE; y++) {
            root.append(createPixel(x, y));
        }
    }
}

function createPixel(x, y) {
    return $('<div></div>')
              .addClass('pixel')
              .css('width', PIXEL_SIZE + 'px')
              .css('height', PIXEL_SIZE + 'px')
              .css('top', (x*PIXEL_SIZE) + 'px')
              .css('left', (y*PIXEL_SIZE) + 'px')
              .attr('id', 'pixel-' + x + "-" + y)
              .attr('onclick', 'openBuyPixelModal(' + x + ',' + y + ');')
              .tooltip({
                title: 'Pixel (' + x + ',' + y + '): It is free!'
              });
}

function initContract(ethContract) {
  const EthMillonDollarHomepage = ethContract(abi);
  contract = EthMillonDollarHomepage.at(address);

  setInterval(updateWindow, 1000);
}

function updateWindow() {
    for (var x = 0; x < WINDOW_SIZE; x++) {
        for (var y = 0; y < WINDOW_SIZE; y++) {
            console.log('---' + x + ',' + y);
            getPixel(x, y).then(p => updatePixel(p, x, y));
        }
    }
}

function getPixel(x, y) {
    return contract.checkPixel(x, y);
}

function buyPixel() {
    var price = $('#price').val();
    var color = $('#color').val();

    return contract.buyPixel(_x, _y, color, parseInt(price), {
        from: web3.eth.accounts[0],
        value: web3.toWei(price, 'ether')
    });
}

function openBuyPixelModal(x, y) {
    _x = x;
    _y = y;
    $('#buyPixelModal').modal('show');
}

function updatePixel(pixel, x, y) {
    console.log('Pixel at (' + x + ',' + y + ') has color ' + pixel.color);
    $('#pixel-' + x + '-' + y).css('background-color', pixel.color ? pixel.color : 'black');
}

window.openBuyPixelModal = openBuyPixelModal;
window.buyPixel = buyPixel;