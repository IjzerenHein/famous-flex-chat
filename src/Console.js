/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define, console*/
/*eslint no-use-before-define:0, no-console:0 */

/**
 * @module
 */
define(function(require, exports, module) {
    'use strict';

    // import dependencies
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var View = require('famous/core/View');

    // globals
    var instance;

    /**
     * @class
     * @extends TextareaSurface
     * @param {Object} [options] Configuration options
     */
    function Console(options) {
        instance = this;
        View.apply(this, arguments);

        // Create log surface
        var modifier = new Modifier({
            //size: [undefined, 100]
        });
        this.surface = new Surface({
            properties: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'rgba(255, 255, 255, 0.5)',
                'z-index': 1000,
                overflow: 'auto'
            }
        });
        this.add(modifier).add(this.surface);

        // Hijack original console.log
        var originalConsoleLog = console.log;
        console.log = function(args) {
            originalConsoleLog.apply(console, arguments);
            instance.log.apply(instance, arguments);
        };
    }
    Console.prototype = Object.create(View.prototype);
    Console.prototype.constructor = Console;

    /**
     * Logs content to the console.
     */
    Console.prototype.log = function(text) {
        var value = this.surface.getContent();
        if (value !== '') {
            value += '<br>';
        }
        value += text;
        this.surface.setContent(value);
    };

    /**
     * Logs content to the console.
     */
    Console.log = function(text) {
        if (instance) {
            instance.log(text);
        }
    };

    /**
     * Get the global console instance.
     */
    Console.prototype.getInstance = function() {
        return instance;
    };

    module.exports = Console;
});
