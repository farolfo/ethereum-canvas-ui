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

const address = '0x8a6fe7a33e09bc0021a3df011cda8b4ccf4c0969';
var contract;

function initContract(ethContract) {
  const EthMillonDollarHomepage = ethContract(abi);
  contract = EthMillonDollarHomepage.at(address);

  setInterval(function() {
    getPixel().then(updatePixel);
  }, 1000);
}

function getPixel() {
    return contract.checkPixel(0, 0);
}

function buyPixel() {
    var price = $('#priceToPay').val();
    var color = $('#colorToSet').val();

    return contract.buyPixel(0, 0, color, parseInt(price), {
        from: web3.eth.accounts[0],
        value: web3.toWei(price, 'ether')
    });
}

function updatePixel(pixel) {
    $('.pixel').css('background-color', pixel.color ? pixel.color : 'black');
    $('#owner').text(pixel.owner);
    //$('#price').text(price);
}

window.buyPixel = buyPixel;