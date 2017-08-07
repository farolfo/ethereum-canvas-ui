'use strict';

const smartContractConfig = {
  address: '0x85a84691547b7ccf19d7c31977a7f8c0af1fb25a',
  abi: [
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
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "color",
          "type": "string"
        }
      ],
      "name": "Purchase",
      "type": "event"
    }
  ]
};

var root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global ||
  this ||
  {};

root.smartContractConfig = smartContractConfig;
