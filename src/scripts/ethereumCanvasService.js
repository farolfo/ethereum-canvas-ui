'use strict';

/**
 * Key used in the localStorage to save the known pixels.
 * @type {string}
 */
const LOCAL_STORAGE_CANVAS_KEY = "localCanvas";

/**
 * Key used in the localStorage to save the last checked block number.
 * @type {string}
 */
const LOCAL_STORAGE_LAST_CHECKED_BLOCK_KEY = "lastCheckedBlock";

/**
 * The minimum increment we accept when beating the current price of an already owned pixel.
 * @type {double}
 */
const EPSILON = 1e-6;

/**
 * The minimum ETH we accept to buy a non-owned pixel.
 * @type {double}
 */
const MIN_ACCEPTED_ETH = EPSILON;

/**
 * The global smart contract.
 */
var contract;

/**
 * The latest synched block.
 */
var latestBlock;

const ethereumCanvasService = {

    /**
     * Initializes the smart contract with the given EthContract instance.
     */
    initContract: function() {
        var truffleContract = TruffleContract(config.build);

        truffleContract.setProvider(web3.currentProvider);
        truffleContract.at(config.address);

        return truffleContract.deployed();
    },

    /**
     * Sets the service to use this contract. (This could be part of the init logic)
     *
     * @param ethContract The EthContract instance to be used.
     */
    setContract: function(instance) {
        contract = instance;
    },

    /**
     * Updates the current canvas with the information stored in the local storage.
     */
    updateCanvasFromLocalStorage: function() {
        var localCanvas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CANVAS_KEY));

        if (localCanvas) {
            _.forEach(localCanvas, function(val, key) {
                console.log('Update via localStorage:');
                let x = key.split(',')[0];
                let y = key.split(',')[1];
                uiCanvas.updatePixel(x, y, val.color, val.price, val.owner);
            });
        }
    },

    /**
     * Listens to the Purchase events since the beginning of time and update the window accordingly.
     */
    listenPurchaseEvents: function() {
        web3.eth.getBlock('latest', function(err, block) {
            latestBlock = block.number;

            const fromBlock = localStorage.getItem(LOCAL_STORAGE_LAST_CHECKED_BLOCK_KEY) || 0;
            const events = contract.Purchase({}, { fromBlock: fromBlock, toBlock: latestBlock });

            console.log('Listening events from block ' + fromBlock + '...');
            events.watch(onPurchaseEvent);
        });
    },

    /**
     * Returns the minimum increment we accept when beating the current price of an already owned pixel.
     */
    getEpsilon: function() {
        return EPSILON;
    },

    /**
     * Returns the minimum ETH we accept to buy a non-owned pixel.
     */
    getMinAcceptedEth: function() {
        return MIN_ACCEPTED_ETH;
    }
};

/**
 * Handler per Purchase event.
 */
function onPurchaseEvent(error, result) {
    if (!error){
        localStorage.setItem(LOCAL_STORAGE_LAST_CHECKED_BLOCK_KEY, result.blockNumber);
        updateLocalStorageWindow(result.args.x, result.args.y, result.args.color, result.args.price, result.args.owner);

        uiCanvas.updatePixel(result.args.x, result.args.y, result.args.color, result.args.price, result.args.owner);
    } else {
        console.error('Got error watching the Purchase event: ' + error);
    }
}

/**
 * Updates the local storage with the given pixel information.
 */
function updateLocalStorageWindow(x, y, color, price, owner) {
    var localCanvas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CANVAS_KEY)) || {};
    localCanvas[x + ',' + y] = {color: color, price: price, owner: owner};
    localStorage.setItem(LOCAL_STORAGE_CANVAS_KEY, JSON.stringify(localCanvas));
}

var root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global ||
  this || {};

root.ethereumCanvasService = ethereumCanvasService;
