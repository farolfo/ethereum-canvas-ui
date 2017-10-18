'use strict';

/**
 * You will get a window with a size of WINDOW_SIZE x WINDOW_SIZE.
 *
 * @type {number}
 */
const WINDOW_SIZE = 300;

/**
 * Each pixel's size.
 *
 * @type {number}
 */
const PIXEL_SIZE = 2;

const uiCanvas = {

    /**
     * Initializes the window grid.
     */
    init: function() {
        $('#canvasLoadingSpinner').css('display', 'none');

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(buildTooltipHtml);

        var window = d3.select('#window').append('svg').attr('onclick', d => 'openBuyPixelModal();');

        window.call(tip);

        window.attr('height', WINDOW_SIZE*PIXEL_SIZE)
            .attr('width', WINDOW_SIZE*PIXEL_SIZE)
            .selectAll('rect')
              .data(buildInitialEmptyWindowData())
            	.enter()
                .append('rect')
                .classed('pixel', true)
                .attr('x', d => d.x * PIXEL_SIZE)
            	.attr('y', d => d.y * PIXEL_SIZE)
            	.attr('width', PIXEL_SIZE)
                .attr('height', PIXEL_SIZE)
                .attr('id', d => 'pixel-' + d.x + "-" + d.y)
                .style('fill', 'white')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
    },

    /**
     * Updates the pixel at (x,y) with the color and price given in the pixel attribute.
     *
     * @param pixel The updated pixel.
     * @param x The x coordinate.
     * @param y The y coordinate.
     * @param price The payed price for this pixel.
     */
    updatePixel: function(x, y, color, price, owner) {
        console.log('Updating pixel at (' + x + ',' + y + ') with color ' + color + ' and price ' + price);

        d3.select('#pixel-' + x + '-' + y)
            .attr('loading', null)
            .attr('owner', owner)
            .attr('price', price ? web3.fromWei(price, 'ether') : null)
            .style('fill', color ? color : 'black');
    }
};

/**
 * Returns a plain initial window grid data object to be used by D3 to initialize the window.
 *
 * @returns {Array} The array of pixel objects.
 */
function buildInitialEmptyWindowData() {
    var resp = [];
    for (var x = 0; x < WINDOW_SIZE; x++) {
        for (var y = 0; y < WINDOW_SIZE; y++) {
            resp.push({x: x, y: y});
        }
    }
    return resp;
}

/**
 * Returns the tooltip html of the given pixel.
 *
 * @param p An object with x and y attributes with the pixel coordinates.
 * @returns {string} The tooltip html.
 */
function buildTooltipHtml(p) {
    var elem = d3.select(this);

    var message = '<strong>Pixel (' + p.x + ',' + p.y + ')</strong>';

    if (!elem.attr('owner')) {
        message += "<br><span style='color: #17BC65'>Available</span>";
    } else {
        message += "<span style='color: #17BC65; float: right;'>ETH " + elem.attr('price') + "</span><br><span style='color: #D1344E'>Owned by " + elem.attr('owner') + "</span>";
    }

    return message;
}

var root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global ||
  this || {};

root.uiCanvas = uiCanvas;
