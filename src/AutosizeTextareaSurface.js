/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define*/
/*eslint no-use-before-define:0*/

/**
 * @module
 */
define(function(require, exports, module) {
    'use strict';

    // import dependencies
    var TextareaSurface = require('famous/surfaces/TextareaSurface');

    /**
     * @class
     * @extends TextareaSurface
     * @param {Object} [options] Configuration options
     */
    function AutosizeTextareaSurface(options) {
        this._heightInvalidated = true;
        this._oldCachedSize = [0, 0];
        _createHiddenSurface.call(this);
        TextareaSurface.apply(this, arguments);
        this.on('change', _onValueChanged.bind(this));
        this.on('keyup', _onValueChanged.bind(this));
        this.on('keydown', _onValueChanged.bind(this));
    }
    AutosizeTextareaSurface.prototype = Object.create(TextareaSurface.prototype);
    AutosizeTextareaSurface.prototype.constructor = AutosizeTextareaSurface;

    //
    // Called whenever the value is changed, copies the value to the
    // hidden TextArea surface.
    //
    function _onValueChanged(event) {
        var value = event.currentTarget.value;
        if (this._hiddenTextarea._currentTarget) {
            this._hiddenTextarea._currentTarget.value = value;
        }
        else {
            if (value === '') {
                value = ' ';
            }
            this._hiddenTextarea.setValue(value);
        }
        this._heightInvalidated = true;
    }

    /**
     * Create the hidden text-area surface
     */
    function _createHiddenSurface() {
        this._preferredScrollHeight = 0;
        this._hiddenTextarea = new TextareaSurface({});
        this.setProperties({});
    }

    /**
     * Checks whether the scroll-height has changed and when so
     * emits an event about the preferred height.
     */
    AutosizeTextareaSurface.prototype.render = function render() {

        // Return render-spec of both this textArea and the hidden
        // text-area so that they are both rendered.
        return [this._hiddenTextarea.id, this.id];
    };

    var oldCommit = AutosizeTextareaSurface.prototype.commit;
    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    AutosizeTextareaSurface.prototype.commit = function commit(context) {

        // Call base class
        oldCommit.apply(this, arguments);

        // Check if height has been changed
        if ((this._oldCachedSize[0] !== context.size[0]) ||
            (this._oldCachedSize[1] !== context.size[1])) {
            this._oldCachedSize[0] = context.size[0];
            this._oldCachedSize[1] = context.size[1];
            this._heightInvalidated = true;
        }

        // Caluclate preferred height
        if (this._hiddenTextarea._currentTarget && this._heightInvalidated) {
            this._heightInvalidated = false;

            // Calculate ideal scrollheight
            this._hiddenTextarea._currentTarget.rows = 1;
            this._hiddenTextarea._currentTarget.style.height = '';
            var scrollHeight = this._hiddenTextarea._currentTarget.scrollHeight;
            if (scrollHeight !== this._preferredScrollHeight) {
                this._preferredScrollHeight = scrollHeight;
                //console.log('scrollHeight changed: ' + this._preferredScrollHeight);
                this._eventOutput.emit('scrollHeightChanged', this._preferredScrollHeight);
            }
        }
    };

    /**
     * Get the height of the scrollable content.
     *
     * @return {Number} Ideal height that would fit all the content.
     */
    AutosizeTextareaSurface.prototype.getScrollHeight = function() {
        return this._preferredScrollHeight;
    };

    /**
     * Copy set properties to hidden text-area and ensure that it stays hidden.
     */
    var oldSetProperties = AutosizeTextareaSurface.prototype.setProperties;
    AutosizeTextareaSurface.prototype.setProperties = function setProperties(properties) {
        properties = properties || {};
        var hiddenProperties = {};
        for (var key in properties) {
            hiddenProperties[key] = properties[key];
        }
        hiddenProperties.visibility = 'hidden';
        this._hiddenTextarea.setProperties(hiddenProperties);
        this._heightInvalidated = true;
        return oldSetProperties.call(this, properties);
    };

    /**
     * Override methods and forward to hidden text-area, so that they use the
     * same settings.
     */
    var oldSetAttributes = AutosizeTextareaSurface.prototype.setAttributes;
    AutosizeTextareaSurface.prototype.setAttributes = function setAttributes(attributes) {
        this._heightInvalidated = true;
        this._hiddenTextarea.setAttributes(attributes);
        return oldSetAttributes.call(this, attributes);
    };
    var oldAddClass = AutosizeTextareaSurface.prototype.addClass;
    AutosizeTextareaSurface.prototype.addClass = function addClass(className) {
        this._heightInvalidated = true;
        this._hiddenTextarea.addClass(className);
        return oldAddClass.call(this, className);
    };
    var oldRemoveClass = AutosizeTextareaSurface.prototype.removeClass;
    AutosizeTextareaSurface.prototype.removeClass = function removeClass(className) {
        this._heightInvalidated = true;
        this._hiddenTextarea.removeClass(className);
        return oldRemoveClass.call(this, className);
    };
    var oldToggleClass = AutosizeTextareaSurface.prototype.toggleClass;
    AutosizeTextareaSurface.prototype.toggleClass = function toggleClass(className) {
        this._heightInvalidated = true;
        this._hiddenTextarea.toggleClass(className);
        return oldToggleClass.call(this, className);
    };
    var oldSetClasses = AutosizeTextareaSurface.prototype.setClasses;
    AutosizeTextareaSurface.prototype.setClasses = function setClasses(classList) {
        this._heightInvalidated = true;
        this._hiddenTextarea.setClasses(classList);
        return oldSetClasses.call(this, classList);
    };
    var oldSetContent = AutosizeTextareaSurface.prototype.setContent;
    AutosizeTextareaSurface.prototype.setContent = function setContent(content) {
        this._heightInvalidated = true;
        this._hiddenTextarea.setContent(content);
        return oldSetContent.call(this, content);
    };
    var oldSetOptions = AutosizeTextareaSurface.prototype.setOptions;
    AutosizeTextareaSurface.prototype.setOptions = function setOptions(options) {
        this._heightInvalidated = true;
        this._hiddenTextarea.setOptions(options);
        return oldSetOptions.call(this, options);
    };
    var oldSetValue = AutosizeTextareaSurface.prototype.setValue;
    AutosizeTextareaSurface.prototype.setValue = function setValue(str) {
        this._heightInvalidated = true;
        this._hiddenTextarea.setValue(str);
        return oldSetValue.call(this, str);
    };
    var oldSetWrap = AutosizeTextareaSurface.prototype.setWrap;
    AutosizeTextareaSurface.prototype.setWrap = function setWrap(str) {
        this._heightInvalidated = true;
        this._hiddenTextarea.setWrap(str);
        return oldSetWrap.call(this, str);
    };
    var oldSetColumns = AutosizeTextareaSurface.prototype.setColumns;
    AutosizeTextareaSurface.prototype.setColumns = function setColumns(num) {
        this._heightInvalidated = true;
        this._hiddenTextarea.setColumns(num);
        return oldSetColumns.call(this, num);
    };
    var oldSetRows = AutosizeTextareaSurface.prototype.setRows;
    AutosizeTextareaSurface.prototype.setRows = function setRows(num) {
        this._heightInvalidated = true;
        this._hiddenTextarea.setRows(num);
        return oldSetRows.call(this, num);
    };

    /**
     * Place the document element this component manages into the document.
     *
     * This fixes the issue that the value cannot be set to an empty string:
     * https://github.com/Famous/famous/issues/414
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    AutosizeTextareaSurface.prototype.deploy = function deploy(target) {
        if (this._placeholder !== ''){
            target.placeholder = this._placeholder;
        }
        target.value = this._value;
        target.name = this._name;
        target.wrap = this._wrap;
        if (this._cols !== ''){
            target.cols = this._cols;
        }
        if (this._rows !== ''){
            target.rows = this._rows;
        }
    };

    module.exports = AutosizeTextareaSurface;
});
