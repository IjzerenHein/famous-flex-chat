/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define, Please, console*/
/*eslint no-console:0 no-use-before-define:0*/
var _globalTextAreaViewId = 1;
define(function(require, exports, module) {

    // import dependencies
    var TextareaSurface = require('famous/surfaces/TextareaSurface');

    /**
     * @class
     * @param {Object} options Options.
     * @alias module:AutoSizeTextareaSurface
     */
    function AutoSizeTextareaSurface() {
        TextareaSurface.apply(this, arguments);
    }
    AutoSizeTextareaSurface.prototype = Object.create(TextareaSurface.prototype);
    AutoSizeTextareaSurface.prototype.constructor = AutoSizeTextareaSurface;

    /**
     * Get the internal content height of the text-area.
     *
     * @return {Number} content height of text-area
     */
    AutoSizeTextareaSurface.prototype.getContentHeight = function() {
        return this._scrollHeight;
    };

    /**
     * Updates the height according to the content
     */
    function _updateHeight(){
        if (this._currTarget) {
            var scrollHeight = this._currTarget.scrollHeight;
            if (this._scrollHeight !== scrollHeight) {
                this._scrollHeight = scrollHeight;
                this.emit('contentHeightChanged', this);
            }
        }
    }

    /**
     * Return spec for this surface. Note that for a base surface, this is
     *    simply an id.
     *
     * @method render
     * @private
     * @return {Object} render spec for this surface (spec id)
     */
    AutoSizeTextareaSurface.prototype.render = function render() {
        _updateHeight.call(this);
        return this.id;
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    TextareaSurface.prototype.deploy = function deploy(target) {
        if (this._placeholder !== '') target.placeholder = this._placeholder;
        target.value = this._value; // fix for resetting the value...
        if (this._name !== '') target.name = this._name;
        if (this._wrap !== '') target.wrap = this._wrap;
        if (this._cols !== '') target.cols = this._cols;
        if (this._rows !== '') target.rows = this._rows;
    };

    module.exports = AutoSizeTextareaSurface;
});
