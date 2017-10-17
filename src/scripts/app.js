'use strict';

/**
 * We must wait to have the web3 element injected by the browser.
 */
window.addEventListener('load', function() {

  // Check if Web3 has been injected by the browser:
  if (typeof web3 !== 'undefined' && typeof TruffleContract !== 'undefined') {
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
    uiCanvas.init();
    ethereumCanvasService.updateCanvasFromLocalStorage();

    ethereumCanvasService.initContract().then(function(instance) {
        ethereumCanvasService.setContract(instance);
        ethereumCanvasService.listenPurchaseEvents();
    });
}
