'use strict';

/**
 * Variables used to share the pixel coordinates and price to purchase.
 */
var targetX, targetY, currentPrice;

/**
 * Performs the purchase of the pixel in the (targetX, targetY) coordinates.
 *
 * @returns {*} The transaction response.
 */
function buyPixel() {
    var price = $('#price').val();
    var color = $('#color').val();

    contract.buyPixel(targetX, targetY, color, {
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
    currentPrice = event.target.getAttribute('price');
    var priceElem = $('#price');

    if (currentPrice) {
        priceElem.val(currentPrice);
        priceElem.attr('data-error', 'The price must a valid number be bigger than ' + currentPrice);
        priceElem.attr('min', currentPrice + ethereumCanvasService.getEpsilon());
    } else {
        priceElem.attr('data-error', 'Must be a valid positive number.');
        priceElem.attr('min', ethereumCanvasService.getMinAcceptedEth());
    }

    priceElem.attr('step', ethereumCanvasService.getEpsilon());
    $('#targetPixel').text('(' + targetX + ',' + targetY + ')');
    $('#buyPixelModal').modal('show');
}

window.openBuyPixelModal = openBuyPixelModal;
window.buyPixel = buyPixel;