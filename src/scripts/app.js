'use strict';

/**
 * We must wait to have the web3 element injected by the browser.
 */
window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined' && typeof TruffleContract !== 'undefined') {
        startApp();
    } else {
         $('#canvasLoadingSpinner').css('display', 'none');
         $('#metaMaskNotInstalled').css('display', 'block');
    }
});

/**
 * Starts the application, initializing the smart contract, the window gird and starting the respective event listeners.
 */
function startApp() {
    ethereumCanvasService.initContract().then(function(instance) {
        uiCanvas.init();
        ethereumCanvasService.setContract(instance);

        ethereumCanvasService.updateCanvasFromLocalStorage();
        ethereumCanvasService.listenPurchaseEvents();
    }).catch(function(err) {
        $('#canvasLoadingSpinner').css('display', 'none');
        debugger
        $('#contractNotFound').css('display', 'block');
    });
}
