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
     *
     * @param ethContract The EthContract instance to be used.
     */
    initContract: function() {
        var truffleContract = TruffleContract(config.build);

        truffleContract.setProvider(web3.currentProvider);
        truffleContract.at(config.address);

        return truffleContract.deployed();
    },

    setContract: function(instance) {
        contract = instance;
    },

    updateCanvasFromLocalStorage: function() {
        var localCanvas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CANVAS_KEY));

        if (localCanvas) {
            _.forEach(localCanvas, function(val, key) {
                console.log('Update via localStorage:');
                let x = key.split(',')[0];
                let y = key.split(',')[1];
                uiCanvas.updatePixel(x, y, val.color, val.price);
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
    }
};

/**
 * Handler per Purchase event.
 */
function onPurchaseEvent(error, result) {
    if (!error){
        localStorage.setItem(LOCAL_STORAGE_LAST_CHECKED_BLOCK_KEY, result.blockNumber);
        updateLocalStorageWindow(result.args.x, result.args.y, result.args.color, result.args.price);

        uiCanvas.updatePixel(result.args.x, result.args.y, result.args.color, result.args.price);
    } else {
        console.error('Got error watching the Purchase event: ' + error);
    }
}

function updateLocalStorageWindow(x, y, color, price) {
    var localCanvas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CANVAS_KEY)) || {};
    localCanvas[x + ',' + y] = {color: color, price: price};
    localStorage.setItem(LOCAL_STORAGE_CANVAS_KEY, JSON.stringify(localCanvas));
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

window.openBuyPixelModal = openBuyPixelModal;
window.buyPixel = buyPixel;

var root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global ||
  this || {};

root.ethereumCanvasService = ethereumCanvasService;
