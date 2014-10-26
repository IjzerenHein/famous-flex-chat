/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
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

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

	    //<webpack>
	    __webpack_require__(4);
	    __webpack_require__(17);
	    __webpack_require__(6);
	    __webpack_require__(5);
	    //</webpack>

	    // Fast-click
	    var FastClick = __webpack_require__(11);
	    FastClick.attach(document.body);

	    // import dependencies
	    var Firebase = __webpack_require__(12);
	    var Engine = __webpack_require__(19);
	    var ViewSequence = __webpack_require__(20);
	    var Surface = __webpack_require__(21);
	    var Modifier = __webpack_require__(22);
	    var Transform = __webpack_require__(23);
	    var ScrollView = __webpack_require__(13);
	    var ChatLayout = __webpack_require__(2);
	    var HeaderFooterLayout = __webpack_require__(16);
	    var FlowLayoutController = __webpack_require__(14);
	    var LayoutController = __webpack_require__(15);
	    var Lagometer = __webpack_require__(9);
	    var AutosizeTextareaSurface = __webpack_require__(3);

	    // Initialize
	    var mainContext = Engine.createContext();
	    var viewSequence = new ViewSequence();
	    _setupFirebase();
	    _createMainLayout();
	    _createScrollView();
	    _createLagometer();

	    //
	    // Main layout, bottom text input, top chat messages
	    //
	    var mainLayout;
	    function _createMainLayout() {
	        mainLayout = new FlowLayoutController({
	            layout: HeaderFooterLayout,
	            layoutOptions: {
	                footerHeight: 50
	            },
	            dataSource: {
	                content: _createScrollView(),
	                footer: _createMessageBar()
	            }
	        });
	        mainContext.add(mainLayout);
	        return mainLayout;
	    }

	    var messageBar;
	    function _createMessageBar() {
	        var back = new Surface({
	            classes: ['message-back']
	        });
	        messageBar = new LayoutController({
	            layout: {dock: [
	                ['fill', 'back'],
	                ['left', undefined, 8],
	                ['top', undefined, 8],
	                ['right', undefined, 8],
	                ['bottom', undefined, 8],
	                ['right', 'send', undefined, 1],
	                ['fill', 'input', 1]
	            ]},
	            dataSource: {
	                back: back,
	                input: _createMessageInput(),
	                send: _createSendButton()
	            }
	        });
	        return messageBar;
	    }

	    //
	    // Message-input
	    //
	    var messageInputTextArea;
	    function _createMessageInput() {
	        messageInputTextArea = new AutosizeTextareaSurface({
	            rows: 1,
	            classes: ['message-input']
	        });
	        messageInputTextArea.on('scrollHeightChanged', _updateMessageBarHeight);
	        return messageInputTextArea;
	    }

	    //
	    // Updates the message-bar height to accomate for the text that
	    // was entered in the message text-area.
	    //
	    function _updateMessageBarHeight() {
	        var height = Math.max(Math.min(messageInputTextArea.getScrollHeight() + 16, 200), 50);
	        if (mainLayout.getLayoutOptions().footerHeight !== height) {
	            mainLayout.setLayoutOptions({
	                footerHeight: height
	            });
	            return true;
	        }
	        return false;
	    }

	    function _createSendButton() {
	        return new Surface({
	            classes: ['message-send'],
	            content: 'Send',
	            size: [60, undefined]
	        });
	    }

	    //
	    // create scrollview
	    //
	    function _createScrollView() {
	        var scrollView = new ScrollView({
	            layout: ChatLayout,
	            layoutOptions: {
	                // callback that is called by the layout-function to check
	                // whether a node is a section
	                isSectionCallback: function(renderNode) {
	                    return renderNode.options.isSection;
	                },
	                isPullToRefreshCallback: function(renderNode) {
	                    return renderNode.isPullToRefresh;
	                }
	            },
	            dataSource: viewSequence,
	            useContainer: true
	        });
	        return scrollView;
	    }

	    // create view-sequence containing items
	    /*viewSequence.push(_createPullToRefreshCell());
	    for (j = 1; j <= 10; j++) {
	        var title = 'This is a sticky section ' + j;
	        if (j === 1) {
	            title = 'Try pull down to refresh!';
	        }
	        viewSequence.push(_createSection(title));
	        for (i = 1 ; i <= 5; i++) {
	            viewSequence.push(_createCell(i));
	        }
	    }
	    viewSequence.push(_createPullToRefreshCell());*/

	    //
	    // setup firebase
	    //
	    function _setupFirebase() {
	        var firebase = new Firebase('https://famous-flex-chat.firebaseio.com/messages');
	        firebase.limit(20).on('child_added', function(snapshot) {
	            viewSequence.push(_createChatBubble(snapshot.val()));
	        });
	    }

	    //
	    // Create a chat-bubble
	    //
	    var chatBubbleTemplate = __webpack_require__(8);
	    function _createChatBubble(data) {
	        return new Surface({
	            size: [undefined, true],
	            content: chatBubbleTemplate(data)
	        });
	    }

	    //
	    // posts a new message
	    //
	    /*function _postMessage(text) {
	        //viewSequence
	        //viewSequence.
	    }*/

	    /**
	     * Create pull to refresh cell
	     */
	    /*function _createPullToRefreshCell(index) {
	        var surface = new Surface({
	            classes: ['pull-to-refresh']
	        });
	        surface.isPullToRefresh = true;
	        return surface;
	    }*/

	    /**
	     * Creates a section
	     */
	    /*function _createSection(text) {
	        return new LayoutController({
	            size: [undefined, 50],
	            isSection: true,
	            layout: {dock: [
	                ['fill', 'back'],
	                ['left', undefined, 20],
	                ['right', undefined, 20],
	                ['fill', 'text', 1]
	            ]},
	            dataSource: {
	                back: new Surface({
	                    classes: ['section-back']
	                }),
	                text: new Surface({
	                    content: text,
	                    classes: ['section-text']
	                })
	            }
	        });
	    }*/

	    //
	    // Shows the lagometer
	    //
	    function _createLagometer() {
	        var lagometerMod = new Modifier({
	            size: [100, 100],
	            align: [1.0, 0.0],
	            origin: [1.0, 0.0],
	            transform: Transform.translate(-10, 70, 1000)
	        });
	        var lagometer = new Lagometer({
	            size: lagometerMod.getSize()
	        });
	        mainContext.add(lagometerMod).add(lagometer);
	    }
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define*/

	/**
	 * Lays out a sections and cells and makes the section stick to the top (or left) side
	 * of the scollview.
	 *
	 * |options|type|description|
	 * |---|---|---|
	 * |`[isSectionCallback]`|Function|Callback that is called in order to check if a render-node is a section rather than a cell.|
	 * |`[itemSize]`|Number|Height or width in pixels of an item (used when renderNode has no size)|
	 *
	 * Example:
	 *
	 * ```javascript
	 * var TableLayout = require('famous-flex-tablelayout/TableLayout');
	 *
	 * new LayoutController({
	 *   layout: TableLayout,
	 *   layoutOptions: {
	 *     isSectionCallback: _isSection,
	 *   },
	 *   dataSource: [
	 *     // first section
	 *     _createSection(),
	 *     _createCell(),
	 *     _createCell(),
	 *     // second section
	 *     _createSection(),
	 *     _createCell(),
	 *   ]
	 * })
	 *
	 * function _createCell() {
	 *   return new Surface({
	 *     size: [undefined, 50],
	 *     content: 'my cell'
	 *   });
	 * }
	 *
	 * function _createSection() {
	 *   var section = new Surface({
	 *     size: [undefined, 30],
	 *     content: 'my sticky section'
	 *   });
	 *   section.isSection = true; // mark renderNode as section
	 *   return section;
	 * }
	 *
	 * function _isSection(renderNode) {
	 *   return renderNode.isSection;
	 * }
	 * ```
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var Utility = __webpack_require__(24);

	    // Define capabilities of this layout function
	    var capabilities = {
	        sequence: true,
	        direction: [Utility.Direction.Y, Utility.Direction.X],
	        scrolling: true,
	        trueSize: true,
	        sequentialScrollingOptimized: true,
	        debug: {
	            testPrev: false
	        }
	    };

	    // Layout function
	    function TableLayout(context, options) {

	        // Prepare
	        var size = context.size;
	        var direction = context.direction;
	        var offset = context.scrollOffset;
	        var node;
	        var nodeSize;
	        var itemSize;
	        var set;
	        var lastSectionBeforeVisibleCell;
	        var firstVisibleCell;
	        var lastCellOffsetInFirstVisibleSection;
	        var firstCell;
	        var firstCellOffset;
	        var lastCell;
	        var lastCellOffset;

	        //
	        // Determine item-size or use true=size
	        //
	        if ((options.itemSize === true) || !options.hasOwnProperty('itemSize')) {
	            itemSize = true;
	        }
	        else {
	            itemSize = (options.itemSize === undefined) ? size[direction] : options.itemSize;
	        }

	        //
	        // Process all next nodes
	        //
	        while (offset < context.scrollEnd) {
	            node = context.next();
	            if (!node) {
	                break;
	            }
	            nodeSize = (itemSize === true) ? context.resolveSize(node, size)[direction] : itemSize;

	            //
	            // Detect the first and last cell
	            //
	            if (!firstCell) {
	                firstCell = node;
	                firstCellOffset = offset;
	                if (options.isPullToRefreshCallback && options.isPullToRefreshCallback(context.getRenderNode(firstCell))) {
	                    nodeSize = 0;
	                }
	            }
	            lastCell = node;
	            lastCellOffset = offset;

	            //
	            // Position node
	            //
	            set = {
	                size: direction ? [size[0], nodeSize] : [nodeSize, size[1]],
	                translate: direction ? [0, offset, 0] : [offset, 0, 0],
	                scrollLength: nodeSize
	            };
	            context.set(node, set);
	            offset += nodeSize;

	            //
	            // Keep track of the last section before the first visible cell
	            //
	            if (options.isSectionCallback && options.isSectionCallback(context.getRenderNode(node))) {
	                if (!firstVisibleCell) {
	                    lastSectionBeforeVisibleCell = node;
	                } else if (lastCellOffsetInFirstVisibleSection === undefined) {
	                    lastCellOffsetInFirstVisibleSection = offset - nodeSize;
	                }
	            } else if (!firstVisibleCell && (offset >= 0)) {
	                firstVisibleCell = node;
	            }
	        }
	        if (!lastCell) {
	            lastCell = context.next();
	            lastCellOffset = offset;
	        }

	        //
	        // Process previous nodes
	        //
	        offset = context.scrollOffset;
	        while (offset > context.scrollStart) {
	            node = context.prev();
	            if (!node) {
	                break;
	            }

	            //
	            // Keep track of the last section before the first visible cell
	            //
	            if (options.isSectionCallback && options.isSectionCallback(context.getRenderNode(node))) {
	                if (!lastSectionBeforeVisibleCell) {
	                    lastSectionBeforeVisibleCell = node;
	                }
	            } else if (offset >= 0) {
	                firstVisibleCell = node;
	                if (lastSectionBeforeVisibleCell) {
	                    lastCellOffsetInFirstVisibleSection = offset;
	                }
	                lastSectionBeforeVisibleCell = undefined;
	            }

	            //
	            // Position node
	            //
	            nodeSize = options.itemSize || context.resolveSize(node, size)[direction];
	            set = {
	                size: direction ? [size[0], nodeSize] : [nodeSize, size[1]],
	                translate: direction ? [0, offset - nodeSize, 0] : [offset - nodeSize, 0, 0],
	                scrollLength: nodeSize
	            };
	            context.set(node, set);
	            offset -= nodeSize;

	            //
	            // Detect the first and last cell
	            //
	            firstCell = node;
	            firstCellOffset = offset;
	            if (!lastCell) {
	                lastCell = node;
	                lastCell = offset;
	            }
	        }

	        //
	        // When no first section is in the scrollable range, then
	        // look back further in search for the that section
	        //
	        if (node && !lastSectionBeforeVisibleCell && options.isSectionCallback) {
	            node = context.prev();
	            while (node && !lastSectionBeforeVisibleCell) {
	                if (options.isSectionCallback && options.isSectionCallback(context.getRenderNode(node))) {
	                    lastSectionBeforeVisibleCell = node;
	                    nodeSize = options.itemSize || context.resolveSize(node, size)[direction];
	                    set = {
	                        size: direction ? [size[0], nodeSize] : [nodeSize, size[1]],
	                        translate: direction ? [0, offset - nodeSize, 0] : [offset - nodeSize, 0, 0]
	                    };
	                    context.set(node, set);
	                }
	                else {
	                    node = context.prev();
	                }
	            }
	        }

	        //
	        // Reposition "last section before first visible cell" to the top of the layout
	        //
	        if (lastSectionBeforeVisibleCell) {
	            var translate = lastSectionBeforeVisibleCell.set.translate;
	            translate[direction] = 0;
	            translate[2] = 1; // put section on top, so that it overlays cells
	            if ((lastCellOffsetInFirstVisibleSection !== undefined) &&
	                (lastSectionBeforeVisibleCell.set.size[direction] > lastCellOffsetInFirstVisibleSection)) {
	                translate[direction] = lastCellOffsetInFirstVisibleSection - lastSectionBeforeVisibleCell.set.size[direction];
	            }
	            context.set(lastSectionBeforeVisibleCell, {
	                size: lastSectionBeforeVisibleCell.set.size,
	                translate: translate,
	                scrollLength: lastSectionBeforeVisibleCell.set.scrollLength
	            });
	        }

	        //
	        // Reposition "pull to refresh" renderable at the top
	        //
	        if (firstCell && (firstCellOffset > 0) &&
	           options.isPullToRefreshCallback && options.isPullToRefreshCallback(context.getRenderNode(firstCell))) {
	            firstCell.set.translate[direction] = 0;
	            firstCell.set.size[direction] = firstCellOffset;
	            context.set(firstCell, {
	                size: firstCell.set.size,
	                translate: firstCell.set.translate,
	                scrollLength: firstCell.set.scrollLength
	            });
	        }

	        //
	        // Reposition "pull to refresh" renderable at the bottom
	        //
	        if (lastCell && (lastCellOffset < context.size[direction]) &&
	           options.isPullToRefreshCallback && options.isPullToRefreshCallback(context.getRenderNode(lastCell))) {
	            lastCell.set.translate[direction] = lastCellOffset;
	            lastCell.set.size[direction] = context.size[direction] - lastCellOffset;
	            context.set(lastCell, {
	                size: lastCell.set.size,
	                translate: lastCell.set.translate,
	                scrollLength: 0
	            });
	        }
	    }

	    TableLayout.Capabilities = capabilities;
	    TableLayout.Name = 'TableLayout';
	    TableLayout.Description = 'Layout for sections and cells';
	    module.exports = TableLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
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
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    // import dependencies
	    var TextareaSurface = __webpack_require__(25);

	    /**
	     * @class
	     * @extends TextareaSurface
	     * @param {Object} [options] Configuration options
	     */
	    function AutosizeTextareaSurface(options) {
	        _createHiddenSurface.call(this);
	        TextareaSurface.apply(this, arguments);
	    }
	    AutosizeTextareaSurface.prototype = Object.create(TextareaSurface.prototype);
	    AutosizeTextareaSurface.prototype.constructor = AutosizeTextareaSurface;

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
	        if (this._currentTarget) {
	            if (this._scrollHeightCache !== this._currentTarget.scrollHeight) {
	                this._scrollHeightCache = this._currentTarget.scrollHeight;
	                this._hiddenTextarea._currentTarget.value = this.getValue();
	                this._hiddenTextarea._currentTarget.style.height = '10px';
	                var preferredScrollHeight = this._hiddenTextarea._currentTarget.scrollHeight;
	                if (preferredScrollHeight !== this._preferredScrollHeight) {
	                    this._preferredScrollHeight = preferredScrollHeight;
	                    //console.log('scrollHeight changed: ' + this._preferredScrollHeight);
	                    this._eventOutput.emit('scrollHeightChanged', this._preferredScrollHeight);
	                }
	            }
	        }

	        // Return render-spec of both this textArea and the hidden
	        // text-area so that they are both rendered.
	        return [this.id, this._hiddenTextarea.id];
	    };

	    /**
	     * Get the height of the scrollable content.
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
	        return oldSetProperties.call(this, properties);
	    };

	    /**
	     * Override methods and forward to hidden text-area, so that they use the
	     * same settings.
	     */
	    var oldSetAttributes = AutosizeTextareaSurface.prototype.setAttributes;
	    AutosizeTextareaSurface.prototype.setAttributes = function setAttributes(attributes) {
	        this._hiddenTextarea.setAttributes(attributes);
	        return oldSetAttributes.call(this, attributes);
	    };
	    var oldAddClass = AutosizeTextareaSurface.prototype.addClass;
	    AutosizeTextareaSurface.prototype.addClass = function addClass(className) {
	        this._hiddenTextarea.addClass(className);
	        return oldAddClass.call(this, className);
	    };
	    var oldRemoveClass = AutosizeTextareaSurface.prototype.removeClass;
	    AutosizeTextareaSurface.prototype.removeClass = function removeClass(className) {
	        this._hiddenTextarea.removeClass(className);
	        return oldRemoveClass.call(this, className);
	    };
	    var oldToggleClass = AutosizeTextareaSurface.prototype.toggleClass;
	    AutosizeTextareaSurface.prototype.toggleClass = function toggleClass(className) {
	        this._hiddenTextarea.toggleClass(className);
	        return oldToggleClass.call(this, className);
	    };
	    var oldSetClasses = AutosizeTextareaSurface.prototype.setClasses;
	    AutosizeTextareaSurface.prototype.setClasses = function setClasses(classList) {
	        this._hiddenTextarea.setClasses(classList);
	        return oldSetClasses.call(this, classList);
	    };
	    var oldSetContent = AutosizeTextareaSurface.prototype.setContent;
	    AutosizeTextareaSurface.prototype.setContent = function setContent(content) {
	        this._hiddenTextarea.setContent(content);
	        return oldSetContent.call(this, content);
	    };
	    var oldSetOptions = AutosizeTextareaSurface.prototype.setOptions;
	    AutosizeTextareaSurface.prototype.setOptions = function setOptions(options) {
	        this._hiddenTextarea.setOptions(options);
	        return oldSetOptions.call(this, options);
	    };
	    var oldSetValue = AutosizeTextareaSurface.prototype.setValue;
	    AutosizeTextareaSurface.prototype.setValue = function setValue(str) {
	        this._hiddenTextarea.setValue(str);
	        return oldSetValue.call(this, str);
	    };
	    var oldSetWrap = AutosizeTextareaSurface.prototype.setWrap;
	    AutosizeTextareaSurface.prototype.setWrap = function setWrap(str) {
	        this._hiddenTextarea.setWrap(str);
	        return oldSetWrap.call(this, str);
	    };
	    var oldSetColumns = AutosizeTextareaSurface.prototype.setColumns;
	    AutosizeTextareaSurface.prototype.setColumns = function setColumns(num) {
	        this._hiddenTextarea.setColumns(num);
	        return oldSetColumns.call(this, num);
	    };
	    var oldSetRows = AutosizeTextareaSurface.prototype.setRows;
	    AutosizeTextareaSurface.prototype.setRows = function setRows(num) {
	        this._hiddenTextarea.setRows(num);
	        return oldSetRows.call(this, num);
	    };

	    module.exports = AutosizeTextareaSurface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(26);
	__webpack_require__(27);
	__webpack_require__(28);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html"

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(10)
		// The css code:
		(__webpack_require__(7));
	// Hot Module Replacement
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"body, div {\n    font-family: \"HelveticaNeue\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;\n    font-weight: normal;\n}\nbody {\n  background: white;\n}\n\n\n.message-back {\n  border-top: 1px solid #AAAAAA;\n  background-color: #DDDDDD;\n}\n\n.message-input {\n  border-radius: 7px;\n  border-color: #AAAAAA;\n  font-size: 16px;\n  padding: 6px 5px 6px 5px;\n}\n\n.message-send {\n  text-align: center;\n  line-height: 34px;\n}\n\n\n/*.pull-to-refresh {\n  z-index: 0;\n  background-image: url(reload.gif);\n  background-repeat: no-repeat no-repeat;\n  -background-position: center top 20px;\n  background-position: center center;\n  background-size: 40px auto;\n}\n*/\n";

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(51).default.template(function (Handlebars,depth0,helpers,partials,data) {
	  this.compilerInfo = [4,'>= 1.0.0'];
	helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
	  var buffer = "";


	  return buffer;
	  });

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*jslint browser:true, nomen:true, vars:true, plusplus:true*/
	/*global define*/

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    'use strict';

	    // import dependencies
	    var Engine = __webpack_require__(19);
	    var CanvasSurface = __webpack_require__(29);
	    var View = __webpack_require__(30);

	    /**
	     * @class Lagometer
	     * @extends View
	     * @constructor
	     * @param {Object} [options] Configuration options
	     */
	    function Lagometer(options) {
	        View.apply(this, arguments);

	        // Create sample-buffer
	        this.samples = [];
	        this.sampleIndex = 0;
	        this.Samples = this.options.size[0];

	        // Install render-handlers
	        Engine.on('prerender', this._onEngineRender.bind(this, true));
	        Engine.on('postrender', this._onEngineRender.bind(this, false));

	        // Create drawing canvas
	        this.canvas = new CanvasSurface(this.options.canvasSurface);
	        this.add(this.canvas);
	    }
	    Lagometer.prototype = Object.create(View.prototype);
	    Lagometer.prototype.constructor = Lagometer;

	    Lagometer.DEFAULT_OPTIONS = {
	        size: [100, 100],
	        min: 0,
	        max: 34,
	        backgroundColor: 'rgba(200, 0, 0, 0.8)',
	        borderColor: 'rgba(255, 0, 0, 0.8)',
	        textColor: 'rgba(255, 255, 255, 0.8)',
	        font: '28px Arial',
	        frameColor: '#00FF00',
	        scriptColor: '#BBBBFF',
	        canvasSurface: {
	            properties: {
	                'pointer-events': 'none'
	            }
	        }
	    };

	    /**
	     * @method _onEngineRender
	     */
	    Lagometer.prototype._onEngineRender = function(pre) {
	        var currentTime = Date.now();
	        if (pre) {

	            // Determine the time that was spent between two 'animation-frames'
	            if (this.lastTime !== undefined) {
	                this.frameTime = currentTime - this.lastTime;
	                if (this.maxFrameTime === undefined) {
	                    this.maxFrameTime = this.frameTime;
	                }
	                this.maxFrameTime = Math.max(this.frameTime, this.maxFrameTime);
	                if (this.minFrameTime === undefined) {
	                    this.minFrameTime = this.frameTime;
	                }
	                this.minFrameTime = Math.min(this.frameTime, this.minFrameTime);
	            }
	            this.lastTime = currentTime;

	        } else if (this.frameTime !== undefined) {

	            // Determine the time that was spent in the script
	            this.scriptTime = currentTime - this.lastTime;
	            if (this.maxScriptTime === undefined) {
	                this.maxScriptTime = this.scriptTime;
	            }
	            this.maxScriptTime = Math.max(this.scriptTime, this.maxScriptTime);
	            if (this.minScriptTime === undefined) {
	                this.minScriptTime = this.scriptTime;
	            }
	            this.minScriptTime = Math.min(this.scriptTime, this.minScriptTime);

	            // Create sample
	            var sample = {
	                lastTime: this.lastTime,
	                frameTime: this.frameTime,
	                scriptTime: this.scriptTime
	            };
	            var maxSamples = this.options.size[0] * 2;
	            if (this.samples.length < maxSamples) {
	                this.sampleIndex = this.samples.length;
	                this.samples.push(sample);
	            }
	            else {
	                this.sampleIndex = (this.sampleIndex + 1) % maxSamples;
	                this.samples[this.sampleIndex] = sample;
	            }
	        }
	    };

	    /**
	     * @method _drawSamples
	     */
	    Lagometer.prototype._drawSamples = function(draw) {

	        draw.context.beginPath();
	        var i;
	        var bufferIndex = draw.index;
	        var size = draw.size;
	        var yScale =  size[1] / (draw.max - draw.min);
	        for (i = 0; i < draw.buffer.length; i++) {
	            var x = size[0] - i;
	            var sample = draw.buffer[bufferIndex][draw.property];
	            var y = size[1] - ((sample - draw.min) * yScale);
	            if (i === 0) {
	                draw.context.moveTo(x, y);
	            }
	            else {
	                draw.context.lineTo(x, y);
	            }
	            bufferIndex--;
	            if (bufferIndex < 0) {
	                bufferIndex = draw.buffer.length - 1;
	                }
	        }
	        draw.context.lineWidth = 1;
	        draw.context.strokeStyle = draw.color;
	        draw.context.stroke();
	    };

	    /**
	     * @method _getFPS
	     */
	    Lagometer.prototype._getFPS = function(count) {
	        count = Math.min(count, this.samples.length);
	        var bufferIndex = this.sampleIndex;
	        var i;
	        var fps = 0;
	        for (i = 0; i < count; i++) {
	            var sample = this.samples[bufferIndex];
	            fps += sample.frameTime;
	            bufferIndex--;
	            if (bufferIndex < 0) {
	                bufferIndex = this.samples.length - 1;
	            }
	        }
	        return 1000 / (fps / count);
	    };

	    /**
	     * Renders the view.
	     *
	     * @method render
	     * @private
	     * @ignore
	     */
	    Lagometer.prototype.render = function render() {
	        var context = this.canvas.getContext('2d');
	        var size = this.getSize();
	        var canvasSize = [size[0] * 2, size[1] * 2];

	        // Update canvas size
	        if (!this._cachedSize ||
	            (this._cachedSize[0] !== size[0]) ||
	            (this._cachedSize[1] !== size[1]) ||
	            (this._cachedCanvasSize[0] !== canvasSize[0]) ||
	            (this._cachedCanvasSize[1] !== canvasSize[1])) {
	            this._cachedSize = size;
	            this._cachedCanvasSize = canvasSize;
	            this.canvas.setSize(size, canvasSize);
	        }

	        // Clear background
	        context.clearRect(0, 0, canvasSize[0], canvasSize[1]);
	        context.fillStyle = this.options.backgroundColor;
	        context.fillRect(0, 0, canvasSize[0], canvasSize[1]);
	        context.lineWidth = 1;
	        context.strokeStyle = this.options.borderColor;
	        context.strokeRect(0, 0, canvasSize[0], canvasSize[1]);

	        // Calculate min/max
	        var min = this.options.min;
	        var max = this.options.max;
	        //var min = Math.min(this.minFrameTime, this.minScriptTime);
	        //var max = Math.max(this.maxFrameTime, this.maxScriptTime);
	        /*var range = max - min;
	        var i;
	        if (this.samples.length) {
	            min = this.samples[0].frameTime;
	            max = this.samples[0].frameTime;
	            for (i = 0; i < this.samples.length; i++) {
	                min = Math.min(min, this.samples[i].frameTime);
	                max = Math.max(max, this.samples[i].frameTime);
	            }
	            min = 0;
	        }*/

	        // Prepare text drawing
	        context.fillStyle = this.options.textColor;
	        context.font = this.options.font;

	        // Draw fps (calculated over last 20 frames)
	        var fps = Math.round(this._getFPS(20));
	        context.fillText(fps + ' fps', canvasSize[0] - 84, 26);

	        // Draw frame-times
	        this._drawSamples({
	            context: context,
	            size: canvasSize,
	            buffer: this.samples,
	            index: this.sampleIndex,
	            min: min,
	            max: max,
	            property: 'frameTime',
	            color: this.options.frameColor
	        });

	        // Draw script-times
	        this._drawSamples({
	            context: context,
	            size: canvasSize,
	            buffer: this.samples,
	            index: this.sampleIndex,
	            min: min,
	            max: max,
	            property: 'scriptTime',
	            color: this.options.scriptColor
	        });

	        // Call super
	        return this._node.render();
	    };

	    module.exports = Lagometer;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function addStyle(cssCode) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(styleElement);
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssCode;
		} else {
			styleElement.appendChild(document.createTextNode(cssCode));
		}
		return function() {
			head.removeChild(styleElement);
		};
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @version 1.0.3
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} options The options to override the defaults
	 */
	function FastClick(layer, options) {
		'use strict';
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}


	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0(+?) requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		'use strict';
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		'use strict';
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		'use strict';
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {
		'use strict';

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		'use strict';
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		'use strict';
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
		'use strict';

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		'use strict';
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		'use strict';
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		'use strict';
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {
		'use strict';

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		'use strict';
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		'use strict';
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {
		'use strict';

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		'use strict';
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		'use strict';
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		'use strict';
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} options The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		'use strict';
		return new FastClick(layer, options);
	};


	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			'use strict';
			return FastClick;
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*! @license Firebase v1.1.2 - License: https://www.firebase.com/terms/terms-of-service.html */ (function() {var k,ba=this;function l(a){return void 0!==a}function ca(){}function da(a){a.ib=function(){return a.Ld?a.Ld:a.Ld=new a}}
	function ea(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
	else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function fa(a){return"array"==ea(a)}function ga(a){var b=ea(a);return"array"==b||"object"==b&&"number"==typeof a.length}function p(a){return"string"==typeof a}function ha(a){return"number"==typeof a}function ia(a){return"function"==ea(a)}function ja(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ka(a,b,c){return a.call.apply(a.bind,arguments)}
	function la(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function r(a,b,c){r=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ka:la;return r.apply(null,arguments)}var ma=Date.now||function(){return+new Date};
	function na(a,b){var c=a.split("."),d=ba;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&l(b)?d[e]=b:d=d[e]?d[e]:d[e]={}}function oa(a,b){function c(){}c.prototype=b.prototype;a.df=b.prototype;a.prototype=new c;a.$e=function(a,c,f){return b.prototype[c].apply(a,Array.prototype.slice.call(arguments,2))}};function pa(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function qa(){this.Ec=void 0}
	function ra(a,b,c){switch(typeof b){case "string":sa(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(fa(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],ra(a,a.Ec?a.Ec.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),sa(f,c),
	c.push(":"),ra(a,a.Ec?a.Ec.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var ta={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},ua=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
	function sa(a,b){b.push('"',a.replace(ua,function(a){if(a in ta)return ta[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return ta[a]=e+b.toString(16)}),'"')};function va(a){return"undefined"!==typeof JSON&&l(JSON.parse)?JSON.parse(a):pa(a)}function u(a){if("undefined"!==typeof JSON&&l(JSON.stringify))a=JSON.stringify(a);else{var b=[];ra(new qa,a,b);a=b.join("")}return a};function wa(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,v(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b};var xa={};function x(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}
	function y(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:ya.assert(!1,"errorPrefix_ called with argumentNumber > 4.  Need to update it?")}return a=a+" failed: "+(d+" argument ")}function z(a,b,c,d){if((!d||l(c))&&!ia(c))throw Error(y(a,b,d)+"must be a valid function.");}function za(a,b,c){if(l(c)&&(!ja(c)||null===c))throw Error(y(a,b,!0)+"must be a valid context object.");};function A(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function B(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function Aa(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])}function Ba(a){var b={};Aa(a,function(a,d){b[a]=d});return b};var ya={},Ca=/[\[\].#$\/\u0000-\u001F\u007F]/,Da=/[\[\].#$\u0000-\u001F\u007F]/;function Ea(a){return p(a)&&0!==a.length&&!Ca.test(a)}function Fa(a,b,c){c&&!l(b)||Ga(y(a,1,c),b)}
	function Ga(a,b,c,d){c||(c=0);d=d||[];if(!l(b))throw Error(a+"contains undefined"+Ha(d));if(ia(b))throw Error(a+"contains a function"+Ha(d)+" with contents: "+b.toString());if(Ia(b))throw Error(a+"contains "+b.toString()+Ha(d));if(1E3<c)throw new TypeError(a+"contains a cyclic object value ("+d.slice(0,100).join(".")+"...)");if(p(b)&&b.length>10485760/3&&10485760<wa(b).length)throw Error(a+"contains a string greater than 10485760 utf8 bytes"+Ha(d)+" ('"+b.substring(0,50)+"...')");if(ja(b))for(var e in b)if(A(b,
	e)){var f=b[e];if(".priority"!==e&&".value"!==e&&".sv"!==e&&!Ea(e))throw Error(a+" contains an invalid key ("+e+")"+Ha(d)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');d.push(e);Ga(a,f,c+1,d);d.pop()}}function Ha(a){return 0==a.length?"":" in property '"+a.join(".")+"'"}function Ja(a,b){if(!ja(b)||fa(b))throw Error(y(a,1,!1)+" must be an Object containing the children to replace.");Fa(a,b,!1)}
	function Ka(a,b,c,d){if(!d||l(c)){if(Ia(c))throw Error(y(a,b,d)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, or null).");if(!(null===c||ha(c)||p(c)||ja(c)&&A(c,".sv")))throw Error(y(a,b,d)+"must be a valid Firebase priority (a string, finite number, or null).");}}
	function La(a,b,c){if(!c||l(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(y(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function Ma(a,b){if(l(b)&&!Ea(b))throw Error(y(a,2,!0)+'was an invalid key: "'+b+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
	function Na(a,b){if(!p(b)||0===b.length||Da.test(b))throw Error(y(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function C(a,b){if(".info"===D(b))throw Error(a+" failed: Can't modify data under /.info/");}function Oa(a,b){if(!p(b))throw Error(y(a,1,!1)+"must be a valid credential (a string).");}function Pa(a,b,c){if(!p(c))throw Error(y(a,b,!1)+"must be a valid string.");}
	function E(a,b,c,d){if(!d||l(c))if(!ja(c)||null===c)throw Error(y(a,b,d)+"must be a valid object.");}function Qa(a,b,c){if(!ja(b)||null===b||!A(b,c))throw Error(y(a,1,!1)+'must contain the key "'+c+'"');if(!p(B(b,c)))throw Error(y(a,1,!1)+'must contain the key "'+c+'" with type "string"');};function F(a,b,c,d,e,f,g){this.i=a;this.path=b;this.Ga=c;this.fa=d;this.za=e;this.Ea=f;this.fb=g;if(l(this.fa)&&l(this.Ea)&&l(this.Ga))throw"Query: Can't combine startAt(), endAt(), and limit().";}F.prototype.rd=function(){x("Query.ref",0,0,arguments.length);return new G(this.i,this.path)};F.prototype.ref=F.prototype.rd;
	F.prototype.Ua=function(a,b){x("Query.on",2,4,arguments.length);La("Query.on",a,!1);z("Query.on",2,b,!1);var c=Ra("Query.on",arguments[2],arguments[3]);this.i.ec(this,a,b,c.cancel,c.$);return b};F.prototype.on=F.prototype.Ua;F.prototype.nb=function(a,b,c){x("Query.off",0,3,arguments.length);La("Query.off",a,!0);z("Query.off",2,b,!0);za("Query.off",3,c);this.i.Dc(this,a,b,c)};F.prototype.off=F.prototype.nb;
	F.prototype.Ke=function(a,b){function c(g){f&&(f=!1,e.nb(a,c),b.call(d.$,g))}x("Query.once",2,4,arguments.length);La("Query.once",a,!1);z("Query.once",2,b,!1);var d=Ra("Query.once",arguments[2],arguments[3]),e=this,f=!0;this.Ua(a,c,function(b){e.nb(a,c);d.cancel&&d.cancel.call(d.$,b)})};F.prototype.once=F.prototype.Ke;
	F.prototype.ze=function(a){x("Query.limit",1,1,arguments.length);if(!ha(a)||Math.floor(a)!==a||0>=a)throw"Query.limit: First argument must be a positive integer.";return new F(this.i,this.path,a,this.fa,this.za,this.Ea,this.fb)};F.prototype.limit=F.prototype.ze;F.prototype.ae=function(a,b){x("Query.startAt",0,2,arguments.length);Ka("Query.startAt",1,a,!0);Ma("Query.startAt",b);l(a)||(b=a=null);return new F(this.i,this.path,this.Ga,a,b,this.Ea,this.fb)};F.prototype.startAt=F.prototype.ae;
	F.prototype.Hd=function(a,b){x("Query.endAt",0,2,arguments.length);Ka("Query.endAt",1,a,!0);Ma("Query.endAt",b);return new F(this.i,this.path,this.Ga,this.fa,this.za,a,b)};F.prototype.endAt=F.prototype.Hd;F.prototype.se=function(a,b){x("Query.equalTo",1,2,arguments.length);Ka("Query.equalTo",1,a,!1);Ma("Query.equalTo",b);return this.ae(a,b).Hd(a,b)};F.prototype.equalTo=F.prototype.se;
	function Sa(a){var b={};l(a.fa)&&(b.sp=a.fa);l(a.za)&&(b.sn=a.za);l(a.Ea)&&(b.ep=a.Ea);l(a.fb)&&(b.en=a.fb);l(a.Ga)&&(b.l=a.Ga);l(a.fa)&&l(a.za)&&null===a.fa&&null===a.za&&(b.vf="l");return b}F.prototype.Wa=function(){var a=Ta(Sa(this));return"{}"===a?"default":a};
	function Ra(a,b,c){var d={};if(b&&c)d.cancel=b,z(a,3,d.cancel,!0),d.$=c,za(a,4,d.$);else if(b)if("object"===typeof b&&null!==b)d.$=b;else if("function"===typeof b)d.cancel=b;else throw Error(xa.af(a,3,!0)+"must either be a cancel callback or a context object.");return d};function H(a,b){if(1==arguments.length){this.u=a.split("/");for(var c=0,d=0;d<this.u.length;d++)0<this.u[d].length&&(this.u[c]=this.u[d],c++);this.u.length=c;this.W=0}else this.u=a,this.W=b}function D(a){return a.W>=a.u.length?null:a.u[a.W]}function Ua(a){var b=a.W;b<a.u.length&&b++;return new H(a.u,b)}function Va(a){return a.W<a.u.length?a.u[a.u.length-1]:null}k=H.prototype;k.toString=function(){for(var a="",b=this.W;b<this.u.length;b++)""!==this.u[b]&&(a+="/"+this.u[b]);return a||"/"};
	k.parent=function(){if(this.W>=this.u.length)return null;for(var a=[],b=this.W;b<this.u.length-1;b++)a.push(this.u[b]);return new H(a,0)};k.J=function(a){for(var b=[],c=this.W;c<this.u.length;c++)b.push(this.u[c]);if(a instanceof H)for(c=a.W;c<a.u.length;c++)b.push(a.u[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new H(b,0)};k.f=function(){return this.W>=this.u.length};k.length=function(){return this.u.length-this.W};
	function Wa(a,b){var c=D(a);if(null===c)return b;if(c===D(b))return Wa(Ua(a),Ua(b));throw"INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")";}k.contains=function(a){var b=this.W,c=a.W;if(this.length()>a.length())return!1;for(;b<this.u.length;){if(this.u[b]!==a.u[c])return!1;++b;++c}return!0};function Xa(){this.children={};this.gc=0;this.value=null}function Ya(a,b,c){this.Ha=a?a:"";this.Qb=b?b:null;this.A=c?c:new Xa}function I(a,b){for(var c=b instanceof H?b:new H(b),d=a,e;null!==(e=D(c));)d=new Ya(e,d,B(d.A.children,e)||new Xa),c=Ua(c);return d}k=Ya.prototype;k.k=function(){return this.A.value};function Za(a,b){v("undefined"!==typeof b,"Cannot set value to undefined");a.A.value=b;$a(a)}k.clear=function(){this.A.value=null;this.A.children={};this.A.gc=0;$a(this)};
	k.Fb=function(){return 0<this.A.gc};k.f=function(){return null===this.k()&&!this.Fb()};k.B=function(a){for(var b in this.A.children)a(new Ya(b,this,this.A.children[b]))};function ab(a,b,c,d){c&&!d&&b(a);a.B(function(a){ab(a,b,!0,d)});c&&d&&b(a)}function bb(a,b,c){for(a=c?a:a.parent();null!==a;){if(b(a))return!0;a=a.parent()}return!1}k.path=function(){return new H(null===this.Qb?this.Ha:this.Qb.path()+"/"+this.Ha)};k.name=function(){return this.Ha};k.parent=function(){return this.Qb};
	function $a(a){if(null!==a.Qb){var b=a.Qb,c=a.Ha,d=a.f(),e=A(b.A.children,c);d&&e?(delete b.A.children[c],b.A.gc--,$a(b)):d||e||(b.A.children[c]=a.A,b.A.gc++,$a(b))}};function cb(a,b){this.ab=a?a:db;this.ea=b?b:eb}function db(a,b){return a<b?-1:a>b?1:0}k=cb.prototype;k.ta=function(a,b){return new cb(this.ab,this.ea.ta(a,b,this.ab).M(null,null,!1,null,null))};k.remove=function(a){return new cb(this.ab,this.ea.remove(a,this.ab).M(null,null,!1,null,null))};k.get=function(a){for(var b,c=this.ea;!c.f();){b=this.ab(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
	function gb(a,b){for(var c,d=a.ea,e=null;!d.f();){c=a.ab(b,d.key);if(0===c){if(d.left.f())return e?e.key:null;for(d=d.left;!d.right.f();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}k.f=function(){return this.ea.f()};k.count=function(){return this.ea.count()};k.Lb=function(){return this.ea.Lb()};k.lb=function(){return this.ea.lb()};k.Fa=function(a){return this.ea.Fa(a)};k.Xa=function(a){return this.ea.Xa(a)};
	k.jb=function(a){return new hb(this.ea,a)};function hb(a,b){this.Wd=b;for(this.pc=[];!a.f();)this.pc.push(a),a=a.left}function ib(a){if(0===a.pc.length)return null;var b=a.pc.pop(),c;c=a.Wd?a.Wd(b.key,b.value):{key:b.key,value:b.value};for(b=b.right;!b.f();)a.pc.push(b),b=b.left;return c}function jb(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:eb;this.right=null!=e?e:eb}k=jb.prototype;
	k.M=function(a,b,c,d,e){return new jb(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};k.count=function(){return this.left.count()+1+this.right.count()};k.f=function(){return!1};k.Fa=function(a){return this.left.Fa(a)||a(this.key,this.value)||this.right.Fa(a)};k.Xa=function(a){return this.right.Xa(a)||a(this.key,this.value)||this.left.Xa(a)};function kb(a){return a.left.f()?a:kb(a.left)}k.Lb=function(){return kb(this).key};
	k.lb=function(){return this.right.f()?this.key:this.right.lb()};k.ta=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.M(null,null,null,e.left.ta(a,b,c),null):0===d?e.M(null,b,null,null,null):e.M(null,null,null,null,e.right.ta(a,b,c));return lb(e)};function mb(a){if(a.left.f())return eb;a.left.R()||a.left.left.R()||(a=nb(a));a=a.M(null,null,null,mb(a.left),null);return lb(a)}
	k.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.f()||c.left.R()||c.left.left.R()||(c=nb(c)),c=c.M(null,null,null,c.left.remove(a,b),null);else{c.left.R()&&(c=ob(c));c.right.f()||c.right.R()||c.right.left.R()||(c=pb(c),c.left.left.R()&&(c=ob(c),c=pb(c)));if(0===b(a,c.key)){if(c.right.f())return eb;d=kb(c.right);c=c.M(d.key,d.value,null,null,mb(c.right))}c=c.M(null,null,null,null,c.right.remove(a,b))}return lb(c)};k.R=function(){return this.color};
	function lb(a){a.right.R()&&!a.left.R()&&(a=qb(a));a.left.R()&&a.left.left.R()&&(a=ob(a));a.left.R()&&a.right.R()&&(a=pb(a));return a}function nb(a){a=pb(a);a.right.left.R()&&(a=a.M(null,null,null,null,ob(a.right)),a=qb(a),a=pb(a));return a}function qb(a){return a.right.M(null,null,a.color,a.M(null,null,!0,null,a.right.left),null)}function ob(a){return a.left.M(null,null,a.color,null,a.M(null,null,!0,a.left.right,null))}
	function pb(a){return a.M(null,null,!a.color,a.left.M(null,null,!a.left.color,null,null),a.right.M(null,null,!a.right.color,null,null))}function rb(){}k=rb.prototype;k.M=function(){return this};k.ta=function(a,b){return new jb(a,b,null)};k.remove=function(){return this};k.count=function(){return 0};k.f=function(){return!0};k.Fa=function(){return!1};k.Xa=function(){return!1};k.Lb=function(){return null};k.lb=function(){return null};k.R=function(){return!1};var eb=new rb;function sb(a){this.Cb=a;this.zc="firebase:"}k=sb.prototype;k.set=function(a,b){null==b?this.Cb.removeItem(this.zc+a):this.Cb.setItem(this.zc+a,u(b))};k.get=function(a){a=this.Cb.getItem(this.zc+a);return null==a?null:va(a)};k.remove=function(a){this.Cb.removeItem(this.zc+a)};k.Nd=!1;k.toString=function(){return this.Cb.toString()};function tb(){this.yb={}}tb.prototype.set=function(a,b){null==b?delete this.yb[a]:this.yb[a]=b};tb.prototype.get=function(a){return A(this.yb,a)?this.yb[a]:null};tb.prototype.remove=function(a){delete this.yb[a]};tb.prototype.Nd=!0;function wb(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new sb(b)}}catch(c){}return new tb}var xb=wb("localStorage"),J=wb("sessionStorage");function yb(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.Ya=b;this.Ta=c;this.Ye=d;this.yc=e||"";this.ia=xb.get("host:"+a)||this.host}function zb(a,b){b!==a.ia&&(a.ia=b,"s-"===a.ia.substr(0,2)&&xb.set("host:"+a.host,a.ia))}yb.prototype.toString=function(){var a=(this.Ya?"https://":"http://")+this.host;this.yc&&(a+="<"+this.yc+">");return a};function Ab(){this.ra=-1};function Bb(){this.ra=-1;this.ra=64;this.F=[];this.Sc=[];this.ge=[];this.vc=[];this.vc[0]=128;for(var a=1;a<this.ra;++a)this.vc[a]=0;this.Kc=this.kb=0;this.reset()}oa(Bb,Ab);Bb.prototype.reset=function(){this.F[0]=1732584193;this.F[1]=4023233417;this.F[2]=2562383102;this.F[3]=271733878;this.F[4]=3285377520;this.Kc=this.kb=0};
	function Cb(a,b,c){c||(c=0);var d=a.ge;if(p(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.F[0];c=a.F[1];for(var g=a.F[2],h=a.F[3],m=a.F[4],n,e=0;80>e;e++)40>e?20>e?(f=h^c&(g^h),n=1518500249):(f=c^g^h,n=1859775393):60>e?(f=c&g|h&(c|g),n=2400959708):(f=c^g^h,n=3395469782),f=(b<<
	5|b>>>27)+f+m+n+d[e]&4294967295,m=h,h=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.F[0]=a.F[0]+b&4294967295;a.F[1]=a.F[1]+c&4294967295;a.F[2]=a.F[2]+g&4294967295;a.F[3]=a.F[3]+h&4294967295;a.F[4]=a.F[4]+m&4294967295}
	Bb.prototype.update=function(a,b){l(b)||(b=a.length);for(var c=b-this.ra,d=0,e=this.Sc,f=this.kb;d<b;){if(0==f)for(;d<=c;)Cb(this,a,d),d+=this.ra;if(p(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.ra){Cb(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.ra){Cb(this,e);f=0;break}}this.kb=f;this.Kc+=b};function Db(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^ma()).toString(36)};var L=Array.prototype,Eb=L.indexOf?function(a,b,c){return L.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(p(a))return p(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Fb=L.forEach?function(a,b,c){L.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Gb=L.filter?function(a,b,c){return L.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=p(a)?
	a.split(""):a,h=0;h<d;h++)if(h in g){var m=g[h];b.call(c,m,h,a)&&(e[f++]=m)}return e},Hb=L.map?function(a,b,c){return L.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=p(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Ib=L.reduce?function(a,b,c,d){d&&(b=r(b,d));return L.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;Fb(a,function(c,g){e=b.call(d,e,c,g,a)});return e},Jb=L.every?function(a,b,c){return L.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=
	p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Kb(a,b){var c;a:{c=a.length;for(var d=p(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){c=e;break a}c=-1}return 0>c?null:p(a)?a.charAt(c):a[c]}function Lb(a,b){a.sort(b||Mb)}function Mb(a,b){return a>b?1:a<b?-1:0};var Nb;a:{var Ob=ba.navigator;if(Ob){var Pb=Ob.userAgent;if(Pb){Nb=Pb;break a}}Nb=""}function Qb(a){return-1!=Nb.indexOf(a)};var Rb=Qb("Opera")||Qb("OPR"),Sb=Qb("Trident")||Qb("MSIE"),Tb=Qb("Gecko")&&-1==Nb.toLowerCase().indexOf("webkit")&&!(Qb("Trident")||Qb("MSIE")),Ub=-1!=Nb.toLowerCase().indexOf("webkit");(function(){var a="",b;if(Rb&&ba.opera)return a=ba.opera.version,ia(a)?a():a;Tb?b=/rv\:([^\);]+)(\)|;)/:Sb?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Ub&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(Nb))?a[1]:"");return Sb&&(b=(b=ba.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Vb=null,Wb=null;
	function Xb(a,b){if(!ga(a))throw Error("encodeByteArray takes an array as a parameter");if(!Vb){Vb={};Wb={};for(var c=0;65>c;c++)Vb[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(c),Wb[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(c)}for(var c=b?Wb:Vb,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,h=g?a[e+1]:0,m=e+2<a.length,n=m?a[e+2]:0,q=f>>2,f=(f&3)<<4|h>>4,h=(h&15)<<2|n>>6,n=n&63;m||(n=64,g||(h=64));d.push(c[q],c[f],c[h],c[n])}return d.join("")}
	;var Yb=function(){var a=1;return function(){return a++}}();function v(a,b){if(!a)throw Error("Firebase INTERNAL ASSERT FAILED:"+b);}function Zb(a){try{if("undefined"!==typeof atob)return atob(a)}catch(b){M("base64DecodeIfNativeSupport failed: ",b)}return null}
	function $b(a){var b=wa(a);a=new Bb;a.update(b);var b=[],c=8*a.Kc;56>a.kb?a.update(a.vc,56-a.kb):a.update(a.vc,a.ra-(a.kb-56));for(var d=a.ra-1;56<=d;d--)a.Sc[d]=c&255,c/=256;Cb(a,a.Sc);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.F[d]>>e&255,++c;return Xb(b)}function ac(a){for(var b="",c=0;c<arguments.length;c++)b=ga(arguments[c])?b+ac.apply(null,arguments[c]):"object"===typeof arguments[c]?b+u(arguments[c]):b+arguments[c],b+=" ";return b}var bc=null,cc=!0;
	function M(a){!0===cc&&(cc=!1,null===bc&&!0===J.get("logging_enabled")&&dc(!0));if(bc){var b=ac.apply(null,arguments);bc(b)}}function ec(a){return function(){M(a,arguments)}}function fc(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+ac.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function gc(a){var b=ac.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}
	function O(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+ac.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
	function hc(a){var b="",c="",d="",e=!0,f="https",g="";if(p(a)){var h=a.indexOf("//");0<=h&&(f=a.substring(0,h-1),a=a.substring(h+2));h=a.indexOf("/");-1===h&&(h=a.length);b=a.substring(0,h);a=a.substring(h+1);var m=b.split(".");if(3===m.length){h=m[2].indexOf(":");e=0<=h?"https"===f||"wss"===f:!0;c=m[1];d=m[0];g="";a=("/"+a).split("/");for(h=0;h<a.length;h++)if(0<a[h].length){m=a[h];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(n){}g+="/"+m}d=d.toLowerCase()}else 2===m.length&&(c=m[0])}return{host:b,
	domain:c,Ve:d,Ya:e,scheme:f,Rb:g}}function Ia(a){return ha(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
	function ic(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
	function jc(a,b){return a!==b?null===a?-1:null===b?1:typeof a!==typeof b?"number"===typeof a?-1:1:a>b?1:-1:0}function kc(a,b){if(a===b)return 0;var c=lc(a),d=lc(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function mc(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+u(b));}
	function Ta(a){if("object"!==typeof a||null===a)return u(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=u(b[d]),c+=":",c+=Ta(a[b[d]]);return c+"}"}function nc(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function oc(a,b){if(fa(a))for(var c=0;c<a.length;++c)b(c,a[c]);else pc(a,b)}function qc(a,b){return b?r(a,b):a}
	function rc(a){v(!Ia(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;a-=1)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;a-=1)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
	(d="0"+d),c+=d;return c.toLowerCase()}function sc(a){var b="Unknown Error";"too_big"===a?b="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==a?b="Client doesn't have permission to access the desired data.":"unavailable"==a&&(b="The service is unavailable");b=Error(a+": "+b);b.code=a.toUpperCase();return b}var tc=/^-?\d{1,10}$/;function lc(a){return tc.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}
	function uc(a){try{a()}catch(b){setTimeout(function(){throw b;},Math.floor(0))}}function P(a,b){if(ia(a)){var c=Array.prototype.slice.call(arguments,1).slice();uc(function(){a.apply(null,c)})}};function vc(a,b){this.H=a;v(null!==this.H,"LeafNode shouldn't be created with null value.");this.pb="undefined"!==typeof b?b:null}k=vc.prototype;k.Q=function(){return!0};k.m=function(){return this.pb};k.La=function(a){return new vc(this.H,a)};k.P=function(){return Q};k.N=function(a){return null===D(a)?this:Q};k.ha=function(){return null};k.K=function(a,b){return(new R).K(a,b).La(this.pb)};k.Ba=function(a,b){var c=D(a);return null===c?b:this.K(c,Q.Ba(Ua(a),b))};k.f=function(){return!1};k.qc=function(){return 0};
	k.X=function(a){return a&&null!==this.m()?{".value":this.k(),".priority":this.m()}:this.k()};k.hash=function(){var a="";null!==this.m()&&(a+="priority:"+wc(this.m())+":");var b=typeof this.H,a=a+(b+":"),a="number"===b?a+rc(this.H):a+this.H;return $b(a)};k.k=function(){return this.H};k.toString=function(){return"string"===typeof this.H?this.H:'"'+this.H+'"'};function xc(a,b){return jc(a.la,b.la)||kc(a.name,b.name)}function yc(a,b){return kc(a.name,b.name)}function zc(a,b){return kc(a,b)};function R(a,b){this.o=a||new cb(zc);this.pb="undefined"!==typeof b?b:null}k=R.prototype;k.Q=function(){return!1};k.m=function(){return this.pb};k.La=function(a){return new R(this.o,a)};k.K=function(a,b){var c=this.o.remove(a);b&&b.f()&&(b=null);null!==b&&(c=c.ta(a,b));return b&&null!==b.m()?new Ac(c,null,this.pb):new R(c,this.pb)};k.Ba=function(a,b){var c=D(a);if(null===c)return b;var d=this.P(c).Ba(Ua(a),b);return this.K(c,d)};k.f=function(){return this.o.f()};k.qc=function(){return this.o.count()};
	var Bc=/^(0|[1-9]\d*)$/;k=R.prototype;k.X=function(a){if(this.f())return null;var b={},c=0,d=0,e=!0;this.B(function(f,g){b[f]=g.X(a);c++;e&&Bc.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],g;for(g in b)f[g]=b[g];return f}a&&null!==this.m()&&(b[".priority"]=this.m());return b};k.hash=function(){var a="";null!==this.m()&&(a+="priority:"+wc(this.m())+":");this.B(function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});return""===a?"":$b(a)};
	k.P=function(a){a=this.o.get(a);return null===a?Q:a};k.N=function(a){var b=D(a);return null===b?this:this.P(b).N(Ua(a))};k.ha=function(a){return gb(this.o,a)};k.Jd=function(){return this.o.Lb()};k.Kd=function(){return this.o.lb()};k.B=function(a){return this.o.Fa(a)};k.$c=function(a){return this.o.Xa(a)};k.jb=function(){return this.o.jb()};k.toString=function(){var a="{",b=!0;this.B(function(c,d){b?b=!1:a+=", ";a+='"'+c+'" : '+d.toString()});return a+="}"};var Q=new R;function Ac(a,b,c){R.call(this,a,c);null===b&&(b=new cb(xc),a.Fa(function(a,c){b=b.ta({name:a,la:c.m()},c)}));this.ya=b}oa(Ac,R);k=Ac.prototype;k.K=function(a,b){var c=this.P(a),d=this.o,e=this.ya;null!==c&&(d=d.remove(a),e=e.remove({name:a,la:c.m()}));b&&b.f()&&(b=null);null!==b&&(d=d.ta(a,b),e=e.ta({name:a,la:b.m()},b));return new Ac(d,e,this.m())};k.ha=function(a,b){var c=gb(this.ya,{name:a,la:b.m()});return c?c.name:null};k.B=function(a){return this.ya.Fa(function(b,c){return a(b.name,c)})};
	k.$c=function(a){return this.ya.Xa(function(b,c){return a(b.name,c)})};k.jb=function(){return this.ya.jb(function(a,b){return{key:a.name,value:b}})};k.Jd=function(){return this.ya.f()?null:this.ya.Lb().name};k.Kd=function(){return this.ya.f()?null:this.ya.lb().name};function S(a,b){if(null===a)return Q;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);v(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new vc(a,c);if(a instanceof Array){var d=Q,e=a;pc(e,function(a,b){if(A(e,b)&&"."!==b.substring(0,1)){var c=S(a);if(c.Q()||!c.f())d=
	d.K(b,c)}});return d.La(c)}var f=[],g={},h=!1,m=a;oc(m,function(a,b){if("string"!==typeof b||"."!==b.substring(0,1)){var c=S(m[b]);c.f()||(h=h||null!==c.m(),f.push({name:b,la:c.m()}),g[b]=c)}});var n=Cc(f,g,!1);if(h){var q=Cc(f,g,!0);return new Ac(n,q,c)}return new R(n,c)}var Dc=Math.log(2);function Ec(a){this.count=parseInt(Math.log(a+1)/Dc,10);this.Fd=this.count-1;this.pe=a+1&parseInt(Array(this.count+1).join("1"),2)}function Fc(a){var b=!(a.pe&1<<a.Fd);a.Fd--;return b}
	function Cc(a,b,c){function d(e,f){var m=f-e;if(0==m)return null;if(1==m){var m=a[e].name,n=c?a[e]:m;return new jb(n,b[m],!1,null,null)}var n=parseInt(m/2,10)+e,q=d(e,n),s=d(n+1,f),m=a[n].name,n=c?a[n]:m;return new jb(n,b[m],!1,q,s)}var e=c?xc:yc;a.sort(e);var f=function(e){function f(e,g){var h=q-e,s=q;q-=e;var t=a[h].name,h=new jb(c?a[h]:t,b[t],g,null,d(h+1,s));m?m.left=h:n=h;m=h}for(var m=null,n=null,q=a.length,s=0;s<e.count;++s){var t=Fc(e),w=Math.pow(2,e.count-(s+1));t?f(w,!1):(f(w,!1),f(w,!0))}return n}(new Ec(a.length)),
	e=c?xc:zc;return null!==f?new cb(e,f):new cb(e)}function wc(a){return"number"===typeof a?"number:"+rc(a):"string:"+a};function T(a,b){this.A=a;this.Cc=b}T.prototype.X=function(){x("Firebase.DataSnapshot.val",0,0,arguments.length);return this.A.X()};T.prototype.val=T.prototype.X;T.prototype.te=function(){x("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.A.X(!0)};T.prototype.exportVal=T.prototype.te;T.prototype.J=function(a){x("Firebase.DataSnapshot.child",0,1,arguments.length);ha(a)&&(a=String(a));Na("Firebase.DataSnapshot.child",a);var b=new H(a),c=this.Cc.J(b);return new T(this.A.N(b),c)};
	T.prototype.child=T.prototype.J;T.prototype.ed=function(a){x("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Na("Firebase.DataSnapshot.hasChild",a);var b=new H(a);return!this.A.N(b).f()};T.prototype.hasChild=T.prototype.ed;T.prototype.m=function(){x("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.A.m()};T.prototype.getPriority=T.prototype.m;
	T.prototype.forEach=function(a){x("Firebase.DataSnapshot.forEach",1,1,arguments.length);z("Firebase.DataSnapshot.forEach",1,a,!1);if(this.A.Q())return!1;var b=this;return this.A.B(function(c,d){return a(new T(d,b.Cc.J(c)))})};T.prototype.forEach=T.prototype.forEach;T.prototype.Fb=function(){x("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.A.Q()?!1:!this.A.f()};T.prototype.hasChildren=T.prototype.Fb;
	T.prototype.name=function(){x("Firebase.DataSnapshot.name",0,0,arguments.length);return this.Cc.name()};T.prototype.name=T.prototype.name;T.prototype.qc=function(){x("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.A.qc()};T.prototype.numChildren=T.prototype.qc;T.prototype.rd=function(){x("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.Cc};T.prototype.ref=T.prototype.rd;function Gc(a){v(fa(a)&&0<a.length,"Requires a non-empty array");this.he=a;this.Jb={}}Gc.prototype.Mc=function(a,b){for(var c=this.Jb[a]||[],d=0;d<c.length;d++)c[d].ca.apply(c[d].$,Array.prototype.slice.call(arguments,1))};Gc.prototype.Ua=function(a,b,c){Hc(this,a);this.Jb[a]=this.Jb[a]||[];this.Jb[a].push({ca:b,$:c});(a=this.cd(a))&&b.apply(c,a)};Gc.prototype.nb=function(a,b,c){Hc(this,a);a=this.Jb[a]||[];for(var d=0;d<a.length;d++)if(a[d].ca===b&&(!c||c===a[d].$)){a.splice(d,1);break}};
	function Hc(a,b){v(Kb(a.he,function(a){return a===b}),"Unknown event: "+b)};function Ic(){Gc.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.xb=!0;if(b){var c=this;document.addEventListener(b,
	function(){var b=!document[a];b!==c.xb&&(c.xb=b,c.Mc("visible",b))},!1)}}oa(Ic,Gc);da(Ic);Ic.prototype.cd=function(a){v("visible"===a,"Unknown event type: "+a);return[this.xb]};function Jc(){Gc.call(this,["online"]);this.Ob=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener){var a=this;window.addEventListener("online",function(){a.Ob||a.Mc("online",!0);a.Ob=!0},!1);window.addEventListener("offline",function(){a.Ob&&a.Mc("online",!1);a.Ob=!1},!1)}}oa(Jc,Gc);da(Jc);Jc.prototype.cd=function(a){v("online"===a,"Unknown event type: "+a);return[this.Ob]};function pc(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function Kc(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function Lc(a){for(var b in a)return!1;return!0}function Mc(a){var b={},c;for(c in a)b[c]=a[c];return b}var Nc="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
	function Pc(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Nc.length;f++)c=Nc[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function Qc(){this.Bb={}}function Rc(a,b,c){l(c)||(c=1);A(a.Bb,b)||(a.Bb[b]=0);a.Bb[b]+=c}Qc.prototype.get=function(){return Mc(this.Bb)};function Sc(a){this.qe=a;this.mc=null}Sc.prototype.get=function(){var a=this.qe.get(),b=Mc(a);if(this.mc)for(var c in this.mc)b[c]-=this.mc[c];this.mc=a;return b};function Tc(a,b){this.yd={};this.Hc=new Sc(a);this.n=b;var c=1E4+2E4*Math.random();setTimeout(r(this.Ud,this),Math.floor(c))}Tc.prototype.Ud=function(){var a=this.Hc.get(),b={},c=!1,d;for(d in a)0<a[d]&&A(this.yd,d)&&(b[d]=a[d],c=!0);c&&(a=this.n,a.T&&(b={c:b},a.e("reportStats",b),a.Ja("s",b)));setTimeout(r(this.Ud,this),Math.floor(6E5*Math.random()))};var Uc={},Vc={};function Wc(a){a=a.toString();Uc[a]||(Uc[a]=new Qc);return Uc[a]}function Xc(a,b){var c=a.toString();Vc[c]||(Vc[c]=b());return Vc[c]};var Yc=null;"undefined"!==typeof MozWebSocket?Yc=MozWebSocket:"undefined"!==typeof WebSocket&&(Yc=WebSocket);function Zc(a,b,c){this.Wc=a;this.e=ec(this.Wc);this.frames=this.Hb=null;this.Na=this.Oa=this.Ad=0;this.ga=Wc(b);this.Ca=(b.Ya?"wss://":"ws://")+b.ia+"/.ws?v=5";"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(this.Ca+="&r=f");b.host!==b.ia&&(this.Ca=this.Ca+"&ns="+b.Ta);c&&(this.Ca=this.Ca+"&s="+c)}var $c;
	Zc.prototype.open=function(a,b){this.ka=b;this.Ge=a;this.e("Websocket connecting to "+this.Ca);this.Db=!1;xb.set("previous_websocket_failure",!0);try{this.Y=new Yc(this.Ca)}catch(c){this.e("Error instantiating WebSocket.");var d=c.message||c.data;d&&this.e(d);this.Ia();return}var e=this;this.Y.onopen=function(){e.e("Websocket connected.");e.Db=!0};this.Y.onclose=function(){e.e("Websocket connection was disconnected.");e.Y=null;e.Ia()};this.Y.onmessage=function(a){if(null!==e.Y)if(a=a.data,e.Na+=a.length,
	Rc(e.ga,"bytes_received",a.length),ad(e),null!==e.frames)bd(e,a);else{a:{v(null===e.frames,"We already have a frame buffer");if(6>=a.length){var b=Number(a);if(!isNaN(b)){e.Ad=b;e.frames=[];a=null;break a}}e.Ad=1;e.frames=[]}null!==a&&bd(e,a)}};this.Y.onerror=function(a){e.e("WebSocket error.  Closing connection.");(a=a.message||a.data)&&e.e(a);e.Ia()}};Zc.prototype.start=function(){};
	Zc.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==Yc&&!$c};Zc.responsesRequiredToBeHealthy=2;Zc.healthyTimeout=3E4;k=Zc.prototype;k.nc=function(){xb.remove("previous_websocket_failure")};function bd(a,b){a.frames.push(b);if(a.frames.length==a.Ad){var c=a.frames.join("");a.frames=null;c=va(c);a.Ge(c)}}
	k.send=function(a){ad(this);a=u(a);this.Oa+=a.length;Rc(this.ga,"bytes_sent",a.length);a=nc(a,16384);1<a.length&&this.Y.send(String(a.length));for(var b=0;b<a.length;b++)this.Y.send(a[b])};k.ac=function(){this.Ra=!0;this.Hb&&(clearInterval(this.Hb),this.Hb=null);this.Y&&(this.Y.close(),this.Y=null)};k.Ia=function(){this.Ra||(this.e("WebSocket is closing itself"),this.ac(),this.ka&&(this.ka(this.Db),this.ka=null))};k.close=function(){this.Ra||(this.e("WebSocket is being closed"),this.ac())};
	function ad(a){clearInterval(a.Hb);a.Hb=setInterval(function(){a.Y&&a.Y.send("0");ad(a)},Math.floor(45E3))};function cd(a){this.ob=a;this.xc=[];this.eb=0;this.Vc=-1;this.Va=null}function dd(a,b,c){a.Vc=b;a.Va=c;a.Vc<a.eb&&(a.Va(),a.Va=null)}function ed(a,b,c){for(a.xc[b]=c;a.xc[a.eb];){var d=a.xc[a.eb];delete a.xc[a.eb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;uc(function(){f.ob(d[e])})}if(a.eb===a.Vc){a.Va&&(clearTimeout(a.Va),a.Va(),a.Va=null);break}a.eb++}};function fd(){this.set={}}k=fd.prototype;k.add=function(a,b){this.set[a]=null!==b?b:!0};k.contains=function(a){return A(this.set,a)};k.get=function(a){return this.contains(a)?this.set[a]:void 0};k.remove=function(a){delete this.set[a]};k.clear=function(){this.set={}};k.f=function(){return Lc(this.set)};k.count=function(){var a=this.set,b=0,c;for(c in a)b++;return b};function gd(a,b){pc(a.set,function(a,d){b(d,a)})}k.keys=function(){var a=[];pc(this.set,function(b,c){a.push(c)});return a};function hd(a,b,c){this.Wc=a;this.e=ec(a);this.Na=this.Oa=0;this.ga=Wc(b);this.Gc=c;this.Db=!1;this.dc=function(a){b.host!==b.ia&&(a.ns=b.Ta);var c=[],f;for(f in a)a.hasOwnProperty(f)&&c.push(f+"="+a[f]);return(b.Ya?"https://":"http://")+b.ia+"/.lp?"+c.join("&")}}var id,jd;
	hd.prototype.open=function(a,b){this.Ed=0;this.U=b;this.Od=new cd(a);this.Ra=!1;var c=this;this.Pa=setTimeout(function(){c.e("Timed out trying to connect.");c.Ia();c.Pa=null},Math.floor(3E4));ic(function(){if(!c.Ra){c.na=new kd(function(a,b,d,h,m){ld(c,arguments);if(c.na)if(c.Pa&&(clearTimeout(c.Pa),c.Pa=null),c.Db=!0,"start"==a)c.id=b,c.Td=d;else if("close"===a)b?(c.na.Fc=!1,dd(c.Od,b,function(){c.Ia()})):c.Ia();else throw Error("Unrecognized command received: "+a);},function(a,b){ld(c,arguments);
	ed(c.Od,a,b)},function(){c.Ia()},c.dc);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.na.Nc&&(a.cb=c.na.Nc);a.v="5";c.Gc&&(a.s=c.Gc);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.dc(a);c.e("Connecting via long-poll to "+a);md(c.na,a,function(){})}})};
	hd.prototype.start=function(){var a=this.na,b=this.Td;a.Be=this.id;a.Ce=b;for(a.Qc=!0;nd(a););a=this.id;b=this.Td;this.mb=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.mb.src=this.dc(c);this.mb.style.display="none";document.body.appendChild(this.mb)};hd.isAvailable=function(){return!jd&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.Ze)&&(id||!0)};k=hd.prototype;
	k.nc=function(){};k.ac=function(){this.Ra=!0;this.na&&(this.na.close(),this.na=null);this.mb&&(document.body.removeChild(this.mb),this.mb=null);this.Pa&&(clearTimeout(this.Pa),this.Pa=null)};k.Ia=function(){this.Ra||(this.e("Longpoll is closing itself"),this.ac(),this.U&&(this.U(this.Db),this.U=null))};k.close=function(){this.Ra||(this.e("Longpoll is being closed."),this.ac())};
	k.send=function(a){a=u(a);this.Oa+=a.length;Rc(this.ga,"bytes_sent",a.length);a=wa(a);a=Xb(a,!0);a=nc(a,1840);for(var b=0;b<a.length;b++){var c=this.na;c.Tb.push({Pe:this.Ed,We:a.length,Gd:a[b]});c.Qc&&nd(c);this.Ed++}};function ld(a,b){var c=u(b).length;a.Na+=c;Rc(a.ga,"bytes_received",c)}
	function kd(a,b,c,d){this.dc=d;this.ka=c;this.od=new fd;this.Tb=[];this.Yc=Math.floor(1E8*Math.random());this.Fc=!0;this.Nc=Yb();window["pLPCommand"+this.Nc]=a;window["pRTLPCB"+this.Nc]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||M("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
	a.contentDocument?a.Da=a.contentDocument:a.contentWindow?a.Da=a.contentWindow.document:a.document&&(a.Da=a.document);this.aa=a;a="";this.aa.src&&"javascript:"===this.aa.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.aa.Da.open(),this.aa.Da.write(a),this.aa.Da.close()}catch(f){M("frame writing exception"),f.stack&&M(f.stack),M(f)}}
	kd.prototype.close=function(){this.Qc=!1;if(this.aa){this.aa.Da.body.innerHTML="";var a=this;setTimeout(function(){null!==a.aa&&(document.body.removeChild(a.aa),a.aa=null)},Math.floor(0))}var b=this.ka;b&&(this.ka=null,b())};
	function nd(a){if(a.Qc&&a.Fc&&a.od.count()<(0<a.Tb.length?2:1)){a.Yc++;var b={};b.id=a.Be;b.pw=a.Ce;b.ser=a.Yc;for(var b=a.dc(b),c="",d=0;0<a.Tb.length;)if(1870>=a.Tb[0].Gd.length+30+c.length){var e=a.Tb.shift(),c=c+"&seg"+d+"="+e.Pe+"&ts"+d+"="+e.We+"&d"+d+"="+e.Gd;d++}else break;od(a,b+c,a.Yc);return!0}return!1}function od(a,b,c){function d(){a.od.remove(c);nd(a)}a.od.add(c);var e=setTimeout(d,Math.floor(25E3));md(a,b,function(){clearTimeout(e);d()})}
	function md(a,b,c){setTimeout(function(){try{if(a.Fc){var d=a.aa.Da.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){M("Long-poll script failed to load: "+b);a.Fc=!1;a.close()};a.aa.Da.body.appendChild(d)}}catch(e){}},Math.floor(1))};function pd(a){qd(this,a)}var rd=[hd,Zc];function qd(a,b){var c=Zc&&Zc.isAvailable(),d=c&&!(xb.Nd||!0===xb.get("previous_websocket_failure"));b.Ye&&(c||O("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.bc=[Zc];else{var e=a.bc=[];oc(rd,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function sd(a){if(0<a.bc.length)return a.bc[0];throw Error("No transports available");};function td(a,b,c,d,e,f){this.id=a;this.e=ec("c:"+this.id+":");this.ob=c;this.Nb=d;this.U=e;this.md=f;this.D=b;this.wc=[];this.Dd=0;this.ce=new pd(b);this.oa=0;this.e("Connection created");ud(this)}
	function ud(a){var b=sd(a.ce);a.C=new b("c:"+a.id+":"+a.Dd++,a.D);a.qd=b.responsesRequiredToBeHealthy||0;var c=vd(a,a.C),d=wd(a,a.C);a.cc=a.C;a.$b=a.C;a.w=null;a.Sa=!1;setTimeout(function(){a.C&&a.C.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.kc=setTimeout(function(){a.kc=null;a.Sa||(a.C&&102400<a.C.Na?(a.e("Connection exceeded healthy timeout but has received "+a.C.Na+" bytes.  Marking connection healthy."),a.Sa=!0,a.C.nc()):a.C&&10240<a.C.Oa?a.e("Connection exceeded healthy timeout but has sent "+
	a.C.Oa+" bytes.  Leaving connection alive."):(a.e("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function wd(a,b){return function(c){b===a.C?(a.C=null,c||0!==a.oa?1===a.oa&&a.e("Realtime connection lost."):(a.e("Realtime connection failed."),"s-"===a.D.ia.substr(0,2)&&(xb.remove("host:"+a.D.host),a.D.ia=a.D.host)),a.close()):b===a.w?(a.e("Secondary connection lost."),c=a.w,a.w=null,a.cc!==c&&a.$b!==c||a.close()):a.e("closing an old connection")}}
	function vd(a,b){return function(c){if(2!=a.oa)if(b===a.$b){var d=mc("t",c);c=mc("d",c);if("c"==d){if(d=mc("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.Gc=c.s;zb(a.D,f);0==a.oa&&(a.C.start(),xd(a,a.C,d),"5"!==e&&O("Protocol version mismatch detected"),c=a.ce,(c=1<c.bc.length?c.bc[1]:null)&&yd(a,c))}else if("n"===d){a.e("recvd end transmission on primary");a.$b=a.w;for(c=0;c<a.wc.length;++c)a.tc(a.wc[c]);a.wc=[];zd(a)}else"s"===d?(a.e("Connection shutdown command received. Shutting down..."),
	a.md&&(a.md(c),a.md=null),a.U=null,a.close()):"r"===d?(a.e("Reset packet received.  New host: "+c),zb(a.D,c),1===a.oa?a.close():(Ad(a),ud(a))):"e"===d?fc("Server Error: "+c):"o"===d?(a.e("got pong on primary."),Dd(a),Ed(a)):fc("Unknown control packet command: "+d)}else"d"==d&&a.tc(c)}else if(b===a.w)if(d=mc("t",c),c=mc("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?Fd(a):"r"===c?(a.e("Got a reset on secondary, closing it"),a.w.close(),a.cc!==a.w&&a.$b!==a.w||a.close()):"o"===c&&(a.e("got pong on secondary."),
	a.Yd--,Fd(a)));else if("d"==d)a.wc.push(c);else throw Error("Unknown protocol layer: "+d);else a.e("message on old connection")}}td.prototype.Zd=function(a){Gd(this,{t:"d",d:a})};function zd(a){a.cc===a.w&&a.$b===a.w&&(a.e("cleaning up and promoting a connection: "+a.w.Wc),a.C=a.w,a.w=null)}
	function Fd(a){0>=a.Yd?(a.e("Secondary connection is healthy."),a.Sa=!0,a.w.nc(),a.w.start(),a.e("sending client ack on secondary"),a.w.send({t:"c",d:{t:"a",d:{}}}),a.e("Ending transmission on primary"),a.C.send({t:"c",d:{t:"n",d:{}}}),a.cc=a.w,zd(a)):(a.e("sending ping on secondary."),a.w.send({t:"c",d:{t:"p",d:{}}}))}td.prototype.tc=function(a){Dd(this);this.ob(a)};function Dd(a){a.Sa||(a.qd--,0>=a.qd&&(a.e("Primary connection is healthy."),a.Sa=!0,a.C.nc()))}
	function yd(a,b){a.w=new b("c:"+a.id+":"+a.Dd++,a.D,a.Gc);a.Yd=b.responsesRequiredToBeHealthy||0;a.w.open(vd(a,a.w),wd(a,a.w));setTimeout(function(){a.w&&(a.e("Timed out trying to upgrade."),a.w.close())},Math.floor(6E4))}function xd(a,b,c){a.e("Realtime connection established.");a.C=b;a.oa=1;a.Nb&&(a.Nb(c),a.Nb=null);0===a.qd?(a.e("Primary connection is healthy."),a.Sa=!0):setTimeout(function(){Ed(a)},Math.floor(5E3))}
	function Ed(a){a.Sa||1!==a.oa||(a.e("sending ping on primary."),Gd(a,{t:"c",d:{t:"p",d:{}}}))}function Gd(a,b){if(1!==a.oa)throw"Connection is not connected";a.cc.send(b)}td.prototype.close=function(){2!==this.oa&&(this.e("Closing realtime connection."),this.oa=2,Ad(this),this.U&&(this.U(),this.U=null))};function Ad(a){a.e("Shutting down all connections");a.C&&(a.C.close(),a.C=null);a.w&&(a.w.close(),a.w=null);a.kc&&(clearTimeout(a.kc),a.kc=null)};function Hd(a){var b={},c={},d={},e="";try{var f=a.split("."),b=va(Zb(f[0])||""),c=va(Zb(f[1])||""),e=f[2],d=c.d||{};delete c.d}catch(g){}return{cf:b,Uc:c,data:d,Ue:e}}function Id(a){a=Hd(a).Uc;return"object"===typeof a&&a.hasOwnProperty("iat")?B(a,"iat"):null}function Jd(a){a=Hd(a);var b=a.Uc;return!!a.Ue&&!!b&&"object"===typeof b&&b.hasOwnProperty("iat")};function Kd(a,b,c,d,e){this.id=Ld++;this.e=ec("p:"+this.id+":");this.Za=!0;this.ja={};this.V=[];this.Pb=0;this.Mb=[];this.T=!1;this.va=1E3;this.oc=3E5;this.uc=b||ca;this.sc=c||ca;this.nd=d||ca;this.dd=e||ca;this.D=a;this.ud=null;this.Xb={};this.Oe=0;this.Ib=this.hd=null;Md(this,0);Ic.ib().Ua("visible",this.Je,this);-1===a.host.indexOf("fblocal")&&Jc.ib().Ua("online",this.He,this)}var Ld=0,Nd=0;k=Kd.prototype;
	k.Ja=function(a,b,c){var d=++this.Oe;a={r:d,a:a,b:b};this.e(u(a));v(this.T,"sendRequest_ call when we're not connected not allowed.");this.ma.Zd(a);c&&(this.Xb[d]=c)};function Od(a,b,c){var d=b.toString(),e=b.path().toString();a.ja[e]=a.ja[e]||{};v(!a.ja[e][d],"listen() called twice for same path/queryId.");a.ja[e][d]={qb:b.qb(),G:c};a.T&&Pd(a,e,d,b.qb(),c)}
	function Pd(a,b,c,d,e){a.e("Listen on "+b+" for "+c);var f={p:b};d=Hb(d,function(a){return Sa(a)});"{}"!==c&&(f.q=d);f.h=a.dd(b);a.Ja("l",f,function(d){a.e("listen response",d);d=d.s;"ok"!==d&&Qd(a,b,c);e&&e(d)})}k.I=function(a,b,c){this.bb={re:a,Id:!1,ca:b,fc:c};this.e("Authenticating using credential: "+a);Rd(this);(b=40==a.length)||(a=Hd(a).Uc,b="object"===typeof a&&!0===B(a,"admin"));b&&(this.e("Admin auth credential detected.  Reducing max reconnect time."),this.oc=3E4)};
	k.Bd=function(a){delete this.bb;this.T&&this.Ja("unauth",{},function(b){a(b.s,b.d)})};function Rd(a){var b=a.bb;a.T&&b&&a.Ja("auth",{cred:b.re},function(c){var d=c.s;c=c.d||"error";"ok"!==d&&a.bb===b&&delete a.bb;b.Id?"ok"!==d&&b.fc&&b.fc(d,c):(b.Id=!0,b.ca&&b.ca(d,c))})}function Sd(a,b,c,d){b=b.toString();Qd(a,b,c)&&a.T&&Td(a,b,c,d)}function Td(a,b,c,d){a.e("Unlisten on "+b+" for "+c);b={p:b};d=Hb(d,function(a){return Sa(a)});"{}"!==c&&(b.q=d);a.Ja("u",b)}
	function Ud(a,b,c,d){a.T?Vd(a,"o",b,c,d):a.Mb.push({Rb:b,action:"o",data:c,G:d})}function Wd(a,b,c,d){a.T?Vd(a,"om",b,c,d):a.Mb.push({Rb:b,action:"om",data:c,G:d})}k.ld=function(a,b){this.T?Vd(this,"oc",a,null,b):this.Mb.push({Rb:a,action:"oc",data:null,G:b})};function Vd(a,b,c,d,e){c={p:c,d:d};a.e("onDisconnect "+b,c);a.Ja(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}k.put=function(a,b,c,d){Xd(this,"p",a,b,c,d)};function Yd(a,b,c,d){Xd(a,"m",b,c,d,void 0)}
	function Xd(a,b,c,d,e,f){c={p:c,d:d};l(f)&&(c.h=f);a.V.push({action:b,Vd:c,G:e});a.Pb++;b=a.V.length-1;a.T&&Zd(a,b)}function Zd(a,b){var c=a.V[b].action,d=a.V[b].Vd,e=a.V[b].G;a.V[b].Le=a.T;a.Ja(c,d,function(d){a.e(c+" response",d);delete a.V[b];a.Pb--;0===a.Pb&&(a.V=[]);e&&e(d.s,d.d)})}
	k.tc=function(a){if("r"in a){this.e("from server: "+u(a));var b=a.r,c=this.Xb[b];c&&(delete this.Xb[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,c=a.b,this.e("handleServerMessage",b,c),"d"===b?this.uc(c.p,c.d,!1):"m"===b?this.uc(c.p,c.d,!0):"c"===b?$d(this,c.p,c.q):"ac"===b?(a=c.s,b=c.d,c=this.bb,delete this.bb,c&&c.fc&&c.fc(a,b)):"sd"===b?this.ud?this.ud(c):"msg"in c&&"undefined"!==typeof console&&console.log("FIREBASE: "+c.msg.replace("\n","\nFIREBASE: ")):
	fc("Unrecognized action received from server: "+u(b)+"\nAre you using the latest client?"))}};k.Nb=function(a){this.e("connection ready");this.T=!0;this.Ib=(new Date).getTime();this.nd({serverTimeOffset:a-(new Date).getTime()});Rd(this);for(var b in this.ja)for(var c in this.ja[b])a=this.ja[b][c],Pd(this,b,c,a.qb,a.G);for(b=0;b<this.V.length;b++)this.V[b]&&Zd(this,b);for(;this.Mb.length;)b=this.Mb.shift(),Vd(this,b.action,b.Rb,b.data,b.G);this.sc(!0)};
	function Md(a,b){v(!a.ma,"Scheduling a connect when we're already connected/ing?");a.gb&&clearTimeout(a.gb);a.gb=setTimeout(function(){a.gb=null;ae(a)},Math.floor(b))}k.Je=function(a){a&&!this.xb&&this.va===this.oc&&(this.e("Window became visible.  Reducing delay."),this.va=1E3,this.ma||Md(this,0));this.xb=a};
	k.He=function(a){a?(this.e("Browser went online.  Reconnecting."),this.va=1E3,this.Za=!0,this.ma||Md(this,0)):(this.e("Browser went offline.  Killing connection; don't reconnect."),this.Za=!1,this.ma&&this.ma.close())};
	k.Qd=function(){this.e("data client disconnected");this.T=!1;this.ma=null;for(var a=0;a<this.V.length;a++){var b=this.V[a];b&&"h"in b.Vd&&b.Le&&(b.G&&b.G("disconnect"),delete this.V[a],this.Pb--)}0===this.Pb&&(this.V=[]);if(this.Za)this.xb?this.Ib&&(3E4<(new Date).getTime()-this.Ib&&(this.va=1E3),this.Ib=null):(this.e("Window isn't visible.  Delaying reconnect."),this.va=this.oc,this.hd=(new Date).getTime()),a=Math.max(0,this.va-((new Date).getTime()-this.hd)),a*=Math.random(),this.e("Trying to reconnect in "+
	a+"ms"),Md(this,a),this.va=Math.min(this.oc,1.3*this.va);else for(var c in this.Xb)delete this.Xb[c];this.sc(!1)};function ae(a){if(a.Za){a.e("Making a connection attempt");a.hd=(new Date).getTime();a.Ib=null;var b=r(a.tc,a),c=r(a.Nb,a),d=r(a.Qd,a),e=a.id+":"+Nd++;a.ma=new td(e,a.D,b,c,d,function(b){O(b+" ("+a.D.toString()+")");a.Za=!1})}}k.Qa=function(){this.Za=!1;this.ma?this.ma.close():(this.gb&&(clearTimeout(this.gb),this.gb=null),this.T&&this.Qd())};
	k.tb=function(){this.Za=!0;this.va=1E3;this.T||Md(this,0)};function $d(a,b,c){c=c?Hb(c,function(a){return Ta(a)}).join("$"):"{}";(a=Qd(a,b,c))&&a.G&&a.G("permission_denied")}function Qd(a,b,c){b=(new H(b)).toString();c||(c="{}");var d=a.ja[b][c];delete a.ja[b][c];return d};function be(){this.o=this.H=null}be.prototype.rb=function(a,b){if(a.f())this.H=b,this.o=null;else if(null!==this.H)this.H=this.H.Ba(a,b);else{null==this.o&&(this.o=new fd);var c=D(a);this.o.contains(c)||this.o.add(c,new be);c=this.o.get(c);a=Ua(a);c.rb(a,b)}};
	function ce(a,b){if(b.f())return a.H=null,a.o=null,!0;if(null!==a.H){if(a.H.Q())return!1;var c=a.H;a.H=null;c.B(function(b,c){a.rb(new H(b),c)});return ce(a,b)}return null!==a.o?(c=D(b),b=Ua(b),a.o.contains(c)&&ce(a.o.get(c),b)&&a.o.remove(c),a.o.f()?(a.o=null,!0):!1):!0}function de(a,b,c){null!==a.H?c(b,a.H):a.B(function(a,e){var f=new H(b.toString()+"/"+a);de(e,f,c)})}be.prototype.B=function(a){null!==this.o&&gd(this.o,function(b,c){a(b,c)})};function ee(){this.ba=Q}function U(a,b){return a.ba.N(b)}function V(a,b,c){a.ba=a.ba.Ba(b,c)}ee.prototype.toString=function(){return this.ba.toString()};function fe(){this.wa=new ee;this.O=new ee;this.qa=new ee;this.Sb=new Ya}function ge(a,b,c){V(a.wa,b,c);return he(a,b)}function he(a,b){for(var c=U(a.wa,b),d=U(a.O,b),e=I(a.Sb,b),f=!1,g=e;null!==g;){if(null!==g.k()){f=!0;break}g=g.parent()}if(f)return!1;c=ie(c,d,e);return c!==d?(V(a.O,b,c),!0):!1}function ie(a,b,c){if(c.f())return a;if(null!==c.k())return b;a=a||Q;c.B(function(d){d=d.name();var e=a.P(d),f=b.P(d),g=I(c,d),e=ie(e,f,g);a=a.K(d,e)});return a}
	fe.prototype.set=function(a,b){var c=this,d=[];Fb(b,function(a){var b=a.path;a=a.ua;var g=Yb();Za(I(c.Sb,b),g);V(c.O,b,a);d.push({path:b,Re:g})});return d};function je(a,b){Fb(b,function(b){var d=b.Re;b=I(a.Sb,b.path);var e=b.k();v(null!==e,"pendingPut should not be null.");e===d&&Za(b,null)})};function ke(a,b){return a&&"object"===typeof a?(v(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function le(a,b){var c=new be;de(a,new H(""),function(a,e){c.rb(a,me(e,b))});return c}function me(a,b){var c=ke(a.m(),b),d;if(a.Q()){var e=ke(a.k(),b);return e!==a.k()||c!==a.m()?new vc(e,c):a}d=a;c!==a.m()&&(d=d.La(c));a.B(function(a,c){var e=me(c,b);e!==c&&(d=d.K(a,e))});return d};var ne="auth.firebase.com";function oe(a,b,c){this.hc=a||{};this.Lc=b||{};this.ub=c||{};this.hc.remember||(this.hc.remember="default")}var pe=["remember","redirectTo"];function qe(a){var b={},c={};Aa(a||{},function(a,e){0<=Eb(pe,a)?b[a]=e:c[a]=e});return new oe(b,{},c)};var re={NETWORK_ERROR:"Unable to contact the Firebase server.",SERVER_ERROR:"An unknown server error occurred.",TRANSPORT_UNAVAILABLE:"There are no login transports available for the requested method.",REQUEST_INTERRUPTED:"The browser redirected the page before the login request could complete.",USER_CANCELLED:"The user cancelled authentication."};function W(a){var b=Error(B(re,a),a);b.code=a;return b};function se(){var a=window.opener.frames,b;for(b=a.length-1;0<=b;b--)try{if(a[b].location.protocol===window.location.protocol&&a[b].location.host===window.location.host&&"__winchan_relay_frame"===a[b].name)return a[b]}catch(c){}return null}function te(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,!1)}function ue(a,b,c){a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener&&a.removeEventListener(b,c,!1)}
	function ve(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);return b?b[1]:a}function we(a){var b="";try{a=a.replace("#","");var c={},d=a.replace(/^\?/,"").split("&");for(a=0;a<d.length;a++)if(d[a]){var e=d[a].split("=");c[e[0]]=e[1]}c&&A(c,"__firebase_request_key")&&(b=B(c,"__firebase_request_key"))}catch(f){}return b}
	function xe(a){var b=[],c;for(c in a)if(A(a,c)){var d=B(a,c);if(fa(d))for(var e=0;e<d.length;e++)b.push(encodeURIComponent(c)+"="+encodeURIComponent(d[e]));else b.push(encodeURIComponent(c)+"="+encodeURIComponent(B(a,c)))}return b.join("&")}function ye(){var a=hc(ne);return a.scheme+"://"+a.host+"/v2"};function ze(){return!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(navigator.userAgent)}function Ae(){var a=navigator.userAgent;if("Microsoft Internet Explorer"===navigator.appName){if((a=a.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1])}else if(-1<a.indexOf("Trident")&&(a=a.match(/rv:([0-9]{2,2}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1]);return!1};function Be(a){a=a||{};a.method||(a.method="GET");a.headers||(a.headers={});a.headers.content_type||(a.headers.content_type="application/json");a.headers.content_type=a.headers.content_type.toLowerCase();this.options=a}
	Be.prototype.open=function(a,b,c){function d(){c&&(c(W("REQUEST_INTERRUPTED")),c=null)}var e=new XMLHttpRequest,f=this.options.method.toUpperCase(),g;te(window,"beforeunload",d);e.onreadystatechange=function(){if(c&&4===e.readyState){var a;if(200<=e.status&&300>e.status){try{a=va(e.responseText)}catch(b){}c(null,a)}else 500<=e.status&&600>e.status?c(W("SERVER_ERROR")):c(W("NETWORK_ERROR"));c=null;ue(window,"beforeunload",d)}};if("GET"===f)a+=(/\?/.test(a)?"":"?")+xe(b),g=null;else{var h=this.options.headers.content_type;
	"application/json"===h&&(g=u(b));"application/x-www-form-urlencoded"===h&&(g=xe(b))}e.open(f,a,!0);a={"X-Requested-With":"XMLHttpRequest",Accept:"application/json;text/plain"};Pc(a,this.options.headers);for(var m in a)e.setRequestHeader(m,a[m]);e.send(g)};Be.isAvailable=function(){return!!window.XMLHttpRequest&&"string"===typeof(new XMLHttpRequest).responseType&&(!(navigator.userAgent.match(/MSIE/)||navigator.userAgent.match(/Trident/))||Ae())};Be.prototype.Ab=function(){return"json"};function Ce(a){a=a||{};this.Yb=Db()+Db()+Db();this.Rd=a||{}}
	Ce.prototype.open=function(a,b,c){function d(){c&&(c(W("USER_CANCELLED")),c=null)}var e=this,f=hc(ne),g;b.requestId=this.Yb;b.redirectTo=f.scheme+"://"+f.host+"/blank/page.html";a+=/\?/.test(a)?"":"?";a+=xe(b);(g=window.open(a,"_blank","location=no"))&&ia(g.addEventListener)?(g.addEventListener("loadstart",function(a){var b;if(b=a&&a.url)a:{var f=a.url;try{var q=document.createElement("a");q.href=f;b=q.host===hc(ne).host&&"/blank/page.html"===q.pathname;break a}catch(s){}b=!1}b&&(a=we(a.url),g.removeEventListener("exit",
	d),g.close(),a=new oe(null,null,{requestId:e.Yb,requestKey:a}),e.Rd.requestWithCredential("/auth/session",a,c),c=null)}),g.addEventListener("exit",d)):c(W("TRANSPORT_UNAVAILABLE"))};na("fb.login.transports.CordovaInAppBrowser.prototype.open",Ce.prototype.open);Ce.isAvailable=function(){return ze()};Ce.prototype.Ab=function(){return"redirect"};function De(a){a=a||{};if(!a.window_features||-1!==navigator.userAgent.indexOf("Fennec/")||-1!==navigator.userAgent.indexOf("Firefox/")&&-1!==navigator.userAgent.indexOf("Android"))a.window_features=void 0;a.window_name||(a.window_name="_blank");a.relay_url||(a.relay_url=ye()+"/auth/channel");this.options=a}
	De.prototype.open=function(a,b,c){function d(a){g&&(document.body.removeChild(g),g=void 0);q&&(q=clearInterval(q));ue(window,"message",e);ue(window,"unload",d);if(n&&!a)try{n.close()}catch(b){h.postMessage("die",m)}n=h=void 0}function e(a){if(a.origin===m)try{var b=va(a.data);"ready"===b.a?h.postMessage(s,m):"error"===b.a?(d(!1),c&&(c(b.d),c=null)):"response"===b.a&&(d(b.bf),c&&(c(null,b.d),c=null))}catch(e){}}var f=Ae(),g,h,m=ve(a);if(m!==ve(this.options.relay_url))c&&setTimeout(function(){c(Error("invalid arguments: origin of url and relay_url must match"))},
	0);else{f&&(g=document.createElement("iframe"),g.setAttribute("src",this.options.relay_url),g.style.display="none",g.setAttribute("name","__winchan_relay_frame"),document.body.appendChild(g),h=g.contentWindow);a+=(/\?/.test(a)?"":"?")+xe(b);var n=window.open(a,this.options.window_name,this.options.window_features);h||(h=n);var q=setInterval(function(){n&&n.closed&&(d(!1),c&&(c(W("USER_CANCELLED")),c=null))},500),s=u({a:"request",d:b});te(window,"unload",d);te(window,"message",e)}};
	na("fb.login.transports.Popup.prototype.open",De.prototype.open);De.isAvailable=function(){return"postMessage"in window&&!/^file:\//.test(location.href)&&!(ze()||navigator.userAgent.match(/Windows Phone/)||window.Windows&&/^ms-appx:/.test(location.href)||navigator.userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i)||navigator.userAgent.match(/CriOS/)||navigator.userAgent.match(/Twitter for iPhone/)||navigator.userAgent.match(/FBAN\/FBIOS/)||window.navigator.standalone)&&!navigator.userAgent.match(/PhantomJS/)};
	De.prototype.Ab=function(){return"popup"};function Ee(a){a=a||{};a.callback_parameter||(a.callback_parameter="callback");this.options=a;window.__firebase_auth_jsonp=window.__firebase_auth_jsonp||{}}
	Ee.prototype.open=function(a,b,c){function d(){c&&(c(W("REQUEST_INTERRUPTED")),c=null)}function e(){setTimeout(function(){delete window.__firebase_auth_jsonp[f];Lc(window.__firebase_auth_jsonp)&&delete window.__firebase_auth_jsonp;try{var a=document.getElementById(f);a&&a.parentNode.removeChild(a)}catch(b){}},1);ue(window,"beforeunload",d)}var f="fn"+(new Date).getTime()+Math.floor(99999*Math.random());b[this.options.callback_parameter]="__firebase_auth_jsonp."+f;a+=(/\?/.test(a)?"":"?")+xe(b);te(window,
	"beforeunload",d);window.__firebase_auth_jsonp[f]=function(a){c&&(c(null,a),c=null);e()};Fe(f,a,c)};function Fe(a,b,c){setTimeout(function(){try{var d=document.createElement("script");d.type="text/javascript";d.id=a;d.async=!0;d.src=b;d.onerror=function(){var b=document.getElementById(a);null!==b&&b.parentNode.removeChild(b);c&&c(W("NETWORK_ERROR"))};var e=document.getElementsByTagName("head");(e&&0!=e.length?e[0]:document.documentElement).appendChild(d)}catch(f){c&&c(W("NETWORK_ERROR"))}},0)}
	Ee.isAvailable=function(){return!ze()};Ee.prototype.Ab=function(){return"json"};function Ge(a,b){this.pd=["session",a.yc,a.Ta].join(":");this.Ic=b}Ge.prototype.set=function(a,b){if(!b)if(this.Ic.length)b=this.Ic[0];else throw Error("fb.login.SessionManager : No storage options available!");b.set(this.pd,a)};Ge.prototype.get=function(){var a=Hb(this.Ic,r(this.we,this)),a=Gb(a,function(a){return null!==a});Lb(a,function(a,c){return Id(c.token)-Id(a.token)});return 0<a.length?a.shift():null};Ge.prototype.we=function(a){try{var b=a.get(this.pd);if(b&&b.token)return b}catch(c){}return null};
	Ge.prototype.clear=function(){var a=this;Fb(this.Ic,function(b){b.remove(a.pd)})};function He(a){a=a||{};this.Yb=Db()+Db()+Db();this.Rd=a||{}}He.prototype.open=function(a,b){J.set("redirect_request_id",this.Yb);b.requestId=this.Yb;b.redirectTo=b.redirectTo||window.location.href;a+=(/\?/.test(a)?"":"?")+xe(b);window.location=a};na("fb.login.transports.Redirect.prototype.open",He.prototype.open);He.isAvailable=function(){return!/^file:\//.test(location.href)&&!ze()};He.prototype.Ab=function(){return"redirect"};function Ie(a,b,c,d){Gc.call(this,["auth_status"]);this.D=a;this.Cd=b;this.Xe=c;this.jd=d;this.vb=new Ge(a,[xb,J]);this.Ma=null;Je(this)}oa(Ie,Gc);k=Ie.prototype;k.bd=function(){return this.Ma||null};function Je(a){J.get("redirect_request_id")&&Ke(a);var b=a.vb.get();b&&b.token?(Le(a,b),a.Cd(b.token,function(c,d){Me(a,c,d,!1,b.token,b)},function(b,d){Ne(a,"resumeSession()",b,d)})):Le(a,null)}
	function Oe(a,b,c,d,e,f){"firebaseio-demo.com"===a.D.domain&&O("FirebaseRef.auth() not supported on demo Firebases (*.firebaseio-demo.com). Please use on production Firebases only (*.firebaseio.com).");a.Cd(b,function(f,h){Me(a,f,h,!0,b,c,d||{},e)},function(b,c){Ne(a,"auth()",b,c,f)})}function Pe(a,b){a.vb.clear();Le(a,null);a.Xe(function(a,d){if("ok"===a)P(b);else{var e=(a||"error").toUpperCase(),f=e;d&&(f+=": "+d);f=Error(f);f.code=e;P(b,f)}})}
	function Me(a,b,c,d,e,f,g,h){"ok"===b?(d&&(b=c.auth,f.auth=b,f.expires=c.expires,f.token=Jd(e)?e:"",c=null,b&&A(b,"uid")?c=B(b,"uid"):A(f,"uid")&&(c=B(f,"uid")),f.uid=c,c="custom",b&&A(b,"provider")?c=B(b,"provider"):A(f,"provider")&&(c=B(f,"provider")),f.provider=c,a.vb.clear(),Jd(e)&&(g=g||{},c=xb,"sessionOnly"===g.remember&&(c=J),"none"!==g.remember&&a.vb.set(f,c)),Le(a,f)),P(h,null,f)):(a.vb.clear(),Le(a,null),f=a=(b||"error").toUpperCase(),c&&(f+=": "+c),f=Error(f),f.code=a,P(h,f))}
	function Ne(a,b,c,d,e){O(b+" was canceled: "+d);a.vb.clear();Le(a,null);a=Error(d);a.code=c.toUpperCase();P(e,a)}function Qe(a,b,c,d){Re(a);var e=[Be,Ee];c=qe(c);Se(a,e,"/auth/"+b,c,d)}
	function Te(a,b,c,d){Re(a);var e=[De,Ce];c=qe(c);"anonymous"===b||"password"===b?setTimeout(function(){P(d,W("TRANSPORT_UNAVAILABLE"))},0):(c.Lc.window_features="menubar=yes,modal=yes,alwaysRaised=yeslocation=yes,resizable=yes,scrollbars=yes,status=yes,height=625,width=625,top="+("object"===typeof screen?.5*(screen.height-625):0)+",left="+("object"===typeof screen?.5*(screen.width-625):0),c.Lc.relay_url=ye()+"/"+a.D.Ta+"/auth/channel",c.Lc.requestWithCredential=r(a.Zb,a),Se(a,e,"/auth/"+b,c,d))}
	function Ke(a){var b=J.get("redirect_request_id");if(b){var c=J.get("redirect_client_options");J.remove("redirect_request_id");J.remove("redirect_client_options");var d=[Be,Ee],b={requestId:b,requestKey:we(document.location.hash)},c=new oe(c,{},b);try{document.location.hash=document.location.hash.replace(/&__firebase_request_key=([a-zA-z0-9]*)/,"")}catch(e){}Se(a,d,"/auth/session",c)}}k.Xc=function(a,b){Re(this);var c=qe(a);c.ub._method="POST";this.Zb("/users",c,function(a){P(b,a)})};
	k.sd=function(a,b){var c=this;Re(this);var d="/users/"+encodeURIComponent(a.email),e=qe(a);e.ub._method="DELETE";this.Zb(d,e,function(a,d){!a&&d&&d.uid&&c.Ma&&c.Ma.uid&&c.Ma.uid===d.uid&&Pe(c);P(b,a)})};k.Tc=function(a,b){Re(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=qe(a);d.ub._method="PUT";d.ub.password=a.newPassword;this.Zb(c,d,function(a){P(b,a)})};
	k.td=function(a,b){Re(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=qe(a);d.ub._method="POST";this.Zb(c,d,function(a){P(b,a)})};k.Zb=function(a,b,c){Ue(this,[Be,Ee],a,b,c)};function Se(a,b,c,d,e){Ue(a,b,c,d,function(b,c){!b&&c&&c.token&&c.uid?Oe(a,c.token,c,d.hc,function(a,b){a?P(e,a):P(e,null,b)}):P(e,b||W("UNKNOWN_ERROR"))})}
	function Ue(a,b,c,d,e){b=Gb(b,function(a){return"function"===typeof a.isAvailable&&a.isAvailable()});0===b.length?setTimeout(function(){P(e,W("TRANSPORT_UNAVAILABLE"))},0):(b=new (b.shift())(d.Lc),d=Ba(d.ub),d.v="js-1.1.2",d.transport=b.Ab(),d.suppress_status_codes=!0,a=ye()+"/"+a.D.Ta+c,b.open(a,d,function(a,b){if(a)P(e,a);else if(b&&b.error){var c=Error(b.error.message);c.code=b.error.code;c.details=b.error.details;P(e,c)}else P(e,null,b)}))}
	function Le(a,b){var c=null!==a.Ma||null!==b;a.Ma=b;c&&a.Mc("auth_status",b);a.jd(null!==b)}k.cd=function(a){v("auth_status"===a,'initial event must be of type "auth_status"');return[this.Ma]};function Re(a){var b=a.D;if("firebaseio.com"!==b.domain&&"firebaseio-demo.com"!==b.domain&&"auth.firebase.com"===ne)throw Error("This custom Firebase server ('"+a.D.domain+"') does not support delegated login.");};function Ve(){this.hb=[]}function We(a,b){if(0!==b.length)for(var c=0;c<b.length;c++)a.hb.push(b[c])}Ve.prototype.Vb=function(){for(var a=0;a<this.hb.length;a++)if(this.hb[a]){var b=this.hb[a];this.hb[a]=null;Xe(b)}this.hb=[]};function Xe(a){var b=a.ca,c=a.$d,d=a.Ub;uc(function(){b(c,d)})};function X(a,b,c,d){this.type=a;this.xa=b;this.da=c;this.Ub=d};function Ye(a){this.S=a;this.sa=[];this.Zc=new Ve}function Ze(a,b,c,d,e){a.sa.push({type:b,ca:c,cancel:d,$:e});d=[];var f=$e(a.j);a.Gb&&f.push(new X("value",a.j));for(var g=0;g<f.length;g++)if(f[g].type===b){var h=new G(a.S.i,a.S.path);f[g].da&&(h=h.J(f[g].da));d.push({ca:qc(c,e),$d:new T(f[g].xa,h),Ub:f[g].Ub})}We(a.Zc,d)}Ye.prototype.Ac=function(a,b){b=this.Bc(a,b);null!=b&&af(this,b)};
	function af(a,b){for(var c=[],d=0;d<b.length;d++){var e=b[d],f=e.type,g=new G(a.S.i,a.S.path);b[d].da&&(g=g.J(b[d].da));g=new T(b[d].xa,g);"value"!==e.type||g.Fb()?"value"!==e.type&&(f+=" "+g.name()):f+="("+g.X()+")";M(a.S.i.n.id+": event:"+a.S.path+":"+a.S.Wa()+":"+f);for(f=0;f<a.sa.length;f++){var h=a.sa[f];b[d].type===h.type&&c.push({ca:qc(h.ca,h.$),$d:g,Ub:e.Ub})}}We(a.Zc,c)}Ye.prototype.Vb=function(){this.Zc.Vb()};
	function $e(a){var b=[];if(!a.Q()){var c=null;a.B(function(a,e){b.push(new X("child_added",e,a,c));c=a})}return b}function bf(a){a.Gb||(a.Gb=!0,af(a,[new X("value",a.j)]))};function cf(a,b){Ye.call(this,a);this.j=b}oa(cf,Ye);cf.prototype.Bc=function(a,b){this.j=a;this.Gb&&null!=b&&b.push(new X("value",this.j));return b};cf.prototype.Eb=function(){return{}};function df(a,b){this.jc=a;this.kd=b}function ef(a,b,c,d,e){var f=a.N(c),g=b.N(c);d=new df(d,e);e=ff(d,c,f,g);g=!f.f()&&!g.f()&&f.m()!==g.m();if(e||g)for(f=c,c=e;null!==f.parent();){var h=a.N(f);e=b.N(f);var m=f.parent();if(!d.jc||I(d.jc,m).k()){var n=b.N(m),q=[],f=Va(f);h.f()?(h=n.ha(f,e),q.push(new X("child_added",e,f,h))):e.f()?q.push(new X("child_removed",h,f)):(h=n.ha(f,e),g&&q.push(new X("child_moved",e,f,h)),c&&q.push(new X("child_changed",e,f,h)));d.kd(m,n,q)}g&&(g=!1,c=!0);f=m}}
	function ff(a,b,c,d){var e,f=[];c===d?e=!1:c.Q()&&d.Q()?e=c.k()!==d.k():c.Q()?(gf(a,b,Q,d,f),e=!0):d.Q()?(gf(a,b,c,Q,f),e=!0):e=gf(a,b,c,d,f);e?a.kd(b,d,f):c.m()!==d.m()&&a.kd(b,d,null);return e}
	function gf(a,b,c,d,e){var f=!1,g=!a.jc||!I(a.jc,b).f(),h=[],m=[],n=[],q=[],s={},t={},w,aa,K,N;w=c.jb();K=ib(w);aa=d.jb();for(N=ib(aa);null!==K||null!==N;){c=N;c=null===K?1:null===c?-1:K.key===c.key?0:xc({name:K.key,la:K.value.m()},{name:c.key,la:c.value.m()});if(0>c)f=B(s,K.key),l(f)?(n.push({ad:K,zd:h[f]}),h[f]=null):(t[K.key]=m.length,m.push(K)),f=!0,K=ib(w);else{if(0<c)f=B(t,N.key),l(f)?(n.push({ad:m[f],zd:N}),m[f]=null):(s[N.key]=h.length,h.push(N)),f=!0;else{c=b.J(N.key);if(c=ff(a,c,K.value,
	N.value))q.push(N),f=!0;K.value.m()!==N.value.m()&&(n.push({ad:K,zd:N}),f=!0);K=ib(w)}N=ib(aa)}if(!g&&f)return!0}for(g=0;g<m.length;g++)if(s=m[g])c=b.J(s.key),ff(a,c,s.value,Q),e.push(new X("child_removed",s.value,s.key));for(g=0;g<h.length;g++)if(s=h[g])c=b.J(s.key),m=d.ha(s.key,s.value),ff(a,c,Q,s.value),e.push(new X("child_added",s.value,s.key,m));for(g=0;g<n.length;g++)s=n[g].ad,h=n[g].zd,c=b.J(h.key),m=d.ha(h.key,h.value),e.push(new X("child_moved",h.value,h.key,m)),(c=ff(a,c,s.value,h.value))&&
	q.push(h);for(g=0;g<q.length;g++)a=q[g],m=d.ha(a.key,a.value),e.push(new X("child_changed",a.value,a.key,m));return f};function hf(){this.Z=this.Aa=null;this.set={}}oa(hf,fd);k=hf.prototype;k.setActive=function(a){this.Aa=a};function jf(a,b,c){a.add(b,c);a.Z||(a.Z=c.S.path)}function kf(a){var b=a.Aa;a.Aa=null;return b}function lf(a){return a.contains("default")}function mf(a){return null!=a.Aa&&lf(a)}k.defaultView=function(){return lf(this)?this.get("default"):null};k.path=function(){return this.Z};k.toString=function(){return Hb(this.keys(),function(a){return"default"===a?"{}":a}).join("$")};
	k.qb=function(){var a=[];gd(this,function(b,c){a.push(c.S)});return a};function nf(a,b){Ye.call(this,a);this.j=Q;this.Bc(b,$e(b))}oa(nf,Ye);
	nf.prototype.Bc=function(a,b){if(null===b)return b;var c=[],d=this.S;l(d.fa)&&(l(d.za)&&null!=d.za?c.push(function(a,b){var c=jc(b,d.fa);return 0<c||0===c&&0<=kc(a,d.za)}):c.push(function(a,b){return 0<=jc(b,d.fa)}));l(d.Ea)&&(l(d.fb)?c.push(function(a,b){var c=jc(b,d.Ea);return 0>c||0===c&&0>=kc(a,d.fb)}):c.push(function(a,b){return 0>=jc(b,d.Ea)}));var e=null,f=null;if(l(this.S.Ga))if(l(this.S.fa)){if(e=of(a,c,this.S.Ga,!1)){var g=a.P(e).m();c.push(function(a,b){var c=jc(b,g);return 0>c||0===c&&
	0>=kc(a,e)})}}else if(f=of(a,c,this.S.Ga,!0)){var h=a.P(f).m();c.push(function(a,b){var c=jc(b,h);return 0<c||0===c&&0<=kc(a,f)})}for(var m=[],n=[],q=[],s=[],t=0;t<b.length;t++){var w=b[t].da,aa=b[t].xa;switch(b[t].type){case "child_added":pf(c,w,aa)&&(this.j=this.j.K(w,aa),n.push(b[t]));break;case "child_removed":this.j.P(w).f()||(this.j=this.j.K(w,null),m.push(b[t]));break;case "child_changed":!this.j.P(w).f()&&pf(c,w,aa)&&(this.j=this.j.K(w,aa),s.push(b[t]));break;case "child_moved":var K=!this.j.P(w).f(),
	N=pf(c,w,aa);K?N?(this.j=this.j.K(w,aa),q.push(b[t])):(m.push(new X("child_removed",this.j.P(w),w)),this.j=this.j.K(w,null)):N&&(this.j=this.j.K(w,aa),n.push(b[t]))}}var Bd=e||f;if(Bd){var Cd=(t=null!==f)?this.j.Jd():this.j.Kd(),Oc=!1,ub=!1,vb=this;(t?a.$c:a.B).call(a,function(a,b){ub||null!==Cd||(ub=!0);if(ub&&Oc)return!0;Oc?(m.push(new X("child_removed",vb.j.P(a),a)),vb.j=vb.j.K(a,null)):ub&&(n.push(new X("child_added",b,a)),vb.j=vb.j.K(a,b));Cd===a&&(ub=!0);a===Bd&&(Oc=!0)})}for(t=0;t<n.length;t++)c=
	n[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_added",c.xa,c.da,w));for(t=0;t<q.length;t++)c=q[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_moved",c.xa,c.da,w));for(t=0;t<s.length;t++)c=s[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_changed",c.xa,c.da,w));this.Gb&&0<m.length&&m.push(new X("value",this.j));return m};function of(a,b,c,d){if(a.Q())return null;var e=null;(d?a.$c:a.B).call(a,function(a,d){if(pf(b,a,d)&&(e=a,c--,0===c))return!0});return e}
	function pf(a,b,c){for(var d=0;d<a.length;d++)if(!a[d](b,c.m()))return!1;return!0}nf.prototype.ed=function(a){return this.j.P(a)!==Q};
	nf.prototype.Eb=function(a,b,c){var d={};this.j.Q()||this.j.B(function(a){d[a]=3});var e=this.j;c=U(c,new H(""));var f=new Ya;Za(I(f,this.S.path),!0);b=Q.Ba(a,b);var g=this;ef(c,b,a,f,function(a,b,c){null!==c&&a.toString()===g.S.path.toString()&&g.Bc(b,c)});this.j.Q()?pc(d,function(a,b){d[b]=2}):(this.j.B(function(a){A(d,a)||(d[a]=1)}),pc(d,function(a,b){g.j.P(b).f()&&(d[b]=2)}));this.j=e;return d};function qf(a,b){this.n=a;this.g=b;this.rc=b.ba;this.pa=new Ya}qf.prototype.ec=function(a,b,c,d,e){var f=a.path,g=I(this.pa,f),h=g.k();null===h?(h=new hf,Za(g,h)):v(!h.f(),"We shouldn't be storing empty QueryMaps");var m=a.Wa();if(h.contains(m))a=h.get(m),Ze(a,b,c,d,e);else{var n=this.g.ba.N(f);a=rf(a,n);sf(this,g,h,m,a);Ze(a,b,c,d,e);(b=(b=bb(I(this.pa,f),function(a){var b;if(b=a.k()&&a.k().defaultView())b=a.k().defaultView().Gb;if(b)return!0},!0))||null===this.n&&!U(this.g,f).f())&&bf(a)}a.Vb()};
	function tf(a,b,c,d,e){var f=a.get(b),g;if(g=f){g=!1;for(var h=f.sa.length-1;0<=h;h--){var m=f.sa[h];if(!(c&&m.type!==c||d&&m.ca!==d||e&&m.$!==e)&&(f.sa.splice(h,1),g=!0,c&&d))break}}(c=g&&!(0<f.sa.length))&&a.remove(b);return c}function uf(a,b,c,d,e){b=b?b.Wa():null;var f=[];b&&"default"!==b?tf(a,b,c,d,e)&&f.push(b):Fb(a.keys(),function(b){tf(a,b,c,d,e)&&f.push(b)});return f}qf.prototype.Dc=function(a,b,c,d){var e=I(this.pa,a.path).k();return null===e?null:vf(this,e,a,b,c,d)};
	function vf(a,b,c,d,e,f){var g=b.path(),g=I(a.pa,g);c=uf(b,c,d,e,f);b.f()&&Za(g,null);d=wf(g);if(0<c.length&&!d){d=g;e=g.parent();for(c=!1;!c&&e;){if(f=e.k()){v(!mf(f));var h=d.name(),m=!1;gd(f,function(a,b){m=b.ed(h)||m});m&&(c=!0)}d=e;e=e.parent()}d=null;mf(b)||(b=kf(b),d=xf(a,g),b&&b());return c?null:d}return null}function yf(a,b,c){ab(I(a.pa,b),function(a){(a=a.k())&&gd(a,function(a,b){bf(b)})},c,!0)}
	function zf(a,b,c){function d(a){do{if(g[a.toString()])return!0;a=a.parent()}while(null!==a);return!1}var e=a.rc,f=a.g.ba;a.rc=f;for(var g={},h=0;h<c.length;h++)g[c[h].toString()]=!0;ef(e,f,b,a.pa,function(c,e,f){if(b.contains(c)){var g=d(c);g&&yf(a,c,!1);a.Ac(c,e,f);g&&yf(a,c,!0)}else a.Ac(c,e,f)});d(b)&&yf(a,b,!0);Af(a,b)}function Af(a,b){var c=I(a.pa,b);ab(c,function(a){(a=a.k())&&gd(a,function(a,b){b.Vb()})},!0,!0);bb(c,function(a){(a=a.k())&&gd(a,function(a,b){b.Vb()})},!1)}
	qf.prototype.Ac=function(a,b,c){a=I(this.pa,a).k();null!==a&&gd(a,function(a,e){e.Ac(b,c)})};function wf(a){return bb(a,function(a){return a.k()&&mf(a.k())})}function sf(a,b,c,d,e){if(mf(c)||wf(b))jf(c,d,e);else{var f,g;c.f()||(f=c.toString(),g=c.qb());jf(c,d,e);c.setActive(Bf(a,c));f&&g&&Sd(a.n,c.path(),f,g)}mf(c)&&ab(b,function(a){if(a=a.k())a.Aa&&a.Aa(),a.Aa=null})}
	function xf(a,b){function c(b){var f=b.k();if(f&&lf(f))d.push(f.path()),null==f.Aa&&f.setActive(Bf(a,f));else{if(f){null!=f.Aa||f.setActive(Bf(a,f));var g={};gd(f,function(a,b){b.j.B(function(a){A(g,a)||(g[a]=!0,a=f.path().J(a),d.push(a))})})}b.B(c)}}var d=[];c(b);return d}
	function Bf(a,b){if(a.n){var c=a.n,d=b.path(),e=b.toString(),f=b.qb(),g,h=b.keys(),m=lf(b);Od(a.n,b,function(c){"ok"!==c?(c=sc(c),O("on() or once() for "+b.path().toString()+" failed: "+c.toString()),Cf(a,b,c)):g||(m?yf(a,b.path(),!0):Fb(h,function(a){(a=b.get(a))&&bf(a)}),Af(a,b.path()))});return function(){g=!0;Sd(c,d,e,f)}}return ca}function Cf(a,b,c){b&&(gd(b,function(a,b){for(var f=0;f<b.sa.length;f++){var g=b.sa[f];g.cancel&&qc(g.cancel,g.$)(c)}}),vf(a,b))}
	function rf(a,b){return"default"===a.Wa()?new cf(a,b):new nf(a,b)}qf.prototype.Eb=function(a,b,c,d){function e(a){pc(a,function(a,b){f[b]=3===a?3:(B(f,b)||a)===a?a:3})}var f={};gd(b,function(b,f){e(f.Eb(a,c,d))});c.Q()||c.B(function(a){A(f,a)||(f[a]=4)});return f};function Df(a,b,c,d,e){var f=b.path();b=a.Eb(f,b,d,e);var g=Q,h=[];pc(b,function(b,n){var q=new H(n);3===b||1===b?g=g.K(n,d.N(q)):(2===b&&h.push({path:f.J(n),ua:Q}),h=h.concat(Ef(a,d.N(q),I(c,q),e)))});return[{path:f,ua:g}].concat(h)}
	function Ff(a,b,c,d){var e;a:{var f=I(a.pa,b);e=f.parent();for(var g=[];null!==e;){var h=e.k();if(null!==h){if(lf(h)){e=[{path:b,ua:c}];break a}h=a.Eb(b,h,c,d);f=B(h,f.name());if(3===f||1===f){e=[{path:b,ua:c}];break a}2===f&&g.push({path:b,ua:Q})}f=e;e=e.parent()}e=g}if(1==e.length&&(!e[0].ua.f()||c.f()))return e;g=I(a.pa,b);f=g.k();null!==f?lf(f)?e.push({path:b,ua:c}):e=e.concat(Df(a,f,g,c,d)):e=e.concat(Ef(a,c,g,d));return e}
	function Ef(a,b,c,d){var e=c.k();if(null!==e)return lf(e)?[{path:c.path(),ua:b}]:Df(a,e,c,b,d);var f=[];c.B(function(c){var e=b.Q()?Q:b.P(c.name());c=Ef(a,e,c,d);f=f.concat(c)});return f};function Gf(a){this.D=a;this.ga=Wc(a);this.n=new Kd(this.D,r(this.uc,this),r(this.sc,this),r(this.nd,this),r(this.dd,this));this.be=Xc(a,r(function(){return new Tc(this.ga,this.n)},this));this.$a=new Ya;this.Ka=new ee;this.g=new fe;this.L=new qf(this.n,this.g.qa);this.fd=new ee;this.gd=new qf(null,this.fd);Hf(this,"connected",!1);this.U=new be;this.I=new Ie(a,r(this.n.I,this.n),r(this.n.Bd,this.n),r(this.jd,this));this.ic=0}k=Gf.prototype;
	k.toString=function(){return(this.D.Ya?"https://":"http://")+this.D.host};k.name=function(){return this.D.Ta};function If(a){a=U(a.fd,new H(".info/serverTimeOffset")).X()||0;return(new Date).getTime()+a}function Jf(a){a=a={timestamp:If(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
	k.uc=function(a,b,c){this.ic++;this.Md&&(b=this.Md(a,b));var d,e,f=[];9<=a.length&&a.lastIndexOf(".priority")===a.length-9?(d=new H(a.substring(0,a.length-9)),e=U(this.g.wa,d).La(b),f.push(d)):c?(d=new H(a),e=U(this.g.wa,d),pc(b,function(a,b){var c=new H(b);".priority"===b?e=e.La(a):(e=e.Ba(c,S(a)),f.push(d.J(b)))})):(d=new H(a),e=S(b),f.push(d));a=Ff(this.L,d,e,this.g.O);b=!1;for(c=0;c<a.length;++c){var g=a[c];b=ge(this.g,g.path,g.ua)||b}b&&(d=Kf(this,d));zf(this.L,d,f)};
	k.sc=function(a){Hf(this,"connected",a);!1===a&&Lf(this)};k.nd=function(a){var b=this;oc(a,function(a,d){Hf(b,d,a)})};k.dd=function(a){a=new H(a);return U(this.g.wa,a).hash()};k.jd=function(a){Hf(this,"authenticated",a)};function Hf(a,b,c){b=new H("/.info/"+b);V(a.fd,b,S(c));zf(a.gd,b,[b])}
	k.wb=function(a,b,c,d){this.e("set",{path:a.toString(),value:b,la:c});var e=Jf(this);b=S(b,c);var e=me(b,e),e=Ff(this.L,a,e,this.g.O),f=this.g.set(a,e),g=this;this.n.put(a.toString(),b.X(!0),function(b,c){"ok"!==b&&O("set at "+a+" failed: "+b);je(g.g,f);he(g.g,a);var e=Kf(g,a);zf(g.L,e,[]);Mf(d,b,c)});e=Nf(this,a);Kf(this,e);zf(this.L,e,[a])};
	k.update=function(a,b,c){this.e("update",{path:a.toString(),value:b});var d=U(this.g.qa,a),e=!0,f=[],g=Jf(this),h=[],m;for(m in b){var e=!1,n=S(b[m]),n=me(n,g),d=d.K(m,n),q=a.J(m);f.push(q);n=Ff(this.L,q,n,this.g.O);h=h.concat(this.g.set(a,n))}if(e)M("update() called with empty data.  Don't do anything."),Mf(c,"ok");else{var s=this;Yd(this.n,a.toString(),b,function(b,d){"ok"!==b&&O("update at "+a+" failed: "+b);je(s.g,h);he(s.g,a);var e=Kf(s,a);zf(s.L,e,[]);Mf(c,b,d)});b=Nf(this,a);Kf(this,b);zf(s.L,
	b,f)}};k.vd=function(a,b,c){this.e("setPriority",{path:a.toString(),la:b});var d=Jf(this),d=ke(b,d),d=U(this.g.O,a).La(d),d=Ff(this.L,a,d,this.g.O),e=this.g.set(a,d),f=this;this.n.put(a.toString()+"/.priority",b,function(b,d){"permission_denied"===b&&O("setPriority at "+a+" failed: "+b);je(f.g,e);he(f.g,a);var m=Kf(f,a);zf(f.L,m,[]);Mf(c,b,d)});b=Kf(this,a);zf(f.L,b,[])};
	function Lf(a){a.e("onDisconnectEvents");var b=[],c=Jf(a);de(le(a.U,c),new H(""),function(c,e){var f=Ff(a.L,c,e,a.g.O);b.push.apply(b,a.g.set(c,f));f=Nf(a,c);Kf(a,f);zf(a.L,f,[c])});je(a.g,b);a.U=new be}k.ld=function(a,b){var c=this;this.n.ld(a.toString(),function(d,e){"ok"===d&&ce(c.U,a);Mf(b,d,e)})};function Of(a,b,c,d){var e=S(c);Ud(a.n,b.toString(),e.X(!0),function(c,g){"ok"===c&&a.U.rb(b,e);Mf(d,c,g)})}
	function Pf(a,b,c,d,e){var f=S(c,d);Ud(a.n,b.toString(),f.X(!0),function(c,d){"ok"===c&&a.U.rb(b,f);Mf(e,c,d)})}function Qf(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(M("onDisconnect().update() called with empty data.  Don't do anything."),Mf(d,"ok")):Wd(a.n,b.toString(),c,function(e,f){if("ok"===e)for(var m in c){var n=S(c[m]);a.U.rb(b.J(m),n)}Mf(d,e,f)})}function Rf(a){Rc(a.ga,"deprecated_on_disconnect");a.be.yd.deprecated_on_disconnect=!0}
	k.ec=function(a,b,c,d,e){".info"===D(a.path)?this.gd.ec(a,b,c,d,e):this.L.ec(a,b,c,d,e)};k.Dc=function(a,b,c,d){if(".info"===D(a.path))this.gd.Dc(a,b,c,d);else{b=this.L.Dc(a,b,c,d);if(c=null!==b){c=this.g;d=a.path;for(var e=[],f=0;f<b.length;++f)e[f]=U(c.wa,b[f]);V(c.wa,d,Q);for(f=0;f<b.length;++f)V(c.wa,b[f],e[f]);c=he(c,d)}c&&(v(this.g.qa.ba===this.L.rc,"We should have raised any outstanding events by now.  Else, we'll blow them away."),V(this.g.qa,a.path,U(this.g.O,a.path)),this.L.rc=this.g.qa.ba)}};
	k.Qa=function(){this.n.Qa()};k.tb=function(){this.n.tb()};k.wd=function(a){if("undefined"!==typeof console){a?(this.Hc||(this.Hc=new Sc(this.ga)),a=this.Hc.get()):a=this.ga.get();var b=Ib(Kc(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};k.xd=function(a){Rc(this.ga,a);this.be.yd[a]=!0};k.e=function(){M("r:"+this.n.id+":",arguments)};
	function Mf(a,b,c){a&&uc(function(){if("ok"==b)a(null,c);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function Sf(a,b,c,d,e){function f(){}a.e("transaction on "+b);var g=new G(a,b);g.Ua("value",f);c={path:b,update:c,G:d,status:null,Sd:Yb(),Rc:e,Xd:0,Oc:function(){g.nb("value",f)},Pc:null};a.Ka.ba=Tf(a,a.Ka.ba,a.g.O.ba,a.$a);d=c.update(U(a.Ka,b).X());if(l(d)){Ga("transaction failed: Data returned ",d);c.status=1;e=I(a.$a,b);var h=e.k()||[];h.push(c);Za(e,h);h="object"===typeof d&&null!==d&&A(d,".priority")?d[".priority"]:U(a.g.O,b).m();e=Jf(a);d=S(d,h);d=me(d,e);V(a.Ka,b,d);c.Rc&&(V(a.g.qa,b,d),zf(a.L,
	b,[b]));Uf(a)}else c.Oc(),c.G&&(a=Vf(a,b),c.G(null,!1,a))}function Uf(a,b){var c=b||a.$a;b||Wf(a,c);if(null!==c.k()){var d=Xf(a,c);v(0<d.length);Jb(d,function(a){return 1===a.status})&&Yf(a,c.path(),d)}else c.Fb()&&c.B(function(b){Uf(a,b)})}
	function Yf(a,b,c){for(var d=0;d<c.length;d++)v(1===c[d].status,"tryToSendTransactionQueue_: items in queue should all be run."),c[d].status=2,c[d].Xd++;var e=U(a.g.O,b).hash();V(a.g.O,b,U(a.g.qa,b));for(var f=U(a.Ka,b).X(!0),g=Yb(),h=Zf(c),d=0;d<h.length;d++)Za(I(a.g.Sb,h[d]),g);a.n.put(b.toString(),f,function(e){a.e("transaction put response",{path:b.toString(),status:e});for(d=0;d<h.length;d++){var f=I(a.g.Sb,h[d]),q=f.k();v(null!==q,"sendTransactionQueue_: pendingPut should not be null.");q===
	g&&(Za(f,null),V(a.g.O,h[d],U(a.g.wa,h[d])))}if("ok"===e){e=[];for(d=0;d<c.length;d++)c[d].status=3,c[d].G&&(f=Vf(a,c[d].path),e.push(r(c[d].G,null,null,!0,f))),c[d].Oc();Wf(a,I(a.$a,b));Uf(a);for(d=0;d<e.length;d++)uc(e[d])}else{if("datastale"===e)for(d=0;d<c.length;d++)c[d].status=4===c[d].status?5:1;else for(O("transaction at "+b+" failed: "+e),d=0;d<c.length;d++)c[d].status=5,c[d].Pc=e;e=Kf(a,b);zf(a.L,e,[b])}},e)}
	function Zf(a){for(var b={},c=0;c<a.length;c++)a[c].Rc&&(b[a[c].path.toString()]=a[c].path);a=[];for(var d in b)a.push(b[d]);return a}
	function Kf(a,b){var c=$f(a,b),d=c.path(),c=Xf(a,c);V(a.g.qa,d,U(a.g.O,d));V(a.Ka,d,U(a.g.O,d));if(0!==c.length){for(var e=U(a.g.qa,d),f=e,g=[],h=0;h<c.length;h++){var m=Wa(d,c[h].path),n=!1,q;v(null!==m,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===c[h].status)n=!0,q=c[h].Pc;else if(1===c[h].status)if(25<=c[h].Xd)n=!0,q="maxretry";else{var s=e.N(m),t=c[h].update(s.X());if(l(t)){Ga("transaction failed: Data returned ",t);var w=S(t);"object"===typeof t&&null!=t&&A(t,".priority")||
	(w=w.La(s.m()));e=e.Ba(m,w);c[h].Rc&&(f=f.Ba(m,w))}else n=!0,q="nodata"}n&&(c[h].status=3,setTimeout(c[h].Oc,Math.floor(0)),c[h].G&&(n=new G(a,c[h].path),m=new T(e.N(m),n),"nodata"===q?g.push(r(c[h].G,null,null,!1,m)):g.push(r(c[h].G,null,Error(q),!1,m))))}V(a.Ka,d,e);V(a.g.qa,d,f);Wf(a,a.$a);for(h=0;h<g.length;h++)uc(g[h]);Uf(a)}return d}function $f(a,b){for(var c,d=a.$a;null!==(c=D(b))&&null===d.k();)d=I(d,c),b=Ua(b);return d}
	function Xf(a,b){var c=[];ag(a,b,c);c.sort(function(a,b){return a.Sd-b.Sd});return c}function ag(a,b,c){var d=b.k();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.B(function(b){ag(a,b,c)})}function Wf(a,b){var c=b.k();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;Za(b,0<c.length?c:null)}b.B(function(b){Wf(a,b)})}function Nf(a,b){var c=$f(a,b).path(),d=I(a.$a,b);bb(d,function(a){bg(a)});bg(d);ab(d,function(a){bg(a)});return c}
	function bg(a){var b=a.k();if(null!==b){for(var c=[],d=-1,e=0;e<b.length;e++)4!==b[e].status&&(2===b[e].status?(v(d===e-1,"All SENT items should be at beginning of queue."),d=e,b[e].status=4,b[e].Pc="set"):(v(1===b[e].status),b[e].Oc(),b[e].G&&c.push(r(b[e].G,null,Error("set"),!1,null))));-1===d?Za(a,null):b.length=d+1;for(e=0;e<c.length;e++)uc(c[e])}}function Vf(a,b){var c=new G(a,b);return new T(U(a.Ka,b),c)}
	function Tf(a,b,c,d){if(d.f())return c;if(null!=d.k())return b;var e=c;d.B(function(d){var g=d.name(),h=new H(g);d=Tf(a,b.N(h),c.N(h),d);e=e.K(g,d)});return e};function Y(){this.sb={}}da(Y);Y.prototype.Qa=function(){for(var a in this.sb)this.sb[a].Qa()};Y.prototype.interrupt=Y.prototype.Qa;Y.prototype.tb=function(){for(var a in this.sb)this.sb[a].tb()};Y.prototype.resume=Y.prototype.tb;function cg(a){var b=this;this.zb=a;this.Jc="*";Ae()?this.Kb=this.lc=se():(this.Kb=window.opener,this.lc=window);if(!b.Kb)throw"Unable to find relay frame";te(this.lc,"message",r(this.ob,this));te(this.lc,"message",r(this.Pd,this));try{dg(this,{a:"ready"})}catch(c){te(this.Kb,"load",function(){dg(b,{a:"ready"})})}te(window,"unload",r(this.Ie,this))}function dg(a,b){b=u(b);Ae()?a.Kb.doPost(b,a.Jc):a.Kb.postMessage(b,a.Jc)}
	cg.prototype.ob=function(a){var b=this,c;try{c=va(a.data)}catch(d){}c&&"request"===c.a&&(ue(window,"message",this.ob),this.Jc=a.origin,this.zb&&setTimeout(function(){b.zb(b.Jc,c.d,function(a,c){b.oe=!c;b.zb=void 0;dg(b,{a:"response",d:a,forceKeepWindowOpen:c})})},0))};cg.prototype.Ie=function(){try{ue(this.lc,"message",this.Pd)}catch(a){}this.zb&&(dg(this,{a:"error",d:"unknown closed window"}),this.zb=void 0);try{window.close()}catch(b){}};cg.prototype.Pd=function(a){if(this.oe&&"die"===a.data)try{window.close()}catch(b){}};var Z={xe:function(a){var b=R.prototype.hash;R.prototype.hash=a;var c=vc.prototype.hash;vc.prototype.hash=a;return function(){R.prototype.hash=b;vc.prototype.hash=c}}};Z.hijackHash=Z.xe;Z.Wa=function(a){return a.Wa()};Z.queryIdentifier=Z.Wa;Z.Ae=function(a){return a.i.n.ja};Z.listens=Z.Ae;Z.Me=function(a){return a.i.n.ma};Z.refConnection=Z.Me;Z.ee=Kd;Z.DataConnection=Z.ee;Kd.prototype.sendRequest=Kd.prototype.Ja;Kd.prototype.interrupt=Kd.prototype.Qa;Z.fe=td;Z.RealTimeConnection=Z.fe;
	td.prototype.sendRequest=td.prototype.Zd;td.prototype.close=td.prototype.close;Z.de=yb;Z.ConnectionTarget=Z.de;Z.ue=function(){id=$c=!0};Z.forceLongPolling=Z.ue;Z.ve=function(){jd=!0};Z.forceWebSockets=Z.ve;Z.Te=function(a,b){a.i.n.ud=b};Z.setSecurityDebugCallback=Z.Te;Z.wd=function(a,b){a.i.wd(b)};Z.stats=Z.wd;Z.xd=function(a,b){a.i.xd(b)};Z.statsIncrementCounter=Z.xd;Z.ic=function(a){return a.i.ic};Z.dataUpdateCount=Z.ic;Z.ye=function(a,b){a.i.Md=b};Z.interceptServerData=Z.ye;Z.Fe=function(a){new cg(a)};
	Z.onPopupOpen=Z.Fe;Z.Qe=function(a){ne=a};Z.setAuthenticationServer=Z.Qe;function $(a,b,c){this.Wb=a;this.Z=b;this.Ha=c}$.prototype.cancel=function(a){x("Firebase.onDisconnect().cancel",0,1,arguments.length);z("Firebase.onDisconnect().cancel",1,a,!0);this.Wb.ld(this.Z,a)};$.prototype.cancel=$.prototype.cancel;$.prototype.remove=function(a){x("Firebase.onDisconnect().remove",0,1,arguments.length);C("Firebase.onDisconnect().remove",this.Z);z("Firebase.onDisconnect().remove",1,a,!0);Of(this.Wb,this.Z,null,a)};$.prototype.remove=$.prototype.remove;
	$.prototype.set=function(a,b){x("Firebase.onDisconnect().set",1,2,arguments.length);C("Firebase.onDisconnect().set",this.Z);Fa("Firebase.onDisconnect().set",a,!1);z("Firebase.onDisconnect().set",2,b,!0);Of(this.Wb,this.Z,a,b)};$.prototype.set=$.prototype.set;
	$.prototype.wb=function(a,b,c){x("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);C("Firebase.onDisconnect().setWithPriority",this.Z);Fa("Firebase.onDisconnect().setWithPriority",a,!1);Ka("Firebase.onDisconnect().setWithPriority",2,b,!1);z("Firebase.onDisconnect().setWithPriority",3,c,!0);if(".length"===this.Ha||".keys"===this.Ha)throw"Firebase.onDisconnect().setWithPriority failed: "+this.Ha+" is a read-only object.";Pf(this.Wb,this.Z,a,b,c)};$.prototype.setWithPriority=$.prototype.wb;
	$.prototype.update=function(a,b){x("Firebase.onDisconnect().update",1,2,arguments.length);C("Firebase.onDisconnect().update",this.Z);if(fa(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Ja("Firebase.onDisconnect().update",a);z("Firebase.onDisconnect().update",2,b,!0);Qf(this.Wb,
	this.Z,a,b)};$.prototype.update=$.prototype.update;var eg=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);v(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);v(20===c.length,"NextPushId: Length should be 20.");
	return c}}();function G(a,b){var c,d,e;if(a instanceof Gf)c=a,d=b;else{x("new Firebase",1,2,arguments.length);d=hc(arguments[0]);c=d.Ve;"firebase"===d.domain&&gc(d.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");c||gc("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d.Ya||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&O("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
	c=new yb(d.host,d.Ya,c,"ws"===d.scheme||"wss"===d.scheme);d=new H(d.Rb);e=d.toString();var f;!(f=!p(c.host)||0===c.host.length||!Ea(c.Ta))&&(f=0!==e.length)&&(e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),f=!(p(e)&&0!==e.length&&!Da.test(e)));if(f)throw Error(y("new Firebase",1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');if(b)if(b instanceof Y)e=b;else if(p(b))e=Y.ib(),c.yc=b;else throw Error("Expected a valid Firebase.Context for second argument to new Firebase()");
	else e=Y.ib();f=c.toString();var g=B(e.sb,f);g||(g=new Gf(c),e.sb[f]=g);c=g}F.call(this,c,d)}oa(G,F);na("Firebase",G);G.prototype.name=function(){x("Firebase.name",0,0,arguments.length);return this.path.f()?null:Va(this.path)};G.prototype.name=G.prototype.name;
	G.prototype.J=function(a){x("Firebase.child",1,1,arguments.length);if(ha(a))a=String(a);else if(!(a instanceof H))if(null===D(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Na("Firebase.child",b)}else Na("Firebase.child",a);return new G(this.i,this.path.J(a))};G.prototype.child=G.prototype.J;G.prototype.parent=function(){x("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new G(this.i,a)};G.prototype.parent=G.prototype.parent;
	G.prototype.root=function(){x("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.parent();)a=a.parent();return a};G.prototype.root=G.prototype.root;G.prototype.toString=function(){x("Firebase.toString",0,0,arguments.length);var a;if(null===this.parent())a=this.i.toString();else{a=this.parent().toString()+"/";var b=this.name();a+=encodeURIComponent(String(b))}return a};G.prototype.toString=G.prototype.toString;
	G.prototype.set=function(a,b){x("Firebase.set",1,2,arguments.length);C("Firebase.set",this.path);Fa("Firebase.set",a,!1);z("Firebase.set",2,b,!0);this.i.wb(this.path,a,null,b)};G.prototype.set=G.prototype.set;
	G.prototype.update=function(a,b){x("Firebase.update",1,2,arguments.length);C("Firebase.update",this.path);if(fa(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Ja("Firebase.update",a);z("Firebase.update",2,b,!0);if(A(a,".priority"))throw Error("update() does not currently support updating .priority.");
	this.i.update(this.path,a,b)};G.prototype.update=G.prototype.update;G.prototype.wb=function(a,b,c){x("Firebase.setWithPriority",2,3,arguments.length);C("Firebase.setWithPriority",this.path);Fa("Firebase.setWithPriority",a,!1);Ka("Firebase.setWithPriority",2,b,!1);z("Firebase.setWithPriority",3,c,!0);if(".length"===this.name()||".keys"===this.name())throw"Firebase.setWithPriority failed: "+this.name()+" is a read-only object.";this.i.wb(this.path,a,b,c)};G.prototype.setWithPriority=G.prototype.wb;
	G.prototype.remove=function(a){x("Firebase.remove",0,1,arguments.length);C("Firebase.remove",this.path);z("Firebase.remove",1,a,!0);this.set(null,a)};G.prototype.remove=G.prototype.remove;
	G.prototype.transaction=function(a,b,c){x("Firebase.transaction",1,3,arguments.length);C("Firebase.transaction",this.path);z("Firebase.transaction",1,a,!1);z("Firebase.transaction",2,b,!0);if(l(c)&&"boolean"!=typeof c)throw Error(y("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.name()||".keys"===this.name())throw"Firebase.transaction failed: "+this.name()+" is a read-only object.";"undefined"===typeof c&&(c=!0);Sf(this.i,this.path,a,b,c)};G.prototype.transaction=G.prototype.transaction;
	G.prototype.vd=function(a,b){x("Firebase.setPriority",1,2,arguments.length);C("Firebase.setPriority",this.path);Ka("Firebase.setPriority",1,a,!1);z("Firebase.setPriority",2,b,!0);this.i.vd(this.path,a,b)};G.prototype.setPriority=G.prototype.vd;G.prototype.push=function(a,b){x("Firebase.push",0,2,arguments.length);C("Firebase.push",this.path);Fa("Firebase.push",a,!0);z("Firebase.push",2,b,!0);var c=If(this.i),c=eg(c),c=this.J(c);"undefined"!==typeof a&&null!==a&&c.set(a,b);return c};
	G.prototype.push=G.prototype.push;G.prototype.ka=function(){return new $(this.i,this.path,this.name())};G.prototype.onDisconnect=G.prototype.ka;G.prototype.Ne=function(){O("FirebaseRef.removeOnDisconnect() being deprecated. Please use FirebaseRef.onDisconnect().remove() instead.");this.ka().remove();Rf(this.i)};G.prototype.removeOnDisconnect=G.prototype.Ne;
	G.prototype.Se=function(a){O("FirebaseRef.setOnDisconnect(value) being deprecated. Please use FirebaseRef.onDisconnect().set(value) instead.");this.ka().set(a);Rf(this.i)};G.prototype.setOnDisconnect=G.prototype.Se;G.prototype.I=function(a,b,c){O("FirebaseRef.auth() being deprecated. Please use FirebaseRef.authWithCustomToken() instead.");x("Firebase.auth",1,3,arguments.length);Oa("Firebase.auth",a);z("Firebase.auth",2,b,!0);z("Firebase.auth",3,b,!0);Oe(this.i.I,a,{},{remember:"none"},b,c)};
	G.prototype.auth=G.prototype.I;G.prototype.Bd=function(a){x("Firebase.unauth",0,1,arguments.length);z("Firebase.unauth",1,a,!0);Pe(this.i.I,a)};G.prototype.unauth=G.prototype.Bd;G.prototype.bd=function(){x("Firebase.getAuth",0,0,arguments.length);return this.i.I.bd()};G.prototype.getAuth=G.prototype.bd;G.prototype.Ee=function(a,b){x("Firebase.onAuth",1,2,arguments.length);z("Firebase.onAuth",1,a,!1);za("Firebase.onAuth",2,b);this.i.I.Ua("auth_status",a,b)};G.prototype.onAuth=G.prototype.Ee;
	G.prototype.De=function(a,b){x("Firebase.offAuth",1,2,arguments.length);z("Firebase.offAuth",1,a,!1);za("Firebase.offAuth",2,b);this.i.I.nb("auth_status",a,b)};G.prototype.offAuth=G.prototype.De;G.prototype.je=function(a,b,c){x("Firebase.authWithCustomToken",2,3,arguments.length);Oa("Firebase.authWithCustomToken",a);z("Firebase.authWithCustomToken",2,b,!1);E("Firebase.authWithCustomToken",3,c,!0);Oe(this.i.I,a,{},c||{},b)};G.prototype.authWithCustomToken=G.prototype.je;
	G.prototype.ke=function(a,b,c){x("Firebase.authWithOAuthPopup",2,3,arguments.length);Pa("Firebase.authWithOAuthPopup",1,a);z("Firebase.authWithOAuthPopup",2,b,!1);E("Firebase.authWithOAuthPopup",3,c,!0);Te(this.i.I,a,c,b)};G.prototype.authWithOAuthPopup=G.prototype.ke;
	G.prototype.le=function(a,b,c){x("Firebase.authWithOAuthRedirect",2,3,arguments.length);Pa("Firebase.authWithOAuthRedirect",1,a);z("Firebase.authWithOAuthRedirect",2,b,!1);E("Firebase.authWithOAuthRedirect",3,c,!0);var d=this.i.I;Re(d);var e=[He],f=qe(c);"anonymous"===a||"firebase"===a?P(b,W("TRANSPORT_UNAVAILABLE")):(J.set("redirect_client_options",f.hc),Se(d,e,"/auth/"+a,f,b))};G.prototype.authWithOAuthRedirect=G.prototype.le;
	G.prototype.me=function(a,b,c,d){x("Firebase.authWithOAuthToken",3,4,arguments.length);Pa("Firebase.authWithOAuthToken",1,a);z("Firebase.authWithOAuthToken",3,c,!1);E("Firebase.authWithOAuthToken",4,d,!0);p(b)?(Pa("Firebase.authWithOAuthToken",2,b),Qe(this.i.I,a+"/token",{access_token:b},c)):(E("Firebase.authWithOAuthToken",2,b,!1),Qe(this.i.I,a+"/token",b,c))};G.prototype.authWithOAuthToken=G.prototype.me;
	G.prototype.ie=function(a,b){x("Firebase.authAnonymously",1,2,arguments.length);z("Firebase.authAnonymously",1,a,!1);E("Firebase.authAnonymously",2,b,!0);Qe(this.i.I,"anonymous",{},a)};G.prototype.authAnonymously=G.prototype.ie;
	G.prototype.ne=function(a,b,c){x("Firebase.authWithPassword",2,3,arguments.length);E("Firebase.authWithPassword",1,a,!1);Qa("Firebase.authWithPassword",a,"email");Qa("Firebase.authWithPassword",a,"password");z("Firebase.authAnonymously",2,b,!1);E("Firebase.authAnonymously",3,c,!0);Qe(this.i.I,"password",a,b)};G.prototype.authWithPassword=G.prototype.ne;
	G.prototype.Xc=function(a,b){x("Firebase.createUser",2,2,arguments.length);E("Firebase.createUser",1,a,!1);Qa("Firebase.createUser",a,"email");Qa("Firebase.createUser",a,"password");z("Firebase.createUser",2,b,!1);this.i.I.Xc(a,b)};G.prototype.createUser=G.prototype.Xc;G.prototype.sd=function(a,b){x("Firebase.removeUser",2,2,arguments.length);E("Firebase.removeUser",1,a,!1);Qa("Firebase.removeUser",a,"email");Qa("Firebase.removeUser",a,"password");z("Firebase.removeUser",2,b,!1);this.i.I.sd(a,b)};
	G.prototype.removeUser=G.prototype.sd;G.prototype.Tc=function(a,b){x("Firebase.changePassword",2,2,arguments.length);E("Firebase.changePassword",1,a,!1);Qa("Firebase.changePassword",a,"email");Qa("Firebase.changePassword",a,"oldPassword");Qa("Firebase.changePassword",a,"newPassword");z("Firebase.changePassword",2,b,!1);this.i.I.Tc(a,b)};G.prototype.changePassword=G.prototype.Tc;
	G.prototype.td=function(a,b){x("Firebase.resetPassword",2,2,arguments.length);E("Firebase.resetPassword",1,a,!1);Qa("Firebase.resetPassword",a,"email");z("Firebase.resetPassword",2,b,!1);this.i.I.td(a,b)};G.prototype.resetPassword=G.prototype.td;G.goOffline=function(){x("Firebase.goOffline",0,0,arguments.length);Y.ib().Qa()};G.goOnline=function(){x("Firebase.goOnline",0,0,arguments.length);Y.ib().tb()};
	function dc(a,b){v(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?bc=r(console.log,console):"object"===typeof console.log&&(bc=function(a){console.log(a)})),b&&J.set("logging_enabled",!0)):a?bc=a:(bc=null,J.remove("logging_enabled"))}G.enableLogging=dc;G.ServerValue={TIMESTAMP:{".sv":"timestamp"}};G.SDK_VERSION="1.1.2";G.INTERNAL=Z;G.Context=Y;})();
	module.exports = Firebase;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
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
	 * Work in progress - do not use.
	 *
	 * Inherited from: [FlowLayoutController](./FlowLayoutController.md)
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var LayoutUtility = __webpack_require__(31);
	    var FlowLayoutController = __webpack_require__(14);
	    var FlowLayoutNode = __webpack_require__(32);
	    var LayoutNodeManager = __webpack_require__(33);
	    var ContainerSurface = __webpack_require__(34);
	    var Transform = __webpack_require__(23);
	    var EventHandler = __webpack_require__(35);
	    var Group = __webpack_require__(36);
	    var Vector = __webpack_require__(42);
	    var PhysicsEngine = __webpack_require__(43);
	    var Particle = __webpack_require__(44);
	    var Drag = __webpack_require__(45);
	    var Spring = __webpack_require__(46);
	    var ScrollSync = __webpack_require__(47);

	    /**
	     * Boudary reached detection
	     */
	    var Bounds = {
	        NONE: 0,
	        PREV: 1, // top
	        NEXT: 2, // bottom
	        BOTH: 3
	    };

	    /**
	     * @class
	     * @param {Object} options Options.
	     * @alias module:ScrollView
	     */
	    function ScrollView(options, createNodeFn) {
	        FlowLayoutController.call(this, ScrollView.DEFAULT_OPTIONS, new LayoutNodeManager(FlowLayoutNode, _initLayoutNode.bind(this)));
	        if (options) {
	            this.setOptions(options);
	        }

	        // Scrolling
	        this._scroll = {
	            activeTouches: [],
	            scrollDelta: 0,
	            // physics-engine to use for scrolling
	            pe: new PhysicsEngine(),
	            // particle that represents the scroll-offset
	            particle: new Particle({
	                position: [0, 0]
	            }),
	            // drag-force that slows the particle down after a "flick"
	            dragForce: new Drag(this.options.scrollDrag),
	            // spring
	            springValue: undefined,
	            springForce: new Spring(this.options.scrollSpring),
	            springEndState: new Vector([0, 0, 0]),
	            // window
	            windowStart: undefined,
	            groupStart: undefined
	        };

	        // Diagnostics
	        this._debug = {
	            layoutCount: 0,
	            logging: false
	        };

	        // Create groupt for faster rendering
	        this.group = new Group();
	        this.group.add({render: _innerRender.bind(this)});

	        // Configure physics engine with particle and drag
	        this._scroll.pe.addBody(this._scroll.particle);
	        this._scroll.dragForceId = this._scroll.pe.attach(this._scroll.dragForce, this._scroll.particle);
	        this._scroll.springForce.setOptions({ anchor: this._scroll.springEndState });

	        // Setup input event handler
	        this._eventInput = new EventHandler();
	        EventHandler.setInputHandler(this, this._eventInput);

	        // Listen to touch events
	        this._eventInput.on('touchstart', _touchStart.bind(this));
	        this._eventInput.on('touchmove', _touchMove.bind(this));
	        this._eventInput.on('touchend', _touchEnd.bind(this));
	        this._eventInput.on('touchcancel', _touchEnd.bind(this));

	        // Listen to mouse-wheel events
	        this._scrollSync = new ScrollSync(this.options.scrollSync);
	        this._eventInput.pipe(this._scrollSync);
	        //this._scrollSync.on('start', _moveStart.bind(this, this._scrollSync));
	        this._scrollSync.on('update', _scrollUpdate.bind(this));
	        //this._scrollSync.on('end', _moveEnd.bind(this, this._scrollSync));

	        // Embed in container surface if neccesary
	        if (this.options.useContainer) {
	            this.container = new ContainerSurface({
	                properties: {overflow : 'hidden'}
	            });

	            // Create container surface, which has one child, which just returns
	            // the entity-id of this scrollview. This causes the Commit function
	            // of this scrollview to be called
	            this.container.add({
	                render: function() {
	                    return this.id;
	                }.bind(this)
	            });

	            // Pipe events received in container to this scrollview
	            this.subscribe(this.container);
	            EventHandler.setInputHandler(this.container, this);
	            EventHandler.setOutputHandler(this.container, this);
	        }
	    }
	    ScrollView.prototype = Object.create(FlowLayoutController.prototype);
	    ScrollView.prototype.constructor = ScrollView;

	    ScrollView.DEFAULT_OPTIONS = {
	        //insertSpec: undefined,
	        //removeSpec: undefined,
	        useContainer: false,
	        offsetRounding: 1.0,
	        scrollDrag: {
	            strength : 0.001
	        },
	        scrollSpring: {
	            dampingRatio: 1.0,
	            period: 500
	        },
	        scrollSync: {
	            scale: 0.1
	        },
	        paginated: false,
	        //paginationEnergyThresshold: 0.001,
	        reverse: false,
	        touchMoveDirectionThresshold: undefined // 0..1
	    };

	    /**
	     * Called whenever a layout-node is created/re-used. Initializes
	     * the node with the `insertSpec` if it has been defined and enabled
	     * locking of the x/y translation so that the x/y position of the renderable
	     * is immediately updated when the user scrolls the view.
	     */
	    function _initLayoutNode(node, spec) {
	        /*if (node.setOptions) {
	            node.setOptions({
	                spring: this.options.nodeSpring
	            });
	        }*/
	        if (!spec && this.options.insertSpec) {
	            node.setSpec(this.options.insertSpec);
	        }
	        if (node.setDirectionLock) {
	            node.setDirectionLock(this._direction, 1);
	        }
	    }

	    /**
	     * Helper function for logging debug statements to the console.
	     */
	    function _log(args) {
	        if (!this._debug.logging) {
	            return;
	        }
	        var message = this._debug.layoutCount + ': ';
	        for (var i = 0; i < arguments.length; i++) {
	            var arg = arguments[i];
	            if ((arg instanceof Object) || (arg instanceof Array)) {
	                message += JSON.stringify(arg);
	            }
	            else {
	                message += arg;
	            }
	        }
	        console.log(message);
	    }

	    /**
	     * Helper function to aid development and find bugs.
	     */
	    function _verifyIntegrity(phase, scrollOffset) {
	        /*phase = phase ? ' (' + phase + ')' : '';
	        if ((scrollOffset !== undefined) && isNaN(scrollOffset)) {
	            throw 'invalid scrollOffset: ' + scrollOffset + phase;
	        }
	        if ((this._scroll.scrollDelta !== undefined) && isNaN(this._scroll.scrollDelta)) {
	            throw 'invalid scrollDelta: ' + this._scroll.scrollDelta + phase;
	        }
	        if (isNaN(this._scroll.particle.getVelocity1D(0))) {
	            throw 'invalid particle velocity: ' + this._scroll.particle.getVelocity1D(0) + phase;
	        }
	        if (isNaN(this._scroll.particle.getPosition1D(0))) {
	            throw 'invalid particle position: ' + this._scroll.particle.getPosition1D(0) + phase;
	        }*/
	    }

	    /**
	     * Sets the value for the spring, or set to `undefined` to disable the spring
	     */
	    function _setSpring(value) {
	        if (value !== undefined) {
	            value = _roundScrollOffset.call(this, value);
	        }
	        if (this._scroll.springValue !== value) {
	            this._scroll.springValue = value;
	            if (value === undefined) {
	                if (this._scroll.springForceId !== undefined) {
	                    this._scroll.pe.detach(this._scroll.springForceId);
	                    this._scroll.springForceId = undefined;
	                    _log.call(this, 'disabled spring');
	                }
	            }
	            else {
	                if (this._scroll.springForceId === undefined) {
	                    this._scroll.springForceId = this._scroll.pe.attach(this._scroll.springForce, this._scroll.particle);
	                }
	                this._scroll.springEndState.set1D(value);
	                this._scroll.pe.wake();
	                _log.call(this, 'setting spring to: ', value);
	            }
	        }
	    }

	    /**
	     * Called whenever the user starts moving the scroll-view, using
	     * touch gestures.
	     */
	    function _touchStart(event) {
	        //_log.call(this, 'touchStart');
	        this._eventOutput.emit('touchstart', event);

	        // Reset any programmatic scrollTo request when the user is doing stuff
	        this._scroll.scrollToSequence = undefined;

	        // Remove any touches that are no longer active
	        var oldTouchesCount = this._scroll.activeTouches.length;
	        var i = 0;
	        var touchFound;
	        while (i < this._scroll.activeTouches.length) {
	            var activeTouch = this._scroll.activeTouches[i];
	            touchFound = false;
	            for (var j = 0; j < event.touches.length; j++) {
	                var touch = event.touches[j];
	                if (touch.identifier === activeTouch.id) {
	                    touchFound = true;
	                    break;
	                }
	            }
	            if (!touchFound) {
	                //_log.cal(this, 'removing touch with id: ', activeTouch.id);
	                this._scroll.activeTouches.splice(i, 1);
	            }
	            else {
	                i++;
	            }
	        }

	        // Process touch
	        for (i = 0; i < event.touches.length; i++) {
	            var changedTouch = event.touches[i];
	            touchFound = false;
	            for (j = 0; j < this._scroll.activeTouches.length; i++) {
	                if (this._scroll.activeTouches[j].id === changedTouch.identifier) {
	                    touchFound = true;
	                    break;
	                }
	            }
	            if (!touchFound) {
	                var current = [changedTouch.clientX, changedTouch.clientY];
	                var time = Date.now();
	                this._scroll.activeTouches.push({
	                    id: changedTouch.identifier,
	                    start: current,
	                    current: current,
	                    prev: current,
	                    time: time,
	                    prevTime: time
	                });
	            }
	        }

	        // The first time a touch new touch gesture has arrived, emit event
	        if (!oldTouchesCount && this._scroll.activeTouches.length) {
	            _setParticle.call(this, undefined, 0, 'touchStart'); // reset particle velocity
	            this._scroll.moveToStartPosition = this._scroll.particle.getPosition1D();
	            this._scroll.moveToPosition = this._scroll.moveToStartPosition;
	            this._eventOutput.emit('scrollstart', this._scroll.activeTouches[0]);
	        }
	    }

	    /**
	     * Called whenever the user is moving his/her fingers to scroll the view.
	     * Updates the moveOffset so that the scroll-offset on the view is updated.
	     */
	    function _touchMove(event) {
	        //_log.call(this, 'touchMove');
	        this._eventOutput.emit('touchmove', event);

	        // Reset any programmatic scrollTo request when the user is doing stuff
	        this._scroll.scrollToSequence = undefined;

	        // Process the touch event
	        var primaryTouch;
	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var changedTouch = event.changedTouches[i];
	            for (var j = 0; j < this._scroll.activeTouches.length; j++) {
	                var touch = this._scroll.activeTouches[j];
	                if (touch.id === changedTouch.identifier) {

	                    // When a thresshold is configured, check whether the move operation (x/y ratio)
	                    // lies within the thresshold. A move of 10 pixels x and 10 pixels y is considered 45 deg,
	                    // which corresponds to a thresshold of 0.5.
	                    var moveDirection = Math.atan2(
	                        Math.abs(changedTouch.clientY - touch.prev[1]),
	                        Math.abs(changedTouch.clientX - touch.prev[0])) / (Math.PI / 2.0);
	                    var directionDiff = Math.abs(this._direction - moveDirection);
	                    if ((this.options.touchMoveDirectionThresshold === undefined) || (directionDiff <= this.options.touchMoveDirectionThresshold)){
	                        touch.prev = touch.current;
	                        touch.current = [changedTouch.clientX, changedTouch.clientY];
	                        touch.prevTime = touch.time;
	                        touch.direction = moveDirection;
	                        touch.time = Date.now();
	                        primaryTouch = (j === 0) ? touch : undefined;
	                    }
	                }
	            }
	        }

	        // Update move offset and emit event
	        if (primaryTouch) {
	            var delta = primaryTouch.current[this._direction] - primaryTouch.start[this._direction];
	            this._scroll.moveToPosition = this._scroll.moveToStartPosition + delta;
	            this._eventOutput.emit('scrollmove', this._scroll.activeTouches[0]);
	            _verifyIntegrity.call(this, 'touchMove');
	        }
	    }

	    /**
	     * Called whenever the user releases his fingers and the touch gesture
	     * has completed. This will set the new position and if the user used a 'flick'
	     * gesture give the scroll-offset particle a velocity and momentum into a
	     * certain direction.
	     */
	    function _touchEnd(event) {
	        //_log.call(this, 'touchEnd');
	        this._eventOutput.emit('touchend', event);

	        // Reset any programmatic scrollTo request when the user is doing stuff
	        this._scroll.scrollToSequence = undefined;

	        // Remove touch
	        var primaryTouch = this._scroll.activeTouches.length ? this._scroll.activeTouches[0] : undefined;
	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var changedTouch = event.changedTouches[i];
	            for (var j = 0; j < this._scroll.activeTouches.length; j++) {
	                var touch = this._scroll.activeTouches[j];
	                if (touch.id === changedTouch.identifier) {

	                    // Remove touch
	                    this._scroll.activeTouches.splice(j, 1);

	                    // When a different touch now becomes the primary touch, update
	                    // its start position to match the current move offset.
	                    if ((j === 0) && this._scroll.activeTouches.length) {
	                        var newPrimaryTouch = this._scroll.activeTouches[0];
	                        newPrimaryTouch.start[0] = newPrimaryTouch.current[0] - (touch.current[0] - touch.start[0]);
	                        newPrimaryTouch.start[1] = newPrimaryTouch.current[1] - (touch.current[1] - touch.start[1]);
	                    }
	                    break;
	                }
	            }
	        }

	        // Wait for all fingers to be released from the screen before resetting the move-spring
	        if (this._scroll.activeTouches.length) {
	            return;
	        }

	        // Determine velocity and add to particle
	        var velocity = 0;
	        var diffTime = Date.now() - primaryTouch.prevTime;
	        if (diffTime > 0) {
	            var diffOffset = primaryTouch.current[this._direction] - primaryTouch.prev[this._direction];
	            velocity = diffOffset / diffTime;
	        }

	        // Update particle
	        var scrollOffset = _calcScrollOffset.call(this);
	        _setParticle.call(this, scrollOffset, velocity, 'moveEnd');
	        this._scroll.pe.wake();

	        // Stop the move operation
	        this._scroll.moveToStartPosition = undefined;
	        this._scroll.moveToPosition = undefined;

	        // Emit end event
	        this._eventOutput.emit('scrollend', primaryTouch);
	    }

	    /**
	     * Called whenever the user is scrolling the view using either a mouse
	     * scroll wheel or a track-pad.
	     */
	    function _scrollUpdate(event) {

	        // Reset any programmatic scrollTo request when the user is doing stuff
	        this._scroll.scrollToSequence = undefined;

	        // Store the scroll delta
	        this._scroll.scrollDelta += Array.isArray(event.delta) ? event.delta[this._direction] : event.delta;
	    }

	    /**
	     * Helper function which rounds the scroll-offset to ensure it reaches an end-state and doesn't
	     * move infinitely.
	     */
	    function _roundScrollOffset(scrollOffset) {
	        return Math.round(scrollOffset / this.options.offsetRounding) * this.options.offsetRounding;
	    }

	    /**
	     * Updates the scroll offset particle.
	     */
	    function _setParticle(position, velocity, phase) {
	        phase = phase ? ' (' + phase + ')' : '';
	        if (position !== undefined) {
	            var oldPosition = this._scroll.particle.getPosition1D();
	            this._scroll.particle.setPosition1D(position);
	            _log.call(this, 'setParticle.position: ', position, ' (old: ', oldPosition, ', delta: ', position - oldPosition, ')', phase);
	        }
	        if (velocity !== undefined) {
	            var oldVelocity = this._scroll.particle.getVelocity1D();
	            this._scroll.particle.setVelocity1D(velocity);
	            _log.call(this, 'setParticle.velocity: ', velocity, ' (old: ', oldVelocity, ', delta: ', velocity - oldVelocity, ')', phase);
	        }
	    }

	    /**
	     * Get the in-use scroll-offset.
	     */
	    function _calcScrollOffset() {

	        // When moving using touch-gestures, make the offset stick to the
	        // finger. When the bounds is exceeded, decrease the scroll distance
	        // by two.
	        var scrollOffset = this._scroll.particle.getPosition1D();
	        if (this._scroll.moveToPosition !== undefined) {
	            if (this._scroll.springPosition !== undefined) {
	                scrollOffset = (this._scroll.moveToPosition + this._scroll.springPosition) / 2.0;
	            }
	            else {
	                scrollOffset = this._scroll.moveToPosition;
	            }
	        } else if (this._scroll.scrollDelta) {
	            scrollOffset += this._scroll.scrollDelta;
	            if (((this._scroll.boundsReached & Bounds.PREV) && (scrollOffset > this._scroll.springPosition)) ||
	               ((this._scroll.boundsReached & Bounds.NEXT) && (scrollOffset < this._scroll.springPosition)) ||
	               (this._scroll.boundsReached === Bounds.BOTH)) {
	                scrollOffset = this._scroll.springPosition;
	            }
	        }
	        return _roundScrollOffset.call(this, scrollOffset);
	    }

	    /**
	     * Integrates the scroll delta into the particle position.
	     */
	    function _integrateScrollDelta(scrollOffset) {
	        if (this._scroll.scrollDelta) {
	            this._scroll.scrollDelta = 0;
	            _setParticle.call(this, scrollOffset, undefined, 'integrateScrollDelta');
	        }
	    }

	    /**
	     * Helper function that calculates the prev layed out height.
	     */
	    function _calcPrevHeight() {
	        var height = 0;
	        this._nodes.forEach(function(node) {
	            if ((node.scrollLength === undefined) || node.trueSizeRequested) {
	                height = undefined; // can't determine height
	                return true;
	            }
	            height += node.scrollLength;
	        }.bind(this), false);
	        return height;
	    }

	    /**
	     * Helper function that calculates the next layed out height.
	     */
	    function _calcNextHeight() {
	        var height = 0;
	        this._nodes.forEach(function(node) {
	            if ((node.scrollLength === undefined) || node.trueSizeRequested) {
	                height = undefined; // can't determine height
	                return true;
	            }
	            height += node.scrollLength;
	        }.bind(this), true);
	        return height;
	    }

	    /**
	     * Normalizes the scroll-offset so that scroll-offset is as close
	     * to 0 as can be. This function modifies the scrollOffset and the
	     * viewSeuqnce so that the least possible view-sequence nodes
	     * need to be rendered.
	     *
	     * I.e., when the scroll-offset is changed, e.g. by scrolling up
	     * or down, then renderables may end-up outside the visible range.
	     */
	    function _calcBounds(size, scrollOffset) {

	        // Local data
	        var prevHeight;
	        var nextHeight;

	        // 1. Check whether primary boundary has been reached
	        if (this.options.reverse) {
	            nextHeight = _calcNextHeight.call(this);
	            if ((nextHeight !== undefined) && ((scrollOffset + nextHeight) < size[this._direction])) {
	                this._scroll.boundsReached = Bounds.NEXT;
	                this._scroll.springPosition = size[this._direction] - nextHeight;
	                return;
	            }
	            prevHeight = _calcPrevHeight.call(this);
	        }
	        else {
	            prevHeight = _calcPrevHeight.call(this);
	            if ((prevHeight !== undefined) && ((scrollOffset - prevHeight) > 0)) {
	                this._scroll.boundsReached = Bounds.PREV;
	                this._scroll.springPosition = prevHeight;
	                return;
	            }
	            nextHeight = _calcNextHeight.call(this);
	        }

	        // 2. When the rendered height is smaller than the total height,
	        //    then lock to the primary bounds
	        var totalHeight;
	        if ((nextHeight !== undefined) && (prevHeight !== undefined)) {
	            totalHeight = prevHeight + nextHeight;
	        }
	        if ((totalHeight !== undefined) && (totalHeight < size[this._direction])) {
	            this._scroll.boundsReached = Bounds.BOTH;
	            this._scroll.springPosition = this.options.reverse ? size[this._direction] - nextHeight : prevHeight;
	            return;
	        }

	        // 3. Check if secondary bounds has been reached
	        if (this.options.reverse) {
	            if ((prevHeight !== undefined) && ((scrollOffset - prevHeight) > 0)) {
	                this._scroll.boundsReached = Bounds.PREV;
	                this._scroll.springPosition = prevHeight;
	                return;
	            }
	        }
	        else {
	            if ((nextHeight !== undefined) && ((scrollOffset + nextHeight) < size[this._direction])){
	                this._scroll.boundsReached = Bounds.NEXT;
	                this._scroll.springPosition = size[this._direction] - nextHeight;
	                return;

	            }
	        }

	        // No bounds reached
	        this._scroll.boundsReached = Bounds.NONE;
	        this._scroll.springPosition = undefined;
	    }

	    /**
	     * Calculates the scrollto-offset to which the spring is set.
	     */
	    function _calcScrollToOffset(size, scrollOffset) {
	        if (!this._scroll.scrollToSequence) {
	            return;
	        }

	        // 1. When boundary is reached, stop scrolling in that direction
	        if ((this._scroll.boundsReached === Bounds.BOTH) ||
	            (!this._scroll.scrollToDirection && (this._scroll.boundsReached === Bounds.PREV)) ||
	            (this._scroll.scrollToDirection && (this._scroll.boundsReached === Bounds.NEXT))) {
	            this._scroll.scrollToSequence = undefined;
	            return;
	        }

	        // 2. Find the node to scroll to
	        var foundNode;
	        var scrollToOffset = 0;
	        this._nodes.forEach(function(node) {
	            if (node.scrollLength === undefined) {
	                return true;
	            }
	            if (node._viewSequence === this._scroll.scrollToSequence) {
	                foundNode = node;
	                return true;
	            }
	            scrollToOffset -= node.scrollLength;
	        }.bind(this), true);
	        if (!foundNode) {
	            scrollToOffset = 0;
	            this._nodes.forEach(function(node) {
	                if (node.scrollLength === undefined) {
	                    return true;
	                }
	                scrollToOffset += node.scrollLength;
	                if (node._viewSequence === this._scroll.scrollToSequence) {
	                    foundNode = node;
	                    return true;
	                }
	            }.bind(this), false);
	        }
	        if (foundNode) {
	            this._scroll.springPosition = scrollToOffset;
	            return;
	        }

	        // 3. When node not found, set the spring to a position into that direction
	        if (this._scroll.scrollToDirection) {
	            this._scroll.springPosition = scrollOffset - size[this._direction];
	        }
	        else {
	            this._scroll.springPosition = scrollOffset + size[this._direction];
	        }
	    }

	    /**
	     * Snaps to a page when paginanation is enabled and the energy of the particle
	     * is below the thesshold.
	     */
	    function _snapToPage(size, scrollOffset) {

	        // Check whether pagination is active
	        if (!this.options.paginated ||
	            (Math.abs(this._scroll.particle.getEnergy()) > this.options.paginationEnergyThresshold) ||
	            (this._scroll.springPosition !== undefined)) {
	            return;
	        }

	        // Local data
	        var pageOffset = scrollOffset;
	        var pageLength;
	        var hasNext;

	        // Lookup page in previous direction
	        var bound = this.options.reverse ? size[this._direction] : 0;
	        this._nodes.forEach(function(node) {
	            if (node.scrollLength !== 0) {
	                if ((pageOffset <= bound) || (node.scrollLength === undefined)) {
	                    return true;
	                }
	                hasNext = (pageLength !== undefined);
	                pageLength = node.scrollLength;
	                pageOffset -= node.scrollLength;
	            }
	        }.bind(this), false);

	        // Lookup page in next direction
	        if (pageLength === undefined) {
	            this._nodes.forEach(function(node) {
	                if (node.scrollLength !== 0) {
	                    if (node.scrollLength === undefined) {
	                        return true;
	                    }
	                    hasNext = (pageLength !== undefined);
	                    if (hasNext) {
	                        if ((pageOffset + pageLength) > bound) {
	                            return true;
	                        }
	                        pageOffset += pageLength;
	                    }
	                    pageLength = node.scrollLength;
	                }
	            }.bind(this), true);
	        }
	        if (!pageLength) {
	            return;
	        }

	        // Determine snap spring-position
	        var boundOffset = pageOffset - bound;
	        if (!hasNext || (Math.abs(boundOffset) < Math.abs(boundOffset + pageLength))) {
	            this._scroll.springPosition = (scrollOffset - pageOffset) + (this.options.reverse ? size[this._direction] : 0);
	            _log.call(this, 'setting snap-spring to #1: ', this._scroll.springPosition, ', scrollOffset: ' + scrollOffset);
	        }
	        else {
	            this._scroll.springPosition = (scrollOffset - (pageOffset + pageLength)) + (this.options.reverse ? size[this._direction] : 0);
	            _log.call(this, 'setting snap-spring to #2: ', this._scroll.springPosition, ', scrollOffset: ' + scrollOffset);
	        }
	    }

	    /**
	     * Normalizes the view-sequence node so that the view-sequence is near to 0.
	     */
	    function _normalizePrevViewSequence(size, scrollOffset, baseOffset) {
	        this._nodes.forEach(function(node) {
	            if ((node.scrollLength === undefined) || node.trueSizeRequested) {
	                return true;
	            }
	            if (scrollOffset < baseOffset){
	                return true;
	            }
	            this._viewSequence = node._viewSequence;
	            scrollOffset -= node.scrollLength;
	            _log.call(this, 'normalized prev node with length: ', node.scrollLength, ', scrollOffset: ', scrollOffset);
	        }.bind(this), false);
	        return scrollOffset;
	    }
	    function _normalizeNextViewSequence(size, scrollOffset, baseOffset) {
	        var prevScrollLength;
	        this._nodes.forEach(function(node) {
	            if ((node.scrollLength === undefined) || node.trueSizeRequested) {
	                return true;
	            }
	            if (prevScrollLength !== undefined) {
	                if ((scrollOffset + prevScrollLength) >= baseOffset){
	                    return true;
	                }
	                this._viewSequence = node._viewSequence;
	                scrollOffset += prevScrollLength;
	                _log.call(this, 'normalized next node with length: ', prevScrollLength, ', scrollOffset: ', scrollOffset);
	            }
	            prevScrollLength = node.scrollLength;
	        }.bind(this), true);
	        return scrollOffset;
	    }
	    function _normalizeViewSequence(size, scrollOffset) {

	        // Check whether normalisation is disabled
	        if (this._layout.capabilities && this._layout.capabilities.debug &&
	            (this._layout.capabilities.debug.normalize !== undefined) &&
	            !this._layout.capabilities.debug.normalize) {
	            return scrollOffset;
	        }

	        // Don't normalize when moving
	        if (this._scroll.moveToStartPosition !== undefined) {
	            return scrollOffset;
	        }

	        // Determine base offset (by default 0 = top/left), but may be overwriten
	        // by the layout function to test layout in the prev-direction.
	        var baseOffset = 0; // top/left
	        if (this._layout.capabilities && this._layout.capabilities.debug && this._layout.capabilities.debug.testPrev) {
	            baseOffset = size[this._direction];
	        }

	        // 1. Normalize in primary direction
	        var normalizedScrollOffset = scrollOffset;
	        if (this.options.reverse) {
	            normalizedScrollOffset = _normalizeNextViewSequence.call(this, size, scrollOffset, baseOffset);
	        }
	        else {
	            normalizedScrollOffset = _normalizePrevViewSequence.call(this, size, scrollOffset, baseOffset);
	        }

	        // 2. Normalize in secondary direction
	        if (normalizedScrollOffset === scrollOffset) {
	            if (this.options.reverse) {
	                normalizedScrollOffset = _normalizePrevViewSequence.call(this, size, scrollOffset, baseOffset);
	            }
	            else {
	                normalizedScrollOffset = _normalizeNextViewSequence.call(this, size, scrollOffset, baseOffset);
	            }
	        }

	        // Adjust particle and springs
	        if (normalizedScrollOffset !== scrollOffset) {
	            var delta = normalizedScrollOffset - scrollOffset;

	            // Adjust particle
	            _setParticle.call(this, this._scroll.particle.getPosition1D() + delta, undefined, 'normalize');

	            // Adjust scroll spring
	            if (this._scroll.springPosition !== undefined) {
	                this._scroll.springPosition += delta;
	            }

	            // Adjust move position
	            if (this._scroll.moveToStartPosition !== undefined) {
	                this._scroll.moveToStartPosition += delta;
	            }

	            // Adjust group offset
	            this._scroll.windowStart -= delta;
	            this._scroll.groupStart -= delta;
	        }
	        return normalizedScrollOffset;
	    }

	        /*function _getVisiblePercentage(spec) {
	        var specLeft = spec.transform[12];
	        var specTop = spec.transform[13];
	        var specSize = spec.size;
	        var left = Math.max(0, specLeft);
	        var top = Math.max(0, specTop);
	        var right = Math.min(this._contextSizeCache[0], specLeft + specSize[0]);
	        var bottom = Math.min(this._contextSizeCache[1], specTop + specSize[1]);
	        var width = right - left;
	        var height = bottom - top;
	        var volume = width * height;
	        var totalVolume = spec.size[0] * spec.size[1];
	        return totalVolume ? (volume / totalVolume) : 0;
	    }

	    function _getVisibleItem(spec) {
	        return {
	            spec: {
	                opacity: spec.opacity,
	                align: spec.align,
	                origin: spec.origin,
	                size: spec.size,
	                transform: spec.transform
	            },
	            renderNode: spec.renderNode,
	            visiblePerc: _getVisiblePercentage.call(this, spec)
	        };
	    }*/

	    /**
	     * Get the first visible item that meets the visible percentage criteria.
	     * The percentage indicates how many pixels should at least visible before
	     * the renderable is considered visible.
	     * `visible percentage = (width * height) / (visible width * visible height)`
	     *
	     * @param {Number} [visiblePerc] percentage in the range of 0..1 (default: 0.99)
	     * @return {Object} item object or undefined
	     */
	    ScrollView.prototype.getFirstVisibleItem = function(visiblePerc) {
	        var scrollOffset = _calcScrollOffset.call(this);
	        var next = scrollOffset <= 0;
	        var foundNode;
	        this._nodes.forEach(function(node) {
	            if (node.scrollLength === undefined) {
	                return true;
	            }
	            scrollOffset += next ? node.scrollLength : -node.scrollLength;
	            if ((next && (scrollOffset > 0)) ||
	                (!next && (scrollOffset <= 0))) {
	                foundNode = node;
	                return true;
	            }
	        }, next);
	        return foundNode ? foundNode._viewSequence : undefined;
	    };

	    /**
	     * Helper function that scrolls the view towards a view-sequence node.
	     */
	    function _scrollToSequence(viewSequence, next) {
	        this._scroll.scrollToSequence = viewSequence;
	        this._scroll.scrollToDirection = next;
	        this._scroll.scrollToDirty = true;
	    }

	    /**
	     * Moves to the next node in the viewSequence.
	     *
	     * @param {Number} [amount] Amount of nodes to move
	     * @return {ScrollView} this
	     */
	    ScrollView.prototype.scroll = function(amount) {

	        // Get current scroll-position. When a previous call was made to
	        // `scroll' or `scrollTo` and that node has not yet been reached, then
	        // the amount is accumalated onto that scroll target.
	        var viewSequence = this._scroll.scrollToSequence || this.getFirstVisibleItem() || this._viewSequence;
	        if (!viewSequence) {
	            return this;
	        }

	        // When the first renderable is partially shown, then treat `-1` (previous)
	        // as `show the current renderable fully`.
	        if (!this._scroll.scrollToSequence && (amount < 0) && (_calcScrollOffset.call(this) < 0)){
	            amount += 1;
	        }

	        // Find scroll target
	        for (var i = 0; i < Math.abs(amount); i++) {
	            var nextViewSequence = (amount > 0) ? viewSequence.getNext() : viewSequence.getPrevious();
	            if (nextViewSequence) {
	                viewSequence = nextViewSequence;
	            }
	            else {
	                break;
	            }
	        }
	        _scrollToSequence.call(this, viewSequence, amount >= 0);
	        return this;
	    };

	    /**
	     * Scroll to the given renderable in the datasource.
	     *
	     * @param {RenderNode} [node] renderable to scroll to
	     * @return {ScrollView} this
	     */
	    ScrollView.prototype.scrollTo = function(node) {

	        // Verify arguments and state
	        if (!this._viewSequence || !node) {
	            return this;
	        }

	        // Check current node
	        if (this._viewSequence.get() === node) {
	            _scrollToSequence.call(this, this._viewSequence, true);
	            return this;
	        }

	        // Find the sequence-node that we want to scroll to.
	        // We look at both directions at the same time.
	        // The first match that is encountered, that direction is chosen.
	        var nextSequence = this._viewSequence.getNext();
	        var prevSequence = this._viewSequence.getPrevious();
	        while ((nextSequence || prevSequence) && (nextSequence !== this._viewSequence)){
	            var nextNode = nextSequence ? nextSequence.get() : undefined;
	            if (nextNode === node) {
	                _scrollToSequence.call(this, nextSequence, true);
	                break;
	            }
	            var prevNode = prevSequence ? prevSequence.get() : undefined;
	            if (prevNode === node) {
	                _scrollToSequence.call(this, prevSequence, false);
	                break;
	            }
	            nextSequence = nextNode ? nextSequence.getNext() : undefined;
	            prevSequence = prevNode ? prevSequence.getPrevious() : undefined;
	        }
	        return this;
	    };

	    /**
	     * Prepares the layout for the layout-function.
	     * Determines the scrollStart and scrollEnd positions so that the layout-function
	     * renders the same renderables as much as possible to reduce insert/remove into
	     * the DOM as much as possible.
	     */
	    function _prepareLayout(size, scrollOffset) {

	        // Determine current window-size
	        var windowSize = size[this._direction] * 5;

	        // Initialize window start position
	        if (this._scroll.windowStart === undefined) {
	            this._scroll.windowStart = -size[this._direction];
	            this._scroll.groupStart = this._scroll.windowStart;
	        }

	        // Normalize window-start in case renderables outside the
	        // window should be displayed.
	        var scrollStart = scrollOffset + this._scroll.windowStart;
	        if (scrollStart >= 0) {
	            _log.call(this, 'normalizing window #1, scrollStart: ' + scrollStart);
	            this._scroll.windowStart = scrollOffset - size[this._direction];
	            scrollStart = scrollOffset - this._scroll.windowStart;
	            //console.log('norm #1: scrollStart: ' + scrollStart + ', windowStart:' + this._scroll.windowStart);
	        } else if ((scrollStart + windowSize) <= size[this._direction]) {
	            _log.call(this, 'normalizing window #2, scrollStart: ' + scrollStart);
	            this._scroll.windowStart = scrollOffset - size[this._direction];
	            scrollStart = scrollOffset - this._scroll.windowStart;
	            //console.log('norm #2: scrollStart: ' + scrollStart + ', windowStart:' + this._scroll.windowStart);
	        }

	        // Prepare for layout
	        //_log.call(this, 'scrollStart: ' + scrollStart + ', offset: ' + scrollOffset + ', end: ' + (scrollStart + windowSize) + ', windowStart: ' + this._scroll.windowStart);
	        return this._nodes.prepareForLayout(
	            this._viewSequence,     // first node to layout
	            this._nodesById, {      // so we can do fast id lookups
	                size: size,
	                direction: this._direction,
	                scrollOffset: scrollOffset,
	                scrollStart: scrollStart,
	                scrollEnd: scrollStart + windowSize
	            }
	        );
	    }

	    /**
	     * Executes the layout and updates the state of the scrollview.
	     */
	    function _layout(size, scrollOffset, nested) {
	        _verifyIntegrity.call(this, 'layout', scrollOffset);

	        // Track the number of times the layout-function was executed
	        this._debug.layoutCount++;
	        //_log.call(this, 'Layout, scrollOffset: ', scrollOffset, ', particle: ', this._scroll.particle.getPosition1D(), ', scrollDelta: ', this._scroll.scrollDelta);

	        // Normalize the group
	        var layoutContext = _prepareLayout.call(this, size, scrollOffset);
	        _verifyIntegrity.call(this, 'prepareLayout');

	        // Layout objects
	        if (this._layout.function) {
	            this._layout.function(
	                layoutContext,          // context which the layout-function can use
	                this._layout.options    // additional layout-options
	            );
	        }
	        _verifyIntegrity.call(this, 'layout.function', scrollOffset);

	        // Mark non-invalidated nodes for removal
	        this._nodes.removeNonInvalidatedNodes(this.options.removeSpec);
	        _verifyIntegrity.call(this, 'removeNonInvalidatedNodes', scrollOffset);

	        // Check whether the bounds have been reached
	        _calcBounds.call(this, size, scrollOffset);
	        _verifyIntegrity.call(this, 'calcBounds', scrollOffset);

	        // If the bounds have changed, and the scroll-offset would be different
	        // than before, then re-layout entirely using the new offset.
	        var newScrollOffset = _calcScrollOffset.call(this);
	        _integrateScrollDelta.call(this, newScrollOffset);
	        if (!nested && (newScrollOffset !== scrollOffset)) {
	            _log.call(this, 'offset changed, re-layouting... (', scrollOffset, ' != ', newScrollOffset, ')');
	            return _layout.call(this, size, newScrollOffset, true);
	        }

	        // Calculate the spec-output
	        var result = this._nodes.buildSpecAndDestroyUnrenderedNodes();
	        _verifyIntegrity.call(this, 'buildSpecAndDestroyUnrenderedNodes', scrollOffset);
	        this._specs = result.specs;
	        if (result.modified || true) {
	            this._eventOutput.emit('reflow', {
	                target: this
	            });
	        }

	        // Update scroll-to spring
	        _calcScrollToOffset.call(this, size, scrollOffset);
	        _verifyIntegrity.call(this, 'calcScrollToOffset', scrollOffset);

	        // When pagination is enabled, snap to page
	        _snapToPage.call(this, size, scrollOffset);
	        _verifyIntegrity.call(this, 'snapToPage', scrollOffset);

	        // Normalize scroll offset so that the current viewsequence node is as close to the
	        // top as possible and the layout function will need to process the least amount
	        // of renderables.
	        scrollOffset = _normalizeViewSequence.call(this, size, scrollOffset);
	        _verifyIntegrity.call(this, 'normalizeViewSequence', scrollOffset);

	        // Update spring
	        _setSpring.call(this, this._scroll.springPosition);
	        _verifyIntegrity.call(this, 'setSpring', scrollOffset);

	        return scrollOffset;
	    }

	    /**
	     * Override of the setDirection function to detect whether the
	     * direction has changed. If so, the directionLock on the nodes
	     * is updated.
	     */
	    var oldSetDirection = ScrollView.prototype.setDirection;
	    ScrollView.prototype.setDirection = function(direction) {
	        var oldDirection = this._direction;
	        oldSetDirection.call(this, direction);
	        if (oldDirection !== this._direction) {
	            this._nodes.forEach(function(node) {
	                if (node.setDirectionLock) {
	                    node.setDirectionLock(this._direction, 0);
	                }
	            }.bind(this));
	        }
	    };

	    /**
	     * Inner render function of the Group
	     */
	    function _innerRender() {
	        var specs = [];
	        var scrollOffset = this._scrollOffsetCache;
	        var translate = [0, 0, 0];
	        translate[this._direction] = -this._scroll.groupStart - scrollOffset;
	        for (var i = 0; i < this._specs.length; i++) {
	            var spec = this._specs[i];
	            var transform = Transform.thenMove(spec.transform, translate);
	            /*var newSpec = spec._windowSpec;
	            if (!newSpec) {
	                newSpec = {};
	                spec._windowSpec = newSpec;
	            }*/
	            var newSpec = {};
	            newSpec.origin = spec.origin;
	            newSpec.align = spec.align;
	            newSpec.opacity = spec.opacity;
	            newSpec.size = spec.size;
	            newSpec.transform = transform;
	            newSpec.target = spec.renderNode.render();
	            /*if (spec._translatedSpec) {
	                if (!LayoutUtility.isEqualSpec(newSpec, spec._translatedSpec)) {
	                    var diff = LayoutUtility.getSpecDiffText(newSpec, spec._translatedSpec);
	                    _log.call(this, diff + ' (scrollOffset: ' + spec._translatedSpec.scrollOffset + ' != ' + scrollOffset + ', windowOffset: ' + this._scroll.windowStart + ')');
	                }
	            }
	            else {
	                _log.call(this, 'new spec rendered');
	            }*/
	            spec._translatedSpec = newSpec;
	            newSpec.scrollOffset = scrollOffset;
	            specs.push(newSpec);
	        }
	        return specs;
	    }

	    /**
	     * Apply changes from this component to the corresponding document element.
	     * This includes changes to classes, styles, size, content, opacity, origin,
	     * and matrix transforms.
	     *
	     * @private
	     * @method commit
	     * @param {Context} context commit context
	     */
	    ScrollView.prototype.commit = function commit(context) {
	        var size = context.size;
	        var scrollOffset = _calcScrollOffset.call(this);

	        // When the size or layout function has changed, reflow the layout
	        if (size[0] !== this._contextSizeCache[0] ||
	            size[1] !== this._contextSizeCache[1] ||
	            this._isDirty ||
	            this._scroll.scrollToDirty ||
	            this._nodes._trueSizeRequested ||
	            this._scrollOffsetCache !== scrollOffset) {

	            // Emit start event
	            var eventData = {
	                target: this,
	                oldSize: this._contextSizeCache,
	                size: size,
	                oldScrollOffset: this._scrollOffsetCache,
	                scrollOffset: scrollOffset,
	                dirty: this._isDirty,
	                trueSizeRequested: this._nodes._trueSizeRequested
	            };
	            this._eventOutput.emit('layoutstart', eventData);

	            // When the layout has changed, and we are not just scrolling,
	            // disable the locked state of the layout-nodes so that they
	            // can freely transition between the old and new state.
	            if (this._isDirty) {
	                this._nodes.forEach(function(node) {
	                    if (node.setDirectionLock) {
	                        node.setDirectionLock(this._direction, 0);
	                    }
	                }.bind(this));
	            }

	            // Update state
	            this._contextSizeCache[0] = size[0];
	            this._contextSizeCache[1] = size[1];
	            this._scrollOffsetCache = scrollOffset;
	            this._isDirty = false;
	            this._scroll.scrollToDirty = false;

	            // Perform layout
	            scrollOffset = _layout.call(this, size, scrollOffset);
	            this._scrollOffsetCache = scrollOffset;

	            // Emit end event
	            this._eventOutput.emit('layoutend', eventData);
	        }
	        else {

	            // Update output and optionally emit event
	            var result = this._nodes.buildSpecAndDestroyUnrenderedNodes();
	            this._specs = result.specs;
	            if (result.modified) {
	                this._eventOutput.emit('reflow', {
	                    target: this
	                });
	            }
	        }

	        // Translate the group
	        var windowOffset = scrollOffset + this._scroll.groupStart;
	        var transform = this._direction ? Transform.translate(0, windowOffset, 0) : Transform.translate(windowOffset, 0, 0);
	        transform = Transform.multiply(context.transform, transform);
	        return {
	            transform: transform,
	            size: size,
	            opacity: context.opacity,
	            origin: context.origin,
	            target: this.group.render()
	        };
	    };

	    /**
	     * Generate a render spec from the contents of this component.
	     *
	     * @private
	     * @method render
	     * @return {number} Render spec for this component
	     */
	    ScrollView.prototype.render = function render() {
	        if (this.container) {
	            return this.container.render.apply(this.container, arguments);
	        }
	        else {
	            return this.id;
	        }
	    };

	    module.exports = ScrollView;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define*/
	/*eslint no-use-before-define:0 */

	/**
	 * FlowLayoutController transitions renderables smoothly from one
	 * layout to another. When the data-source or layout is changed,
	 * the renderables are transitioned from their old state (size,
	 * transform, origin, etc..) to the new state.
	 *
	 * Inherited from: [LayoutController](./LayoutController.md)
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var LayoutController = __webpack_require__(15);
	    var LayoutNodeManager = __webpack_require__(33);
	    var FlowLayoutNode = __webpack_require__(39);
	    var Transform = __webpack_require__(23);

	    /**
	     * @class
	     * @extends LayoutController
	     * @param {Object} options Options.
	     * @param {Function|Object} [options.layout] Layout function or layout-literal.
	     * @param {Object} [options.layoutOptions] Options to pass in to the layout-function.
	     * @param {Array|ViewSequence|Object} [options.dataSource] Array, ViewSequence or Object with key/value pairs.
	     * @param {Utility.Direction} [options.direction] Direction to layout into (e.g. Utility.Direction.Y) (when ommited the default direction of the layout is used)
	     * @param {Spec} [options.insertSpec] Size, transform, opacity... to use when inserting new renderables into the scene.
	     * @param {Spec} [options.removeSpec] Size, transform, opacity... to use when removing renderables from the scene.
	     * @param {Object} [options.nodeSpring] Spring options to use when transitioning between states
	     * @alias module:FlowLayoutController
	     */
	    function FlowLayoutController(options, nodeManager) {
	        LayoutController.call(this, FlowLayoutController.DEFAULT_OPTIONS, nodeManager || new LayoutNodeManager(FlowLayoutNode, _initLayoutNode.bind(this)));
	        if (options) {
	            this.setOptions(options);
	        }
	    }
	    FlowLayoutController.prototype = Object.create(LayoutController.prototype);
	    FlowLayoutController.prototype.constructor = FlowLayoutController;

	    FlowLayoutController.DEFAULT_OPTIONS = {
	        nodeSpring: {
	            dampingRatio: 0.8,
	            period: 300
	        }
	        /*insertSpec: {
	            opacity: undefined,
	            size: undefined,
	            transform: undefined,
	            origin: undefined,
	            align: undefined
	        },
	        removeSpec: {
	            opacity: undefined,
	            size: undefined,
	            transform: undefined,
	            origin: undefined,
	            align: undefined
	        }*/
	    };

	    /**
	     * Called whenever a layout-node is created/re-used. Initializes
	     * the node with the `insertSpec` if it has been defined.
	     */
	    function _initLayoutNode(node, spec) {
	        if (node.setOptions) {
	            node.setOptions({
	                spring: this.options.nodeSpring
	            });
	        }
	        if (!spec && this.options.insertSpec) {
	            node.setSpec(this.options.insertSpec);
	        }
	    }

	    var oldSetOptions = FlowLayoutController.prototype.setOptions;
	    /**
	     * Patches the FlowLayoutController instance's options with the passed-in ones.
	     *
	     * @param {Options} options An object of configurable options for the FlowLayoutController instance.
	     * @param {Function|Object} [options.layout] Layout function or layout-literal.
	     * @param {Object} [options.layoutOptions] Options to pass in to the layout-function.
	     * @param {Array|ViewSequence|Object} [options.dataSource] Array, ViewSequence or Object with key/value pairs.
	     * @param {Utility.Direction} [options.direction] Direction to layout into (e.g. Utility.Direction.Y) (when ommited the default direction of the layout is used)
	     * @param {Spec} [options.insertSpec] Size, transform, opacity... to use when inserting new renderables into the scene.
	     * @param {Spec} [options.removeSpec] Size, transform, opacity... to use when removing renderables from the scene.
	     * @param {Object} [options.nodeSpring] Spring options to use when transitioning between states
	     * @return {FlowLayoutController} this
	     */
	    FlowLayoutController.prototype.setOptions = function setOptions(options) {
	        oldSetOptions.call(this, options);
	        if (options.nodeSpring) {
	            this._nodes.forEach(function(node) {
	                node.setOptions({spring: options.nodeSpring});
	            });
	        }
	        return this;
	    };

	    /**
	     * Apply changes from this component to the corresponding document element.
	     * This includes changes to classes, styles, size, content, opacity, origin,
	     * and matrix transforms.
	     *
	     * @private
	     * @method commit
	     * @param {Context} context commit context
	     */
	    FlowLayoutController.prototype.commit = function commit(context) {
	        var transform = context.transform;
	        var origin = context.origin;
	        var size = context.size;
	        var opacity = context.opacity;
	        var result;

	        // When the size or layout function has changed, reflow the layout
	        if (size[0] !== this._contextSizeCache[0] ||
	            size[1] !== this._contextSizeCache[1] ||
	            this._isDirty ||
	            this._nodes._trueSizeRequested) {

	            // Emit start event
	            var eventData = {
	                target: this,
	                oldSize: this._contextSizeCache,
	                size: size,
	                dirty: this._isDirty,
	                trueSizeRequested: this._nodes._trueSizeRequested
	            };
	            this._eventOutput.emit('layoutstart', eventData);

	            // Update state
	            this._contextSizeCache[0] = size[0];
	            this._contextSizeCache[1] = size[1];
	            this._isDirty = false;

	            // Prepare for layout
	            var layoutContext = this._nodes.prepareForLayout(
	                this._viewSequence,     // first node to layout
	                this._nodesById, {      // so we can do fast id lookups
	                    size: size,
	                    direction: this._direction
	                }
	            );

	            // Layout objects
	            if (this._layout.function) {
	                this._layout.function(
	                    layoutContext,          // context which the layout-function can use
	                    this._layout.options    // additional layout-options
	                );
	            }

	            // Mark non-invalidated nodes for removal
	            this._nodes.removeNonInvalidatedNodes(this.options.removeSpec);

	            // Update output and optionally emit event
	            result = this._nodes.buildSpecAndDestroyUnrenderedNodes();
	            this._commitOutput.target = result.specs;
	            if (result.modified || true) {
	                this._eventOutput.emit('reflow', {
	                    target: this
	                });
	            }

	            // Emit end event
	            this._eventOutput.emit('layoutend', eventData);
	        }
	        else {

	            // Update output and optionally emit event
	            result = this._nodes.buildSpecAndDestroyUnrenderedNodes();
	            this._commitOutput.target = result.specs;
	            if (result.modified) {
	                this._eventOutput.emit('reflow', {
	                    target: this
	                });
	            }
	        }

	        // Render child-nodes every commit
	        for (var i = 0; i < this._commitOutput.target.length; i++) {
	            this._commitOutput.target[i].target = this._commitOutput.target[i].renderNode.render();
	        }

	        // Return
	        if (size) {
	            transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);
	        }
	        this._commitOutput.size = size;
	        this._commitOutput.opacity = opacity;
	        this._commitOutput.transform = transform;
	        return this._commitOutput;
	    };

	    module.exports = FlowLayoutController;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define*/
	/*eslint no-use-before-define:0 */

	/**
	 * LayoutController lays out renderables according to a layout-
	 * function and a data-source.
	 *
	 * The LayoutController is the most basic and lightweight version
	 * of a controller/view laying out renderables according to a
	 * layout-function.
	 *
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var Utility = __webpack_require__(24);
	    var Entity = __webpack_require__(37);
	    var ViewSequence = __webpack_require__(20);
	    var OptionsManager = __webpack_require__(38);
	    var EventHandler = __webpack_require__(35);
	    var LayoutUtility = __webpack_require__(31);
	    var LayoutNodeManager = __webpack_require__(33);
	    var LayoutNode = __webpack_require__(32);
	    var Transform = __webpack_require__(23);
	    __webpack_require__(48);

	    /**
	     * @class
	     * @param {Object} options Options.
	     * @param {Function|Object} [options.layout] Layout function or layout-literal.
	     * @param {Object} [options.layoutOptions] Options to pass in to the layout-function.
	     * @param {Array|ViewSequence|Object} [options.dataSource] Array, ViewSequence or Object with key/value pairs.
	     * @param {Utility.Direction} [options.direction] Direction to layout into (e.g. Utility.Direction.Y) (when ommited the default direction of the layout is used)
	     * @alias module:LayoutController
	     */
	    function LayoutController(options, nodeManager) {

	        // Commit
	        this.id = Entity.register(this);
	        this._isDirty = true;
	        this._contextSizeCache = [0, 0];
	        this._commitOutput = {};

	        // Setup event handlers
	        this._eventOutput = new EventHandler();
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        // Data-source
	        //this._dataSource = undefined;
	        //this._nodesById = undefined;
	        //this._viewSequence = undefined;

	        // Layout
	        this._layout = {
	            //function: undefined,
	            //literal: undefined,
	            //capabilities: undefined,
	            options: Object.create({})
	        };
	        //this._direction = undefined;
	        this._layout.optionsManager = new OptionsManager(this._layout.options);
	        this._layout.optionsManager.on('change', function() {
	            this._isDirty = true;
	        }.bind(this));

	        // Create node manager that manages result LayoutNode instances
	        this._nodes = nodeManager || new LayoutNodeManager(LayoutNode);

	        // Create options
	        this.options = Object.create({});
	        this._optionsManager = new OptionsManager(this.options);
	        this.setDirection(undefined);
	        if (options) {
	            this.setOptions(options);
	        }
	    }

	    /**
	     * Patches the LayoutController instance's options with the passed-in ones.
	     *
	     * @param {Options} options An object of configurable options for the LayoutController instance.
	     * @param {Function|Object} [options.layout] Layout function or layout-literal.
	     * @param {Object} [options.layoutOptions] Options to pass in to the layout-function.
	     * @param {Array|ViewSequence|Object} [options.dataSource] Array, ViewSequence or Object with key/value pairs.
	     * @param {Utility.Direction} [options.direction] Direction to layout into (e.g. Utility.Direction.Y) (when ommited the default direction of the layout is used)
	     * @return {LayoutController} this
	     */
	    LayoutController.prototype.setOptions = function setOptions(options) {
	        this._optionsManager.setOptions(options);
	        if (options.dataSource) {
	            this.setDataSource(options.dataSource);
	        }
	        if (options.layout || options.layoutOptions) {
	            this.setLayout(options.layout, options.layoutOptions);
	        }
	        if (options.direction !== undefined) {
	            this.setDirection(options.direction);
	        }
	        return this;
	    };

	    /**
	     * Sets the collection of renderables which are layed out according to
	     * the layout-function.
	     *
	     * The data-source can be either an Array, ViewSequence or Object
	     * with key/value pairs.
	     *
	     * @param {Array|Object|ViewSequence} dataSource Array, ViewSequence or Object.
	     * @return {LayoutController} this
	     */
	    LayoutController.prototype.setDataSource = function(dataSource) {
	        this._dataSource = dataSource;
	        this._nodesById = undefined;
	        if (dataSource instanceof Array) {
	            this._viewSequence = new ViewSequence(dataSource);
	        } else if (dataSource instanceof ViewSequence) {
	            this._viewSequence = dataSource;
	        } else if (dataSource instanceof Object){
	            this._nodesById = dataSource;
	        }
	        this._isDirty = true;
	        return this;
	    };

	    /**
	     * Get the data-source.
	     *
	     * @return {Array|ViewSequence|Object} data-source
	     */
	    LayoutController.prototype.getDataSource = function() {
	        return this._dataSource;
	    };

	    /**
	     * Set the new layout.
	     *
	     * @param {Function|Object} layout Layout function or layout-literal
	     * @param {Object} [options] Options to pass in to the layout-function
	     * @return {LayoutController} this
	     */
	    LayoutController.prototype.setLayout = function(layout, options) {

	        // Set new layout funtion
	        if (layout instanceof Function) {
	            this._layout.function = layout;
	            this._layout.capabilities = layout.Capabilities;
	            this._layout.literal = undefined;

	        // If the layout is an object, treat it as a layout-literal
	        } else if (layout instanceof Object) {
	            this._layout.literal = layout;
	            this._layout.capabilities = undefined; // todo - derive from literal somehow?
	            var helperName = Object.keys(layout)[0];
	            var Helper = LayoutUtility.getRegisteredHelper(helperName);
	            this._layout.function = Helper ? function(context, options) {
	                var helper = new Helper(context, options);
	                helper.parse(layout[helperName]);
	            } : undefined;
	        }
	        else {
	            this._layout.function = undefined;
	            this._layout.capabilities = undefined;
	            this._layout.literal = undefined;
	        }

	        // Update options
	        if (options) {
	            this.setLayoutOptions(options);
	        }

	        // Update direction
	        this.setDirection(this._configuredDirection);
	        this._isDirty = true;
	        return this;
	    };

	    /**
	     * Get the current layout.
	     *
	     * @return {Function|Object} Layout function or layout literal
	     */
	    LayoutController.prototype.getLayout = function() {
	        return this._layout.literal || this._layout.function;
	    };

	    /**
	     * Set the options for the current layout. Use this function after
	     * `setLayout` to update one or more options for the layout-function.
	     *
	     * @param {Object} [options] Options to pass in to the layout-function
	     * @return {LayoutController} this
	     */
	    LayoutController.prototype.setLayoutOptions = function(options) {
	        this._layout.optionsManager.setOptions(options);
	        return this;
	    };

	    /**
	     * Get the current layout options.
	     *
	     * @return {Object} Layout options
	     */
	    LayoutController.prototype.getLayoutOptions = function() {
	        return this._layout.options;
	    };

	    /**
	     * Calculates the actual in-use direction based on the given direction
	     * and supported capabilities of the layout-function.
	     */
	    function _getActualDirection(direction) {

	        // When the direction is configured in the capabilities, look it up there
	        if (this._layout.capabilities && this._layout.capabilities.direction) {

	            // Multiple directions are supported
	            if (Array.isArray(this._layout.capabilities.direction)) {
	                for (var i = 0; i < this._layout.capabilities.direction.length; i++) {
	                    if (this._layout.capabilities.direction[i] === direction) {
	                        return direction;
	                    }
	                }
	                return this._layout.capabilities.direction[0];
	            }

	            // Only one direction is supported, we must use that
	            else {
	                return this._layout.capabilities.direction;
	            }
	        }

	        // Use Y-direction as a fallback
	        return (direction === undefined) ? Utility.Direction.Y : direction;
	    }

	    /**
	     * Set the direction of the layout. When no direction is set, the default
	     * direction of the layout function is used.
	     *
	     * @param {Utility.Direction} direction Direction (e.g. Utility.Direction.X)
	     * @return {LayoutController} this
	     */
	    LayoutController.prototype.setDirection = function(direction) {
	        this._configuredDirection = direction;
	        var newDirection = _getActualDirection.call(this, direction);
	        if (newDirection !== this._direction) {
	            this._direction = newDirection;
	            this._isDirty = true;
	        }
	    };

	    /**
	     * Get the direction (e.g. Utility.Direction.Y). By default, this function
	     * returns the direction that was configured by setting `setDirection`. When
	     * the direction has not been set, `undefined` is returned.
	     *
	     * When no direction has been set, the first direction is used that is specified
	     * in the capabilities of the layout-function. To obtain the actual in-use direction,
	     * use `getDirection(true)`. This method returns the actual in-use direction and
	     * never returns undefined.
	     *
	     * @param {Boolean} [actual] Set to true to obtain the actual in-use direction
	     * @return {Utility.Direction} Direction or undefined
	     */
	    LayoutController.prototype.getDirection = function(actual) {
	        return actual ? this._direction : this._configuredDirection;
	    };

	    /**
	     * Get the spec (size, transform, etc..) for the given renderable or
	     * Id.
	     *
	     * @param {Renderable|String} node Renderabe or Id to look for
	     * @return {Spec} spec or undefined
	     */
	    LayoutController.prototype.getSpec = function(node) {
	        if (!node) {
	            return undefined;
	        }
	        if ((node instanceof String) || (typeof node === 'string')) {
	            if (!this._nodesById) {
	               return undefined;
	            }
	            node = this._nodesById[node];
	            if (!node) {
	                return undefined;
	            }

	            // If the result was an array, return that instead
	            if (node instanceof Array) {
	                return node;
	            }
	        }
	        for (var i = 0; i < this._commitOutput.target.length; i++) {
	            var spec = this._commitOutput.target[i];
	            if (spec.renderNode === node) {
	                return spec;
	            }
	        }
	        return undefined;
	    };

	    /**
	     * Forces a reflow of the layout the next render cycle.
	     *
	     * @return {LayoutController} this
	     */
	    LayoutController.prototype.reflowLayout = function() {
	        this._isDirty = true;
	        return this;
	    };

	    /**
	     * Inserts a renderable into the data-source.
	     *
	     * The optional argument `insertSpec` is only used by 'FlowLayoutController' and
	     * `ScrollLayoutController`. When specified, the renderable is inserted using an
	     * animation starting with size, origin, opacity, transform, etc... as specified
	     * in `insertSpec'.
	     *
	     * @param {Number|String} indexOrId Index within dataSource array or id (String)
	     * @param {Object} renderable Renderable to add to the data-source
	     * @param {Spec} [insertSpec] Size, transform, etc.. to start with when inserting
	     * @return {FlowLayoutController} this
	     */
	    LayoutController.prototype.insert = function(indexOrId, renderable, insertSpec) {

	        // Add the renderable in case of an id (String)
	        if ((indexOrId instanceof String) || (typeof indexOrId === 'string')) {

	            // Create data-source if neccesary
	            if (this._dataSource === undefined) {
	                this._dataSource = {};
	                this._nodesById = this._dataSource;
	            }

	            // Insert renderable
	            this._nodesById[indexOrId] = renderable;
	        }

	        // Add the renderable using an index
	        else {

	            // Create data-source if neccesary
	            if (this._dataSource === undefined) {
	                this._dataSource = [];
	                this._viewSequence = new ViewSequence(this._dataSource);
	            }

	            // Using insert in this way, only works when the data-source is an array
	            if (!(this._dataSource instanceof Array)) {
	                LayoutUtility.error('LayoutController.insert(index) only works when the dataSource is an array');
	                return this;
	            }

	            // Insert into array
	            if (indexOrId < 0) {
	                this._dataSource.push(renderable);
	            }
	            else {
	                this._dataSource.splice(indexOrId, 0, renderable);
	            }
	        }

	        // When a custom insert-spec was specified, store that in the layout-node
	        if (insertSpec) {
	            this._nodes.insertNode(this._nodes.createNode(renderable, insertSpec));
	        }

	        // Force a reflow
	        this._isDirty = true;

	        return this;
	    };

	    /**
	     * Removes a renderable from the data-source.
	     *
	     * The optional argument `removeSpec` is only used by 'FlowLayoutController' and
	     * `ScrollLayoutController`. When specified, the renderable is removed using an
	     * animation ending at the size, origin, opacity, transform, etc... as specified
	     * in `removeSpec'.
	     *
	     * @param {Number|String} indexOrId Index within dataSource array or id (String)
	     * @param {Spec} [removeSpec] Size, transform, etc.. to end with when removing
	     * @return {LayoutController} this
	     */
	    LayoutController.prototype.remove = function(indexOrId, removeSpec) {

	        // Remove the renderable in case of an id (String)
	        var renderNode;
	        if ((indexOrId instanceof String) || (typeof indexOrId === 'string')) {

	            // Find and remove renderable from data-source
	            renderNode = this._nodesById[indexOrId];
	            if (renderNode) {
	                delete this._nodesById[indexOrId];
	            }
	        }

	        // Remove the renderable using an index
	        else {

	            // Using remove in this way, only works when the data-source is an array
	            if (!(this._dataSource instanceof Array)) {
	                LayoutUtility.error('LayoutController.remove(index) only works when the dataSource is an array');
	                return this;
	            }

	            // Remove from array
	            renderNode = this._dataSource.splice(indexOrId, 1)[0];
	        }

	        // When a custom remove-spec was specified, store that in the layout-node
	        if (renderNode && removeSpec) {
	            var node = this._nodes.getNodeByRenderNode(renderNode);
	            if (node) {
	                node.remove(removeSpec || this.options.removeSpec);
	            }
	        }

	        // Force a reflow
	        if (renderNode) {
	            this._isDirty = true;
	        }

	        return this;
	    };

	    /**
	     * Return size of contained element or `undefined` when size is not defined.
	     *
	     * @return {Array.Number} [width, height]
	     */
	    LayoutController.prototype.getSize = function() {
	        return this.options.size;
	    };

	    /**
	     * Generate a render spec from the contents of this component.
	     *
	     * @private
	     * @method render
	     * @return {Object} Render spec for this component
	     */
	    LayoutController.prototype.render = function render() {
	        return this.id;
	    };

	    /**
	     * Apply changes from this component to the corresponding document element.
	     * This includes changes to classes, styles, size, content, opacity, origin,
	     * and matrix transforms.
	     *
	     * @private
	     * @method commit
	     * @param {Context} context commit context
	     */
	    LayoutController.prototype.commit = function commit(context) {
	        var transform = context.transform;
	        var origin = context.origin;
	        var size = context.size;
	        var opacity = context.opacity;

	        // When the size or layout function has changed, reflow the layout
	        if (size[0] !== this._contextSizeCache[0] ||
	            size[1] !== this._contextSizeCache[1] ||
	            this._isDirty ||
	            this._nodes._trueSizeRequested){

	            // Emit start event
	            var eventData = {
	                target: this,
	                oldSize: this._contextSizeCache,
	                size: size,
	                dirty: this._isDirty,
	                trueSizeRequested: this._nodes._trueSizeRequested
	            };
	            this._eventOutput.emit('layoutstart', eventData);

	            // Update state
	            this._contextSizeCache[0] = size[0];
	            this._contextSizeCache[1] = size[1];
	            this._isDirty = false;

	            // Prepare for layout
	            var layoutContext = this._nodes.prepareForLayout(
	                this._viewSequence,     // first node to layout
	                this._nodesById, {      // so we can do fast id lookups
	                    size: size,
	                    direction: this._direction
	                }
	            );

	            // Layout objects
	            if (this._layout.function) {
	                this._layout.function(
	                    layoutContext,          // context which the layout-function can use
	                    this._layout.options    // additional layout-options
	                );
	            }

	            // Update output and optionally emit event
	            var result = this._nodes.buildSpecAndDestroyUnrenderedNodes();
	            this._commitOutput.target = result.specs;
	            if (result.modified || true) {
	                this._eventOutput.emit('reflow', {
	                    target: this
	                });
	            }

	            // Emit end event
	            this._eventOutput.emit('layoutend', eventData);
	        }

	        // Render child-nodes every commit
	        for (var i = 0; i < this._commitOutput.target.length; i++) {
	            this._commitOutput.target[i].target = this._commitOutput.target[i].renderNode.render();
	        }

	        // Return
	        if (size) {
	            transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);
	        }
	        this._commitOutput.size = size;
	        this._commitOutput.opacity = opacity;
	        this._commitOutput.transform = transform;
	        return this._commitOutput;
	    };

	    module.exports = LayoutController;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define*/

	/**
	 * Three part layout consiting of a top-header, bottom-footer and middle part.
	 *
	 * |options|type|description|
	 * |---|---|---|
	 * |`[headerHeight]`|Number|Height of the header|
	 * |`[footerHeight]`|Number|Height of the footer|
	 *
	 * Example:
	 *
	 * ```javascript
	 * var HeaderFooterLayout = require('famous-flex/layouts/HeaderFooterLayout');
	 *
	 * new LayoutController({
	 *   layout: HeaderFooterLayout,
	 *   layoutOptions: {
	 *     headerHeight: 60,    // header has height of 60 pixels
	 *     footerHeight: 20     // footer has height of 20 pixels
	 *   },
	 *   dataSource: {
	 *	   header: new Surface({content: 'This is the header surface'}),
	 *	   content: new Surface({content: 'This is the content surface'}),
	 *	   footer: new Surface({content: 'This is the footer surface'})
	 *   }
	 * })
	 * ```
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var LayoutDockHelper = __webpack_require__(48);

	    // Layout function
	    module.exports = function HeaderFooterLayout(context, options) {
	        var dock = new LayoutDockHelper(context);
	        dock.top('header', options.headerHeight);
	        dock.bottom('footer', options.footerHeight);
	        dock.fill('content');
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(10)
		// The css code:
		(__webpack_require__(18));
	// Hot Module Replacement
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"/* This Source Code Form is subject to the terms of the Mozilla Public\n * License, v. 2.0. If a copy of the MPL was not distributed with this\n * file, You can obtain one at http://mozilla.org/MPL/2.0/.\n *\n * Owner: mark@famo.us\n * @license MPL 2.0\n * @copyright Famous Industries, Inc. 2014\n */\n\n.famous-root {\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    padding: 0px;\n    overflow: hidden;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n}\n\n.famous-container, .famous-group {\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    right: 0px;\n    overflow: visible;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-backface-visibility: visible;\n    backface-visibility: visible;\n    pointer-events: none;\n}\n\n.famous-group {\n    width: 0px;\n    height: 0px;\n    margin: 0px;\n    padding: 0px;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n}\n\n.famous-surface {\n    position: absolute;\n    -webkit-transform-origin: center center;\n    transform-origin: center center;\n    -webkit-backface-visibility: hidden;\n    backface-visibility: hidden;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n    -webkit-tap-highlight-color: transparent;\n    pointer-events: auto;\n}\n\n.famous-container-group {\n    position: relative;\n    width: 100%;\n    height: 100%;\n}\n";

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * The singleton object initiated upon process
	     *   startup which manages all active Context instances, runs
	     *   the render dispatch loop, and acts as a listener and dispatcher
	     *   for events.  All methods are therefore static.
	     *
	     *   On static initialization, window.requestAnimationFrame is called with
	     *     the event loop function.
	     *
	     *   Note: Any window in which Engine runs will prevent default
	     *     scrolling behavior on the 'touchmove' event.
	     *
	     * @static
	     * @class Engine
	     */
	    var Context = __webpack_require__(41);
	    var EventHandler = __webpack_require__(35);
	    var OptionsManager = __webpack_require__(38);

	    var Engine = {};

	    var contexts = [];
	    var nextTickQueue = [];
	    var deferQueue = [];

	    var lastTime = Date.now();
	    var frameTime;
	    var frameTimeLimit;
	    var loopEnabled = true;
	    var eventForwarders = {};
	    var eventHandler = new EventHandler();

	    var options = {
	        containerType: 'div',
	        containerClass: 'famous-container',
	        fpsCap: undefined,
	        runLoop: true,
	        appMode: true
	    };
	    var optionsManager = new OptionsManager(options);

	    /** @const */
	    var MAX_DEFER_FRAME_TIME = 10;

	    /**
	     * Inside requestAnimationFrame loop, step() is called, which:
	     *   calculates current FPS (throttling loop if it is over limit set in setFPSCap),
	     *   emits dataless 'prerender' event on start of loop,
	     *   calls in order any one-shot functions registered by nextTick on last loop,
	     *   calls Context.update on all Context objects registered,
	     *   and emits dataless 'postrender' event on end of loop.
	     *
	     * @static
	     * @private
	     * @method step
	     */
	    Engine.step = function step() {
	        var currentTime = Date.now();

	        // skip frame if we're over our framerate cap
	        if (frameTimeLimit && currentTime - lastTime < frameTimeLimit) return;

	        var i = 0;

	        frameTime = currentTime - lastTime;
	        lastTime = currentTime;

	        eventHandler.emit('prerender');

	        // empty the queue
	        for (i = 0; i < nextTickQueue.length; i++) nextTickQueue[i].call(this);
	        nextTickQueue.splice(0);

	        // limit total execution time for deferrable functions
	        while (deferQueue.length && (Date.now() - currentTime) < MAX_DEFER_FRAME_TIME) {
	            deferQueue.shift().call(this);
	        }

	        for (i = 0; i < contexts.length; i++) contexts[i].update();

	        eventHandler.emit('postrender');
	    };

	    // engage requestAnimationFrame
	    function loop() {
	        if (options.runLoop) {
	            Engine.step();
	            window.requestAnimationFrame(loop);
	        }
	        else loopEnabled = false;
	    }
	    window.requestAnimationFrame(loop);

	    //
	    // Upon main document window resize (unless on an "input" HTML element):
	    //   scroll to the top left corner of the window,
	    //   and for each managed Context: emit the 'resize' event and update its size.
	    // @param {Object=} event document event
	    //
	    function handleResize(event) {
	        for (var i = 0; i < contexts.length; i++) {
	            contexts[i].emit('resize');
	        }
	        eventHandler.emit('resize');
	    }
	    window.addEventListener('resize', handleResize, false);
	    handleResize();

	    /**
	     * Initialize famous for app mode
	     *
	     * @static
	     * @private
	     * @method initialize
	     */
	    function initialize() {
	        // prevent scrolling via browser
	        window.addEventListener('touchmove', function(event) {
	            event.preventDefault();
	        }, true);
	        document.body.classList.add('famous-root');
	        document.documentElement.classList.add('famous-root');
	    }
	    var initialized = false;

	    /**
	     * Add event handler object to set of downstream handlers.
	     *
	     * @method pipe
	     *
	     * @param {EventHandler} target event handler target object
	     * @return {EventHandler} passed event handler
	     */
	    Engine.pipe = function pipe(target) {
	        if (target.subscribe instanceof Function) return target.subscribe(Engine);
	        else return eventHandler.pipe(target);
	    };

	    /**
	     * Remove handler object from set of downstream handlers.
	     *   Undoes work of "pipe".
	     *
	     * @method unpipe
	     *
	     * @param {EventHandler} target target handler object
	     * @return {EventHandler} provided target
	     */
	    Engine.unpipe = function unpipe(target) {
	        if (target.unsubscribe instanceof Function) return target.unsubscribe(Engine);
	        else return eventHandler.unpipe(target);
	    };

	    /**
	     * Bind a callback function to an event type handled by this object.
	     *
	     * @static
	     * @method "on"
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {function(string, Object)} handler callback
	     * @return {EventHandler} this
	     */
	    Engine.on = function on(type, handler) {
	        if (!(type in eventForwarders)) {
	            eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);
	            if (document.body) {
	                document.body.addEventListener(type, eventForwarders[type]);
	            }
	            else {
	                Engine.nextTick(function(type, forwarder) {
	                    document.body.addEventListener(type, forwarder);
	                }.bind(this, type, eventForwarders[type]));
	            }
	        }
	        return eventHandler.on(type, handler);
	    };

	    /**
	     * Trigger an event, sending to all downstream handlers
	     *   listening for provided 'type' key.
	     *
	     * @method emit
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {Object} event event data
	     * @return {EventHandler} this
	     */
	    Engine.emit = function emit(type, event) {
	        return eventHandler.emit(type, event);
	    };

	    /**
	     * Unbind an event by type and handler.
	     *   This undoes the work of "on".
	     *
	     * @static
	     * @method removeListener
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {function} handler function object to remove
	     * @return {EventHandler} internal event handler object (for chaining)
	     */
	    Engine.removeListener = function removeListener(type, handler) {
	        return eventHandler.removeListener(type, handler);
	    };

	    /**
	     * Return the current calculated frames per second of the Engine.
	     *
	     * @static
	     * @method getFPS
	     *
	     * @return {Number} calculated fps
	     */
	    Engine.getFPS = function getFPS() {
	        return 1000 / frameTime;
	    };

	    /**
	     * Set the maximum fps at which the system should run. If internal render
	     *    loop is called at a greater frequency than this FPSCap, Engine will
	     *    throttle render and update until this rate is achieved.
	     *
	     * @static
	     * @method setFPSCap
	     *
	     * @param {Number} fps maximum frames per second
	     */
	    Engine.setFPSCap = function setFPSCap(fps) {
	        frameTimeLimit = Math.floor(1000 / fps);
	    };

	    /**
	     * Return engine options.
	     *
	     * @static
	     * @method getOptions
	     * @param {string} key
	     * @return {Object} engine options
	     */
	    Engine.getOptions = function getOptions(key) {
	        return optionsManager.getOptions(key);
	    };

	    /**
	     * Set engine options
	     *
	     * @static
	     * @method setOptions
	     *
	     * @param {Object} [options] overrides of default options
	     * @param {Number} [options.fpsCap]  maximum fps at which the system should run
	     * @param {boolean} [options.runLoop=true] whether the run loop should continue
	     * @param {string} [options.containerType="div"] type of container element.  Defaults to 'div'.
	     * @param {string} [options.containerClass="famous-container"] type of container element.  Defaults to 'famous-container'.
	     */
	    Engine.setOptions = function setOptions(options) {
	        return optionsManager.setOptions.apply(optionsManager, arguments);
	    };

	    /**
	     * Creates a new Context for rendering and event handling with
	     *    provided document element as top of each tree. This will be tracked by the
	     *    process-wide Engine.
	     *
	     * @static
	     * @method createContext
	     *
	     * @param {Node} el will be top of Famo.us document element tree
	     * @return {Context} new Context within el
	     */
	    Engine.createContext = function createContext(el) {
	        if (!initialized && options.appMode) Engine.nextTick(initialize);

	        var needMountContainer = false;
	        if (!el) {
	            el = document.createElement(options.containerType);
	            el.classList.add(options.containerClass);
	            needMountContainer = true;
	        }
	        var context = new Context(el);
	        Engine.registerContext(context);
	        if (needMountContainer) {
	            Engine.nextTick(function(context, el) {
	                document.body.appendChild(el);
	                context.emit('resize');
	            }.bind(this, context, el));
	        }
	        return context;
	    };

	    /**
	     * Registers an existing context to be updated within the run loop.
	     *
	     * @static
	     * @method registerContext
	     *
	     * @param {Context} context Context to register
	     * @return {FamousContext} provided context
	     */
	    Engine.registerContext = function registerContext(context) {
	        contexts.push(context);
	        return context;
	    };

	    /**
	     * Returns a list of all contexts.
	     *
	     * @static
	     * @method getContexts
	     * @return {Array} contexts that are updated on each tick
	     */
	    Engine.getContexts = function getContexts() {
	        return contexts;
	    };

	    /**
	     * Removes a context from the run loop. Note: this does not do any
	     *     cleanup.
	     *
	     * @static
	     * @method deregisterContext
	     *
	     * @param {Context} context Context to deregister
	     */
	    Engine.deregisterContext = function deregisterContext(context) {
	        var i = contexts.indexOf(context);
	        if (i >= 0) contexts.splice(i, 1);
	    };

	    /**
	     * Queue a function to be executed on the next tick of the
	     *    Engine.
	     *
	     * @static
	     * @method nextTick
	     *
	     * @param {function(Object)} fn function accepting window object
	     */
	    Engine.nextTick = function nextTick(fn) {
	        nextTickQueue.push(fn);
	    };

	    /**
	     * Queue a function to be executed sometime soon, at a time that is
	     *    unlikely to affect frame rate.
	     *
	     * @static
	     * @method defer
	     *
	     * @param {Function} fn
	     */
	    Engine.defer = function defer(fn) {
	        deferQueue.push(fn);
	    };

	    optionsManager.on('change', function(data) {
	        if (data.id === 'fpsCap') Engine.setFPSCap(data.value);
	        else if (data.id === 'runLoop') {
	            // kick off the loop only if it was stopped
	            if (!loopEnabled && data.value) {
	                loopEnabled = true;
	                window.requestAnimationFrame(loop);
	            }
	        }
	    });

	    module.exports = Engine;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * Helper object used to iterate through items sequentially. Used in
	     *   views that deal with layout.  A ViewSequence object conceptually points
	     *   to a node in a linked list.
	     *
	     * @class ViewSequence
	     *
	     * @constructor
	     * @param {Object|Array} options Options object, or content array.
	     * @param {Number} [options.index] starting index.
	     * @param {Number} [options.array] Array of elements to populate the ViewSequence
	     * @param {Object} [options._] Optional backing store (internal
	     * @param {Boolean} [options.loop] Whether to wrap when accessing elements just past the end
	     *   (or beginning) of the sequence.
	     */
	    function ViewSequence(options) {
	        if (!options) options = [];
	        if (options instanceof Array) options = {array: options};

	        this._ = null;
	        this.index = options.index || 0;

	        if (options.array) this._ = new (this.constructor.Backing)(options.array);
	        else if (options._) this._ = options._;

	        if (this.index === this._.firstIndex) this._.firstNode = this;
	        if (this.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = this;

	        if (options.loop !== undefined) this._.loop = options.loop;

	        if (options.trackSize !== undefined) this._.trackSize = options.trackSize;

	        this._previousNode = null;
	        this._nextNode = null;
	    }

	    // constructor for internal storage
	    ViewSequence.Backing = function Backing(array) {
	        this.array = array;
	        this.firstIndex = 0;
	        this.loop = false;
	        this.firstNode = null;
	        this.lastNode = null;
	        this.cumulativeSizes = [[0, 0]];
	        this.sizeDirty = true;
	        this.trackSize = false;
	    };

	    // Get value "i" slots away from the first index.
	    ViewSequence.Backing.prototype.getValue = function getValue(i) {
	        var _i = i - this.firstIndex;
	        if (_i < 0 || _i >= this.array.length) return null;
	        return this.array[_i];
	    };

	    // Set value "i" slots away from the first index.
	    ViewSequence.Backing.prototype.setValue = function setValue(i, value) {
	        this.array[i - this.firstIndex] = value;
	    };

	    // Get sequence size from backing up to index
	    // TODO: remove from viewSequence with proper abstraction
	    ViewSequence.Backing.prototype.getSize = function getSize(index) {
	        return this.cumulativeSizes[index];
	    };

	    // Calculates cumulative size
	    // TODO: remove from viewSequence with proper abstraction
	    ViewSequence.Backing.prototype.calculateSize = function calculateSize(index) {
	        index = index || this.array.length;
	        var size = [0, 0];
	        for (var i = 0; i < index; i++) {
	            var nodeSize = this.array[i].getSize();
	            if (!nodeSize) return undefined;
	            if (size[0] !== undefined) {
	                if (nodeSize[0] === undefined) size[0] = undefined;
	                else size[0] += nodeSize[0];
	            }
	            if (size[1] !== undefined) {
	                if (nodeSize[1] === undefined) size[1] = undefined;
	                else size[1] += nodeSize[1];
	            }
	            this.cumulativeSizes[i + 1] = size.slice();
	        }
	        this.sizeDirty = false;
	        return size;
	    };

	    // After splicing into the backing store, restore the indexes of each node correctly.
	    ViewSequence.Backing.prototype.reindex = function reindex(start, removeCount, insertCount) {
	        if (!this.array[0]) return;

	        var i = 0;
	        var index = this.firstIndex;
	        var indexShiftAmount = insertCount - removeCount;
	        var node = this.firstNode;

	        // find node to begin
	        while (index < start - 1) {
	            node = node.getNext();
	            index++;
	        }
	        // skip removed nodes
	        var spliceStartNode = node;
	        for (i = 0; i < removeCount; i++) {
	            node = node.getNext();
	            if (node) node._previousNode = spliceStartNode;
	        }
	        var spliceResumeNode = node ? node.getNext() : null;
	        // generate nodes for inserted items
	        spliceStartNode._nextNode = null;
	        node = spliceStartNode;
	        for (i = 0; i < insertCount; i++) node = node.getNext();
	        index += insertCount;
	        // resume the chain
	        if (node !== spliceResumeNode) {
	            node._nextNode = spliceResumeNode;
	            if (spliceResumeNode) spliceResumeNode._previousNode = node;
	        }
	        if (spliceResumeNode) {
	            node = spliceResumeNode;
	            index++;
	            while (node && index < this.array.length + this.firstIndex) {
	                if (node._nextNode) node.index += indexShiftAmount;
	                else node.index = index;
	                node = node.getNext();
	                index++;
	            }
	        }
	        if (this.trackSize) this.sizeDirty = true;
	    };

	    /**
	     * Return ViewSequence node previous to this node in the list, respecting looping if applied.
	     *
	     * @method getPrevious
	     * @return {ViewSequence} previous node.
	     */
	    ViewSequence.prototype.getPrevious = function getPrevious() {
	        var len = this._.array.length;
	        if (!len) {
	            this._previousNode = null;
	        }
	        else if (this.index === this._.firstIndex) {
	            if (this._.loop) {
	                this._previousNode = this._.lastNode || new (this.constructor)({_: this._, index: this._.firstIndex + len - 1});
	                this._previousNode._nextNode = this;
	            }
	            else {
	                this._previousNode = null;
	            }
	        }
	        else if (!this._previousNode) {
	            this._previousNode = new (this.constructor)({_: this._, index: this.index - 1});
	            this._previousNode._nextNode = this;
	        }
	        return this._previousNode;
	    };

	    /**
	     * Return ViewSequence node next after this node in the list, respecting looping if applied.
	     *
	     * @method getNext
	     * @return {ViewSequence} previous node.
	     */
	    ViewSequence.prototype.getNext = function getNext() {
	        var len = this._.array.length;
	        if (!len) {
	            this._nextNode = null;
	        }
	        else if (this.index === this._.firstIndex + len - 1) {
	            if (this._.loop) {
	                this._nextNode = this._.firstNode || new (this.constructor)({_: this._, index: this._.firstIndex});
	                this._nextNode._previousNode = this;
	            }
	            else {
	                this._nextNode = null;
	            }
	        }
	        else if (!this._nextNode) {
	            this._nextNode = new (this.constructor)({_: this._, index: this.index + 1});
	            this._nextNode._previousNode = this;
	        }
	        return this._nextNode;
	    };

	    /**
	     * Return index of the provided item in the backing array
	     *
	     * @method indexOf
	     * @return {Number} index or -1 if not found
	     */
	    ViewSequence.prototype.indexOf = function indexOf(item) {
	        return this._.array.indexOf(item);
	    };

	    /**
	     * Return index of this ViewSequence node.
	     *
	     * @method getIndex
	     * @return {Number} index
	     */
	    ViewSequence.prototype.getIndex = function getIndex() {
	        return this.index;
	    };

	    /**
	     * Return printable version of this ViewSequence node.
	     *
	     * @method toString
	     * @return {string} this index as a string
	     */
	    ViewSequence.prototype.toString = function toString() {
	        return '' + this.index;
	    };

	    /**
	     * Add one or more objects to the beginning of the sequence.
	     *
	     * @method unshift
	     * @param {...Object} value arguments array of objects
	     */
	    ViewSequence.prototype.unshift = function unshift(value) {
	        this._.array.unshift.apply(this._.array, arguments);
	        this._.firstIndex -= arguments.length;
	        if (this._.trackSize) this._.sizeDirty = true;
	    };

	    /**
	     * Add one or more objects to the end of the sequence.
	     *
	     * @method push
	     * @param {...Object} value arguments array of objects
	     */
	    ViewSequence.prototype.push = function push(value) {
	        this._.array.push.apply(this._.array, arguments);
	        if (this._.trackSize) this._.sizeDirty = true;
	    };

	    /**
	     * Remove objects from the sequence
	     *
	     * @method splice
	     * @param {Number} index starting index for removal
	     * @param {Number} howMany how many elements to remove
	     * @param {...Object} value arguments array of objects
	     */
	    ViewSequence.prototype.splice = function splice(index, howMany) {
	        var values = Array.prototype.slice.call(arguments, 2);
	        this._.array.splice.apply(this._.array, [index - this._.firstIndex, howMany].concat(values));
	        this._.reindex(index, howMany, values.length);
	    };

	    /**
	     * Exchange this element's sequence position with another's.
	     *
	     * @method swap
	     * @param {ViewSequence} other element to swap with.
	     */
	    ViewSequence.prototype.swap = function swap(other) {
	        var otherValue = other.get();
	        var myValue = this.get();
	        this._.setValue(this.index, otherValue);
	        this._.setValue(other.index, myValue);

	        var myPrevious = this._previousNode;
	        var myNext = this._nextNode;
	        var myIndex = this.index;
	        var otherPrevious = other._previousNode;
	        var otherNext = other._nextNode;
	        var otherIndex = other.index;

	        this.index = otherIndex;
	        this._previousNode = (otherPrevious === this) ? other : otherPrevious;
	        if (this._previousNode) this._previousNode._nextNode = this;
	        this._nextNode = (otherNext === this) ? other : otherNext;
	        if (this._nextNode) this._nextNode._previousNode = this;

	        other.index = myIndex;
	        other._previousNode = (myPrevious === other) ? this : myPrevious;
	        if (other._previousNode) other._previousNode._nextNode = other;
	        other._nextNode = (myNext === other) ? this : myNext;
	        if (other._nextNode) other._nextNode._previousNode = other;

	        if (this.index === this._.firstIndex) this._.firstNode = this;
	        else if (this.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = this;
	        if (other.index === this._.firstIndex) this._.firstNode = other;
	        else if (other.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = other;
	        if (this._.trackSize) this._.sizeDirty = true;
	    };

	   /**
	     * Return value of this ViewSequence node.
	     *
	     * @method get
	     * @return {Object} value of thiss
	     */
	    ViewSequence.prototype.get = function get() {
	        return this._.getValue(this.index);
	    };

	   /**
	     * Call getSize() on the contained View.
	     *
	     * @method getSize
	     * @return {Array.Number} [width, height]
	     */
	    ViewSequence.prototype.getSize = function getSize() {
	        var target = this.get();
	        return target ? target.getSize() : null;
	    };

	    /**
	     * Generate a render spec from the contents of this component.
	     * Specifically, this will render the value at the current index.
	     * @private
	     * @method render
	     * @return {number} Render spec for this component
	     */
	    ViewSequence.prototype.render = function render() {
	        if (this._.trackSize && this._.sizeDirty) this._.calculateSize();
	        var target = this.get();
	        return target ? target.render.apply(target, arguments) : null;
	    };

	    module.exports = ViewSequence;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var ElementOutput = __webpack_require__(40);

	    /**
	     * A base class for viewable content and event
	     *   targets inside a Famo.us application, containing a renderable document
	     *   fragment. Like an HTML div, it can accept internal markup,
	     *   properties, classes, and handle events.
	     *
	     * @class Surface
	     * @constructor
	     *
	     * @param {Object} [options] default option overrides
	     * @param {Array.Number} [options.size] [width, height] in pixels
	     * @param {Array.string} [options.classes] CSS classes to set on target div
	     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
	     * @param {string} [options.content] inner (HTML) content of surface
	     */
	    function Surface(options) {
	        ElementOutput.call(this);

	        this.options = {};

	        this.properties = {};
	        this.attributes = {};
	        this.content = '';
	        this.classList = [];
	        this.size = null;

	        this._classesDirty = true;
	        this._stylesDirty = true;
	        this._attributesDirty = true;
	        this._sizeDirty = true;
	        this._contentDirty = true;
	        this._trueSizeCheck = true;

	        this._dirtyClasses = [];

	        if (options) this.setOptions(options);

	        this._currentTarget = null;
	    }
	    Surface.prototype = Object.create(ElementOutput.prototype);
	    Surface.prototype.constructor = Surface;
	    Surface.prototype.elementType = 'div';
	    Surface.prototype.elementClass = 'famous-surface';

	    /**
	     * Set HTML attributes on this Surface. Note that this will cause
	     *    dirtying and thus re-rendering, even if values do not change.
	     *
	     * @method setAttributes
	    * @param {Object} attributes property dictionary of "key" => "value"
	     */
	    Surface.prototype.setAttributes = function setAttributes(attributes) {
	        for (var n in attributes) {
	            if (n === 'style') throw new Error('Cannot set styles via "setAttributes" as it will break Famo.us.  Use "setProperties" instead.');
	            this.attributes[n] = attributes[n];
	        }
	        this._attributesDirty = true;
	    };

	    /**
	     * Get HTML attributes on this Surface.
	     *
	     * @method getAttributes
	     *
	     * @return {Object} Dictionary of this Surface's attributes.
	     */
	    Surface.prototype.getAttributes = function getAttributes() {
	        return this.attributes;
	    };

	    /**
	     * Set CSS-style properties on this Surface. Note that this will cause
	     *    dirtying and thus re-rendering, even if values do not change.
	     *
	     * @method setProperties
	     * @chainable
	     * @param {Object} properties property dictionary of "key" => "value"
	     */
	    Surface.prototype.setProperties = function setProperties(properties) {
	        for (var n in properties) {
	            this.properties[n] = properties[n];
	        }
	        this._stylesDirty = true;
	        return this;
	    };

	    /**
	     * Get CSS-style properties on this Surface.
	     *
	     * @method getProperties
	     *
	     * @return {Object} Dictionary of this Surface's properties.
	     */
	    Surface.prototype.getProperties = function getProperties() {
	        return this.properties;
	    };

	    /**
	     * Add CSS-style class to the list of classes on this Surface. Note
	     *   this will map directly to the HTML property of the actual
	     *   corresponding rendered <div>.
	     *
	     * @method addClass
	     * @chainable
	     * @param {string} className name of class to add
	     */
	    Surface.prototype.addClass = function addClass(className) {
	        if (this.classList.indexOf(className) < 0) {
	            this.classList.push(className);
	            this._classesDirty = true;
	        }
	        return this;
	    };

	    /**
	     * Remove CSS-style class from the list of classes on this Surface.
	     *   Note this will map directly to the HTML property of the actual
	     *   corresponding rendered <div>.
	     *
	     * @method removeClass
	     * @chainable
	     * @param {string} className name of class to remove
	     */
	    Surface.prototype.removeClass = function removeClass(className) {
	        var i = this.classList.indexOf(className);
	        if (i >= 0) {
	            this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
	            this._classesDirty = true;
	        }
	        return this;
	    };

	    /**
	     * Toggle CSS-style class from the list of classes on this Surface.
	     *   Note this will map directly to the HTML property of the actual
	     *   corresponding rendered <div>.
	     *
	     * @method toggleClass
	     * @param {string} className name of class to toggle
	     */
	    Surface.prototype.toggleClass = function toggleClass(className) {
	        var i = this.classList.indexOf(className);
	        if (i >= 0) {
	            this.removeClass(className);
	        } else {
	            this.addClass(className);
	        }
	        return this;
	    };

	    /**
	     * Reset class list to provided dictionary.
	     * @method setClasses
	     * @chainable
	     * @param {Array.string} classList
	     */
	    Surface.prototype.setClasses = function setClasses(classList) {
	        var i = 0;
	        var removal = [];
	        for (i = 0; i < this.classList.length; i++) {
	            if (classList.indexOf(this.classList[i]) < 0) removal.push(this.classList[i]);
	        }
	        for (i = 0; i < removal.length; i++) this.removeClass(removal[i]);
	        // duplicates are already checked by addClass()
	        for (i = 0; i < classList.length; i++) this.addClass(classList[i]);
	        return this;
	    };

	    /**
	     * Get array of CSS-style classes attached to this div.
	     *
	     * @method getClasslist
	     * @return {Array.string} array of class names
	     */
	    Surface.prototype.getClassList = function getClassList() {
	        return this.classList;
	    };

	    /**
	     * Set or overwrite inner (HTML) content of this surface. Note that this
	     *    causes a re-rendering if the content has changed.
	     *
	     * @method setContent
	     * @chainable
	     * @param {string|Document Fragment} content HTML content
	     */
	    Surface.prototype.setContent = function setContent(content) {
	        if (this.content !== content) {
	            this.content = content;
	            this._contentDirty = true;
	        }
	        return this;
	    };

	    /**
	     * Return inner (HTML) content of this surface.
	     *
	     * @method getContent
	     *
	     * @return {string} inner (HTML) content
	     */
	    Surface.prototype.getContent = function getContent() {
	        return this.content;
	    };

	    /**
	     * Set options for this surface
	     *
	     * @method setOptions
	     * @chainable
	     * @param {Object} [options] overrides for default options.  See constructor.
	     */
	    Surface.prototype.setOptions = function setOptions(options) {
	        if (options.size) this.setSize(options.size);
	        if (options.classes) this.setClasses(options.classes);
	        if (options.properties) this.setProperties(options.properties);
	        if (options.attributes) this.setAttributes(options.attributes);
	        if (options.content) this.setContent(options.content);
	        return this;
	    };

	    //  Apply to document all changes from removeClass() since last setup().
	    function _cleanupClasses(target) {
	        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
	        this._dirtyClasses = [];
	    }

	    // Apply values of all Famous-managed styles to the document element.
	    //  These will be deployed to the document on call to #setup().
	    function _applyStyles(target) {
	        for (var n in this.properties) {
	            target.style[n] = this.properties[n];
	        }
	    }

	    // Clear all Famous-managed styles from the document element.
	    // These will be deployed to the document on call to #setup().
	    function _cleanupStyles(target) {
	        for (var n in this.properties) {
	            target.style[n] = '';
	        }
	    }

	    // Apply values of all Famous-managed attributes to the document element.
	    //  These will be deployed to the document on call to #setup().
	    function _applyAttributes(target) {
	        for (var n in this.attributes) {
	            target.setAttribute(n, this.attributes[n]);
	        }
	    }

	    // Clear all Famous-managed attributes from the document element.
	    // These will be deployed to the document on call to #setup().
	    function _cleanupAttributes(target) {
	        for (var n in this.attributes) {
	            target.removeAttribute(n);
	        }
	    }

	    function _xyNotEquals(a, b) {
	        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
	    }

	    /**
	     * One-time setup for an element to be ready for commits to document.
	     *
	     * @private
	     * @method setup
	     *
	     * @param {ElementAllocator} allocator document element pool for this context
	     */
	    Surface.prototype.setup = function setup(allocator) {
	        var target = allocator.allocate(this.elementType);
	        if (this.elementClass) {
	            if (this.elementClass instanceof Array) {
	                for (var i = 0; i < this.elementClass.length; i++) {
	                    target.classList.add(this.elementClass[i]);
	                }
	            }
	            else {
	                target.classList.add(this.elementClass);
	            }
	        }
	        target.style.display = '';
	        this.attach(target);
	        this._opacity = null;
	        this._currentTarget = target;
	        this._stylesDirty = true;
	        this._classesDirty = true;
	        this._attributesDirty = true;
	        this._sizeDirty = true;
	        this._contentDirty = true;
	        this._originDirty = true;
	        this._transformDirty = true;
	    };

	    /**
	     * Apply changes from this component to the corresponding document element.
	     * This includes changes to classes, styles, size, content, opacity, origin,
	     * and matrix transforms.
	     *
	     * @private
	     * @method commit
	     * @param {Context} context commit context
	     */
	    Surface.prototype.commit = function commit(context) {
	        if (!this._currentTarget) this.setup(context.allocator);
	        var target = this._currentTarget;
	        var size = context.size;

	        if (this._classesDirty) {
	            _cleanupClasses.call(this, target);
	            var classList = this.getClassList();
	            for (var i = 0; i < classList.length; i++) target.classList.add(classList[i]);
	            this._classesDirty = false;
	            this._trueSizeCheck = true;
	        }

	        if (this._stylesDirty) {
	            _applyStyles.call(this, target);
	            this._stylesDirty = false;
	            this._trueSizeCheck = true;
	        }

	        if (this._attributesDirty) {
	            _applyAttributes.call(this, target);
	            this._attributesDirty = false;
	            this._trueSizeCheck = true;
	        }

	        if (this.size) {
	            var origSize = context.size;
	            size = [this.size[0], this.size[1]];
	            if (size[0] === undefined) size[0] = origSize[0];
	            if (size[1] === undefined) size[1] = origSize[1];
	            if (size[0] === true || size[1] === true) {
	                if (size[0] === true && (this._trueSizeCheck || this._size[0] === 0)) {
	                    var width = target.offsetWidth;
	                    if (this._size && this._size[0] !== width) {
	                        this._size[0] = width;
	                        this._sizeDirty = true;
	                    }
	                    size[0] = width;
	                } else {
	                    if (this._size) size[0] = this._size[0];
	                }
	                if (size[1] === true && (this._trueSizeCheck || this._size[1] === 0)) {
	                    var height = target.offsetHeight;
	                    if (this._size && this._size[1] !== height) {
	                        this._size[1] = height;
	                        this._sizeDirty = true;
	                    }
	                    size[1] = height;
	                } else {
	                    if (this._size) size[1] = this._size[1];
	                }
	                this._trueSizeCheck = false;
	            }
	        }

	        if (_xyNotEquals(this._size, size)) {
	            if (!this._size) this._size = [0, 0];
	            this._size[0] = size[0];
	            this._size[1] = size[1];

	            this._sizeDirty = true;
	        }

	        if (this._sizeDirty) {
	            if (this._size) {
	                target.style.width = (this.size && this.size[0] === true) ? '' : this._size[0] + 'px';
	                target.style.height = (this.size && this.size[1] === true) ?  '' : this._size[1] + 'px';
	            }

	            this._eventOutput.emit('resize');
	        }

	        if (this._contentDirty) {
	            this.deploy(target);
	            this._eventOutput.emit('deploy');
	            this._contentDirty = false;
	            this._trueSizeCheck = true;
	        }

	        ElementOutput.prototype.commit.call(this, context);
	    };

	    /**
	     *  Remove all Famous-relevant attributes from a document element.
	     *    This is called by SurfaceManager's detach().
	     *    This is in some sense the reverse of .deploy().
	     *
	     * @private
	     * @method cleanup
	     * @param {ElementAllocator} allocator
	     */
	    Surface.prototype.cleanup = function cleanup(allocator) {
	        var i = 0;
	        var target = this._currentTarget;
	        this._eventOutput.emit('recall');
	        this.recall(target);
	        target.style.display = 'none';
	        target.style.opacity = '';
	        target.style.width = '';
	        target.style.height = '';
	        _cleanupStyles.call(this, target);
	        _cleanupAttributes.call(this, target);
	        var classList = this.getClassList();
	        _cleanupClasses.call(this, target);
	        for (i = 0; i < classList.length; i++) target.classList.remove(classList[i]);
	        if (this.elementClass) {
	            if (this.elementClass instanceof Array) {
	                for (i = 0; i < this.elementClass.length; i++) {
	                    target.classList.remove(this.elementClass[i]);
	                }
	            }
	            else {
	                target.classList.remove(this.elementClass);
	            }
	        }
	        this.detach(target);
	        this._currentTarget = null;
	        allocator.deallocate(target);
	    };

	    /**
	     * Place the document element that this component manages into the document.
	     *
	     * @private
	     * @method deploy
	     * @param {Node} target document parent of this container
	     */
	    Surface.prototype.deploy = function deploy(target) {
	        var content = this.getContent();
	        if (content instanceof Node) {
	            while (target.hasChildNodes()) target.removeChild(target.firstChild);
	            target.appendChild(content);
	        }
	        else target.innerHTML = content;
	    };

	    /**
	     * Remove any contained document content associated with this surface
	     *   from the actual document.
	     *
	     * @private
	     * @method recall
	     */
	    Surface.prototype.recall = function recall(target) {
	        var df = document.createDocumentFragment();
	        while (target.hasChildNodes()) df.appendChild(target.firstChild);
	        this.setContent(df);
	    };

	    /**
	     *  Get the x and y dimensions of the surface.
	     *
	     * @method getSize
	     * @return {Array.Number} [x,y] size of surface
	     */
	    Surface.prototype.getSize = function getSize() {
	        return this._size ? this._size : this.size;
	    };

	    /**
	     * Set x and y dimensions of the surface.
	     *
	     * @method setSize
	     * @chainable
	     * @param {Array.Number} size as [width, height]
	     */
	    Surface.prototype.setSize = function setSize(size) {
	        this.size = size ? [size[0], size[1]] : null;
	        this._sizeDirty = true;
	        return this;
	    };

	    module.exports = Surface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(23);

	    /* TODO: remove these dependencies when deprecation complete */
	    var Transitionable = __webpack_require__(49);
	    var TransitionableTransform = __webpack_require__(50);

	    /**
	     *
	     *  A collection of visual changes to be
	     *    applied to another renderable component. This collection includes a
	     *    transform matrix, an opacity constant, a size, an origin specifier.
	     *    Modifier objects can be added to any RenderNode or object
	     *    capable of displaying renderables.  The Modifier's children and descendants
	     *    are transformed by the amounts specified in the Modifier's properties.
	     *
	     * @class Modifier
	     * @constructor
	     * @param {Object} [options] overrides of default options
	     * @param {Transform} [options.transform] affine transformation matrix
	     * @param {Number} [options.opacity]
	     * @param {Array.Number} [options.origin] origin adjustment
	     * @param {Array.Number} [options.size] size to apply to descendants
	     */
	    function Modifier(options) {
	        this._transformGetter = null;
	        this._opacityGetter = null;
	        this._originGetter = null;
	        this._alignGetter = null;
	        this._sizeGetter = null;
	        this._proportionGetter = null;

	        /* TODO: remove this when deprecation complete */
	        this._legacyStates = {};

	        this._output = {
	            transform: Transform.identity,
	            opacity: 1,
	            origin: null,
	            align: null,
	            size: null,
	            proportions: null,
	            target: null
	        };

	        if (options) {
	            if (options.transform) this.transformFrom(options.transform);
	            if (options.opacity !== undefined) this.opacityFrom(options.opacity);
	            if (options.origin) this.originFrom(options.origin);
	            if (options.align) this.alignFrom(options.align);
	            if (options.size) this.sizeFrom(options.size);
	            if (options.proportions) this.proportionsFrom(options.proportions);
	        }
	    }

	    /**
	     * Function, object, or static transform matrix which provides the transform.
	     *   This is evaluated on every tick of the engine.
	     *
	     * @method transformFrom
	     *
	     * @param {Object} transform transform provider object
	     * @return {Modifier} this
	     */
	    Modifier.prototype.transformFrom = function transformFrom(transform) {
	        if (transform instanceof Function) this._transformGetter = transform;
	        else if (transform instanceof Object && transform.get) this._transformGetter = transform.get.bind(transform);
	        else {
	            this._transformGetter = null;
	            this._output.transform = transform;
	        }
	        return this;
	    };

	    /**
	     * Set function, object, or number to provide opacity, in range [0,1].
	     *
	     * @method opacityFrom
	     *
	     * @param {Object} opacity provider object
	     * @return {Modifier} this
	     */
	    Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
	        if (opacity instanceof Function) this._opacityGetter = opacity;
	        else if (opacity instanceof Object && opacity.get) this._opacityGetter = opacity.get.bind(opacity);
	        else {
	            this._opacityGetter = null;
	            this._output.opacity = opacity;
	        }
	        return this;
	    };

	    /**
	     * Set function, object, or numerical array to provide origin, as [x,y],
	     *   where x and y are in the range [0,1].
	     *
	     * @method originFrom
	     *
	     * @param {Object} origin provider object
	     * @return {Modifier} this
	     */
	    Modifier.prototype.originFrom = function originFrom(origin) {
	        if (origin instanceof Function) this._originGetter = origin;
	        else if (origin instanceof Object && origin.get) this._originGetter = origin.get.bind(origin);
	        else {
	            this._originGetter = null;
	            this._output.origin = origin;
	        }
	        return this;
	    };

	    /**
	     * Set function, object, or numerical array to provide align, as [x,y],
	     *   where x and y are in the range [0,1].
	     *
	     * @method alignFrom
	     *
	     * @param {Object} align provider object
	     * @return {Modifier} this
	     */
	    Modifier.prototype.alignFrom = function alignFrom(align) {
	        if (align instanceof Function) this._alignGetter = align;
	        else if (align instanceof Object && align.get) this._alignGetter = align.get.bind(align);
	        else {
	            this._alignGetter = null;
	            this._output.align = align;
	        }
	        return this;
	    };

	    /**
	     * Set function, object, or numerical array to provide size, as [width, height].
	     *
	     * @method sizeFrom
	     *
	     * @param {Object} size provider object
	     * @return {Modifier} this
	     */
	    Modifier.prototype.sizeFrom = function sizeFrom(size) {
	        if (size instanceof Function) this._sizeGetter = size;
	        else if (size instanceof Object && size.get) this._sizeGetter = size.get.bind(size);
	        else {
	            this._sizeGetter = null;
	            this._output.size = size;
	        }
	        return this;
	    };

	    /**
	     * Set function, object, or numerical array to provide proportions, as [percent of width, percent of height].
	     *
	     * @method proportionsFrom
	     *
	     * @param {Object} proportions provider object
	     * @return {Modifier} this
	     */
	    Modifier.prototype.proportionsFrom = function proportionsFrom(proportions) {
	        if (proportions instanceof Function) this._proportionGetter = proportions;
	        else if (proportions instanceof Object && proportions.get) this._proportionGetter = proportions.get.bind(proportions);
	        else {
	            this._proportionGetter = null;
	            this._output.proportions = proportions;
	        }
	        return this;
	    };

	     /**
	     * Deprecated: Prefer transformFrom with static Transform, or use a TransitionableTransform.
	     * @deprecated
	     * @method setTransform
	     *
	     * @param {Transform} transform Transform to transition to
	     * @param {Transitionable} transition Valid transitionable object
	     * @param {Function} callback callback to call after transition completes
	     * @return {Modifier} this
	     */
	    Modifier.prototype.setTransform = function setTransform(transform, transition, callback) {
	        if (transition || this._legacyStates.transform) {
	            if (!this._legacyStates.transform) {
	                this._legacyStates.transform = new TransitionableTransform(this._output.transform);
	            }
	            if (!this._transformGetter) this.transformFrom(this._legacyStates.transform);

	            this._legacyStates.transform.set(transform, transition, callback);
	            return this;
	        }
	        else return this.transformFrom(transform);
	    };

	    /**
	     * Deprecated: Prefer opacityFrom with static opacity array, or use a Transitionable with that opacity.
	     * @deprecated
	     * @method setOpacity
	     *
	     * @param {Number} opacity Opacity value to transition to.
	     * @param {Transitionable} transition Valid transitionable object
	     * @param {Function} callback callback to call after transition completes
	     * @return {Modifier} this
	     */
	    Modifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
	        if (transition || this._legacyStates.opacity) {
	            if (!this._legacyStates.opacity) {
	                this._legacyStates.opacity = new Transitionable(this._output.opacity);
	            }
	            if (!this._opacityGetter) this.opacityFrom(this._legacyStates.opacity);

	            return this._legacyStates.opacity.set(opacity, transition, callback);
	        }
	        else return this.opacityFrom(opacity);
	    };

	    /**
	     * Deprecated: Prefer originFrom with static origin array, or use a Transitionable with that origin.
	     * @deprecated
	     * @method setOrigin
	     *
	     * @param {Array.Number} origin two element array with values between 0 and 1.
	     * @param {Transitionable} transition Valid transitionable object
	     * @param {Function} callback callback to call after transition completes
	     * @return {Modifier} this
	     */
	    Modifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
	        /* TODO: remove this if statement when deprecation complete */
	        if (transition || this._legacyStates.origin) {

	            if (!this._legacyStates.origin) {
	                this._legacyStates.origin = new Transitionable(this._output.origin || [0, 0]);
	            }
	            if (!this._originGetter) this.originFrom(this._legacyStates.origin);

	            this._legacyStates.origin.set(origin, transition, callback);
	            return this;
	        }
	        else return this.originFrom(origin);
	    };

	    /**
	     * Deprecated: Prefer alignFrom with static align array, or use a Transitionable with that align.
	     * @deprecated
	     * @method setAlign
	     *
	     * @param {Array.Number} align two element array with values between 0 and 1.
	     * @param {Transitionable} transition Valid transitionable object
	     * @param {Function} callback callback to call after transition completes
	     * @return {Modifier} this
	     */
	    Modifier.prototype.setAlign = function setAlign(align, transition, callback) {
	        /* TODO: remove this if statement when deprecation complete */
	        if (transition || this._legacyStates.align) {

	            if (!this._legacyStates.align) {
	                this._legacyStates.align = new Transitionable(this._output.align || [0, 0]);
	            }
	            if (!this._alignGetter) this.alignFrom(this._legacyStates.align);

	            this._legacyStates.align.set(align, transition, callback);
	            return this;
	        }
	        else return this.alignFrom(align);
	    };

	    /**
	     * Deprecated: Prefer sizeFrom with static origin array, or use a Transitionable with that size.
	     * @deprecated
	     * @method setSize
	     * @param {Array.Number} size two element array of [width, height]
	     * @param {Transitionable} transition Valid transitionable object
	     * @param {Function} callback callback to call after transition completes
	     * @return {Modifier} this
	     */
	    Modifier.prototype.setSize = function setSize(size, transition, callback) {
	        if (size && (transition || this._legacyStates.size)) {
	            if (!this._legacyStates.size) {
	                this._legacyStates.size = new Transitionable(this._output.size || [0, 0]);
	            }
	            if (!this._sizeGetter) this.sizeFrom(this._legacyStates.size);

	            this._legacyStates.size.set(size, transition, callback);
	            return this;
	        }
	        else return this.sizeFrom(size);
	    };

	    /**
	     * Deprecated: Prefer proportionsFrom with static origin array, or use a Transitionable with those proportions.
	     * @deprecated
	     * @method setProportions
	     * @param {Array.Number} proportions two element array of [percent of width, percent of height]
	     * @param {Transitionable} transition Valid transitionable object
	     * @param {Function} callback callback to call after transition completes
	     * @return {Modifier} this
	     */
	    Modifier.prototype.setProportions = function setProportions(proportions, transition, callback) {
	        if (proportions && (transition || this._legacyStates.proportions)) {
	            if (!this._legacyStates.proportions) {
	                this._legacyStates.proportions = new Transitionable(this._output.proportions || [0, 0]);
	            }
	            if (!this._proportionGetter) this.proportionsFrom(this._legacyStates.proportions);

	            this._legacyStates.proportions.set(proportions, transition, callback);
	            return this;
	        }
	        else return this.proportionsFrom(proportions);
	    };

	    /**
	     * Deprecated: Prefer to stop transform in your provider object.
	     * @deprecated
	     * @method halt
	     */
	    Modifier.prototype.halt = function halt() {
	        if (this._legacyStates.transform) this._legacyStates.transform.halt();
	        if (this._legacyStates.opacity) this._legacyStates.opacity.halt();
	        if (this._legacyStates.origin) this._legacyStates.origin.halt();
	        if (this._legacyStates.align) this._legacyStates.align.halt();
	        if (this._legacyStates.size) this._legacyStates.size.halt();
	        if (this._legacyStates.proportions) this._legacyStates.proportions.halt();
	        this._transformGetter = null;
	        this._opacityGetter = null;
	        this._originGetter = null;
	        this._alignGetter = null;
	        this._sizeGetter = null;
	        this._proportionGetter = null;
	    };

	    /**
	     * Deprecated: Prefer to use your provided transform or output of your transform provider.
	     * @deprecated
	     * @method getTransform
	     * @return {Object} transform provider object
	     */
	    Modifier.prototype.getTransform = function getTransform() {
	        return this._transformGetter();
	    };

	    /**
	     * Deprecated: Prefer to determine the end state of your transform from your transform provider
	     * @deprecated
	     * @method getFinalTransform
	     * @return {Transform} transform matrix
	     */
	    Modifier.prototype.getFinalTransform = function getFinalTransform() {
	        return this._legacyStates.transform ? this._legacyStates.transform.getFinal() : this._output.transform;
	    };

	    /**
	     * Deprecated: Prefer to use your provided opacity or output of your opacity provider.
	     * @deprecated
	     * @method getOpacity
	     * @return {Object} opacity provider object
	     */
	    Modifier.prototype.getOpacity = function getOpacity() {
	        return this._opacityGetter();
	    };

	    /**
	     * Deprecated: Prefer to use your provided origin or output of your origin provider.
	     * @deprecated
	     * @method getOrigin
	     * @return {Object} origin provider object
	     */
	    Modifier.prototype.getOrigin = function getOrigin() {
	        return this._originGetter();
	    };

	    /**
	     * Deprecated: Prefer to use your provided align or output of your align provider.
	     * @deprecated
	     * @method getAlign
	     * @return {Object} align provider object
	     */
	    Modifier.prototype.getAlign = function getAlign() {
	        return this._alignGetter();
	    };

	    /**
	     * Deprecated: Prefer to use your provided size or output of your size provider.
	     * @deprecated
	     * @method getSize
	     * @return {Object} size provider object
	     */
	    Modifier.prototype.getSize = function getSize() {
	        return this._sizeGetter ? this._sizeGetter() : this._output.size;
	    };

	    /**
	     * Deprecated: Prefer to use your provided proportions or output of your proportions provider.
	     * @deprecated
	     * @method getProportions
	     * @return {Object} proportions provider object
	     */
	    Modifier.prototype.getProportions = function getProportions() {
	        return this._proportionGetter ? this._proportionGetter() : this._output.proportions;
	    };

	    // call providers on tick to receive render spec elements to apply
	    function _update() {
	        if (this._transformGetter) this._output.transform = this._transformGetter();
	        if (this._opacityGetter) this._output.opacity = this._opacityGetter();
	        if (this._originGetter) this._output.origin = this._originGetter();
	        if (this._alignGetter) this._output.align = this._alignGetter();
	        if (this._sizeGetter) this._output.size = this._sizeGetter();
	        if (this._proportionGetter) this._output.proportions = this._proportionGetter();
	    }

	    /**
	     * Return render spec for this Modifier, applying to the provided
	     *    target component.  This is similar to render() for Surfaces.
	     *
	     * @private
	     * @method modify
	     *
	     * @param {Object} target (already rendered) render spec to
	     *    which to apply the transform.
	     * @return {Object} render spec for this Modifier, including the
	     *    provided target
	     */
	    Modifier.prototype.modify = function modify(target) {
	        _update.call(this);
	        this._output.target = target;
	        return this._output;
	    };

	    module.exports = Modifier;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     *  A high-performance static matrix math library used to calculate
	     *    affine transforms on surfaces and other renderables.
	     *    Famo.us uses 4x4 matrices corresponding directly to
	     *    WebKit matrices (column-major order).
	     *
	     *    The internal "type" of a Matrix is a 16-long float array in
	     *    row-major order, with:
	     *    elements [0],[1],[2],[4],[5],[6],[8],[9],[10] forming the 3x3
	     *          transformation matrix;
	     *    elements [12], [13], [14] corresponding to the t_x, t_y, t_z
	     *           translation;
	     *    elements [3], [7], [11] set to 0;
	     *    element [15] set to 1.
	     *    All methods are static.
	     *
	     * @static
	     *
	     * @class Transform
	     */
	    var Transform = {};

	    // WARNING: these matrices correspond to WebKit matrices, which are
	    //    transposed from their math counterparts
	    Transform.precision = 1e-6;
	    Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	    /**
	     * Multiply two or more Transform matrix types to return a Transform matrix.
	     *
	     * @method multiply4x4
	     * @static
	     * @param {Transform} a left Transform
	     * @param {Transform} b right Transform
	     * @return {Transform}
	     */
	    Transform.multiply4x4 = function multiply4x4(a, b) {
	        return [
	            a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
	            a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
	            a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
	            a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
	            a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
	            a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
	            a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
	            a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
	            a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
	            a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
	            a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
	            a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
	            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
	            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
	            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
	            a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
	        ];
	    };

	    /**
	     * Fast-multiply two or more Transform matrix types to return a
	     *    Matrix, assuming bottom row on each is [0 0 0 1].
	     *
	     * @method multiply
	     * @static
	     * @param {Transform} a left Transform
	     * @param {Transform} b right Transform
	     * @return {Transform}
	     */
	    Transform.multiply = function multiply(a, b) {
	        return [
	            a[0] * b[0] + a[4] * b[1] + a[8] * b[2],
	            a[1] * b[0] + a[5] * b[1] + a[9] * b[2],
	            a[2] * b[0] + a[6] * b[1] + a[10] * b[2],
	            0,
	            a[0] * b[4] + a[4] * b[5] + a[8] * b[6],
	            a[1] * b[4] + a[5] * b[5] + a[9] * b[6],
	            a[2] * b[4] + a[6] * b[5] + a[10] * b[6],
	            0,
	            a[0] * b[8] + a[4] * b[9] + a[8] * b[10],
	            a[1] * b[8] + a[5] * b[9] + a[9] * b[10],
	            a[2] * b[8] + a[6] * b[9] + a[10] * b[10],
	            0,
	            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12],
	            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13],
	            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14],
	            1
	        ];
	    };

	    /**
	     * Return a Transform translated by additional amounts in each
	     *    dimension. This is equivalent to the result of
	     *
	     *    Transform.multiply(Matrix.translate(t[0], t[1], t[2]), m).
	     *
	     * @method thenMove
	     * @static
	     * @param {Transform} m a Transform
	     * @param {Array.Number} t floats delta vector of length 2 or 3
	     * @return {Transform}
	     */
	    Transform.thenMove = function thenMove(m, t) {
	        if (!t[2]) t[2] = 0;
	        return [m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, m[12] + t[0], m[13] + t[1], m[14] + t[2], 1];
	    };

	    /**
	     * Return a Transform atrix which represents the result of a transform matrix
	     *    applied after a move. This is faster than the equivalent multiply.
	     *    This is equivalent to the result of:
	     *
	     *    Transform.multiply(m, Transform.translate(t[0], t[1], t[2])).
	     *
	     * @method moveThen
	     * @static
	     * @param {Array.Number} v vector representing initial movement
	     * @param {Transform} m matrix to apply afterwards
	     * @return {Transform} the resulting matrix
	     */
	    Transform.moveThen = function moveThen(v, m) {
	        if (!v[2]) v[2] = 0;
	        var t0 = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
	        var t1 = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
	        var t2 = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
	        return Transform.thenMove(m, [t0, t1, t2]);
	    };

	    /**
	     * Return a Transform which represents a translation by specified
	     *    amounts in each dimension.
	     *
	     * @method translate
	     * @static
	     * @param {Number} x x translation
	     * @param {Number} y y translation
	     * @param {Number} z z translation
	     * @return {Transform}
	     */
	    Transform.translate = function translate(x, y, z) {
	        if (z === undefined) z = 0;
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
	    };

	    /**
	     * Return a Transform scaled by a vector in each
	     *    dimension. This is a more performant equivalent to the result of
	     *
	     *    Transform.multiply(Transform.scale(s[0], s[1], s[2]), m).
	     *
	     * @method thenScale
	     * @static
	     * @param {Transform} m a matrix
	     * @param {Array.Number} s delta vector (array of floats &&
	     *    array.length == 3)
	     * @return {Transform}
	     */
	    Transform.thenScale = function thenScale(m, s) {
	        return [
	            s[0] * m[0], s[1] * m[1], s[2] * m[2], 0,
	            s[0] * m[4], s[1] * m[5], s[2] * m[6], 0,
	            s[0] * m[8], s[1] * m[9], s[2] * m[10], 0,
	            s[0] * m[12], s[1] * m[13], s[2] * m[14], 1
	        ];
	    };

	    /**
	     * Return a Transform which represents a scale by specified amounts
	     *    in each dimension.
	     *
	     * @method scale
	     * @static
	     * @param {Number} x x scale factor
	     * @param {Number} y y scale factor
	     * @param {Number} z z scale factor
	     * @return {Transform}
	     */
	    Transform.scale = function scale(x, y, z) {
	        if (z === undefined) z = 1;
	        if (y === undefined) y = x;
	        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents a clockwise
	     *    rotation around the x axis.
	     *
	     * @method rotateX
	     * @static
	     * @param {Number} theta radians
	     * @return {Transform}
	     */
	    Transform.rotateX = function rotateX(theta) {
	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);
	        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents a clockwise
	     *    rotation around the y axis.
	     *
	     * @method rotateY
	     * @static
	     * @param {Number} theta radians
	     * @return {Transform}
	     */
	    Transform.rotateY = function rotateY(theta) {
	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);
	        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents a clockwise
	     *    rotation around the z axis.
	     *
	     * @method rotateZ
	     * @static
	     * @param {Number} theta radians
	     * @return {Transform}
	     */
	    Transform.rotateZ = function rotateZ(theta) {
	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);
	        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents composed clockwise
	     *    rotations along each of the axes. Equivalent to the result of
	     *    Matrix.multiply(rotateX(phi), rotateY(theta), rotateZ(psi)).
	     *
	     * @method rotate
	     * @static
	     * @param {Number} phi radians to rotate about the positive x axis
	     * @param {Number} theta radians to rotate about the positive y axis
	     * @param {Number} psi radians to rotate about the positive z axis
	     * @return {Transform}
	     */
	    Transform.rotate = function rotate(phi, theta, psi) {
	        var cosPhi = Math.cos(phi);
	        var sinPhi = Math.sin(phi);
	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);
	        var cosPsi = Math.cos(psi);
	        var sinPsi = Math.sin(psi);
	        var result = [
	            cosTheta * cosPsi,
	            cosPhi * sinPsi + sinPhi * sinTheta * cosPsi,
	            sinPhi * sinPsi - cosPhi * sinTheta * cosPsi,
	            0,
	            -cosTheta * sinPsi,
	            cosPhi * cosPsi - sinPhi * sinTheta * sinPsi,
	            sinPhi * cosPsi + cosPhi * sinTheta * sinPsi,
	            0,
	            sinTheta,
	            -sinPhi * cosTheta,
	            cosPhi * cosTheta,
	            0,
	            0, 0, 0, 1
	        ];
	        return result;
	    };

	    /**
	     * Return a Transform which represents an axis-angle rotation
	     *
	     * @method rotateAxis
	     * @static
	     * @param {Array.Number} v unit vector representing the axis to rotate about
	     * @param {Number} theta radians to rotate clockwise about the axis
	     * @return {Transform}
	     */
	    Transform.rotateAxis = function rotateAxis(v, theta) {
	        var sinTheta = Math.sin(theta);
	        var cosTheta = Math.cos(theta);
	        var verTheta = 1 - cosTheta; // versine of theta

	        var xxV = v[0] * v[0] * verTheta;
	        var xyV = v[0] * v[1] * verTheta;
	        var xzV = v[0] * v[2] * verTheta;
	        var yyV = v[1] * v[1] * verTheta;
	        var yzV = v[1] * v[2] * verTheta;
	        var zzV = v[2] * v[2] * verTheta;
	        var xs = v[0] * sinTheta;
	        var ys = v[1] * sinTheta;
	        var zs = v[2] * sinTheta;

	        var result = [
	            xxV + cosTheta, xyV + zs, xzV - ys, 0,
	            xyV - zs, yyV + cosTheta, yzV + xs, 0,
	            xzV + ys, yzV - xs, zzV + cosTheta, 0,
	            0, 0, 0, 1
	        ];
	        return result;
	    };

	    /**
	     * Return a Transform which represents a transform matrix applied about
	     * a separate origin point.
	     *
	     * @method aboutOrigin
	     * @static
	     * @param {Array.Number} v origin point to apply matrix
	     * @param {Transform} m matrix to apply
	     * @return {Transform}
	     */
	    Transform.aboutOrigin = function aboutOrigin(v, m) {
	        var t0 = v[0] - (v[0] * m[0] + v[1] * m[4] + v[2] * m[8]);
	        var t1 = v[1] - (v[0] * m[1] + v[1] * m[5] + v[2] * m[9]);
	        var t2 = v[2] - (v[0] * m[2] + v[1] * m[6] + v[2] * m[10]);
	        return Transform.thenMove(m, [t0, t1, t2]);
	    };

	    /**
	     * Return a Transform representation of a skew transformation
	     *
	     * @method skew
	     * @static
	     * @param {Number} phi scale factor skew in the x axis
	     * @param {Number} theta scale factor skew in the y axis
	     * @param {Number} psi scale factor skew in the z axis
	     * @return {Transform}
	     */
	    Transform.skew = function skew(phi, theta, psi) {
	        return [1, Math.tan(theta), 0, 0, Math.tan(psi), 1, 0, 0, 0, Math.tan(phi), 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representation of a skew in the x-direction
	     *
	     * @method skewX
	     * @static
	     * @param {Number} angle the angle between the top and left sides
	     * @return {Transform}
	     */
	    Transform.skewX = function skewX(angle) {
	        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representation of a skew in the y-direction
	     *
	     * @method skewY
	     * @static
	     * @param {Number} angle the angle between the top and right sides
	     * @return {Transform}
	     */
	    Transform.skewY = function skewY(angle) {
	        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Returns a perspective Transform matrix
	     *
	     * @method perspective
	     * @static
	     * @param {Number} focusZ z position of focal point
	     * @return {Transform}
	     */
	    Transform.perspective = function perspective(focusZ) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / focusZ, 0, 0, 0, 1];
	    };

	    /**
	     * Return translation vector component of given Transform
	     *
	     * @method getTranslate
	     * @static
	     * @param {Transform} m Transform
	     * @return {Array.Number} the translation vector [t_x, t_y, t_z]
	     */
	    Transform.getTranslate = function getTranslate(m) {
	        return [m[12], m[13], m[14]];
	    };

	    /**
	     * Return inverse affine transform for given Transform.
	     *   Note: This assumes m[3] = m[7] = m[11] = 0, and m[15] = 1.
	     *   Will provide incorrect results if not invertible or preconditions not met.
	     *
	     * @method inverse
	     * @static
	     * @param {Transform} m Transform
	     * @return {Transform}
	     */
	    Transform.inverse = function inverse(m) {
	        // only need to consider 3x3 section for affine
	        var c0 = m[5] * m[10] - m[6] * m[9];
	        var c1 = m[4] * m[10] - m[6] * m[8];
	        var c2 = m[4] * m[9] - m[5] * m[8];
	        var c4 = m[1] * m[10] - m[2] * m[9];
	        var c5 = m[0] * m[10] - m[2] * m[8];
	        var c6 = m[0] * m[9] - m[1] * m[8];
	        var c8 = m[1] * m[6] - m[2] * m[5];
	        var c9 = m[0] * m[6] - m[2] * m[4];
	        var c10 = m[0] * m[5] - m[1] * m[4];
	        var detM = m[0] * c0 - m[1] * c1 + m[2] * c2;
	        var invD = 1 / detM;
	        var result = [
	            invD * c0, -invD * c4, invD * c8, 0,
	            -invD * c1, invD * c5, -invD * c9, 0,
	            invD * c2, -invD * c6, invD * c10, 0,
	            0, 0, 0, 1
	        ];
	        result[12] = -m[12] * result[0] - m[13] * result[4] - m[14] * result[8];
	        result[13] = -m[12] * result[1] - m[13] * result[5] - m[14] * result[9];
	        result[14] = -m[12] * result[2] - m[13] * result[6] - m[14] * result[10];
	        return result;
	    };

	    /**
	     * Returns the transpose of a 4x4 matrix
	     *
	     * @method transpose
	     * @static
	     * @param {Transform} m matrix
	     * @return {Transform} the resulting transposed matrix
	     */
	    Transform.transpose = function transpose(m) {
	        return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
	    };

	    function _normSquared(v) {
	        return (v.length === 2) ? v[0] * v[0] + v[1] * v[1] : v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
	    }
	    function _norm(v) {
	        return Math.sqrt(_normSquared(v));
	    }
	    function _sign(n) {
	        return (n < 0) ? -1 : 1;
	    }

	    /**
	     * Decompose Transform into separate .translate, .rotate, .scale,
	     *    and .skew components.
	     *
	     * @method interpret
	     * @static
	     * @param {Transform} M transform matrix
	     * @return {Object} matrix spec object with component matrices .translate,
	     *    .rotate, .scale, .skew
	     */
	    Transform.interpret = function interpret(M) {

	        // QR decomposition via Householder reflections
	        //FIRST ITERATION

	        //default Q1 to the identity matrix;
	        var x = [M[0], M[1], M[2]];                // first column vector
	        var sgn = _sign(x[0]);                     // sign of first component of x (for stability)
	        var xNorm = _norm(x);                      // norm of first column vector
	        var v = [x[0] + sgn * xNorm, x[1], x[2]];  // v = x + sign(x[0])|x|e1
	        var mult = 2 / _normSquared(v);            // mult = 2/v'v

	        //bail out if our Matrix is singular
	        if (mult >= Infinity) {
	            return {translate: Transform.getTranslate(M), rotate: [0, 0, 0], scale: [0, 0, 0], skew: [0, 0, 0]};
	        }

	        //evaluate Q1 = I - 2vv'/v'v
	        var Q1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

	        //diagonals
	        Q1[0]  = 1 - mult * v[0] * v[0];    // 0,0 entry
	        Q1[5]  = 1 - mult * v[1] * v[1];    // 1,1 entry
	        Q1[10] = 1 - mult * v[2] * v[2];    // 2,2 entry

	        //upper diagonal
	        Q1[1] = -mult * v[0] * v[1];        // 0,1 entry
	        Q1[2] = -mult * v[0] * v[2];        // 0,2 entry
	        Q1[6] = -mult * v[1] * v[2];        // 1,2 entry

	        //lower diagonal
	        Q1[4] = Q1[1];                      // 1,0 entry
	        Q1[8] = Q1[2];                      // 2,0 entry
	        Q1[9] = Q1[6];                      // 2,1 entry

	        //reduce first column of M
	        var MQ1 = Transform.multiply(Q1, M);

	        //SECOND ITERATION on (1,1) minor
	        var x2 = [MQ1[5], MQ1[6]];
	        var sgn2 = _sign(x2[0]);                    // sign of first component of x (for stability)
	        var x2Norm = _norm(x2);                     // norm of first column vector
	        var v2 = [x2[0] + sgn2 * x2Norm, x2[1]];    // v = x + sign(x[0])|x|e1
	        var mult2 = 2 / _normSquared(v2);           // mult = 2/v'v

	        //evaluate Q2 = I - 2vv'/v'v
	        var Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

	        //diagonal
	        Q2[5]  = 1 - mult2 * v2[0] * v2[0]; // 1,1 entry
	        Q2[10] = 1 - mult2 * v2[1] * v2[1]; // 2,2 entry

	        //off diagonals
	        Q2[6] = -mult2 * v2[0] * v2[1];     // 2,1 entry
	        Q2[9] = Q2[6];                      // 1,2 entry

	        //calc QR decomposition. Q = Q1*Q2, R = Q'*M
	        var Q = Transform.multiply(Q2, Q1);      //note: really Q transpose
	        var R = Transform.multiply(Q, M);

	        //remove negative scaling
	        var remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
	        R = Transform.multiply(R, remover);
	        Q = Transform.multiply(remover, Q);

	        //decompose into rotate/scale/skew matrices
	        var result = {};
	        result.translate = Transform.getTranslate(M);
	        result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])];
	        if (!result.rotate[0]) {
	            result.rotate[0] = 0;
	            result.rotate[2] = Math.atan2(Q[4], Q[5]);
	        }
	        result.scale = [R[0], R[5], R[10]];
	        result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])];

	        //double rotation workaround
	        if (Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI) {
	            result.rotate[1] = Math.PI - result.rotate[1];
	            if (result.rotate[1] > Math.PI) result.rotate[1] -= 2 * Math.PI;
	            if (result.rotate[1] < -Math.PI) result.rotate[1] += 2 * Math.PI;
	            if (result.rotate[0] < 0) result.rotate[0] += Math.PI;
	            else result.rotate[0] -= Math.PI;
	            if (result.rotate[2] < 0) result.rotate[2] += Math.PI;
	            else result.rotate[2] -= Math.PI;
	        }

	        return result;
	    };

	    /**
	     * Weighted average between two matrices by averaging their
	     *     translation, rotation, scale, skew components.
	     *     f(M1,M2,t) = (1 - t) * M1 + t * M2
	     *
	     * @method average
	     * @static
	     * @param {Transform} M1 f(M1,M2,0) = M1
	     * @param {Transform} M2 f(M1,M2,1) = M2
	     * @param {Number} t
	     * @return {Transform}
	     */
	    Transform.average = function average(M1, M2, t) {
	        t = (t === undefined) ? 0.5 : t;
	        var specM1 = Transform.interpret(M1);
	        var specM2 = Transform.interpret(M2);

	        var specAvg = {
	            translate: [0, 0, 0],
	            rotate: [0, 0, 0],
	            scale: [0, 0, 0],
	            skew: [0, 0, 0]
	        };

	        for (var i = 0; i < 3; i++) {
	            specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i];
	            specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i];
	            specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i];
	            specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
	        }
	        return Transform.build(specAvg);
	    };

	    /**
	     * Compose .translate, .rotate, .scale, .skew components into
	     * Transform matrix
	     *
	     * @method build
	     * @static
	     * @param {matrixSpec} spec object with component matrices .translate,
	     *    .rotate, .scale, .skew
	     * @return {Transform} composed transform
	     */
	    Transform.build = function build(spec) {
	        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
	        var skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]);
	        var rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
	        return Transform.thenMove(Transform.multiply(Transform.multiply(rotateMatrix, skewMatrix), scaleMatrix), spec.translate);
	    };

	    /**
	     * Determine if two Transforms are component-wise equal
	     *   Warning: breaks on perspective Transforms
	     *
	     * @method equals
	     * @static
	     * @param {Transform} a matrix
	     * @param {Transform} b matrix
	     * @return {boolean}
	     */
	    Transform.equals = function equals(a, b) {
	        return !Transform.notEquals(a, b);
	    };

	    /**
	     * Determine if two Transforms are component-wise unequal
	     *   Warning: breaks on perspective Transforms
	     *
	     * @method notEquals
	     * @static
	     * @param {Transform} a matrix
	     * @param {Transform} b matrix
	     * @return {boolean}
	     */
	    Transform.notEquals = function notEquals(a, b) {
	        if (a === b) return false;

	        // shortci
	        return !(a && b) ||
	            a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] ||
	            a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] ||
	            a[4] !== b[4] || a[5] !== b[5] || a[6] !== b[6] ||
	            a[8] !== b[8] || a[9] !== b[9] || a[10] !== b[10];
	    };

	    /**
	     * Constrain angle-trio components to range of [-pi, pi).
	     *
	     * @method normalizeRotation
	     * @static
	     * @param {Array.Number} rotation phi, theta, psi (array of floats
	     *    && array.length == 3)
	     * @return {Array.Number} new phi, theta, psi triplet
	     *    (array of floats && array.length == 3)
	     */
	    Transform.normalizeRotation = function normalizeRotation(rotation) {
	        var result = rotation.slice(0);
	        if (result[0] === Math.PI * 0.5 || result[0] === -Math.PI * 0.5) {
	            result[0] = -result[0];
	            result[1] = Math.PI - result[1];
	            result[2] -= Math.PI;
	        }
	        if (result[0] > Math.PI * 0.5) {
	            result[0] = result[0] - Math.PI;
	            result[1] = Math.PI - result[1];
	            result[2] -= Math.PI;
	        }
	        if (result[0] < -Math.PI * 0.5) {
	            result[0] = result[0] + Math.PI;
	            result[1] = -Math.PI - result[1];
	            result[2] -= Math.PI;
	        }
	        while (result[1] < -Math.PI) result[1] += 2 * Math.PI;
	        while (result[1] >= Math.PI) result[1] -= 2 * Math.PI;
	        while (result[2] < -Math.PI) result[2] += 2 * Math.PI;
	        while (result[2] >= Math.PI) result[2] -= 2 * Math.PI;
	        return result;
	    };

	    /**
	     * (Property) Array defining a translation forward in z by 1
	     *
	     * @property {array} inFront
	     * @static
	     * @final
	     */
	    Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1e-3, 1];

	    /**
	     * (Property) Array defining a translation backwards in z by 1
	     *
	     * @property {array} behind
	     * @static
	     * @final
	     */
	    Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1e-3, 1];

	    module.exports = Transform;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * This namespace holds standalone functionality.
	     *  Currently includes name mapping for transition curves,
	     *  name mapping for origin pairs, and the after() function.
	     *
	     * @class Utility
	     * @static
	     */
	    var Utility = {};

	    /**
	     * Table of direction array positions
	     *
	     * @property {object} Direction
	     * @final
	     */
	    Utility.Direction = {
	        X: 0,
	        Y: 1,
	        Z: 2
	    };

	    /**
	     * Return wrapper around callback function. Once the wrapper is called N
	     *   times, invoke the callback function. Arguments and scope preserved.
	     *
	     * @method after
	     *
	     * @param {number} count number of calls before callback function invoked
	     * @param {Function} callback wrapped callback function
	     *
	     * @return {function} wrapped callback with coundown feature
	     */
	    Utility.after = function after(count, callback) {
	        var counter = count;
	        return function() {
	            counter--;
	            if (counter === 0) callback.apply(this, arguments);
	        };
	    };

	    /**
	     * Load a URL and return its contents in a callback
	     *
	     * @method loadURL
	     *
	     * @param {string} url URL of object
	     * @param {function} callback callback to dispatch with content
	     */
	    Utility.loadURL = function loadURL(url, callback) {
	        var xhr = new XMLHttpRequest();
	        xhr.onreadystatechange = function onreadystatechange() {
	            if (this.readyState === 4) {
	                if (callback) callback(this.responseText);
	            }
	        };
	        xhr.open('GET', url);
	        xhr.send();
	    };

	    /**
	     * Create a document fragment from a string of HTML
	     *
	     * @method createDocumentFragmentFromHTML
	     *
	     * @param {string} html HTML to convert to DocumentFragment
	     *
	     * @return {DocumentFragment} DocumentFragment representing input HTML
	     */
	    Utility.createDocumentFragmentFromHTML = function createDocumentFragmentFromHTML(html) {
	        var element = document.createElement('div');
	        element.innerHTML = html;
	        var result = document.createDocumentFragment();
	        while (element.hasChildNodes()) result.appendChild(element.firstChild);
	        return result;
	    };

	    /*
	     *  Deep clone an object.
	     *  @param b {Object} Object to clone
	     *  @return a {Object} Cloned object.
	     */
	    Utility.clone = function clone(b) {
	        var a;
	        if (typeof b === 'object') {
	            a = (b instanceof Array) ? [] : {};
	            for (var key in b) {
	                if (typeof b[key] === 'object' && b[key] !== null) {
	                    if (b[key] instanceof Array) {
	                        a[key] = new Array(b[key].length);
	                        for (var i = 0; i < b[key].length; i++) {
	                            a[key][i] = Utility.clone(b[key][i]);
	                        }
	                    }
	                    else {
	                      a[key] = Utility.clone(b[key]);
	                    }
	                }
	                else {
	                    a[key] = b[key];
	                }
	            }
	        }
	        else {
	            a = b;
	        }
	        return a;
	    };

	    module.exports = Utility;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Surface = __webpack_require__(21);

	    /**
	     * A Famo.us surface in the form of an HTML textarea element.
	     *   This extends the Surface class.
	     *
	     * @class TextareaSurface
	     * @extends Surface
	     * @constructor
	     * @param {Object} [options] overrides of default options
	     * @param {string} [options.placeholder] placeholder text hint that describes the expected value of an textarea element
	     * @param {string} [options.value] value of text
	     * @param {string} [options.name] specifies the name of textarea
	     * @param {string} [options.wrap] specify 'hard' or 'soft' wrap for textarea
	     * @param {number} [options.cols] number of columns in textarea
	     * @param {number} [options.rows] number of rows in textarea
	     */
	    function TextareaSurface(options) {
	        this._placeholder = options.placeholder || '';
	        this._value       = options.value || '';
	        this._name        = options.name || '';
	        this._wrap        = options.wrap || '';
	        this._cols        = options.cols || '';
	        this._rows        = options.rows || '';

	        Surface.apply(this, arguments);
	        this.on('click', this.focus.bind(this));
	    }
	    TextareaSurface.prototype = Object.create(Surface.prototype);
	    TextareaSurface.prototype.constructor = TextareaSurface;

	    TextareaSurface.prototype.elementType = 'textarea';
	    TextareaSurface.prototype.elementClass = 'famous-surface';

	    /**
	     * Set placeholder text.  Note: Triggers a repaint.
	     *
	     * @method setPlaceholder
	     * @param {string} str Value to set the placeholder to.
	     * @return {TextareaSurface} this, allowing method chaining.
	     */
	    TextareaSurface.prototype.setPlaceholder = function setPlaceholder(str) {
	        this._placeholder = str;
	        this._contentDirty = true;
	        return this;
	    };

	    /**
	     * Focus on the current input, pulling up the keyboard on mobile.
	     *
	     * @method focus
	     * @return {TextareaSurface} this, allowing method chaining.
	     */
	    TextareaSurface.prototype.focus = function focus() {
	        if (this._currentTarget) this._currentTarget.focus();
	        return this;
	    };

	    /**
	     * Blur the current input, hiding the keyboard on mobile.
	     *
	     * @method focus
	     * @return {TextareaSurface} this, allowing method chaining.
	     */
	    TextareaSurface.prototype.blur = function blur() {
	        if (this._currentTarget) this._currentTarget.blur();
	        return this;
	    };

	    /**
	     * Set the value of textarea.
	     *   Note: Triggers a repaint next tick.
	     *
	     * @method setValue
	     * @param {string} str Value to set the main textarea value to.
	     * @return {TextareaSurface} this, allowing method chaining.
	     */
	    TextareaSurface.prototype.setValue = function setValue(str) {
	        this._value = str;
	        this._contentDirty = true;
	        return this;
	    };

	    /**
	     * Get the value of the inner content of the textarea (e.g. the entered text)
	     *
	     * @method getValue
	     * @return {string} value of element
	     */
	    TextareaSurface.prototype.getValue = function getValue() {
	        if (this._currentTarget) {
	            return this._currentTarget.value;
	        }
	        else {
	            return this._value;
	        }
	    };

	    /**
	     * Set the name attribute of the element.
	     *   Note: Triggers a repaint next tick.
	     *
	     * @method setName
	     * @param {string} str element name
	     * @return {TextareaSurface} this, allowing method chaining.
	     */
	    TextareaSurface.prototype.setName = function setName(str) {
	        this._name = str;
	        this._contentDirty = true;
	        return this;
	    };

	    /**
	     * Get the name attribute of the element.
	     *
	     * @method getName
	     * @return {string} name of element
	     */
	    TextareaSurface.prototype.getName = function getName() {
	        return this._name;
	    };

	    /**
	     * Set the wrap of textarea.
	     *   Note: Triggers a repaint next tick.
	     *
	     * @method setWrap
	     * @param {string} str wrap of the textarea surface (e.g. 'soft', 'hard')
	     * @return {TextareaSurface} this, allowing method chaining.
	     */
	    TextareaSurface.prototype.setWrap = function setWrap(str) {
	        this._wrap = str;
	        this._contentDirty = true;
	        return this;
	    };

	    /**
	     * Set the number of columns visible in the textarea.
	     *   Note: Overridden by surface size; set width to true. (eg. size: [true, *])
	     *         Triggers a repaint next tick.
	     *
	     * @method setColumns
	     * @param {number} num columns in textarea surface
	     * @return {TextareaSurface} this, allowing method chaining.
	     */
	    TextareaSurface.prototype.setColumns = function setColumns(num) {
	        this._cols = num;
	        this._contentDirty = true;
	        return this;
	    };

	    /**
	     * Set the number of rows visible in the textarea.
	     *   Note: Overridden by surface size; set height to true. (eg. size: [*, true])
	     *         Triggers a repaint next tick.
	     *
	     * @method setRows
	     * @param {number} num rows in textarea surface
	     * @return {TextareaSurface} this, allowing method chaining.
	     */
	    TextareaSurface.prototype.setRows = function setRows(num) {
	        this._rows = num;
	        this._contentDirty = true;
	        return this;
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
	        if (this._value !== '') target.value = this._value;
	        if (this._name !== '') target.name = this._name;
	        if (this._wrap !== '') target.wrap = this._wrap;
	        if (this._cols !== '') target.cols = this._cols;
	        if (this._rows !== '') target.rows = this._rows;
	    };

	    module.exports = TextareaSurface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	 * classList.js: Cross-browser full element.classList implementation.
	 * 2011-06-15
	 *
	 * By Eli Grey, http://eligrey.com
	 * Public Domain.
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 */

	/*global self, document, DOMException */

	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

	if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

	(function (view) {

	"use strict";

	var
	      classListProp = "classList"
	    , protoProp = "prototype"
	    , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
	    , objCtr = Object
	    , strTrim = String[protoProp].trim || function () {
	        return this.replace(/^\s+|\s+$/g, "");
	    }
	    , arrIndexOf = Array[protoProp].indexOf || function (item) {
	        var
	              i = 0
	            , len = this.length
	        ;
	        for (; i < len; i++) {
	            if (i in this && this[i] === item) {
	                return i;
	            }
	        }
	        return -1;
	    }
	    // Vendors: please allow content code to instantiate DOMExceptions
	    , DOMEx = function (type, message) {
	        this.name = type;
	        this.code = DOMException[type];
	        this.message = message;
	    }
	    , checkTokenAndGetIndex = function (classList, token) {
	        if (token === "") {
	            throw new DOMEx(
	                  "SYNTAX_ERR"
	                , "An invalid or illegal string was specified"
	            );
	        }
	        if (/\s/.test(token)) {
	            throw new DOMEx(
	                  "INVALID_CHARACTER_ERR"
	                , "String contains an invalid character"
	            );
	        }
	        return arrIndexOf.call(classList, token);
	    }
	    , ClassList = function (elem) {
	        var
	              trimmedClasses = strTrim.call(elem.className)
	            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
	            , i = 0
	            , len = classes.length
	        ;
	        for (; i < len; i++) {
	            this.push(classes[i]);
	        }
	        this._updateClassName = function () {
	            elem.className = this.toString();
	        };
	    }
	    , classListProto = ClassList[protoProp] = []
	    , classListGetter = function () {
	        return new ClassList(this);
	    }
	;
	// Most DOMException implementations don't allow calling DOMException's toString()
	// on non-DOMExceptions. Error's toString() is sufficient here.
	DOMEx[protoProp] = Error[protoProp];
	classListProto.item = function (i) {
	    return this[i] || null;
	};
	classListProto.contains = function (token) {
	    token += "";
	    return checkTokenAndGetIndex(this, token) !== -1;
	};
	classListProto.add = function (token) {
	    token += "";
	    if (checkTokenAndGetIndex(this, token) === -1) {
	        this.push(token);
	        this._updateClassName();
	    }
	};
	classListProto.remove = function (token) {
	    token += "";
	    var index = checkTokenAndGetIndex(this, token);
	    if (index !== -1) {
	        this.splice(index, 1);
	        this._updateClassName();
	    }
	};
	classListProto.toggle = function (token) {
	    token += "";
	    if (checkTokenAndGetIndex(this, token) === -1) {
	        this.add(token);
	    } else {
	        this.remove(token);
	    }
	};
	classListProto.toString = function () {
	    return this.join(" ");
	};

	if (objCtr.defineProperty) {
	    var classListPropDesc = {
	          get: classListGetter
	        , enumerable: true
	        , configurable: true
	    };
	    try {
	        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	    } catch (ex) { // IE 8 doesn't support enumerable:true
	        if (ex.number === -0x7FF5EC54) {
	            classListPropDesc.enumerable = false;
	            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	        }
	    }
	} else if (objCtr[protoProp].__defineGetter__) {
	    elemCtrProto.__defineGetter__(classListProp, classListGetter);
	}

	}(self));

	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	if (!Function.prototype.bind) {
	    Function.prototype.bind = function (oThis) {
	        if (typeof this !== "function") {
	            // closest thing possible to the ECMAScript 5 internal IsCallable function
	            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	        }

	        var aArgs = Array.prototype.slice.call(arguments, 1),
	        fToBind = this,
	        fNOP = function () {},
	        fBound = function () {
	            return fToBind.apply(this instanceof fNOP && oThis
	                ? this
	                : oThis,
	                aArgs.concat(Array.prototype.slice.call(arguments)));
	        };

	        fNOP.prototype = this.prototype;
	        fBound.prototype = new fNOP();

	        return fBound;
	    };
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// adds requestAnimationFrame functionality
	// Source: http://strd6.com/2011/05/better-window-requestanimationframe-shim/

	window.requestAnimationFrame || (window.requestAnimationFrame =
	  window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame    ||
	  window.oRequestAnimationFrame      ||
	  window.msRequestAnimationFrame     ||
	  function(callback, element) {
	    return window.setTimeout(function() {
	      callback(+new Date());
	  }, 1000 / 60);
	});


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Surface = __webpack_require__(21);

	    /**
	     * A surface containing an HTML5 Canvas element.
	     *   This extends the Surface class.
	     *
	     * @class CanvasSurface
	     * @extends Surface
	     * @constructor
	     * @param {Object} [options] overrides of default options
	     * @param {Array.Number} [options.canvasSize] [width, height] for document element
	     */
	    function CanvasSurface(options) {
	        if (options && options.canvasSize) this._canvasSize = options.canvasSize;
	        Surface.apply(this, arguments);
	        if (!this._canvasSize) this._canvasSize = this.getSize();
	        this._backBuffer = document.createElement('canvas');
	        if (this._canvasSize) {
	            this._backBuffer.width = this._canvasSize[0];
	            this._backBuffer.height = this._canvasSize[1];
	        }
	        this._contextId = undefined;
	    }

	    CanvasSurface.prototype = Object.create(Surface.prototype);
	    CanvasSurface.prototype.constructor = CanvasSurface;
	    CanvasSurface.prototype.elementType = 'canvas';
	    CanvasSurface.prototype.elementClass = 'famous-surface';

	    /**
	     * Set inner document content.  Note that this is a noop for CanvasSurface.
	     *
	     * @method setContent
	     *
	     */
	    CanvasSurface.prototype.setContent = function setContent() {};

	    /**
	     * Place the document element this component manages into the document.
	     *    This will draw the content to the document.
	     *
	     * @private
	     * @method deploy
	     * @param {Node} target document parent of this container
	     */
	    CanvasSurface.prototype.deploy = function deploy(target) {
	        if (this._canvasSize) {
	            target.width = this._canvasSize[0];
	            target.height = this._canvasSize[1];
	        }
	        if (this._contextId === '2d') {
	            target.getContext(this._contextId).drawImage(this._backBuffer, 0, 0);
	            this._backBuffer.width = 0;
	            this._backBuffer.height = 0;
	        }
	    };

	    /**
	     * Remove this component and contained content from the document
	     *
	     * @private
	     * @method recall
	     *
	     * @param {Node} target node to which the component was deployed
	     */
	    CanvasSurface.prototype.recall = function recall(target) {
	        var size = this.getSize();

	        this._backBuffer.width = target.width;
	        this._backBuffer.height = target.height;

	        if (this._contextId === '2d') {
	            this._backBuffer.getContext(this._contextId).drawImage(target, 0, 0);
	            target.width = 0;
	            target.height = 0;
	        }
	    };

	    /**
	     * Returns the canvas element's context
	     *
	     * @method getContext
	     * @param {string} contextId context identifier
	     */
	    CanvasSurface.prototype.getContext = function getContext(contextId) {
	        this._contextId = contextId;
	        return this._currentTarget ? this._currentTarget.getContext(contextId) : this._backBuffer.getContext(contextId);
	    };

	    /**
	     *  Set the size of the surface and canvas element.
	     *
	     *  @method setSize
	     *  @param {Array.number} size [width, height] of surface
	     *  @param {Array.number} canvasSize [width, height] of canvas surface
	     */
	    CanvasSurface.prototype.setSize = function setSize(size, canvasSize) {
	        Surface.prototype.setSize.apply(this, arguments);
	        if (canvasSize) this._canvasSize = [canvasSize[0], canvasSize[1]];
	        if (this._currentTarget) {
	            this._currentTarget.width = this._canvasSize[0];
	            this._currentTarget.height = this._canvasSize[1];
	        }
	    };

	    module.exports = CanvasSurface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(35);
	    var OptionsManager = __webpack_require__(38);
	    var RenderNode = __webpack_require__(52);
	    var Utility = __webpack_require__(24);

	    /**
	     * Useful for quickly creating elements within applications
	     *   with large event systems.  Consists of a RenderNode paired with
	     *   an input EventHandler and an output EventHandler.
	     *   Meant to be extended by the developer.
	     *
	     * @class View
	     * @uses EventHandler
	     * @uses OptionsManager
	     * @uses RenderNode
	     * @constructor
	     */
	    function View(options) {
	        this._node = new RenderNode();

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();
	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS);
	        this._optionsManager = new OptionsManager(this.options);

	        if (options) this.setOptions(options);
	    }

	    View.DEFAULT_OPTIONS = {}; // no defaults

	    /**
	     * Look up options value by key
	     * @method getOptions
	     *
	     * @param {string} key key
	     * @return {Object} associated object
	     */
	    View.prototype.getOptions = function getOptions(key) {
	        return this._optionsManager.getOptions(key);
	    };

	    /*
	     *  Set internal options.
	     *  No defaults options are set in View.
	     *
	     *  @method setOptions
	     *  @param {Object} options
	     */
	    View.prototype.setOptions = function setOptions(options) {
	        this._optionsManager.patch(options);
	    };

	    /**
	     * Add a child renderable to the view.
	     *   Note: This is meant to be used by an inheriting class
	     *   rather than from outside the prototype chain.
	     *
	     * @method add
	     * @return {RenderNode}
	     * @protected
	     */
	    View.prototype.add = function add() {
	        return this._node.add.apply(this._node, arguments);
	    };

	    /**
	     * Alias for add
	     * @method _add
	     */
	    View.prototype._add = View.prototype.add;

	    /**
	     * Generate a render spec from the contents of this component.
	     *
	     * @private
	     * @method render
	     * @return {number} Render spec for this component
	     */
	    View.prototype.render = function render() {
	        return this._node.render();
	    };

	    /**
	     * Return size of contained element.
	     *
	     * @method getSize
	     * @return {Array.Number} [width, height]
	     */
	    View.prototype.getSize = function getSize() {
	        if (this._node && this._node.getSize) {
	            return this._node.getSize.apply(this._node, arguments) || this.options.size;
	        }
	        else return this.options.size;
	    };

	    module.exports = View;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define, console*/
	/*eslint no-console:0*/

	/**
	 * Utility class for famous-flex.
	 *
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * @class
	     * @alias module:LayoutUtility
	     */
	    function LayoutUtility() {
	    }
	    LayoutUtility.registeredHelpers = {};

	    var Capabilities = {
	        SEQUENCE: 1,
	        DIRECTION_X: 2,
	        DIRECTION_Y: 4,
	        SCROLLING: 8
	    };
	    LayoutUtility.Capabilities = Capabilities;

	    /**
	     *  Normalizes the margins argument.
	     *
	     *  @param {Array.Number} margins
	     */
	    LayoutUtility.normalizeMargins = function(margins) {
	        if (!margins) {
	            return [0, 0, 0, 0];
	        } else if (!Array.isArray(margins)) {
	            return [margins, margins, margins, margins];
	        } else if (margins.length === 0) {
	            return [0, 0, 0, 0];
	        } else if (margins.length === 1) {
	            return [margins[0], margins[0], margins[0], margins[0]];
	        } else if (margins.length === 2) {
	            return [margins[0], margins[1], margins[0], margins[1]];
	        }
	        else {
	            return margins;
	        }
	    };

	    /**
	     * Makes a (shallow) copy of a spec.
	     *
	     * @param {Spec} spec Spec to clone
	     * @return {Spec} cloned spec
	     */
	    LayoutUtility.cloneSpec = function(spec) {
	        var clone = {};
	        if (spec.opacity !== undefined) {
	            clone.opacity = spec.opacity;
	        }
	        if (spec.size !== undefined) {
	            clone.size = spec.size.slice(0);
	        }
	        if (spec.transform !== undefined) {
	            clone.transform = spec.transform.slice(0);
	        }
	        if (spec.origin !== undefined) {
	            clone.origin = spec.origin.slice(0);
	        }
	        if (spec.align !== undefined) {
	            clone.align = spec.align.slice(0);
	        }
	        return clone;
	    };

	    /**
	     * Clears the contents of a spec.
	     *
	     * @param {Spec} spec Spec to clear
	     * @return {Spec} spec
	     */
	    LayoutUtility.clearSpec = function(spec) {
	        delete spec.opacity;
	        delete spec.size;
	        delete spec.transform;
	        delete spec.origin;
	        delete spec.align;
	        return spec;
	    };

	    /**
	     * Compares two arrays for equality.
	     */
	    function _isEqualArray(a, b) {
	        if (a === b) {
	            return true;
	        }
	        if ((a === undefined) || (b === undefined)) {
	            return false;
	        }
	        var i = a.length;
	        if (i !== b.length){
	            return false;
	        }
	        while (i--) {
	            if (a[i] !== b[i]) {
	                return false;
	            }
	        }
	        return true;
	    }

	    /**
	     * Compares two specs for equality.
	     *
	     * @param {Spec} spec1 Spec to compare
	     * @param {Spec} spec2 Spec to compare
	     * @return {Boolean} true/false
	     */
	    LayoutUtility.isEqualSpec = function(spec1, spec2) {
	        if (spec1.opacity !== spec2.opacity) {
	            return false;
	        }
	        if (!_isEqualArray(spec1.size, spec2.size)) {
	            return false;
	        }
	        if (!_isEqualArray(spec1.transform, spec2.transform)) {
	            return false;
	        }
	        if (!_isEqualArray(spec1.origin, spec2.origin)) {
	            return false;
	        }
	        if (!_isEqualArray(spec1.align, spec2.align)) {
	            return false;
	        }
	        return true;
	    };

	    /**
	     * Helper function that returns a string containing the differences
	     * between two specs.
	     *
	     * @param {Spec} spec1 Spec to compare
	     * @param {Spec} spec2 Spec to compare
	     * @return {String} text
	     */
	    LayoutUtility.getSpecDiffText = function(spec1, spec2) {
	        var result = 'spec diff:';
	        if (spec1.opacity !== spec2.opacity) {
	            result += '\nopacity: ' + spec1.opacity + ' != ' + spec2.opacity;
	        }
	        if (!_isEqualArray(spec1.size, spec2.size)) {
	            result += '\nsize: ' + JSON.stringify(spec1.size) + ' != ' + JSON.stringify(spec2.size);
	        }
	        if (!_isEqualArray(spec1.transform, spec2.transform)) {
	            result += '\ntransform: ' + JSON.stringify(spec1.transform) + ' != ' + JSON.stringify(spec2.transform);
	        }
	        if (!_isEqualArray(spec1.origin, spec2.origin)) {
	            result += '\norigin: ' + JSON.stringify(spec1.origin) + ' != ' + JSON.stringify(spec2.origin);
	        }
	        if (!_isEqualArray(spec1.align, spec2.align)) {
	            result += '\nalign: ' + JSON.stringify(spec1.align) + ' != ' + JSON.stringify(spec2.align);
	        }
	        return result;
	    };

	    /**
	     * Helper function to call whenever a critical error has occurred.
	     *
	     * @param {String} message error-message
	     */
	    LayoutUtility.error = function(message) {
	        console.log('ERROR: ' + message);
	        throw message;
	    };

	    /**
	     * Helper function to call whenever a warning error has occurred.
	     *
	     * @param {String} message warning-message
	     */
	    LayoutUtility.warning = function(message) {
	        console.log('WARNING: ' + message);
	    };

	    /**
	     * Helper function to log 1 or more arguments. All the arguments
	     * are concatenated to produce a single string which is logged.
	     *
	     * @param {String|Array|Object} args arguments to stringify and concatenate
	     */
	    LayoutUtility.log = function(args) {
	        var message = '';
	        for (var i = 0; i < arguments.length; i++) {
	            var arg = arguments[i];
	            if ((arg instanceof Object) || (arg instanceof Array)) {
	                message += JSON.stringify(arg);
	            }
	            else {
	                message += arg;
	            }
	        }
	        console.log(message);
	    };

	    /**
	     * Registers a layout-helper so it can be used as a layout-literal for
	     * a layout-controller. The LayoutHelper instance must support the `parse`
	     * function, which is fed the layout-literal content.
	     *
	     * **Example:**
	     *
	     * ```javascript
	     * Layout.registerHelper('dock', LayoutDockHelper);
	     *
	     * var layoutController = new LayoutController({
	     *   layout: { dock: [,
	     *     ['top', 'header', 50],
	     *     ['bottom', 'footer', 50],
	     *     ['fill', 'content'],
	     *   ]},
	     *   dataSource: {
	     *     header: new Surface({content: 'Header'}),
	     *     footer: new Surface({content: 'Footer'}),
	     *     content: new Surface({content: 'Content'}),
	     *   }
	     * })
	     * ```
	     *
	     * @param {String} name name of the helper (e.g. 'dock')
	     * @param {Function} Helper Helper to register (e.g. LayoutDockHelper)
	     */
	    LayoutUtility.registerHelper = function(name, Helper) {
	        if (!Helper.prototype.parse) {
	            LayoutUtility.error('The layout-helper for name "' + name + '" is required to support the "parse" method');
	        }
	        if (this.registeredHelpers[name] !== undefined) {
	            LayoutUtility.warning('A layout-helper with the name "' + name + '" is already registered and will be overwritten');
	        }
	        this.registeredHelpers[name] = Helper;
	    };

	    /**
	     * Unregisters a layout-helper.
	     *
	     * @param {String} name name of the layout-helper
	     */
	    LayoutUtility.unregisterHelper = function(name) {
	        delete this.registeredHelpers[name];
	    };

	    /**
	     * Gets a registered layout-helper by its name.
	     *
	     * @param {String} name name of the layout-helper
	     * @return {Function} layout-helper or undefined
	     */
	    LayoutUtility.getRegisteredHelper = function(name) {
	        return this.registeredHelpers[name];
	    };

	    // Layout function
	    module.exports = LayoutUtility;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define*/
	/*eslint no-use-before-define:0 */

	/**
	 * Internal LayoutNode class used by `LayoutController`.
	 *
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var Transform = __webpack_require__(23);
	    var LayoutUtility = __webpack_require__(31);

	    /**
	     * @class
	     * @param {Object} renderNode Render-node which this layout-node represents
	     * @alias module:LayoutNode
	     */
	    function LayoutNode(renderNode, spec) {
	        this.renderNode = renderNode;
	        this._spec = spec ? LayoutUtility.cloneSpec(spec) : {};
	        this._spec.renderNode = renderNode; // also store in spec
	        this._invalidated = false;
	        this._removing = false;
	        //this.scrollLength = undefined;
	        //this.trueSizeRequested = false;
	    }

	    /**
	     * Called when the node is destroyed
	     */
	    LayoutNode.prototype.destroy = function() {
	        // override to implement
	    };

	    /**
	     * Reset the end-state. This function is called on all layout-nodes prior to
	     * calling the layout-function. So that the layout-function starts with a clean slate.
	     */
	    LayoutNode.prototype.reset = function() {
	        this._invalidated = false;
	        this.trueSizeRequested = false;
	    };

	    /**
	     * Set the spec of the node
	     *
	     * @param {Object} spec
	     */
	    LayoutNode.prototype.setSpec = function(spec) {
	        this._spec.align = spec.align;
	        this._spec.origin = spec.origin;
	        this._spec.size = spec.size;
	        this._spec.transform = spec.transform;
	        this._spec.opacity = spec.opacity;
	    };

	    /**
	     * Set the content of the node
	     *
	     * @param {Object} set
	     */
	    LayoutNode.prototype.set = function(set, size) {
	        this._invalidated = true;
	        this._removing = false;
	        var spec = this._spec;
	        spec.opacity = set.opacity;
	        spec.size = set.size;
	        spec.origin = set.origin;
	        spec.align = set.align;
	        if (set.translate || set.skew || set.rotate || set.scale) {
	            this._spec.transform = Transform.build({
	                translate: set.translate || [0, 0, 0],
	                skew: set.skew || [0, 0, 0],
	                scale: set.scale || [1, 1, 1],
	                rotate: set.rotate || [0, 0, 0]
	            });
	        }
	        else {
	            this._spec.transform = undefined;
	        }
	        this.scrollLength = set.scrollLength;
	    };

	    /**
	     * Creates the render-spec
	     */
	    LayoutNode.prototype.getSpec = function() {
	        return this._invalidated ? this._spec : undefined;
	    };

	    /**
	     * Marks the node for removal
	     */
	    LayoutNode.prototype.remove = function(removeSpec) {
	        this._removing = true;
	    };

	    module.exports = LayoutNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define*/
	/*eslint no-use-before-define:0 */

	/**
	 * LayoutNodeManager is a private class used internally by the LayoutControllers and
	 * ScrollViews. It manages the layout-nodes that are rendered and exposes the layout-context
	 * which is passed along to the layout-function.
	 *
	 * LayoutNodeManager keeps track of every rendered node through an ordered double-linked
	 * list. The first time the layout-function is called, the linked list is created.
	 * After that, the linked list is updated to reflect the output of the layout-function.
	 * When the layout is unchanged, then the linked-list exactly matches the order of the
	 * accessed nodes in the layout-function, and no layout-nodes need to be created or
	 * re-ordered.
	 *
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var LayoutNode = __webpack_require__(32);
	    var LayoutContext = __webpack_require__(53);
	    var LayoutUtility = __webpack_require__(31);

	    var MAX_POOL_SIZE = 100;
	    var LOG_PREFIX = 'Nodes: ';

	    /**
	     * @class
	     * @param {LayoutNode} LayoutNode Layout-nodes to create
	     * @param {Function} initLayoutNodeFn function to use when initializing new nodes
	     * @alias module:LayoutNodeManager
	     */
	    function LayoutNodeManager(LayoutNode, initLayoutNodeFn) {
	        this.LayoutNode = LayoutNode;
	        this._initLayoutNodeFn = initLayoutNodeFn;
	        this._context = new LayoutContext({
	            next: _contextNext.bind(this),
	            prev: _contextPrev.bind(this),
	            get: _contextGet.bind(this),
	            set: _contextSet.bind(this),
	            getRenderNode: _contextGetRenderNode.bind(this),
	            resolveSize: _contextResolveSize.bind(this)
	        });
	        this._contextState = {
	            // enumation state for the context
	            //nextSequence: undefined,
	            //prevSequence: undefined,
	            //next: undefined
	            //prev: undefined
	            //start: undefined
	        };
	        this._pool = {
	            size: 0
	            //first: undefined
	        };
	        this.verbose = false;
	        //this._first = undefined; // first item in the linked list
	        //this._nodesById = undefined;
	        //this._trueSizeRequested = false;
	    }

	    /**
	     * Prepares the manager for a new layout iteration, after which it returns the
	     * context which can be used by the layout-function.
	     *
	     * @param {ViewSequence} viewSequence first node to layout
	     * @param {Object} [nodesById] dictionary to use when looking up nodes by id
	     * @return {LayoutContext} context which can be passed to the layout-function
	     */
	    LayoutNodeManager.prototype.prepareForLayout = function(viewSequence, nodesById, contextData) {

	        // Reset all nodes
	        var node = this._first;
	        while (node) {
	            node.reset();
	            node = node._next;
	        }

	        // Prepare data
	        this._nodesById = nodesById;
	        this._trueSizeRequested = false;

	        // Prepare context for enumation
	        this._contextState.nextSequence = viewSequence;
	        this._contextState.prevSequence = viewSequence;
	        this._contextState.next = undefined;
	        this._contextState.prev = undefined;
	        this._contextState.nextGetIndex = 0;
	        this._contextState.prevGetIndex = 0;
	        this._contextState.nextSetIndex = 0;
	        this._contextState.prevSetIndex = 0;

	        // Prepare content
	        this._context.size = contextData.size;
	        this._context.direction = contextData.direction;
	        this._context.scrollOffset = contextData.scrollOffset || 0;
	        this._context.scrollStart = contextData.scrollStart || 0;
	        this._context.scrollEnd = contextData.scrollEnd || this._context.size[this._context.direction];
	        return this._context;
	    };

	    /**
	     * When the layout-function no longer lays-out the node, then it is not longer
	     * being invalidated. In this case the destination is set to the removeSpec
	     * after which the node is animated towards the remove-spec.
	     *
	     * @param {Spec} [removeSpec] spec towards which the no longer layed-out nodes are animated
	     */
	    LayoutNodeManager.prototype.removeNonInvalidatedNodes = function(removeSpec) {
	        var node = this._first;
	        while (node) {

	            // If a node existed, but it is no longer being layed out,
	            // then set it to the '_removing' state.
	            if (!node._invalidated && !node._removing) {
	                if (this.verbose) {
	                    LayoutUtility.log(LOG_PREFIX, 'removing node');
	                }
	                node.remove(removeSpec);
	            }

	            // Move to next node
	            node = node._next;
	        }
	    };

	    /**
	     * Builds the render-spec and destroy any layout-nodes that no longer
	     * return a render-spec.
	     *
	     * @return {Array.Spec} array of Specs
	     */
	    LayoutNodeManager.prototype.buildSpecAndDestroyUnrenderedNodes = function() {
	        var specs = [];
	        var result = {
	            specs: specs,
	            modified: false
	        };
	        var node = this._first;
	        while (node) {
	            var oldEndStateReached = node._endStateReached;
	            var spec = node.getSpec();
	            if (!spec) {

	                // Remove node from linked-list
	                if (node._next) {
	                    node._next._prev = node._prev;
	                }
	                if (node._prev) {
	                    node._prev._next = node._next;
	                }
	                else {
	                    this._first = node._next;
	                }

	                // Destroy the node
	                var destroyNode = node;
	                node = node._next;
	                destroyNode.destroy();
	                if (this.verbose) {
	                    LayoutUtility.log(LOG_PREFIX, 'destroying node');
	                }

	                // Add node to pool
	                if (this._pool.size < MAX_POOL_SIZE) {
	                    this._pool.size++;
	                    destroyNode._next = this._pool.first;
	                    this._pool.first = destroyNode;
	                }

	                // Mark as modified
	                result.modified = true;

	                _checkIntegrity.call(this);
	            }
	            else {

	                // Update stats
	                if (!node._endStateReached || !oldEndStateReached) {
	                    result.modified = true;
	                }

	                // Add node to result output
	                specs.push(spec);
	                node = node._next;
	            }
	        }
	        return result;
	    };

	    /**
	     * Get the layout-node by its renderable.
	     *
	     * @param {Object} renderable renderable
	     * @return {LayoutNode} layout-node or undefined
	     */
	    LayoutNodeManager.prototype.getNodeByRenderNode = function(renderable) {
	        var node = this._first;
	        while (node) {
	            if (node.renderNode === renderable) {
	                return node;
	            }
	            node = node._next;
	        }
	        return undefined;
	    };

	    /**
	     * Inserts a layout-node into the linked-list.
	     *
	     * @param {LayoutNode} node layout-node to insert
	     */
	    LayoutNodeManager.prototype.insertNode = function(node) {
	        node._next = this._first;
	        if (this._first) {
	            this._first._prev = node;
	        }
	        this._first = node;
	        _checkIntegrity.call(this);
	    };

	    /**
	     * Creates a layout-node
	     *
	     * @param {Object} renderNode render-node for whom to create a layout-node for
	     * @return {LayoutNode} layout-node
	     */
	    LayoutNodeManager.prototype.createNode = function(renderNode, spec) {
	        var node;
	        if (this._pool.first) {
	            node = this._pool.first;
	            this._pool.first = node._next;
	            this._pool.size--;
	            node.constructor.apply(node, arguments);
	        }
	        else {
	            node = new this.LayoutNode(renderNode, spec);
	        }
	        node._prev = undefined;
	        node._next = undefined;
	        node._viewSequence = undefined;
	        if (this._initLayoutNodeFn) {
	            this._initLayoutNodeFn.call(this, node, spec);
	        }
	        return node;
	    };

	    /**
	     * Enumates all layout-nodes.
	     *
	     * @param {Function} callback Function that is called every node
	     * @param {Bool} [next] undefined = all, true = all next, false = all previous
	     */
	    LayoutNodeManager.prototype.forEach = function(callback, next) {
	        var node;
	        if (next === undefined) {
	            node = this._first;
	            while (node) {
	                if (callback(node)) {
	                    return;
	                }
	                node = node._next;
	            }
	        } else if (next === true) {
	            node = this._contextState.start;
	            while (node) {
	                if (!node._invalidated || callback(node)) {
	                    return;
	                }
	                node = node._next;
	            }
	        } else if (next === false) {
	            node = this._contextState.start ? this._contextState.start._prev : undefined;
	            while (node) {
	                if (!node._invalidated || callback(node)) {
	                    return;
	                }
	                node = node._prev;
	            }
	        }
	    };

	    /**
	     * Checks the integrity of the linked-list.
	     */
	    function _checkIntegrity() {
	        var node = this._first;
	        var count = 0;
	        var prevNode;
	        while (node) {
	            if (!node._prev && (node !== this._first)) {
	                throw 'No prev but not first';
	            }
	            if (node._prev !== prevNode) {
	                throw 'Bork';
	            }
	            prevNode = node;
	            node = node._next;
	            count++;
	        }
	    }

	    /**
	     * Creates or gets a layout node.
	     */
	    function _contextGetCreateAndOrderNodes(renderNode, prev) {

	        // The first time this function is called, the current
	        // prev/next position is obtained.
	        var node;
	        if (!this._contextState.next) {
	            node = this._first;
	            while (node) {
	                if (node.renderNode === renderNode) {
	                    break;
	                }
	                node = node._next;
	            }
	            if (!node) {
	                node = this.createNode(renderNode);
	                node._next = this._first;
	                if (this._first) {
	                    this._first._prev = node;
	                }
	                this._first = node;
	            }
	            this._contextState.start = node;
	            this._contextState.next = node;
	            this._contextState.prev = node;

	            _checkIntegrity.call(this);
	        }

	        // Check whether node already exist at the correct position
	        // in the linked-list. If so, return that node immediately
	        // and advanced the prev/next pointer for the next/prev
	        // lookup operation.
	        if (prev && (this._contextState.start !== node)) {
	            if (this._contextState.prev) {
	                var prevNode = this._contextState.prev._prev;
	                if (prevNode && (prevNode.renderNode === renderNode)) {
	                    this._contextState.prev = prevNode;
	                    _checkIntegrity.call(this);
	                    return prevNode;
	                }
	            }
	        }
	        else {
	            var nextNode = this._contextState.next;
	            if (nextNode && (nextNode.renderNode === renderNode)) {
	                if (nextNode._next) {
	                    this._contextState.next = nextNode._next;
	                }
	                _checkIntegrity.call(this);
	                return nextNode;
	            }
	        }

	        // Lookup the node anywhere in the list..
	        node = this._first;
	        while (node) {
	            if (node.renderNode === renderNode) {
	                break;
	            }
	            node = node._next;
	        }

	        // Create new node if neccessary
	        if (!node) {
	            node = this.createNode(renderNode);
	        }

	        // Node existed, remove from linked-list
	        else {
	            if (node._next) {
	                node._next._prev = node._prev;
	            }
	            if (node._prev) {
	                node._prev._next = node._next;
	            }
	            else {
	                this._first = node._next;
	            }
	            node._next = undefined;
	            node._prev = undefined;
	            _checkIntegrity.call(this);
	        }

	        // Insert node into the linked list
	        if (prev) {
	            if (this._contextState.prev._prev) {
	                node._prev = this._contextState.prev._prev;
	                this._contextState.prev._prev._next = node;
	            }
	            else {
	                this._first = node;
	            }
	            this._contextState.prev._prev = node;
	            node._next = this._contextState.prev;
	            this._contextState.prev = node;
	        }
	        else {
	            if (this._contextState.next._next) {
	                node._next = this._contextState.next._next;
	                this._contextState.next._next._prev = node;
	            }
	            this._contextState.next._next = node;
	            node._prev = this._contextState.next;
	            this._contextState.next = node;
	        }
	        _checkIntegrity.call(this);

	        return node;
	    }

	    /**
	     * Get the next render-node
	     */
	    function _contextNext() {

	        // Get the next node from the sequence
	        if (!this._contextState.nextSequence) {
	            return undefined;
	        }
	        var renderNode = this._contextState.nextSequence.get();
	        if (!renderNode) {
	            this._contextState.nextSequence = undefined;
	            return undefined;
	        }
	        var nextSequence = this._contextState.nextSequence;
	        this._contextState.nextSequence = this._contextState.nextSequence.getNext();
	        return {
	            renderNode: renderNode,
	            viewSequence: nextSequence,
	            next: true,
	            index: ++this._contextState.nextGetIndex
	        };
	    }

	    /**
	     * Get the previous render-node
	     */
	    function _contextPrev() {

	        // Get the previous node from the sequence
	        if (!this._contextState.prevSequence) {
	            return undefined;
	        }
	        this._contextState.prevSequence = this._contextState.prevSequence.getPrevious();
	        if (!this._contextState.prevSequence) {
	            return undefined;
	        }
	        var renderNode = this._contextState.prevSequence.get();
	        if (!renderNode) {
	            this._contextState.prevSequence = undefined;
	            return undefined;
	        }
	        return {
	            renderNode: renderNode,
	            viewSequence: this._contextState.prevSequence,
	            prev: true,
	            index: --this._contextState.prevGetIndex
	        };
	    }

	    /**
	     * Resolve id into a context-node.
	     */
	     function _contextGet(contextNodeOrId) {
	        if (!contextNodeOrId) {
	            return undefined;
	        }
	        if ((contextNodeOrId instanceof String) || (typeof contextNodeOrId === 'string')) {
	            if (!this._nodesById) {
	               return undefined;
	            }
	            var renderNode = this._nodesById[contextNodeOrId];
	            if (!renderNode) {
	                return undefined;
	            }

	            // Return array
	            if (renderNode instanceof Array) {
	                var result = [];
	                for (var i = 0 ; i < renderNode.length; i++) {
	                    result.push({
	                        renderNode: renderNode[i],
	                        arrayElement: true
	                    });
	                }
	                return result;
	            }

	            // Create context node
	            return {
	                renderNode: renderNode,
	                byId: true
	            };
	        }
	        else {
	            return contextNodeOrId;
	        }
	    }

	    /**
	     * Get render-node by its id.
	     */
	     function _contextGetRenderNode(contextNodeOrId) {
	        if (!contextNodeOrId) {
	            return undefined;
	        }
	        if ((contextNodeOrId instanceof String) || (typeof contextNodeOrId === 'string')) {
	            if (!this._nodesById) {
	               return undefined;
	            }
	            return this._nodesById[contextNodeOrId];
	        }
	        else {
	            return contextNodeOrId.renderNode;
	        }
	    }

	    /**
	     * Set the node content
	     */
	    function _contextSet(contextNodeOrId, set) {
	        var contextNode = _contextGet.call(this, contextNodeOrId);
	        if (contextNode) {
	            if (!contextNode.node) {
	                if (contextNode.next) {
	                     if (contextNode.index < this._contextState.nextSetIndex) {
	                        LayoutUtility.error('Nodes must be layed out in the same order as they were requested!');
	                     }
	                     this._contextState.nextSetIndex = contextNode.index;
	                } else if (contextNode.prev) {
	                     if (contextNode.index > this._contextState.prevSetIndex) {
	                        LayoutUtility.error('Nodes must be layed out in the same order as they were requested!');
	                     }
	                     this._contextState.prevSetIndex = contextNode.index;
	                }
	                contextNode.node = _contextGetCreateAndOrderNodes.call(this, contextNode.renderNode, contextNode.prev);
	                contextNode.node._viewSequence = contextNode.viewSequence;
	            }
	            contextNode.node.trueSizeRequested = contextNode.trueSizeRequested;
	            contextNode.node.set(set, this._context.size);
	            contextNode.set = set;
	        }
	    }

	    /**
	     * Resolve the size of the layout-node from the renderable itsself
	     */
	    function _contextResolveSize(contextNodeOrId, parentSize) {
	        var contextNode = _contextGet.call(this, contextNodeOrId);
	        if (!contextNode) {
	            return this;
	        }
	        var size = contextNode.renderNode.getSize(true);
	        if (!size) {
	            size = contextNode.renderNode.getSize(false);
	            if (!size) {
	                size = parentSize;
	            }
	            else {
	                var newSize = [size[0], size[1]];
	                if (size[0] === true) {
	                   newSize[0] = 0; // true cannot be resolved at this stage, try again next render-cycle
	                   this._trueSizeRequested = true;
	                   contextNode.trueSizeRequested = true;
	                }
	                else if (size[0] === undefined) {
	                    newSize[0] = parentSize[0];
	                }
	                if (size[1] === true) {
	                   newSize[1] = 0; // true cannot be resolved at this stage, try again next render-cycle
	                   this._trueSizeRequested = true;
	                   contextNode.trueSizeRequested = true;
	                }
	                else if (size[1] === undefined) {
	                    newSize[1] = parentSize[1];
	                }
	                size = newSize;
	            }
	        }
	        return size;
	    }

	    module.exports = LayoutNodeManager;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Surface = __webpack_require__(21);
	    var Context = __webpack_require__(41);

	    /**
	     * ContainerSurface is an object designed to contain surfaces and
	     *   set properties to be applied to all of them at once.
	     *   This extends the Surface class.
	     *   A container surface will enforce these properties on the
	     *   surfaces it contains:
	     *
	     *   size (clips contained surfaces to its own width and height);
	     *
	     *   origin;
	     *
	     *   its own opacity and transform, which will be automatically
	     *   applied to  all Surfaces contained directly and indirectly.
	     *
	     * @class ContainerSurface
	     * @extends Surface
	     * @constructor
	     * @param {Array.Number} [options.size] [width, height] in pixels
	     * @param {Array.string} [options.classes] CSS classes to set on all inner content
	     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
	     * @param {string} [options.content] inner (HTML) content of surface (should not be used)
	     */
	    function ContainerSurface(options) {
	        Surface.call(this, options);
	        this._container = document.createElement('div');
	        this._container.classList.add('famous-group');
	        this._container.classList.add('famous-container-group');
	        this._shouldRecalculateSize = false;
	        this.context = new Context(this._container);
	        this.setContent(this._container);
	    }

	    ContainerSurface.prototype = Object.create(Surface.prototype);
	    ContainerSurface.prototype.constructor = ContainerSurface;
	    ContainerSurface.prototype.elementType = 'div';
	    ContainerSurface.prototype.elementClass = 'famous-surface';

	    /**
	     * Add renderables to this object's render tree
	     *
	     * @method add
	     *
	     * @param {Object} obj renderable object
	     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
	     */
	    ContainerSurface.prototype.add = function add() {
	        return this.context.add.apply(this.context, arguments);
	    };

	    /**
	     * Return spec for this surface.  Note: Can result in a size recalculation.
	     *
	     * @private
	     * @method render
	     *
	     * @return {Object} render spec for this surface (spec id)
	     */
	    ContainerSurface.prototype.render = function render() {
	        if (this._sizeDirty) this._shouldRecalculateSize = true;
	        return Surface.prototype.render.apply(this, arguments);
	    };

	    /**
	     * Place the document element this component manages into the document.
	     *
	     * @private
	     * @method deploy
	     * @param {Node} target document parent of this container
	     */
	    ContainerSurface.prototype.deploy = function deploy() {
	        this._shouldRecalculateSize = true;
	        return Surface.prototype.deploy.apply(this, arguments);
	    };

	    /**
	     * Apply changes from this component to the corresponding document element.
	     * This includes changes to classes, styles, size, content, opacity, origin,
	     * and matrix transforms.
	     *
	     * @private
	     * @method commit
	     * @param {Context} context commit context
	     * @param {Transform} transform unused TODO
	     * @param {Number} opacity  unused TODO
	     * @param {Array.Number} origin unused TODO
	     * @param {Array.Number} size unused TODO
	     * @return {undefined} TODO returns an undefined value
	     */
	    ContainerSurface.prototype.commit = function commit(context, transform, opacity, origin, size) {
	        var previousSize = this._size ? [this._size[0], this._size[1]] : null;
	        var result = Surface.prototype.commit.apply(this, arguments);
	        if (this._shouldRecalculateSize || (previousSize && (this._size[0] !== previousSize[0] || this._size[1] !== previousSize[1]))) {
	            this.context.setSize();
	            this._shouldRecalculateSize = false;
	        }
	        this.context.update();
	        return result;
	    };

	    module.exports = ContainerSurface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventEmitter = __webpack_require__(54);

	    /**
	     * EventHandler forwards received events to a set of provided callback functions.
	     * It allows events to be captured, processed, and optionally piped through to other event handlers.
	     *
	     * @class EventHandler
	     * @extends EventEmitter
	     * @constructor
	     */
	    function EventHandler() {
	        EventEmitter.apply(this, arguments);

	        this.downstream = []; // downstream event handlers
	        this.downstreamFn = []; // downstream functions

	        this.upstream = []; // upstream event handlers
	        this.upstreamListeners = {}; // upstream listeners
	    }
	    EventHandler.prototype = Object.create(EventEmitter.prototype);
	    EventHandler.prototype.constructor = EventHandler;

	    /**
	     * Assign an event handler to receive an object's input events.
	     *
	     * @method setInputHandler
	     * @static
	     *
	     * @param {Object} object object to mix trigger, subscribe, and unsubscribe functions into
	     * @param {EventHandler} handler assigned event handler
	     */
	    EventHandler.setInputHandler = function setInputHandler(object, handler) {
	        object.trigger = handler.trigger.bind(handler);
	        if (handler.subscribe && handler.unsubscribe) {
	            object.subscribe = handler.subscribe.bind(handler);
	            object.unsubscribe = handler.unsubscribe.bind(handler);
	        }
	    };

	    /**
	     * Assign an event handler to receive an object's output events.
	     *
	     * @method setOutputHandler
	     * @static
	     *
	     * @param {Object} object object to mix pipe, unpipe, on, addListener, and removeListener functions into
	     * @param {EventHandler} handler assigned event handler
	     */
	    EventHandler.setOutputHandler = function setOutputHandler(object, handler) {
	        if (handler instanceof EventHandler) handler.bindThis(object);
	        object.pipe = handler.pipe.bind(handler);
	        object.unpipe = handler.unpipe.bind(handler);
	        object.on = handler.on.bind(handler);
	        object.addListener = object.on;
	        object.removeListener = handler.removeListener.bind(handler);
	    };

	    /**
	     * Trigger an event, sending to all downstream handlers
	     *   listening for provided 'type' key.
	     *
	     * @method emit
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {Object} event event data
	     * @return {EventHandler} this
	     */
	    EventHandler.prototype.emit = function emit(type, event) {
	        EventEmitter.prototype.emit.apply(this, arguments);
	        var i = 0;
	        for (i = 0; i < this.downstream.length; i++) {
	            if (this.downstream[i].trigger) this.downstream[i].trigger(type, event);
	        }
	        for (i = 0; i < this.downstreamFn.length; i++) {
	            this.downstreamFn[i](type, event);
	        }
	        return this;
	    };

	    /**
	     * Alias for emit
	     * @method addListener
	     */
	    EventHandler.prototype.trigger = EventHandler.prototype.emit;

	    /**
	     * Add event handler object to set of downstream handlers.
	     *
	     * @method pipe
	     *
	     * @param {EventHandler} target event handler target object
	     * @return {EventHandler} passed event handler
	     */
	    EventHandler.prototype.pipe = function pipe(target) {
	        if (target.subscribe instanceof Function) return target.subscribe(this);

	        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
	        var index = downstreamCtx.indexOf(target);
	        if (index < 0) downstreamCtx.push(target);

	        if (target instanceof Function) target('pipe', null);
	        else if (target.trigger) target.trigger('pipe', null);

	        return target;
	    };

	    /**
	     * Remove handler object from set of downstream handlers.
	     *   Undoes work of "pipe".
	     *
	     * @method unpipe
	     *
	     * @param {EventHandler} target target handler object
	     * @return {EventHandler} provided target
	     */
	    EventHandler.prototype.unpipe = function unpipe(target) {
	        if (target.unsubscribe instanceof Function) return target.unsubscribe(this);

	        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
	        var index = downstreamCtx.indexOf(target);
	        if (index >= 0) {
	            downstreamCtx.splice(index, 1);
	            if (target instanceof Function) target('unpipe', null);
	            else if (target.trigger) target.trigger('unpipe', null);
	            return target;
	        }
	        else return false;
	    };

	    /**
	     * Bind a callback function to an event type handled by this object.
	     *
	     * @method "on"
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {function(string, Object)} handler callback
	     * @return {EventHandler} this
	     */
	    EventHandler.prototype.on = function on(type, handler) {
	        EventEmitter.prototype.on.apply(this, arguments);
	        if (!(type in this.upstreamListeners)) {
	            var upstreamListener = this.trigger.bind(this, type);
	            this.upstreamListeners[type] = upstreamListener;
	            for (var i = 0; i < this.upstream.length; i++) {
	                this.upstream[i].on(type, upstreamListener);
	            }
	        }
	        return this;
	    };

	    /**
	     * Alias for "on"
	     * @method addListener
	     */
	    EventHandler.prototype.addListener = EventHandler.prototype.on;

	    /**
	     * Listen for events from an upstream event handler.
	     *
	     * @method subscribe
	     *
	     * @param {EventEmitter} source source emitter object
	     * @return {EventHandler} this
	     */
	    EventHandler.prototype.subscribe = function subscribe(source) {
	        var index = this.upstream.indexOf(source);
	        if (index < 0) {
	            this.upstream.push(source);
	            for (var type in this.upstreamListeners) {
	                source.on(type, this.upstreamListeners[type]);
	            }
	        }
	        return this;
	    };

	    /**
	     * Stop listening to events from an upstream event handler.
	     *
	     * @method unsubscribe
	     *
	     * @param {EventEmitter} source source emitter object
	     * @return {EventHandler} this
	     */
	    EventHandler.prototype.unsubscribe = function unsubscribe(source) {
	        var index = this.upstream.indexOf(source);
	        if (index >= 0) {
	            this.upstream.splice(index, 1);
	            for (var type in this.upstreamListeners) {
	                source.removeListener(type, this.upstreamListeners[type]);
	            }
	        }
	        return this;
	    };

	    module.exports = EventHandler;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Context = __webpack_require__(41);
	    var Transform = __webpack_require__(23);
	    var Surface = __webpack_require__(21);

	    /**
	     * A Context designed to contain surfaces and set properties
	     *   to be applied to all of them at once.
	     *   This is primarily used for specific performance improvements in the rendering engine.
	     *   Private.
	     *
	     * @private
	     * @class Group
	     * @extends Surface
	     * @constructor
	     * @param {Object} [options] Surface options array (see Surface})
	     */
	    function Group(options) {
	        Surface.call(this, options);
	        this._shouldRecalculateSize = false;
	        this._container = document.createDocumentFragment();
	        this.context = new Context(this._container);
	        this.setContent(this._container);
	        this._groupSize = [undefined, undefined];
	    }

	    /** @const */
	    Group.SIZE_ZERO = [0, 0];

	    Group.prototype = Object.create(Surface.prototype);
	    Group.prototype.elementType = 'div';
	    Group.prototype.elementClass = 'famous-group';

	    /**
	     * Add renderables to this component's render tree.
	     *
	     * @method add
	     * @private
	     * @param {Object} obj renderable object
	     * @return {RenderNode} Render wrapping provided object, if not already a RenderNode
	     */
	    Group.prototype.add = function add() {
	        return this.context.add.apply(this.context, arguments);
	    };

	    /**
	     * Generate a render spec from the contents of this component.
	     *
	     * @private
	     * @method render
	     * @return {Number} Render spec for this component
	     */
	    Group.prototype.render = function render() {
	        return Surface.prototype.render.call(this);
	    };

	    /**
	     * Place the document element this component manages into the document.
	     *
	     * @private
	     * @method deploy
	     * @param {Node} target document parent of this container
	     */
	    Group.prototype.deploy = function deploy(target) {
	        this.context.migrate(target);
	    };

	    /**
	     * Remove this component and contained content from the document
	     *
	     * @private
	     * @method recall
	     *
	     * @param {Node} target node to which the component was deployed
	     */
	    Group.prototype.recall = function recall(target) {
	        this._container = document.createDocumentFragment();
	        this.context.migrate(this._container);
	    };

	    /**
	     * Apply changes from this component to the corresponding document element.
	     *
	     * @private
	     * @method commit
	     *
	     * @param {Object} context update spec passed in from above in the render tree.
	     */
	    Group.prototype.commit = function commit(context) {
	        var transform = context.transform;
	        var origin = context.origin;
	        var opacity = context.opacity;
	        var size = context.size;
	        var result = Surface.prototype.commit.call(this, {
	            allocator: context.allocator,
	            transform: Transform.thenMove(transform, [-origin[0] * size[0], -origin[1] * size[1], 0]),
	            opacity: opacity,
	            origin: origin,
	            size: Group.SIZE_ZERO
	        });
	        if (size[0] !== this._groupSize[0] || size[1] !== this._groupSize[1]) {
	            this._groupSize[0] = size[0];
	            this._groupSize[1] = size[1];
	            this.context.setSize(size);
	        }
	        this.context.update({
	            transform: Transform.translate(-origin[0] * size[0], -origin[1] * size[1], 0),
	            origin: origin,
	            size: size
	        });
	        return result;
	    };

	    module.exports = Group;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * A singleton that maintains a global registry of Surfaces.
	     *   Private.
	     *
	     * @private
	     * @static
	     * @class Entity
	     */

	    var entities = [];

	    /**
	     * Get entity from global index.
	     *
	     * @private
	     * @method get
	     * @param {Number} id entity registration id
	     * @return {Surface} entity in the global index
	     */
	    function get(id) {
	        return entities[id];
	    }

	    /**
	     * Overwrite entity in the global index
	     *
	     * @private
	     * @method set
	     * @param {Number} id entity registration id
	     * @param {Surface} entity to add to the global index
	     */
	    function set(id, entity) {
	        entities[id] = entity;
	    }

	    /**
	     * Add entity to global index
	     *
	     * @private
	     * @method register
	     * @param {Surface} entity to add to global index
	     * @return {Number} new id
	     */
	    function register(entity) {
	        var id = entities.length;
	        set(id, entity);
	        return id;
	    }

	    /**
	     * Remove entity from global index
	     *
	     * @private
	     * @method unregister
	     * @param {Number} id entity registration id
	     */
	    function unregister(id) {
	        set(id, null);
	    }

	    module.exports = {
	        register: register,
	        unregister: unregister,
	        get: get,
	        set: set
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(35);

	    /**
	     *  A collection of methods for setting options which can be extended
	     *  onto other classes.
	     *
	     *
	     *  **** WARNING ****
	     *  You can only pass through objects that will compile into valid JSON.
	     *
	     *  Valid options:
	     *      Strings,
	     *      Arrays,
	     *      Objects,
	     *      Numbers,
	     *      Nested Objects,
	     *      Nested Arrays.
	     *
	     *    This excludes:
	     *        Document Fragments,
	     *        Functions
	     * @class OptionsManager
	     * @constructor
	     * @param {Object} value options dictionary
	     */
	    function OptionsManager(value) {
	        this._value = value;
	        this.eventOutput = null;
	    }

	    /**
	     * Create options manager from source dictionary with arguments overriden by patch dictionary.
	     *
	     * @static
	     * @method OptionsManager.patch
	     *
	     * @param {Object} source source arguments
	     * @param {...Object} data argument additions and overwrites
	     * @return {Object} source object
	     */
	    OptionsManager.patch = function patchObject(source, data) {
	        var manager = new OptionsManager(source);
	        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i]);
	        return source;
	    };

	    function _createEventOutput() {
	        this.eventOutput = new EventHandler();
	        this.eventOutput.bindThis(this);
	        EventHandler.setOutputHandler(this, this.eventOutput);
	    }

	    /**
	     * Create OptionsManager from source with arguments overriden by patches.
	     *   Triggers 'change' event on this object's event handler if the state of
	     *   the OptionsManager changes as a result.
	     *
	     * @method patch
	     *
	     * @param {...Object} arguments list of patch objects
	     * @return {OptionsManager} this
	     */
	    OptionsManager.prototype.patch = function patch() {
	        var myState = this._value;
	        for (var i = 0; i < arguments.length; i++) {
	            var data = arguments[i];
	            for (var k in data) {
	                if ((k in myState) && (data[k] && data[k].constructor === Object) && (myState[k] && myState[k].constructor === Object)) {
	                    if (!myState.hasOwnProperty(k)) myState[k] = Object.create(myState[k]);
	                    this.key(k).patch(data[k]);
	                    if (this.eventOutput) this.eventOutput.emit('change', {id: k, value: this.key(k).value()});
	                }
	                else this.set(k, data[k]);
	            }
	        }
	        return this;
	    };

	    /**
	     * Alias for patch
	     *
	     * @method setOptions
	     *
	     */
	    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

	    /**
	     * Return OptionsManager based on sub-object retrieved by key
	     *
	     * @method key
	     *
	     * @param {string} identifier key
	     * @return {OptionsManager} new options manager with the value
	     */
	    OptionsManager.prototype.key = function key(identifier) {
	        var result = new OptionsManager(this._value[identifier]);
	        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
	        return result;
	    };

	    /**
	     * Look up value by key or get the full options hash
	     * @method get
	     *
	     * @param {string} key key
	     * @return {Object} associated object or full options hash
	     */
	    OptionsManager.prototype.get = function get(key) {
	        return key ? this._value[key] : this._value;
	    };

	    /**
	     * Alias for get
	     * @method getOptions
	     */
	    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

	    /**
	     * Set key to value.  Outputs 'change' event if a value is overwritten.
	     *
	     * @method set
	     *
	     * @param {string} key key string
	     * @param {Object} value value object
	     * @return {OptionsManager} new options manager based on the value object
	     */
	    OptionsManager.prototype.set = function set(key, value) {
	        var originalValue = this.get(key);
	        this._value[key] = value;
	        if (this.eventOutput && value !== originalValue) this.eventOutput.emit('change', {id: key, value: value});
	        return this;
	    };

	    /**
	     * Bind a callback function to an event type handled by this object.
	     *
	     * @method "on"
	     *
	     * @param {string} type event type key (for example, 'change')
	     * @param {function(string, Object)} handler callback
	     * @return {EventHandler} this
	     */
	    OptionsManager.prototype.on = function on() {
	        _createEventOutput.call(this);
	        return this.on.apply(this, arguments);
	    };

	    /**
	     * Unbind an event by type and handler.
	     *   This undoes the work of "on".
	     *
	     * @method removeListener
	     *
	     * @param {string} type event type key (for example, 'change')
	     * @param {function} handler function object to remove
	     * @return {EventHandler} internal event handler object (for chaining)
	     */
	    OptionsManager.prototype.removeListener = function removeListener() {
	        _createEventOutput.call(this);
	        return this.removeListener.apply(this, arguments);
	    };

	    /**
	     * Add event handler object to set of downstream handlers.
	     *
	     * @method pipe
	     *
	     * @param {EventHandler} target event handler target object
	     * @return {EventHandler} passed event handler
	     */
	    OptionsManager.prototype.pipe = function pipe() {
	        _createEventOutput.call(this);
	        return this.pipe.apply(this, arguments);
	    };

	    /**
	     * Remove handler object from set of downstream handlers.
	     * Undoes work of "pipe"
	     *
	     * @method unpipe
	     *
	     * @param {EventHandler} target target handler object
	     * @return {EventHandler} provided target
	     */
	    OptionsManager.prototype.unpipe = function unpipe() {
	        _createEventOutput.call(this);
	        return this.unpipe.apply(this, arguments);
	    };

	    module.exports = OptionsManager;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define*/
	/*eslint no-use-before-define:0 */

	/**
	 * Internal LayoutNode class used by `FlowLayoutController`.
	 *
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var OptionsManager = __webpack_require__(38);
	    var Transform = __webpack_require__(23);
	    var Vector = __webpack_require__(42);
	    var Particle = __webpack_require__(44);
	    var Spring = __webpack_require__(46);
	    var PhysicsEngine = __webpack_require__(43);
	    var LayoutNode = __webpack_require__(32);
	    var Transitionable = __webpack_require__(49);

	    /**
	     * @class
	     * @extends LayoutNode
	     * @param {Object} renderNode Render-node which this layout-node represents
	     * @param {Spec} spec Initial state
	     * @param {Object} physicsEngines physics-engines to use
	     * @alias module:FlowLayoutNode
	     */
	    function FlowLayoutNode(renderNode, spec) {
	        LayoutNode.apply(this, arguments);

	        if (!this.options) {
	            this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
	            this._optionsManager = new OptionsManager(this.options);
	        }

	        if (!this._pe) {
	            this._pe = new PhysicsEngine();
	        }

	        this._options = {
	            spring: {
	                dampingRatio: 0.8,
	                period: 300
	            }
	        };

	        if (!this._properties) {
	            this._properties = {};
	        }
	        else {
	            for (var propName in this._properties) {
	                this._properties[propName].init = false;
	            }
	        }
	        _verifyIntegrity.call(this);

	        this._endStateReached = false;
	        this._initial = true;
	        if (spec) {
	            this.setSpec(spec);
	        }
	        _verifyIntegrity.call(this);
	    }
	    FlowLayoutNode.prototype = Object.create(LayoutNode.prototype);
	    FlowLayoutNode.prototype.constructor = FlowLayoutNode;

	    FlowLayoutNode.DEFAULT_OPTIONS = {
	        spring: {
	            dampingRatio: 0.8,
	            period: 300
	        },
	        particleRounding: 0.01
	    };

	    /**
	     * Defaults
	     */
	    var DEFAULT = {
	        opacity: 1,
	        size: [0, 0],
	        origin: [0, 0],
	        align: [0, 0],
	        scale: [1, 1, 1],
	        translate: [0, 0, 0],
	        rotate: [0, 0, 0],
	        skew: [0, 0, 0]
	    };

	    /**
	     * Verifies that the integrity of the layout-node is oke.
	     */
	    function _verifyIntegrity() {
	        /*var i;
	        for (var propName in this._properties) {
	            var prop = this._properties[propName];
	            if (prop.particle) {
	                if (isNaN(prop.particle.getEnergy())) {
	                    throw 'invalid particle energy: ' + propName;
	                }
	                var value = prop.particle.getPosition();
	                for (i = 0; i < value.length; i++) {
	                    if (isNaN(value[i])) {
	                       throw 'invalid particle value: ' + propName + '(' + i + ')';
	                    }
	                }
	                value = prop.endState.get();
	                for (i = 0; i < value.length; i++) {
	                    if (isNaN(value[i])) {
	                       throw 'invalid endState value: ' + propName + '(' + i + ')';
	                    }
	                }
	            }
	        }*/
	    }

	    /**
	     * Helper function which rounds a particle value to ensure it reaches an end-state and doesn't
	     * move infinitely.
	     */
	    function _roundParticleValue(value) {
	        return Math.round(value / this.options.particleRounding) * this.options.particleRounding;
	    }

	    /**
	     * Sets the configuration options
	     */
	    FlowLayoutNode.prototype.setOptions = function(options) {
	        this._optionsManager.setOptions(options);
	        for (var propName in this._properties) {
	            var prop = this._properties[propName];
	            if (prop.force) {
	                var springOptions = {};
	                for (var key in this.options.spring) {
	                    springOptions[key] = this.options.spring[key];
	                }
	                springOptions.anchor = prop.endState;
	                prop.force.setOptions(springOptions);
	            }
	        }
	        _verifyIntegrity.call(this);
	        return this;
	    };

	    /**
	     * Set the properties from a spec.
	     */
	    FlowLayoutNode.prototype.setSpec = function(spec) {
	        if ((spec.opacity !== undefined) || this._removing) {
	            _setPropertyValue.call(this, 'opacity', spec.opacity, DEFAULT.opacity);
	        }
	        if (spec.size|| this._removing) {
	            _setPropertyValue.call(this, 'size', spec.size, DEFAULT.size);
	        }
	        if (spec.align|| this._removing) {
	            _setPropertyValue.call(this, 'align', spec.align, DEFAULT.align);
	        }
	        if (spec.origin|| this._removing) {
	            _setPropertyValue.call(this, 'origin', spec.origin, DEFAULT.origin);
	        }
	        if (spec.transform || this._removing) {
	            var transform = spec.transform ? Transform.interpret(spec.transform) : {};
	            _setPropertyValue.call(this, 'translate', transform.translate, DEFAULT.translate);
	            _setPropertyValue.call(this, 'scale', transform.scale, DEFAULT.scale);
	            _setPropertyValue.call(this, 'skew', transform.skew, DEFAULT.skew);
	            _setPropertyValue.call(this, 'rotate', transform.rotate, DEFAULT.rotate);
	        }
	    };

	    /**
	     * Reset the end-state. This function is called on all layout-nodes prior to
	     * calling the layout-function. So that the layout-function starts with a clean slate.
	     */
	    FlowLayoutNode.prototype.reset = function() {
	        if (this._invalidated) {
	            for (var propName in this._properties) {
	                this._properties[propName].invalidated = false;
	            }
	            this._invalidated = false;
	        }
	        this.trueSizeRequested = false;
	        _verifyIntegrity.call(this);
	    };

	    /**
	     * Markes the node for removal.
	     */
	    FlowLayoutNode.prototype.remove = function(removeSpec) {

	        // Transition to the remove-spec state
	        this._removing = true;
	        if (removeSpec) {
	            this.setSpec(removeSpec);
	        }

	        // Mark for removal
	        this._invalidated = false;
	        _verifyIntegrity.call(this);
	    };

	    /**
	     * Locks a property, or a specific array-dimension of the property
	     * fixed to the end-state value. Use this to e.g. lock the x-translation
	     * to a the fixed end-state, so that when scrolling the renderable sticks
	     * to the x-axis and does not feel sluggish.
	     */
	    FlowLayoutNode.prototype.setDirectionLock = function(direction, value) {
	        if (direction === undefined) {
	            this._lockDirection = undefined;
	        }
	        else {
	            this._lockDirection = direction;
	            if (value !== undefined) {
	                if (!this._lockTransitionable) {
	                    this._lockTransitionable = new Transitionable(1);
	                }
	                this._lockTransitionable.halt();
	                this._lockTransitionable.reset(value);
	                if (value !== 1) {
	                    this._lockTransitionable.set(1, {
	                        duration: (1 - value) * 1000
	                    });
	                }
	            }
	        }
	    };

	    /**
	     * Helper function for getting the property value.
	     */
	    function _getPropertyValue(prop, def) {
	        return (prop && prop.init) ? prop.particle.getPosition() : def;
	    }
	    function _getSizeValue() {
	        var prop = this._properties.size;
	        if (!prop || !prop.init) {
	            return undefined;
	        }
	        var size = prop.particle.getPosition();
	        return [
	            _roundParticleValue.call(this, size[0]),
	            _roundParticleValue.call(this, size[1])
	        ];
	    }
	    function _getOpacityValue() {
	        var prop = this._properties.opacity;
	        return (prop && prop.init) ? _roundParticleValue.call(this, Math.max(0,Math.min(1, prop.particle.getPosition1D()))) : undefined;
	    }
	    function _getTranslateValue(def) {
	        var prop = this._properties.translate;
	        if (!prop || !prop.init) {
	            return def;
	        }
	        var position = prop.particle.getPosition();
	        if (this._lockDirection !== undefined) {
	            var value = position[this._lockDirection];
	            var endState = prop.endState.get()[this._lockDirection];
	            var lockValue = value + ((endState - value) * this._lockTransitionable.get());
	            position = [
	                _roundParticleValue.call(this,position[0]),
	                _roundParticleValue.call(this,position[1]),
	                _roundParticleValue.call(this,position[2])
	            ];
	            position[this._lockDirection] = lockValue;
	        }
	        return position;
	    }

	    /**
	     * Creates the render-spec
	     */
	    FlowLayoutNode.prototype.getSpec = function() {

	        // When the end state was reached, return the previous spec
	        var endStateReached = this._pe.isSleeping();
	        if (this._endStateReached && endStateReached) {
	            if (this._invalidated) {
	                return this._spec;
	            }
	            else {
	                return undefined;
	            }
	        }
	        this._endStateReached = endStateReached;

	        // Build fresh spec
	        this._initial = false;
	        this._spec.opacity = _getOpacityValue.call(this);
	        this._spec.size = _getSizeValue.call(this);
	        this._spec.align = _getPropertyValue(this._properties.align, undefined);
	        this._spec.origin = _getPropertyValue(this._properties.origin, undefined);
	        this._spec.transform = Transform.build({
	            translate: _getTranslateValue.call(this, DEFAULT.translate),
	            skew: _getPropertyValue(this._properties.skew, DEFAULT.skew),
	            scale: _getPropertyValue(this._properties.scale, DEFAULT.scale),
	            rotate: _getPropertyValue(this._properties.rotate, DEFAULT.rotate)
	        });
	        //if (this.renderNode._debug) {
	            //this.renderNode._debug = false;
	            /*console.log(JSON.stringify({
	                opacity: this._spec.opacity,
	                size: this._spec.size,
	                align: this._spec.align,
	                origin: this._spec.origin,
	                transform: this._spec.transform
	            }));*/
	        //}

	        _verifyIntegrity.call(this);
	        return this._spec;
	    };

	    /**
	     * Helper function to set the property of a node (e.g. opacity, translate, etc..)
	     */
	    function _setPropertyValue(propName, endState, defaultValue) {

	        // Check if end-state equals default-value, if so reset it to undefined
	        if ((endState !== undefined) && (defaultValue !== undefined)) {
	            if (Array.isArray(endState) && Array.isArray(defaultValue) && (endState.length === defaultValue.length)) {
	                var same = true;
	                for (var i = 0 ; i < endState.length; i++) {
	                    if (endState[i] !== defaultValue[i]) {
	                        same = false;
	                        break;
	                    }
	                }
	                endState = same ? undefined : endState;
	            }
	            else if (endState === defaultValue) {
	                endState = undefined;
	            }
	        }

	        // Get property
	        var prop = this._properties[propName];

	        // When property doesn't exist, and no end-state, nothing to do
	        if ((endState === undefined) && (!prop || !prop.init)) {
	            return;
	        }

	        // Update the property
	        if (prop && prop.init) {
	            prop.invalidated = true;
	            if (endState !== undefined) {
	                prop.endState.set(endState);
	            }
	            else if (this._removing) {
	                prop.endState.set(prop.particle.getPosition());
	            }
	            else {
	                prop.endState.set(defaultValue);
	            }
	            this._pe.wake();
	            return;
	        }

	        // Create property if neccesary
	        if (!prop) {
	            prop = {
	                particle: new Particle({
	                    position: this._initial ? endState : defaultValue
	                }),
	                endState: new Vector(endState)
	            };
	            var springOptions = {};
	            for (var key in this.options.spring) {
	                springOptions[key] = this.options.spring[key];
	            }
	            springOptions.anchor = prop.endState;
	            prop.force = new Spring(springOptions);
	            this._pe.addBody(prop.particle);
	            prop.forceId = this._pe.attach(prop.force, prop.particle);
	            this._properties[propName] = prop;
	        }
	        else {
	            prop.particle.setPosition(this._initial ? endState : defaultValue);
	            prop.endState.set(endState);
	            this._pe.wake();
	        }
	        prop.init = true;
	        prop.invalidated = true;
	    }
	    FlowLayoutNode.prototype.set = function(set, size) {
	        this._removing = false;
	        this.scrollLength = set.scrollLength;
	        _setPropertyValue.call(this, 'opacity', set.opacity, DEFAULT.opacity);
	        _setPropertyValue.call(this, 'align', set.align, DEFAULT.align);
	        _setPropertyValue.call(this, 'origin', set.origin, DEFAULT.origin);
	        _setPropertyValue.call(this, 'size', set.size, size);
	        _setPropertyValue.call(this, 'translate', set.translate, DEFAULT.translate);
	        _setPropertyValue.call(this, 'skew', set.skew, DEFAULT.skew);
	        _setPropertyValue.call(this, 'rotate', set.rotate, DEFAULT.rotate);
	        _setPropertyValue.call(this, 'scale', set.scale, DEFAULT.scale);
	        this._invalidated = true;
	        _verifyIntegrity.call(this);
	    };

	    module.exports = FlowLayoutNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Entity = __webpack_require__(37);
	    var EventHandler = __webpack_require__(35);
	    var Transform = __webpack_require__(23);

	    var usePrefix = !('transform' in document.documentElement.style);
	    var devicePixelRatio = window.devicePixelRatio || 1;

	    /**
	     * A base class for viewable content and event
	     *   targets inside a Famo.us application, containing a renderable document
	     *   fragment. Like an HTML div, it can accept internal markup,
	     *   properties, classes, and handle events.
	     *
	     * @class ElementOutput
	     * @constructor
	     *
	     * @param {Node} element document parent of this container
	     */
	    function ElementOutput(element) {
	        this._matrix = null;
	        this._opacity = 1;
	        this._origin = null;
	        this._size = null;

	        this._eventOutput = new EventHandler();
	        this._eventOutput.bindThis(this);

	        /** @ignore */
	        this.eventForwarder = function eventForwarder(event) {
	            this._eventOutput.emit(event.type, event);
	        }.bind(this);

	        this.id = Entity.register(this);
	        this._element = null;
	        this._sizeDirty = false;
	        this._originDirty = false;
	        this._transformDirty = false;

	        this._invisible = false;
	        if (element) this.attach(element);
	    }

	    /**
	     * Bind a callback function to an event type handled by this object.
	     *
	     * @method "on"
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {function(string, Object)} fn handler callback
	     * @return {EventHandler} this
	     */
	    ElementOutput.prototype.on = function on(type, fn) {
	        if (this._element) this._element.addEventListener(type, this.eventForwarder);
	        this._eventOutput.on(type, fn);
	    };

	    /**
	     * Unbind an event by type and handler.
	     *   This undoes the work of "on"
	     *
	     * @method removeListener
	     * @param {string} type event type key (for example, 'click')
	     * @param {function(string, Object)} fn handler
	     */
	    ElementOutput.prototype.removeListener = function removeListener(type, fn) {
	        this._eventOutput.removeListener(type, fn);
	    };

	    /**
	     * Trigger an event, sending to all downstream handlers
	     *   listening for provided 'type' key.
	     *
	     * @method emit
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {Object} [event] event data
	     * @return {EventHandler} this
	     */
	    ElementOutput.prototype.emit = function emit(type, event) {
	        if (event && !event.origin) event.origin = this;
	        var handled = this._eventOutput.emit(type, event);
	        if (handled && event && event.stopPropagation) event.stopPropagation();
	        return handled;
	    };

	    /**
	     * Add event handler object to set of downstream handlers.
	     *
	     * @method pipe
	     *
	     * @param {EventHandler} target event handler target object
	     * @return {EventHandler} passed event handler
	     */
	    ElementOutput.prototype.pipe = function pipe(target) {
	        return this._eventOutput.pipe(target);
	    };

	    /**
	     * Remove handler object from set of downstream handlers.
	     *   Undoes work of "pipe"
	     *
	     * @method unpipe
	     *
	     * @param {EventHandler} target target handler object
	     * @return {EventHandler} provided target
	     */
	    ElementOutput.prototype.unpipe = function unpipe(target) {
	        return this._eventOutput.unpipe(target);
	    };

	    /**
	     * Return spec for this surface. Note that for a base surface, this is
	     *    simply an id.
	     *
	     * @method render
	     * @private
	     * @return {Object} render spec for this surface (spec id)
	     */
	    ElementOutput.prototype.render = function render() {
	        return this.id;
	    };

	    //  Attach Famous event handling to document events emanating from target
	    //    document element.  This occurs just after attachment to the document.
	    //    Calling this enables methods like #on and #pipe.
	    function _addEventListeners(target) {
	        for (var i in this._eventOutput.listeners) {
	            target.addEventListener(i, this.eventForwarder);
	        }
	    }

	    //  Detach Famous event handling from document events emanating from target
	    //  document element.  This occurs just before detach from the document.
	    function _removeEventListeners(target) {
	        for (var i in this._eventOutput.listeners) {
	            target.removeEventListener(i, this.eventForwarder);
	        }
	    }

	    /**
	     * Return a Matrix's webkit css representation to be used with the
	     *    CSS3 -webkit-transform style.
	     *    Example: -webkit-transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
	     *
	     * @method _formatCSSTransform
	     * @private
	     * @param {FamousMatrix} m matrix
	     * @return {string} matrix3d CSS style representation of the transform
	     */
	    function _formatCSSTransform(m) {
	        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio;
	        m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;

	        var result = 'matrix3d(';
	        for (var i = 0; i < 15; i++) {
	            result += (m[i] < 0.000001 && m[i] > -0.000001) ? '0,' : m[i] + ',';
	        }
	        result += m[15] + ')';
	        return result;
	    }

	    /**
	     * Directly apply given FamousMatrix to the document element as the
	     *   appropriate webkit CSS style.
	     *
	     * @method setMatrix
	     *
	     * @static
	     * @private
	     * @param {Element} element document element
	     * @param {FamousMatrix} matrix
	     */

	    var _setMatrix;
	    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
	        _setMatrix = function(element, matrix) {
	            element.style.zIndex = (matrix[14] * 1000000) | 0;    // fix for Firefox z-buffer issues
	            element.style.transform = _formatCSSTransform(matrix);
	        };
	    }
	    else if (usePrefix) {
	        _setMatrix = function(element, matrix) {
	            element.style.webkitTransform = _formatCSSTransform(matrix);
	        };
	    }
	    else {
	        _setMatrix = function(element, matrix) {
	            element.style.transform = _formatCSSTransform(matrix);
	        };
	    }

	    // format origin as CSS percentage string
	    function _formatCSSOrigin(origin) {
	        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
	    }

	    // Directly apply given origin coordinates to the document element as the
	    // appropriate webkit CSS style.
	    var _setOrigin = usePrefix ? function(element, origin) {
	        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
	    } : function(element, origin) {
	        element.style.transformOrigin = _formatCSSOrigin(origin);
	    };

	    // Shrink given document element until it is effectively invisible.
	    var _setInvisible = usePrefix ? function(element) {
	        element.style.webkitTransform = 'scale3d(0.0001,0.0001,0.0001)';
	        element.style.opacity = 0;
	    } : function(element) {
	        element.style.transform = 'scale3d(0.0001,0.0001,0.0001)';
	        element.style.opacity = 0;
	    };

	    function _xyNotEquals(a, b) {
	        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
	    }

	    /**
	     * Apply changes from this component to the corresponding document element.
	     * This includes changes to classes, styles, size, content, opacity, origin,
	     * and matrix transforms.
	     *
	     * @private
	     * @method commit
	     * @param {Context} context commit context
	     */
	    ElementOutput.prototype.commit = function commit(context) {
	        var target = this._element;
	        if (!target) return;

	        var matrix = context.transform;
	        var opacity = context.opacity;
	        var origin = context.origin;
	        var size = context.size;

	        if (!matrix && this._matrix) {
	            this._matrix = null;
	            this._opacity = 0;
	            _setInvisible(target);
	            return;
	        }

	        if (_xyNotEquals(this._origin, origin)) this._originDirty = true;
	        if (Transform.notEquals(this._matrix, matrix)) this._transformDirty = true;

	        if (this._invisible) {
	            this._invisible = false;
	            this._element.style.display = '';
	        }

	        if (this._opacity !== opacity) {
	            this._opacity = opacity;
	            target.style.opacity = (opacity >= 1) ? '0.999999' : opacity;
	        }

	        if (this._transformDirty || this._originDirty || this._sizeDirty) {
	            if (this._sizeDirty) this._sizeDirty = false;

	            if (this._originDirty) {
	                if (origin) {
	                    if (!this._origin) this._origin = [0, 0];
	                    this._origin[0] = origin[0];
	                    this._origin[1] = origin[1];
	                }
	                else this._origin = null;
	                _setOrigin(target, this._origin);
	                this._originDirty = false;
	            }

	            if (!matrix) matrix = Transform.identity;
	            this._matrix = matrix;
	            var aaMatrix = this._size ? Transform.thenMove(matrix, [-this._size[0]*origin[0], -this._size[1]*origin[1], 0]) : matrix;
	            _setMatrix(target, aaMatrix);
	            this._transformDirty = false;
	        }
	    };

	    ElementOutput.prototype.cleanup = function cleanup() {
	        if (this._element) {
	            this._invisible = true;
	            this._element.style.display = 'none';
	        }
	    };

	    /**
	     * Place the document element that this component manages into the document.
	     *
	     * @private
	     * @method attach
	     * @param {Node} target document parent of this container
	     */
	    ElementOutput.prototype.attach = function attach(target) {
	        this._element = target;
	        _addEventListeners.call(this, target);
	    };

	    /**
	     * Remove any contained document content associated with this surface
	     *   from the actual document.
	     *
	     * @private
	     * @method detach
	     */
	    ElementOutput.prototype.detach = function detach() {
	        var target = this._element;
	        if (target) {
	            _removeEventListeners.call(this, target);
	            if (this._invisible) {
	                this._invisible = false;
	                this._element.style.display = '';
	            }
	        }
	        this._element = null;
	        return target;
	    };

	    module.exports = ElementOutput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var RenderNode = __webpack_require__(52);
	    var EventHandler = __webpack_require__(35);
	    var ElementAllocator = __webpack_require__(55);
	    var Transform = __webpack_require__(23);
	    var Transitionable = __webpack_require__(49);

	    var _zeroZero = [0, 0];
	    var usePrefix = !('perspective' in document.documentElement.style);

	    function _getElementSize(element) {
	        return [element.clientWidth, element.clientHeight];
	    }

	    var _setPerspective = usePrefix ? function(element, perspective) {
	        element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
	    } : function(element, perspective) {
	        element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
	    };

	    /**
	     * The top-level container for a Famous-renderable piece of the document.
	     *   It is directly updated by the process-wide Engine object, and manages one
	     *   render tree root, which can contain other renderables.
	     *
	     * @class Context
	     * @constructor
	     * @private
	     * @param {Node} container Element in which content will be inserted
	     */
	    function Context(container) {
	        this.container = container;
	        this._allocator = new ElementAllocator(container);

	        this._node = new RenderNode();
	        this._eventOutput = new EventHandler();
	        this._size = _getElementSize(this.container);

	        this._perspectiveState = new Transitionable(0);
	        this._perspective = undefined;

	        this._nodeContext = {
	            allocator: this._allocator,
	            transform: Transform.identity,
	            opacity: 1,
	            origin: _zeroZero,
	            align: _zeroZero,
	            size: this._size
	        };

	        this._eventOutput.on('resize', function() {
	            this.setSize(_getElementSize(this.container));
	        }.bind(this));

	    }

	    // Note: Unused
	    Context.prototype.getAllocator = function getAllocator() {
	        return this._allocator;
	    };

	    /**
	     * Add renderables to this Context's render tree.
	     *
	     * @method add
	     *
	     * @param {Object} obj renderable object
	     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
	     */
	    Context.prototype.add = function add(obj) {
	        return this._node.add(obj);
	    };

	    /**
	     * Move this Context to another containing document element.
	     *
	     * @method migrate
	     *
	     * @param {Node} container Element to which content will be migrated
	     */
	    Context.prototype.migrate = function migrate(container) {
	        if (container === this.container) return;
	        this.container = container;
	        this._allocator.migrate(container);
	    };

	    /**
	     * Gets viewport size for Context.
	     *
	     * @method getSize
	     *
	     * @return {Array.Number} viewport size as [width, height]
	     */
	    Context.prototype.getSize = function getSize() {
	        return this._size;
	    };

	    /**
	     * Sets viewport size for Context.
	     *
	     * @method setSize
	     *
	     * @param {Array.Number} size [width, height].  If unspecified, use size of root document element.
	     */
	    Context.prototype.setSize = function setSize(size) {
	        if (!size) size = _getElementSize(this.container);
	        this._size[0] = size[0];
	        this._size[1] = size[1];
	    };

	    /**
	     * Commit this Context's content changes to the document.
	     *
	     * @private
	     * @method update
	     * @param {Object} contextParameters engine commit specification
	     */
	    Context.prototype.update = function update(contextParameters) {
	        if (contextParameters) {
	            if (contextParameters.transform) this._nodeContext.transform = contextParameters.transform;
	            if (contextParameters.opacity) this._nodeContext.opacity = contextParameters.opacity;
	            if (contextParameters.origin) this._nodeContext.origin = contextParameters.origin;
	            if (contextParameters.align) this._nodeContext.align = contextParameters.align;
	            if (contextParameters.size) this._nodeContext.size = contextParameters.size;
	        }
	        var perspective = this._perspectiveState.get();
	        if (perspective !== this._perspective) {
	            _setPerspective(this.container, perspective);
	            this._perspective = perspective;
	        }

	        this._node.commit(this._nodeContext);
	    };

	    /**
	     * Get current perspective of this context in pixels.
	     *
	     * @method getPerspective
	     * @return {Number} depth perspective in pixels
	     */
	    Context.prototype.getPerspective = function getPerspective() {
	        return this._perspectiveState.get();
	    };

	    /**
	     * Set current perspective of this context in pixels.
	     *
	     * @method setPerspective
	     * @param {Number} perspective in pixels
	     * @param {Object} [transition] Transitionable object for applying the change
	     * @param {function(Object)} callback function called on completion of transition
	     */
	    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
	        return this._perspectiveState.set(perspective, transition, callback);
	    };

	    /**
	     * Trigger an event, sending to all downstream handlers
	     *   listening for provided 'type' key.
	     *
	     * @method emit
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {Object} event event data
	     * @return {EventHandler} this
	     */
	    Context.prototype.emit = function emit(type, event) {
	        return this._eventOutput.emit(type, event);
	    };

	    /**
	     * Bind a callback function to an event type handled by this object.
	     *
	     * @method "on"
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {function(string, Object)} handler callback
	     * @return {EventHandler} this
	     */
	    Context.prototype.on = function on(type, handler) {
	        return this._eventOutput.on(type, handler);
	    };

	    /**
	     * Unbind an event by type and handler.
	     *   This undoes the work of "on".
	     *
	     * @method removeListener
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {function} handler function object to remove
	     * @return {EventHandler} internal event handler object (for chaining)
	     */
	    Context.prototype.removeListener = function removeListener(type, handler) {
	        return this._eventOutput.removeListener(type, handler);
	    };

	    /**
	     * Add event handler object to set of downstream handlers.
	     *
	     * @method pipe
	     *
	     * @param {EventHandler} target event handler target object
	     * @return {EventHandler} passed event handler
	     */
	    Context.prototype.pipe = function pipe(target) {
	        return this._eventOutput.pipe(target);
	    };

	    /**
	     * Remove handler object from set of downstream handlers.
	     *   Undoes work of "pipe".
	     *
	     * @method unpipe
	     *
	     * @param {EventHandler} target target handler object
	     * @return {EventHandler} provided target
	     */
	    Context.prototype.unpipe = function unpipe(target) {
	        return this._eventOutput.unpipe(target);
	    };

	    module.exports = Context;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * Three-element floating point vector.
	     *
	     * @class Vector
	     * @constructor
	     *
	     * @param {number} x x element value
	     * @param {number} y y element value
	     * @param {number} z z element value
	     */
	    function Vector(x,y,z) {
	        if (arguments.length === 1 && x !== undefined) this.set(x);
	        else {
	            this.x = x || 0;
	            this.y = y || 0;
	            this.z = z || 0;
	        }
	        return this;
	    }

	    var _register = new Vector(0,0,0);

	    /**
	     * Add this element-wise to another Vector, element-wise.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     *
	     * @method add
	     * @param {Vector} v addend
	     * @return {Vector} vector sum
	     */
	    Vector.prototype.add = function add(v) {
	        return _setXYZ.call(_register,
	            this.x + v.x,
	            this.y + v.y,
	            this.z + v.z
	        );
	    };

	    /**
	     * Subtract another vector from this vector, element-wise.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     *
	     * @method sub
	     * @param {Vector} v subtrahend
	     * @return {Vector} vector difference
	     */
	    Vector.prototype.sub = function sub(v) {
	        return _setXYZ.call(_register,
	            this.x - v.x,
	            this.y - v.y,
	            this.z - v.z
	        );
	    };

	    /**
	     * Scale Vector by floating point r.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     *
	     * @method mult
	     *
	     * @param {number} r scalar
	     * @return {Vector} vector result
	     */
	    Vector.prototype.mult = function mult(r) {
	        return _setXYZ.call(_register,
	            r * this.x,
	            r * this.y,
	            r * this.z
	        );
	    };

	    /**
	     * Scale Vector by floating point 1/r.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     *
	     * @method div
	     *
	     * @param {number} r scalar
	     * @return {Vector} vector result
	     */
	    Vector.prototype.div = function div(r) {
	        return this.mult(1 / r);
	    };

	    /**
	     * Given another vector v, return cross product (v)x(this).
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     *
	     * @method cross
	     * @param {Vector} v Left Hand Vector
	     * @return {Vector} vector result
	     */
	    Vector.prototype.cross = function cross(v) {
	        var x = this.x;
	        var y = this.y;
	        var z = this.z;
	        var vx = v.x;
	        var vy = v.y;
	        var vz = v.z;

	        return _setXYZ.call(_register,
	            z * vy - y * vz,
	            x * vz - z * vx,
	            y * vx - x * vy
	        );
	    };

	    /**
	     * Component-wise equality test between this and Vector v.
	     * @method equals
	     * @param {Vector} v vector to compare
	     * @return {boolean}
	     */
	    Vector.prototype.equals = function equals(v) {
	        return (v.x === this.x && v.y === this.y && v.z === this.z);
	    };

	    /**
	     * Rotate clockwise around x-axis by theta radians.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     * @method rotateX
	     * @param {number} theta radians
	     * @return {Vector} rotated vector
	     */
	    Vector.prototype.rotateX = function rotateX(theta) {
	        var x = this.x;
	        var y = this.y;
	        var z = this.z;

	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);

	        return _setXYZ.call(_register,
	            x,
	            y * cosTheta - z * sinTheta,
	            y * sinTheta + z * cosTheta
	        );
	    };

	    /**
	     * Rotate clockwise around y-axis by theta radians.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     * @method rotateY
	     * @param {number} theta radians
	     * @return {Vector} rotated vector
	     */
	    Vector.prototype.rotateY = function rotateY(theta) {
	        var x = this.x;
	        var y = this.y;
	        var z = this.z;

	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);

	        return _setXYZ.call(_register,
	            z * sinTheta + x * cosTheta,
	            y,
	            z * cosTheta - x * sinTheta
	        );
	    };

	    /**
	     * Rotate clockwise around z-axis by theta radians.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     * @method rotateZ
	     * @param {number} theta radians
	     * @return {Vector} rotated vector
	     */
	    Vector.prototype.rotateZ = function rotateZ(theta) {
	        var x = this.x;
	        var y = this.y;
	        var z = this.z;

	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);

	        return _setXYZ.call(_register,
	            x * cosTheta - y * sinTheta,
	            x * sinTheta + y * cosTheta,
	            z
	        );
	    };

	    /**
	     * Return dot product of this with a second Vector
	     * @method dot
	     * @param {Vector} v second vector
	     * @return {number} dot product
	     */
	    Vector.prototype.dot = function dot(v) {
	        return this.x * v.x + this.y * v.y + this.z * v.z;
	    };

	    /**
	     * Return squared length of this vector
	     * @method normSquared
	     * @return {number} squared length
	     */
	    Vector.prototype.normSquared = function normSquared() {
	        return this.dot(this);
	    };

	    /**
	     * Return length of this vector
	     * @method norm
	     * @return {number} length
	     */
	    Vector.prototype.norm = function norm() {
	        return Math.sqrt(this.normSquared());
	    };

	    /**
	     * Scale Vector to specified length.
	     *   If length is less than internal tolerance, set vector to [length, 0, 0].
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     * @method normalize
	     *
	     * @param {number} length target length, default 1.0
	     * @return {Vector}
	     */
	    Vector.prototype.normalize = function normalize(length) {
	        if (arguments.length === 0) length = 1;
	        var norm = this.norm();

	        if (norm > 1e-7) return _setFromVector.call(_register, this.mult(length / norm));
	        else return _setXYZ.call(_register, length, 0, 0);
	    };

	    /**
	     * Make a separate copy of the Vector.
	     *
	     * @method clone
	     *
	     * @return {Vector}
	     */
	    Vector.prototype.clone = function clone() {
	        return new Vector(this);
	    };

	    /**
	     * True if and only if every value is 0 (or falsy)
	     *
	     * @method isZero
	     *
	     * @return {boolean}
	     */
	    Vector.prototype.isZero = function isZero() {
	        return !(this.x || this.y || this.z);
	    };

	    function _setXYZ(x,y,z) {
	        this.x = x;
	        this.y = y;
	        this.z = z;
	        return this;
	    }

	    function _setFromArray(v) {
	        return _setXYZ.call(this,v[0],v[1],v[2] || 0);
	    }

	    function _setFromVector(v) {
	        return _setXYZ.call(this, v.x, v.y, v.z);
	    }

	    function _setFromNumber(x) {
	        return _setXYZ.call(this,x,0,0);
	    }

	    /**
	     * Set this Vector to the values in the provided Array or Vector.
	     *
	     * @method set
	     * @param {object} v array, Vector, or number
	     * @return {Vector} this
	     */
	    Vector.prototype.set = function set(v) {
	        if (v instanceof Array) return _setFromArray.call(this, v);
	        if (typeof v === 'number') return _setFromNumber.call(this, v);
	        return _setFromVector.call(this, v);
	    };

	    Vector.prototype.setXYZ = function(x,y,z) {
	        return _setXYZ.apply(this, arguments);
	    };

	    Vector.prototype.set1D = function(x) {
	        return _setFromNumber.call(this, x);
	    };

	    /**
	     * Put result of last internal register calculation in specified output vector.
	     *
	     * @method put
	     * @param {Vector} v destination vector
	     * @return {Vector} destination vector
	     */

	    Vector.prototype.put = function put(v) {
	        if (this === _register) _setFromVector.call(v, _register);
	        else _setFromVector.call(v, this);
	    };

	    /**
	     * Set this vector to [0,0,0]
	     *
	     * @method clear
	     */
	    Vector.prototype.clear = function clear() {
	        return _setXYZ.call(this,0,0,0);
	    };

	    /**
	     * Scale this Vector down to specified "cap" length.
	     *   If Vector shorter than cap, or cap is Infinity, do nothing.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     *
	     * @method cap
	     * @return {Vector} capped vector
	     */
	    Vector.prototype.cap = function cap(cap) {
	        if (cap === Infinity) return _setFromVector.call(_register, this);
	        var norm = this.norm();
	        if (norm > cap) return _setFromVector.call(_register, this.mult(cap / norm));
	        else return _setFromVector.call(_register, this);
	    };

	    /**
	     * Return projection of this Vector onto another.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     *
	     * @method project
	     * @param {Vector} n vector to project upon
	     * @return {Vector} projected vector
	     */
	    Vector.prototype.project = function project(n) {
	        return n.mult(this.dot(n));
	    };

	    /**
	     * Reflect this Vector across provided vector.
	     *   Note: This sets the internal result register, so other references to that vector will change.
	     *
	     * @method reflectAcross
	     * @param {Vector} n vector to reflect across
	     * @return {Vector} reflected vector
	     */
	    Vector.prototype.reflectAcross = function reflectAcross(n) {
	        n.normalize().put(n);
	        return _setFromVector(_register, this.sub(this.project(n).mult(2)));
	    };

	    /**
	     * Convert Vector to three-element array.
	     *
	     * @method get
	     * @return {array<number>} three-element array
	     */
	    Vector.prototype.get = function get() {
	        return [this.x, this.y, this.z];
	    };

	    Vector.prototype.get1D = function() {
	        return this.x;
	    };

	    module.exports = Vector;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(35);

	    /**
	     * The Physics Engine is responsible for mediating bodies with their
	     *   interaction with forces and constraints (agents). Specifically, it
	     *   is responsible for:
	     *
	     *   - adding and removing bodies
	     *   - updating a body's state over time
	     *   - attaching and detaching agents
	     *   - sleeping upon equillibrium and waking upon excitation
	     *
	     * @class PhysicsEngine
	     * @constructor
	     * @param options {Object} options
	     */
	    function PhysicsEngine(options) {
	        this.options = Object.create(PhysicsEngine.DEFAULT_OPTIONS);
	        if (options) this.setOptions(options);

	        this._particles      = [];   //list of managed particles
	        this._bodies         = [];   //list of managed bodies
	        this._agentData      = {};   //hash of managed agent data
	        this._forces         = [];   //list of Ids of agents that are forces
	        this._constraints    = [];   //list of Ids of agents that are constraints

	        this._buffer         = 0.0;
	        this._prevTime       = now();
	        this._isSleeping     = false;
	        this._eventHandler   = null;
	        this._currAgentId    = 0;
	        this._hasBodies      = false;
	        this._eventHandler   = null;
	    }

	    /** const */
	    var TIMESTEP = 17;
	    var MIN_TIME_STEP = 1000 / 120;
	    var MAX_TIME_STEP = 17;

	    var now = Date.now;

	    // Catalogue of outputted events
	    var _events = {
	        start : 'start',
	        update : 'update',
	        end : 'end'
	    };

	    /**
	     * @property PhysicsEngine.DEFAULT_OPTIONS
	     * @type Object
	     * @protected
	     * @static
	     */
	    PhysicsEngine.DEFAULT_OPTIONS = {

	        /**
	         * The number of iterations the engine takes to resolve constraints
	         * @attribute constraintSteps
	         * @type Number
	         */
	        constraintSteps : 1,

	        /**
	         * The energy threshold required for the Physics Engine to update
	         * @attribute sleepTolerance
	         * @type Number
	         */
	        sleepTolerance : 1e-7,

	        /**
	         * The maximum velocity magnitude of a physics body
	         *      Range : [0, Infinity]
	         * @attribute velocityCap
	         * @type Number
	         */
	        velocityCap : undefined,

	        /**
	         * The maximum angular velocity magnitude of a physics body
	         *      Range : [0, Infinity]
	         * @attribute angularVelocityCap
	         * @type Number
	         */
	        angularVelocityCap : undefined
	    };

	    /**
	     * Options setter
	     *
	     * @method setOptions
	     * @param opts {Object}
	     */
	    PhysicsEngine.prototype.setOptions = function setOptions(opts) {
	        for (var key in opts) if (this.options[key]) this.options[key] = opts[key];
	    };

	    /**
	     * Method to add a physics body to the engine. Necessary to update the
	     *   body over time.
	     *
	     * @method addBody
	     * @param body {Body}
	     * @return body {Body}
	     */
	    PhysicsEngine.prototype.addBody = function addBody(body) {
	        body._engine = this;
	        if (body.isBody) {
	            this._bodies.push(body);
	            this._hasBodies = true;
	        }
	        else this._particles.push(body);
	        body.on('start', this.wake.bind(this));
	        return body;
	    };

	    /**
	     * Remove a body from the engine. Detaches body from all forces and
	     *   constraints.
	     *
	     * TODO: Fix for in loop
	     *
	     * @method removeBody
	     * @param body {Body}
	     */
	    PhysicsEngine.prototype.removeBody = function removeBody(body) {
	        var array = (body.isBody) ? this._bodies : this._particles;
	        var index = array.indexOf(body);
	        if (index > -1) {
	            for (var agent in this._agentData) this.detachFrom(agent.id, body);
	            array.splice(index,1);
	        }
	        if (this.getBodies().length === 0) this._hasBodies = false;
	    };

	    function _mapAgentArray(agent) {
	        if (agent.applyForce)      return this._forces;
	        if (agent.applyConstraint) return this._constraints;
	    }

	    function _attachOne(agent, targets, source) {
	        if (targets === undefined) targets = this.getParticlesAndBodies();
	        if (!(targets instanceof Array)) targets = [targets];

	        agent.on('change', this.wake.bind(this));

	        this._agentData[this._currAgentId] = {
	            agent   : agent,
	            id      : this._currAgentId,
	            targets : targets,
	            source  : source
	        };

	        _mapAgentArray.call(this, agent).push(this._currAgentId);
	        return this._currAgentId++;
	    }

	    /**
	     * Attaches a force or constraint to a Body. Returns an AgentId of the
	     *   attached agent which can be used to detach the agent.
	     *
	     * @method attach
	     * @param agents {Agent|Array.Agent} A force, constraint, or array of them.
	     * @param [targets=All] {Body|Array.Body} The Body or Bodies affected by the agent
	     * @param [source] {Body} The source of the agent
	     * @return AgentId {Number}
	     */
	    PhysicsEngine.prototype.attach = function attach(agents, targets, source) {
	        this.wake();

	        if (agents instanceof Array) {
	            var agentIDs = [];
	            for (var i = 0; i < agents.length; i++)
	                agentIDs[i] = _attachOne.call(this, agents[i], targets, source);
	            return agentIDs;
	        }
	        else return _attachOne.call(this, agents, targets, source);
	    };

	    /**
	     * Append a body to the targets of a previously defined physics agent.
	     *
	     * @method attachTo
	     * @param agentID {AgentId} The agentId of a previously defined agent
	     * @param target {Body} The Body affected by the agent
	     */
	    PhysicsEngine.prototype.attachTo = function attachTo(agentID, target) {
	        _getAgentData.call(this, agentID).targets.push(target);
	    };

	    /**
	     * Undoes PhysicsEngine.attach. Removes an agent and its associated
	     *   effect on its affected Bodies.
	     *
	     * @method detach
	     * @param id {AgentId} The agentId of a previously defined agent
	     */
	    PhysicsEngine.prototype.detach = function detach(id) {
	        // detach from forces/constraints array
	        var agent = this.getAgent(id);
	        var agentArray = _mapAgentArray.call(this, agent);
	        var index = agentArray.indexOf(id);
	        agentArray.splice(index,1);

	        // detach agents array
	        delete this._agentData[id];
	    };

	    /**
	     * Remove a single Body from a previously defined agent.
	     *
	     * @method detach
	     * @param id {AgentId} The agentId of a previously defined agent
	     * @param target {Body} The body to remove from the agent
	     */
	    PhysicsEngine.prototype.detachFrom = function detachFrom(id, target) {
	        var boundAgent = _getAgentData.call(this, id);
	        if (boundAgent.source === target) this.detach(id);
	        else {
	            var targets = boundAgent.targets;
	            var index = targets.indexOf(target);
	            if (index > -1) targets.splice(index,1);
	        }
	    };

	    /**
	     * A convenience method to give the Physics Engine a clean slate of
	     * agents. Preserves all added Body objects.
	     *
	     * @method detachAll
	     */
	    PhysicsEngine.prototype.detachAll = function detachAll() {
	        this._agentData     = {};
	        this._forces        = [];
	        this._constraints   = [];
	        this._currAgentId   = 0;
	    };

	    function _getAgentData(id) {
	        return this._agentData[id];
	    }

	    /**
	     * Returns the corresponding agent given its agentId.
	     *
	     * @method getAgent
	     * @param id {AgentId}
	     */
	    PhysicsEngine.prototype.getAgent = function getAgent(id) {
	        return _getAgentData.call(this, id).agent;
	    };

	    /**
	     * Returns all particles that are currently managed by the Physics Engine.
	     *
	     * @method getParticles
	     * @return particles {Array.Particles}
	     */
	    PhysicsEngine.prototype.getParticles = function getParticles() {
	        return this._particles;
	    };

	    /**
	     * Returns all bodies, except particles, that are currently managed by the Physics Engine.
	     *
	     * @method getBodies
	     * @return bodies {Array.Bodies}
	     */
	    PhysicsEngine.prototype.getBodies = function getBodies() {
	        return this._bodies;
	    };

	    /**
	     * Returns all bodies that are currently managed by the Physics Engine.
	     *
	     * @method getBodies
	     * @return bodies {Array.Bodies}
	     */
	    PhysicsEngine.prototype.getParticlesAndBodies = function getParticlesAndBodies() {
	        return this.getParticles().concat(this.getBodies());
	    };

	    /**
	     * Iterates over every Particle and applies a function whose first
	     *   argument is the Particle
	     *
	     * @method forEachParticle
	     * @param fn {Function} Function to iterate over
	     * @param [dt] {Number} Delta time
	     */
	    PhysicsEngine.prototype.forEachParticle = function forEachParticle(fn, dt) {
	        var particles = this.getParticles();
	        for (var index = 0, len = particles.length; index < len; index++)
	            fn.call(this, particles[index], dt);
	    };

	    /**
	     * Iterates over every Body that isn't a Particle and applies
	     *   a function whose first argument is the Body
	     *
	     * @method forEachBody
	     * @param fn {Function} Function to iterate over
	     * @param [dt] {Number} Delta time
	     */
	    PhysicsEngine.prototype.forEachBody = function forEachBody(fn, dt) {
	        if (!this._hasBodies) return;
	        var bodies = this.getBodies();
	        for (var index = 0, len = bodies.length; index < len; index++)
	            fn.call(this, bodies[index], dt);
	    };

	    /**
	     * Iterates over every Body and applies a function whose first
	     *   argument is the Body
	     *
	     * @method forEach
	     * @param fn {Function} Function to iterate over
	     * @param [dt] {Number} Delta time
	     */
	    PhysicsEngine.prototype.forEach = function forEach(fn, dt) {
	        this.forEachParticle(fn, dt);
	        this.forEachBody(fn, dt);
	    };

	    function _updateForce(index) {
	        var boundAgent = _getAgentData.call(this, this._forces[index]);
	        boundAgent.agent.applyForce(boundAgent.targets, boundAgent.source);
	    }

	    function _updateForces() {
	        for (var index = this._forces.length - 1; index > -1; index--)
	            _updateForce.call(this, index);
	    }

	    function _updateConstraint(index, dt) {
	        var boundAgent = this._agentData[this._constraints[index]];
	        return boundAgent.agent.applyConstraint(boundAgent.targets, boundAgent.source, dt);
	    }

	    function _updateConstraints(dt) {
	        var iteration = 0;
	        while (iteration < this.options.constraintSteps) {
	            for (var index = this._constraints.length - 1; index > -1; index--)
	                _updateConstraint.call(this, index, dt);
	            iteration++;
	        }
	    }

	    function _updateVelocities(body, dt) {
	        body.integrateVelocity(dt);
	        if (this.options.velocityCap)
	            body.velocity.cap(this.options.velocityCap).put(body.velocity);
	    }

	    function _updateAngularVelocities(body, dt) {
	        body.integrateAngularMomentum(dt);
	        body.updateAngularVelocity();
	        if (this.options.angularVelocityCap)
	            body.angularVelocity.cap(this.options.angularVelocityCap).put(body.angularVelocity);
	    }

	    function _updateOrientations(body, dt) {
	        body.integrateOrientation(dt);
	    }

	    function _updatePositions(body, dt) {
	        body.integratePosition(dt);
	        body.emit(_events.update, body);
	    }

	    function _integrate(dt) {
	        _updateForces.call(this, dt);
	        this.forEach(_updateVelocities, dt);
	        this.forEachBody(_updateAngularVelocities, dt);
	        _updateConstraints.call(this, dt);
	        this.forEachBody(_updateOrientations, dt);
	        this.forEach(_updatePositions, dt);
	    }

	    function _getParticlesEnergy() {
	        var energy = 0.0;
	        var particleEnergy = 0.0;
	        this.forEach(function(particle) {
	            particleEnergy = particle.getEnergy();
	            energy += particleEnergy;
	        });
	        return energy;
	    }

	    function _getAgentsEnergy() {
	        var energy = 0;
	        for (var id in this._agentData)
	            energy += this.getAgentEnergy(id);
	        return energy;
	    }

	    /**
	     * Calculates the potential energy of an agent, like a spring, by its Id
	     *
	     * @method getAgentEnergy
	     * @param agentId {Number} The attached agent Id
	     * @return energy {Number}
	     */
	    PhysicsEngine.prototype.getAgentEnergy = function(agentId) {
	        var agentData = _getAgentData.call(this, agentId);
	        return agentData.agent.getEnergy(agentData.targets, agentData.source);
	    };

	    /**
	     * Calculates the kinetic energy of all Body objects and potential energy
	     *   of all attached agents.
	     *
	     * TODO: implement.
	     * @method getEnergy
	     * @return energy {Number}
	     */
	    PhysicsEngine.prototype.getEnergy = function getEnergy() {
	        return _getParticlesEnergy.call(this) + _getAgentsEnergy.call(this);
	    };

	    /**
	     * Updates all Body objects managed by the physics engine over the
	     *   time duration since the last time step was called.
	     *
	     * @method step
	     */
	    PhysicsEngine.prototype.step = function step() {
	        if (this.isSleeping()) return;

	        //set current frame's time
	        var currTime = now();

	        //milliseconds elapsed since last frame
	        var dtFrame = currTime - this._prevTime;

	        this._prevTime = currTime;

	        if (dtFrame < MIN_TIME_STEP) return;
	        if (dtFrame > MAX_TIME_STEP) dtFrame = MAX_TIME_STEP;

	        //robust integration
	//        this._buffer += dtFrame;
	//        while (this._buffer > this._timestep){
	//            _integrate.call(this, this._timestep);
	//            this._buffer -= this._timestep;
	//        };
	//        _integrate.call(this, this._buffer);
	//        this._buffer = 0.0;

	        _integrate.call(this, TIMESTEP);

	        this.emit(_events.update, this);

	        if (this.getEnergy() < this.options.sleepTolerance) this.sleep();
	    };

	    /**
	     * Tells whether the Physics Engine is sleeping or awake.
	     *
	     * @method isSleeping
	     * @return {Boolean}
	     */
	    PhysicsEngine.prototype.isSleeping = function isSleeping() {
	        return this._isSleeping;
	    };

	    /**
	     * Tells whether the Physics Engine is sleeping or awake.
	     *
	     * @method isActive
	     * @return {Boolean}
	     */
	    PhysicsEngine.prototype.isActive = function isSleeping() {
	        return !this._isSleeping;
	    };

	    /**
	     * Stops the Physics Engine update loop. Emits an 'end' event.
	     *
	     * @method sleep
	     */
	    PhysicsEngine.prototype.sleep = function sleep() {
	        if (this._isSleeping) return;
	        this.forEach(function(body) {
	            body.sleep();
	        });
	        this.emit(_events.end, this);
	        this._isSleeping = true;
	    };

	    /**
	     * Restarts the Physics Engine update loop. Emits an 'start' event.
	     *
	     * @method wake
	     */
	    PhysicsEngine.prototype.wake = function wake() {
	        if (!this._isSleeping) return;
	        this._prevTime = now();
	        this.emit(_events.start, this);
	        this._isSleeping = false;
	    };

	    PhysicsEngine.prototype.emit = function emit(type, data) {
	        if (this._eventHandler === null) return;
	        this._eventHandler.emit(type, data);
	    };

	    PhysicsEngine.prototype.on = function on(event, fn) {
	        if (this._eventHandler === null) this._eventHandler = new EventHandler();
	        this._eventHandler.on(event, fn);
	    };

	    module.exports = PhysicsEngine;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Vector = __webpack_require__(42);
	    var Transform = __webpack_require__(23);
	    var EventHandler = __webpack_require__(35);
	    var Integrator = __webpack_require__(59);

	    /**
	     * A point body that is controlled by the Physics Engine. A particle has
	     *   position and velocity states that are updated by the Physics Engine.
	     *   Ultimately, a particle is a special type of modifier, and can be added to
	     *   the Famo.us Scene Graph like any other modifier.
	     *
	     * @class Particle
	     * @uses EventHandler
	     * @extensionfor Body
	     *
	     * @param [options] {Options}           An object of configurable options.
	     * @param [options.position] {Array}    The position of the particle.
	     * @param [options.velocity] {Array}    The velocity of the particle.
	     * @param [options.mass] {Number}       The mass of the particle.
	     */
	     function Particle(options) {
	        options = options || {};
	        var defaults = Particle.DEFAULT_OPTIONS;

	        // registers
	        this.position = new Vector();
	        this.velocity = new Vector();
	        this.force = new Vector();

	        // state variables
	        this._engine = null;
	        this._isSleeping = true;
	        this._eventOutput = null;

	        // set scalars
	        this.mass = (options.mass !== undefined)
	            ? options.mass
	            : defaults.mass;

	        this.inverseMass = 1 / this.mass;

	        // set vectors
	        this.setPosition(options.position || defaults.position);
	        this.setVelocity(options.velocity || defaults.velocity);
	        this.force.set(options.force || [0,0,0]);

	        this.transform = Transform.identity.slice();

	        // cached _spec
	        this._spec = {
	            size : [true, true],
	            target : {
	                transform : this.transform,
	                origin : [0.5, 0.5],
	                target : null
	            }
	        };
	    }

	    Particle.DEFAULT_OPTIONS = {
	        position : [0, 0, 0],
	        velocity : [0, 0, 0],
	        mass : 1
	    };

	    //Catalogue of outputted events
	    var _events = {
	        start : 'start',
	        update : 'update',
	        end : 'end'
	    };

	    // Cached timing function
	    var now = Date.now;

	    /**
	     * @attribute isBody
	     * @type Boolean
	     * @static
	     */
	    Particle.prototype.isBody = false;

	    /**
	     * Determines if particle is active
	     *
	     * @method isActive
	     * @return {Boolean}
	     */
	    Particle.prototype.isActive = function isActive() {
	        return !this._isSleeping;
	    };

	    /**
	     * Stops the particle from updating
	     *
	     * @method sleep
	     */
	    Particle.prototype.sleep = function sleep() {
	        if (this._isSleeping) return;
	        this.emit(_events.end, this);
	        this._isSleeping = true;
	    };

	    /**
	     * Starts the particle update
	     *
	     * @method wake
	     */
	    Particle.prototype.wake = function wake() {
	        if (!this._isSleeping) return;
	        this.emit(_events.start, this);
	        this._isSleeping = false;
	        this._prevTime = now();
	        if (this._engine) this._engine.wake();
	    };

	    /**
	     * Basic setter for position
	     *
	     * @method setPosition
	     * @param position {Array|Vector}
	     */
	    Particle.prototype.setPosition = function setPosition(position) {
	        this.position.set(position);
	    };

	    /**
	     * 1-dimensional setter for position
	     *
	     * @method setPosition1D
	     * @param x {Number}
	     */
	    Particle.prototype.setPosition1D = function setPosition1D(x) {
	        this.position.x = x;
	    };

	    /**
	     * Basic getter function for position
	     *
	     * @method getPosition
	     * @return position {Array}
	     */
	    Particle.prototype.getPosition = function getPosition() {
	        this._engine.step();
	        return this.position.get();
	    };

	    /**
	     * 1-dimensional getter for position
	     *
	     * @method getPosition1D
	     * @return value {Number}
	     */
	    Particle.prototype.getPosition1D = function getPosition1D() {
	        this._engine.step();
	        return this.position.x;
	    };

	    /**
	     * Basic setter function for velocity Vector
	     *
	     * @method setVelocity
	     * @function
	     */
	    Particle.prototype.setVelocity = function setVelocity(velocity) {
	        this.velocity.set(velocity);
	        if (!(velocity[0] === 0 && velocity[1] === 0 && velocity[2] === 0))
	            this.wake();
	    };

	    /**
	     * 1-dimensional setter for velocity
	     *
	     * @method setVelocity1D
	     * @param x {Number}
	     */
	    Particle.prototype.setVelocity1D = function setVelocity1D(x) {
	        this.velocity.x = x;
	        if (x !== 0) this.wake();
	    };

	    /**
	     * Basic getter function for velocity Vector
	     *
	     * @method getVelocity
	     * @return velocity {Array}
	     */
	    Particle.prototype.getVelocity = function getVelocity() {
	        return this.velocity.get();
	    };

	    /**
	     * Basic setter function for force Vector
	     *
	     * @method setForce
	     * @return force {Array}
	     */
	    Particle.prototype.setForce = function setForce(force) {
	        this.force.set(force);
	        this.wake();
	    };

	    /**
	     * 1-dimensional getter for velocity
	     *
	     * @method getVelocity1D
	     * @return velocity {Number}
	     */
	    Particle.prototype.getVelocity1D = function getVelocity1D() {
	        return this.velocity.x;
	    };

	    /**
	     * Basic setter function for mass quantity
	     *
	     * @method setMass
	     * @param mass {Number} mass
	     */
	    Particle.prototype.setMass = function setMass(mass) {
	        this.mass = mass;
	        this.inverseMass = 1 / mass;
	    };

	    /**
	     * Basic getter function for mass quantity
	     *
	     * @method getMass
	     * @return mass {Number}
	     */
	    Particle.prototype.getMass = function getMass() {
	        return this.mass;
	    };

	    /**
	     * Reset position and velocity
	     *
	     * @method reset
	     * @param position {Array|Vector}
	     * @param velocity {Array|Vector}
	     */
	    Particle.prototype.reset = function reset(position, velocity) {
	        this.setPosition(position || [0,0,0]);
	        this.setVelocity(velocity || [0,0,0]);
	    };

	    /**
	     * Add force vector to existing internal force Vector
	     *
	     * @method applyForce
	     * @param force {Vector}
	     */
	    Particle.prototype.applyForce = function applyForce(force) {
	        if (force.isZero()) return;
	        this.force.add(force).put(this.force);
	        this.wake();
	    };

	    /**
	     * Add impulse (change in velocity) Vector to this Vector's velocity.
	     *
	     * @method applyImpulse
	     * @param impulse {Vector}
	     */
	    Particle.prototype.applyImpulse = function applyImpulse(impulse) {
	        if (impulse.isZero()) return;
	        var velocity = this.velocity;
	        velocity.add(impulse.mult(this.inverseMass)).put(velocity);
	    };

	    /**
	     * Update a particle's velocity from its force accumulator
	     *
	     * @method integrateVelocity
	     * @param dt {Number} Time differential
	     */
	    Particle.prototype.integrateVelocity = function integrateVelocity(dt) {
	        Integrator.integrateVelocity(this, dt);
	    };

	    /**
	     * Update a particle's position from its velocity
	     *
	     * @method integratePosition
	     * @param dt {Number} Time differential
	     */
	    Particle.prototype.integratePosition = function integratePosition(dt) {
	        Integrator.integratePosition(this, dt);
	    };

	    /**
	     * Update the position and velocity of the particle
	     *
	     * @method _integrate
	     * @protected
	     * @param dt {Number} Time differential
	     */
	    Particle.prototype._integrate = function _integrate(dt) {
	        this.integrateVelocity(dt);
	        this.integratePosition(dt);
	    };

	    /**
	     * Get kinetic energy of the particle.
	     *
	     * @method getEnergy
	     * @function
	     */
	    Particle.prototype.getEnergy = function getEnergy() {
	        return 0.5 * this.mass * this.velocity.normSquared();
	    };

	    /**
	     * Generate transform from the current position state
	     *
	     * @method getTransform
	     * @return Transform {Transform}
	     */
	    Particle.prototype.getTransform = function getTransform() {
	        this._engine.step();

	        var position = this.position;
	        var transform = this.transform;

	        transform[12] = position.x;
	        transform[13] = position.y;
	        transform[14] = position.z;
	        return transform;
	    };

	    /**
	     * The modify interface of a Modifier
	     *
	     * @method modify
	     * @param target {Spec}
	     * @return Spec {Spec}
	     */
	    Particle.prototype.modify = function modify(target) {
	        var _spec = this._spec.target;
	        _spec.transform = this.getTransform();
	        _spec.target = target;
	        return this._spec;
	    };

	    // private
	    function _createEventOutput() {
	        this._eventOutput = new EventHandler();
	        this._eventOutput.bindThis(this);
	        EventHandler.setOutputHandler(this, this._eventOutput);
	    }

	    Particle.prototype.emit = function emit(type, data) {
	        if (!this._eventOutput) return;
	        this._eventOutput.emit(type, data);
	    };

	    Particle.prototype.on = function on() {
	        _createEventOutput.call(this);
	        return this.on.apply(this, arguments);
	    };

	    Particle.prototype.removeListener = function removeListener() {
	        _createEventOutput.call(this);
	        return this.removeListener.apply(this, arguments);
	    };

	    Particle.prototype.pipe = function pipe() {
	        _createEventOutput.call(this);
	        return this.pipe.apply(this, arguments);
	    };

	    Particle.prototype.unpipe = function unpipe() {
	        _createEventOutput.call(this);
	        return this.unpipe.apply(this, arguments);
	    };

	    module.exports = Particle;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Force = __webpack_require__(56);

	    /**
	     * Drag is a force that opposes velocity. Attach it to the physics engine
	     * to slow down a physics body in motion.
	     *
	     * @class Drag
	     * @constructor
	     * @extends Force
	     * @param {Object} options options to set on drag
	     */
	    function Drag(options) {
	        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
	        if (options) this.setOptions(options);

	        Force.call(this);
	    }

	    Drag.prototype = Object.create(Force.prototype);
	    Drag.prototype.constructor = Drag;

	    /**
	     * @property Drag.FORCE_FUNCTIONS
	     * @type Object
	     * @protected
	     * @static
	     */
	    Drag.FORCE_FUNCTIONS = {

	        /**
	         * A drag force proportional to the velocity
	         * @attribute LINEAR
	         * @type Function
	         * @param {Vector} velocity
	         * @return {Vector} drag force
	         */
	        LINEAR : function(velocity) {
	            return velocity;
	        },

	        /**
	         * A drag force proportional to the square of the velocity
	         * @attribute QUADRATIC
	         * @type Function
	         * @param {Vector} velocity
	         * @return {Vector} drag force
	         */
	        QUADRATIC : function(velocity) {
	            return velocity.mult(velocity.norm());
	        }
	    };

	    /**
	     * @property Drag.DEFAULT_OPTIONS
	     * @type Object
	     * @protected
	     * @static
	     */
	    Drag.DEFAULT_OPTIONS = {

	        /**
	         * The strength of the force
	         *    Range : [0, 0.1]
	         * @attribute strength
	         * @type Number
	         * @default 0.01
	         */
	        strength : 0.01,

	        /**
	         * The type of opposing force
	         * @attribute forceFunction
	         * @type Function
	         */
	        forceFunction : Drag.FORCE_FUNCTIONS.LINEAR
	    };

	    /**
	     * Adds a drag force to a physics body's force accumulator.
	     *
	     * @method applyForce
	     * @param targets {Array.Body} Array of bodies to apply drag force to.
	     */
	    Drag.prototype.applyForce = function applyForce(targets) {
	        var strength        = this.options.strength;
	        var forceFunction   = this.options.forceFunction;
	        var force           = this.force;
	        var index;
	        var particle;

	        for (index = 0; index < targets.length; index++) {
	            particle = targets[index];
	            forceFunction(particle.velocity).mult(-strength).put(force);
	            particle.applyForce(force);
	        }
	    };

	    /**
	     * Basic options setter
	     *
	     * @method setOptions
	     * @param {Objects} options
	     */
	    Drag.prototype.setOptions = function setOptions(options) {
	        for (var key in options) this.options[key] = options[key];
	    };

	    module.exports = Drag;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/*global console */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Force = __webpack_require__(56);
	    var Vector = __webpack_require__(42);

	    /**
	     *  A force that moves a physics body to a location with a spring motion.
	     *    The body can be moved to another physics body, or an anchor point.
	     *
	     *  @class Spring
	     *  @constructor
	     *  @extends Force
	     *  @param {Object} options options to set on drag
	     */
	    function Spring(options) {
	        Force.call(this);

	        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
	        if (options) this.setOptions(options);

	        //registers
	        this.disp = new Vector(0,0,0);

	        _init.call(this);
	    }

	    Spring.prototype = Object.create(Force.prototype);
	    Spring.prototype.constructor = Spring;

	    /** @const */
	    var pi = Math.PI;
	    var MIN_PERIOD = 150;

	    /**
	     * @property Spring.FORCE_FUNCTIONS
	     * @type Object
	     * @protected
	     * @static
	     */
	    Spring.FORCE_FUNCTIONS = {

	        /**
	         * A FENE (Finitely Extensible Nonlinear Elastic) spring force
	         *      see: http://en.wikipedia.org/wiki/FENE
	         * @attribute FENE
	         * @type Function
	         * @param {Number} dist current distance target is from source body
	         * @param {Number} rMax maximum range of influence
	         * @return {Number} unscaled force
	         */
	        FENE : function(dist, rMax) {
	            var rMaxSmall = rMax * .99;
	            var r = Math.max(Math.min(dist, rMaxSmall), -rMaxSmall);
	            return r / (1 - r * r/(rMax * rMax));
	        },

	        /**
	         * A Hookean spring force, linear in the displacement
	         *      see: http://en.wikipedia.org/wiki/Hooke's_law
	         * @attribute FENE
	         * @type Function
	         * @param {Number} dist current distance target is from source body
	         * @return {Number} unscaled force
	         */
	        HOOK : function(dist) {
	            return dist;
	        }
	    };

	    /**
	     * @property Spring.DEFAULT_OPTIONS
	     * @type Object
	     * @protected
	     * @static
	     */
	    Spring.DEFAULT_OPTIONS = {

	        /**
	         * The amount of time in milliseconds taken for one complete oscillation
	         * when there is no damping
	         *    Range : [150, Infinity]
	         * @attribute period
	         * @type Number
	         * @default 300
	         */
	        period : 300,

	        /**
	         * The damping of the spring.
	         *    Range : [0, 1]
	         *    0 = no damping, and the spring will oscillate forever
	         *    1 = critically damped (the spring will never oscillate)
	         * @attribute dampingRatio
	         * @type Number
	         * @default 0.1
	         */
	        dampingRatio : 0.1,

	        /**
	         * The rest length of the spring
	         *    Range : [0, Infinity]
	         * @attribute length
	         * @type Number
	         * @default 0
	         */
	        length : 0,

	        /**
	         * The maximum length of the spring (for a FENE spring)
	         *    Range : [0, Infinity]
	         * @attribute length
	         * @type Number
	         * @default Infinity
	         */
	        maxLength : Infinity,

	        /**
	         * The location of the spring's anchor, if not another physics body
	         *
	         * @attribute anchor
	         * @type Array
	         * @optional
	         */
	        anchor : undefined,

	        /**
	         * The type of spring force
	         * @attribute forceFunction
	         * @type Function
	         */
	        forceFunction : Spring.FORCE_FUNCTIONS.HOOK
	    };

	    function _calcStiffness() {
	        var options = this.options;
	        options.stiffness = Math.pow(2 * pi / options.period, 2);
	    }

	    function _calcDamping() {
	        var options = this.options;
	        options.damping = 4 * pi * options.dampingRatio / options.period;
	    }

	    function _init() {
	        _calcStiffness.call(this);
	        _calcDamping.call(this);
	    }

	    /**
	     * Basic options setter
	     *
	     * @method setOptions
	     * @param options {Object}
	     */
	    Spring.prototype.setOptions = function setOptions(options) {
	        // TODO fix no-console error
	        /* eslint no-console: 0 */

	        if (options.anchor !== undefined) {
	            if (options.anchor.position instanceof Vector) this.options.anchor = options.anchor.position;
	            if (options.anchor instanceof Vector) this.options.anchor = options.anchor;
	            if (options.anchor instanceof Array)  this.options.anchor = new Vector(options.anchor);
	        }

	        if (options.period !== undefined){
	            if (options.period < MIN_PERIOD) {
	                options.period = MIN_PERIOD;
	                console.warn('The period of a SpringTransition is capped at ' + MIN_PERIOD + ' ms. Use a SnapTransition for faster transitions');
	            }
	            this.options.period = options.period;
	        }

	        if (options.dampingRatio !== undefined) this.options.dampingRatio = options.dampingRatio;
	        if (options.length !== undefined) this.options.length = options.length;
	        if (options.forceFunction !== undefined) this.options.forceFunction = options.forceFunction;
	        if (options.maxLength !== undefined) this.options.maxLength = options.maxLength;

	        _init.call(this);
	        Force.prototype.setOptions.call(this, options);
	    };

	    /**
	     * Adds a spring force to a physics body's force accumulator.
	     *
	     * @method applyForce
	     * @param targets {Array.Body} Array of bodies to apply force to.
	     */
	    Spring.prototype.applyForce = function applyForce(targets, source) {
	        var force = this.force;
	        var disp = this.disp;
	        var options = this.options;

	        var stiffness = options.stiffness;
	        var damping = options.damping;
	        var restLength = options.length;
	        var maxLength = options.maxLength;
	        var anchor = options.anchor || source.position;
	        var forceFunction = options.forceFunction;

	        var i;
	        var target;
	        var p2;
	        var v2;
	        var dist;
	        var m;

	        for (i = 0; i < targets.length; i++) {
	            target = targets[i];
	            p2 = target.position;
	            v2 = target.velocity;

	            anchor.sub(p2).put(disp);
	            dist = disp.norm() - restLength;

	            if (dist === 0) return;

	            //if dampingRatio specified, then override strength and damping
	            m      = target.mass;
	            stiffness *= m;
	            damping   *= m;

	            disp.normalize(stiffness * forceFunction(dist, maxLength))
	                .put(force);

	            if (damping)
	                if (source) force.add(v2.sub(source.velocity).mult(-damping)).put(force);
	                else force.add(v2.mult(-damping)).put(force);

	            target.applyForce(force);
	            if (source) source.applyForce(force.mult(-1));
	        }
	    };

	    /**
	     * Calculates the potential energy of the spring.
	     *
	     * @method getEnergy
	     * @param [targets] target  The physics body attached to the spring
	     * @return {source}         The potential energy of the spring
	     */
	    Spring.prototype.getEnergy = function getEnergy(targets, source) {
	        var options     = this.options;
	        var restLength  = options.length;
	        var anchor      = (source) ? source.position : options.anchor;
	        var strength    = options.stiffness;

	        var energy = 0.0;
	        for (var i = 0; i < targets.length; i++){
	            var target = targets[i];
	            var dist = anchor.sub(target.position).norm() - restLength;
	            energy += 0.5 * strength * dist * dist;
	        }
	        return energy;
	    };

	    module.exports = Spring;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(35);
	    var Engine = __webpack_require__(19);
	    var OptionsManager = __webpack_require__(38);

	    /**
	     * Handles piped in mousewheel events.
	     *   Emits 'start', 'update', and 'end' events with payloads including:
	     *   delta: change since last position,
	     *   position: accumulated deltas,
	     *   velocity: speed of change in pixels per ms,
	     *   slip: true (unused).
	     *
	     *   Can be used as delegate of GenericSync.
	     *
	     * @class ScrollSync
	     * @constructor
	     * @param {Object} [options] overrides of default options
	     * @param {Number} [options.direction] Pay attention to x changes (ScrollSync.DIRECTION_X),
	     *   y changes (ScrollSync.DIRECTION_Y) or both (undefined)
	     * @param {Number} [options.minimumEndSpeed] End speed calculation floors at this number, in pixels per ms
	     * @param {boolean} [options.rails] whether to snap position calculations to nearest axis
	     * @param {Number | Array.Number} [options.scale] scale outputs in by scalar or pair of scalars
	     * @param {Number} [options.stallTime] reset time for velocity calculation in ms
	     */
	    function ScrollSync(options) {
	        this.options = Object.create(ScrollSync.DEFAULT_OPTIONS);
	        this._optionsManager = new OptionsManager(this.options);
	        if (options) this.setOptions(options);

	        this._payload = {
	            delta    : null,
	            position : null,
	            velocity : null,
	            slip     : true
	        };

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._position = (this.options.direction === undefined) ? [0,0] : 0;
	        this._prevTime = undefined;
	        this._prevVel = undefined;
	        this._eventInput.on('mousewheel', _handleMove.bind(this));
	        this._eventInput.on('wheel', _handleMove.bind(this));
	        this._inProgress = false;
	        this._loopBound = false;
	    }

	    ScrollSync.DEFAULT_OPTIONS = {
	        direction: undefined,
	        minimumEndSpeed: Infinity,
	        rails: false,
	        scale: 1,
	        stallTime: 50,
	        lineHeight: 40,
	        preventDefault: true
	    };

	    ScrollSync.DIRECTION_X = 0;
	    ScrollSync.DIRECTION_Y = 1;

	    var MINIMUM_TICK_TIME = 8;

	    var _now = Date.now;

	    function _newFrame() {
	        if (this._inProgress && (_now() - this._prevTime) > this.options.stallTime) {
	            this._inProgress = false;

	            var finalVel = (Math.abs(this._prevVel) >= this.options.minimumEndSpeed)
	                ? this._prevVel
	                : 0;

	            var payload = this._payload;
	            payload.position = this._position;
	            payload.velocity = finalVel;
	            payload.slip = true;

	            this._eventOutput.emit('end', payload);
	        }
	    }

	    function _handleMove(event) {
	        if (this.options.preventDefault) event.preventDefault();

	        if (!this._inProgress) {
	            this._inProgress = true;
	            this._position = (this.options.direction === undefined) ? [0,0] : 0;
	            payload = this._payload;
	            payload.slip = true;
	            payload.position = this._position;
	            payload.clientX = event.clientX;
	            payload.clientY = event.clientY;
	            payload.offsetX = event.offsetX;
	            payload.offsetY = event.offsetY;
	            this._eventOutput.emit('start', payload);
	            if (!this._loopBound) {
	                Engine.on('prerender', _newFrame.bind(this));
	                this._loopBound = true;
	            }
	        }

	        var currTime = _now();
	        var prevTime = this._prevTime || currTime;

	        var diffX = (event.wheelDeltaX !== undefined) ? event.wheelDeltaX : -event.deltaX;
	        var diffY = (event.wheelDeltaY !== undefined) ? event.wheelDeltaY : -event.deltaY;

	        if (event.deltaMode === 1) { // units in lines, not pixels
	            diffX *= this.options.lineHeight;
	            diffY *= this.options.lineHeight;
	        }

	        if (this.options.rails) {
	            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
	            else diffX = 0;
	        }

	        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time

	        var velX = diffX / diffTime;
	        var velY = diffY / diffTime;

	        var scale = this.options.scale;
	        var nextVel;
	        var nextDelta;

	        if (this.options.direction === ScrollSync.DIRECTION_X) {
	            nextDelta = scale * diffX;
	            nextVel = scale * velX;
	            this._position += nextDelta;
	        }
	        else if (this.options.direction === ScrollSync.DIRECTION_Y) {
	            nextDelta = scale * diffY;
	            nextVel = scale * velY;
	            this._position += nextDelta;
	        }
	        else {
	            nextDelta = [scale * diffX, scale * diffY];
	            nextVel = [scale * velX, scale * velY];
	            this._position[0] += nextDelta[0];
	            this._position[1] += nextDelta[1];
	        }

	        var payload = this._payload;
	        payload.delta    = nextDelta;
	        payload.velocity = nextVel;
	        payload.position = this._position;
	        payload.slip     = true;

	        this._eventOutput.emit('update', payload);

	        this._prevTime = currTime;
	        this._prevVel = nextVel;
	    }

	    /**
	     * Return entire options dictionary, including defaults.
	     *
	     * @method getOptions
	     * @return {Object} configuration options
	     */
	    ScrollSync.prototype.getOptions = function getOptions() {
	        return this.options;
	    };

	    /**
	     * Set internal options, overriding any default options
	     *
	     * @method setOptions
	     *
	     * @param {Object} [options] overrides of default options
	     * @param {Number} [options.minimimEndSpeed] If final velocity smaller than this, round down to 0.
	     * @param {Number} [options.stallTime] ms of non-motion before 'end' emitted
	     * @param {Number} [options.rails] whether to constrain to nearest axis.
	     * @param {Number} [options.direction] ScrollSync.DIRECTION_X, DIRECTION_Y -
	     *    pay attention to one specific direction.
	     * @param {Number} [options.scale] constant factor to scale velocity output
	     */
	    ScrollSync.prototype.setOptions = function setOptions(options) {
	        return this._optionsManager.setOptions(options);
	    };

	    module.exports = ScrollSync;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define*/

	/**
	 * LayoutDockHelper helps positioning nodes using docking principles.
	 *
	 * **Example:**
	 *
	 * ```javascript
	 * var LayoutDockHelper = require('famous-flex/helpers/LayoutDockHelper');
	 *
	 * function HeaderFooterLayout(context, options) {
	 *   var dock = new LayoutDockHelper(context);
	 *   dock.top('header', options.headerHeight);
	 *   dock.bottom('footer', options.footerHeight);
	 *   dock.fill('content');
	 * };
	 * ```
	 *
	 * You can also use layout-literals to create layouts using docking semantics:
	 *
	 * ```javascript
	 * var layoutController = new LayoutController({
	 *   layout: {dock: [
	 *     ['top', 'header', 40],
	 *     ['bottom', 'footer', 40, 1], // z-index +1
	 *     ['fill', 'content']
	 *   ]},
	 *   dataSource: {
	 *     header: new Surface({content: 'header'}),
	 *     footer: new Surface({content: 'footer'}),
	 *     content: new Surface({content: 'content'}),
	 *   }
	 * });
	 * ```
	 *
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    // import dependencies
	    var LayoutUtility = __webpack_require__(31);

	    /**
	     * @class
	     * @param {LayoutContext} context layout-context
	     * @param {Object} [options] additional options
	     * @param {Object} [options.margins] margins to start out with (default: 0px)
	     * @param {Number} [options.translateZ] z-index to use when translating objects (default: 0)
	     * @alias module:LayoutDockHelper
	     */
	    function LayoutDockHelper(context, options) {
	        var size = context.size;
	        this._size = size;
	        this._context = context;
	        this._options = options;
	        this._z = (options && options.translateZ) ? options.translateZ : 0;
	        if (options && options.margins) {
	            var margins = LayoutUtility.normalizeMargins(options.margins);
	            this._left = margins[3];
	            this._top = margins[0];
	            this._right = size[0] - margins[1];
	            this._bottom = size[1] - margins[2];
	        }
	        else {
	            this._left = 0;
	            this._top = 0;
	            this._right = size[0];
	            this._bottom = size[1];
	        }
	    }

	    /**
	     * Parses the layout-rules based on a JSON data object.
	     * The object should be an array with the following syntax:
	     * `[[rule, node, value, z], [rule, node, value, z], ...]`
	     *
	     * **Example:**
	     *
	     * ```JSON
	     * [
	     *   ['top': 'header', 50],
	     *   ['bottom': 'footer', 50, 10], // z-index: 10
	     *   ['fill', 'content']
	     * ]
	     * ```
	     *
	     * @param {Object} data JSON object
	     */
	    LayoutDockHelper.prototype.parse = function(data) {
	        for (var i = 0; i < data.length; i++) {
	            var rule = data[i];
	            var value = (data.length >= 3) ? rule[2] : undefined;
	            if (rule[0] === 'top') {
	                this.top(rule[1], value, (data.length >=4) ? rule[3] : undefined);
	            } else if (rule[0] === 'left') {
	                this.left(rule[1], value, (data.length >=4) ? rule[3] : undefined);
	            } else if (rule[0] === 'right') {
	                this.right(rule[1], value, (data.length >=4) ? rule[3] : undefined);
	            } else if (rule[0] === 'bottom') {
	                this.bottom(rule[1], value, (data.length >=4) ? rule[3] : undefined);
	            } else if (rule[0] === 'fill') {
	                this.fill(rule[1], (data.length >=3) ? rule[2] : undefined);
	            }
	        }
	    };

	    /**
	     * Dock the node to the top.
	     *
	     * @param {LayoutNode|String} [node] layout-node to dock, when ommited the `height` argument argument is used for padding
	     * @param {Number} [height] height of the layout-node, when ommited the height of the node is used
	     * @param {Number} [z] z-index to use for the node}
	     * @return {LayoutDockHelper} this
	     */
	    LayoutDockHelper.prototype.top = function(node, height, z) {
	        if (height instanceof Array) {
	            height = height[1];
	        }
	        if (height === undefined) {
	            var size = this._context.resolveSize(node, [this._right - this._left, this._bottom - this._top]);
	            height = size[1];
	        }
	        this._context.set(node, {
	            size: [this._right - this._left, height],
	            origin: [0, 0],
	            align: [0, 0],
	            translate: [this._left, this._top, (z === undefined) ? this._z : z]
	        });
	        this._top += height;
	        return this;
	    };

	    /**
	     * Dock the node to the left
	     *
	     * @param {LayoutNode|String} [node] layout-node to dock, when ommited the `width` argument argument is used for padding
	     * @param {Number} [width] width of the layout-node, when ommited the width of the node is used
	     * @param {Number} [z] z-index to use for the node}
	     * @return {LayoutDockHelper} this
	     */
	    LayoutDockHelper.prototype.left = function(node, width, z) {
	        if (width instanceof Array) {
	            width = width[0];
	        }
	        if (width === undefined) {
	            var size = this._context.resolveSize(node, [this._right - this._left, this._bottom - this._top]);
	            width = size[0];
	        }
	        this._context.set(node, {
	            size: [width, this._bottom - this._top],
	            origin: [0, 0],
	            align: [0, 0],
	            translate: [this._left, this._top, (z === undefined) ? this._z : z]
	        });
	        this._left += width;
	        return this;
	    };

	    /**
	     * Dock the node to the bottom
	     *
	     * @param {LayoutNode|String} [node] layout-node to dock, when ommited the `height` argument argument is used for padding
	     * @param {Number} [height] height of the layout-node, when ommited the height of the node is used
	     * @param {Number} [z] z-index to use for the node}
	     * @return {LayoutDockHelper} this
	     */
	    LayoutDockHelper.prototype.bottom = function(node, height, z) {
	        if (height instanceof Array) {
	            height = height[1];
	        }
	        if (height === undefined) {
	            var size = this._context.resolveSize(node, [this._right - this._left, this._bottom - this._top]);
	            height = size[1];
	        }
	        this._context.set(node, {
	            size: [this._right - this._left, height],
	            origin: [0, 1],
	            align: [0, 1],
	            translate: [this._left, -(this._size[1] - this._bottom), (z === undefined) ? this._z : z]
	        });
	        this._bottom -= height;
	        return this;
	    };

	    /**
	     * Dock the node to the right.
	     *
	     * @param {LayoutNode|String} [node] layout-node to dock, when ommited the `width` argument argument is used for padding
	     * @param {Number} [width] width of the layout-node, when ommited the width of the node is used
	     * @param {Number} [z] z-index to use for the node}
	     * @return {LayoutDockHelper} this
	     */
	    LayoutDockHelper.prototype.right = function(node, width, z) {
	        if (width instanceof Array) {
	            width = width[0];
	        }
	        if (node) {
	            if (width === undefined) {
	                var size = this._context.resolveSize(node, [this._right - this._left, this._bottom - this._top]);
	                width = size[0];
	            }
	            this._context.set(node, {
	                size: [width, this._bottom - this._top],
	                origin: [1, 0],
	                align: [1, 0],
	                translate: [-(this._size[0] - this._right), this._top, (z === undefined) ? this._z : z]
	            });
	        }
	        if (width) {
	            this._right -= width;
	        }
	        return this;
	    };

	    /**
	     * Fills the node to the remaining content.
	     *
	     * @param {LayoutNode|String} node layout-node to dock
	     * @param {Number} [z] z-index to use for the node}
	     * @return {LayoutDockHelper} this
	     */
	    LayoutDockHelper.prototype.fill = function(node, z) {
	        this._context.set(node, {
	            size: [this._right - this._left, this._bottom - this._top],
	            translate: [this._left, this._top, (z === undefined) ? this._z : z]
	        });
	        return this;
	    };

	    // Register the helper
	    LayoutUtility.registerHelper('dock', LayoutDockHelper);

	    module.exports = LayoutDockHelper;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var MultipleTransition = __webpack_require__(57);
	    var TweenTransition = __webpack_require__(58);

	    /**
	     * A state maintainer for a smooth transition between
	     *    numerically-specified states. Example numeric states include floats or
	     *    Transform objects.
	     *
	     * An initial state is set with the constructor or set(startState). A
	     *    corresponding end state and transition are set with set(endState,
	     *    transition). Subsequent calls to set(endState, transition) begin at
	     *    the last state. Calls to get(timestamp) provide the interpolated state
	     *    along the way.
	     *
	     * Note that there is no event loop here - calls to get() are the only way
	     *    to find state projected to the current (or provided) time and are
	     *    the only way to trigger callbacks. Usually this kind of object would
	     *    be part of the render() path of a visible component.
	     *
	     * @class Transitionable
	     * @constructor
	     * @param {number|Array.Number|Object.<number|string, number>} start
	     *    beginning state
	     */
	    function Transitionable(start) {
	        this.currentAction = null;
	        this.actionQueue = [];
	        this.callbackQueue = [];

	        this.state = 0;
	        this.velocity = undefined;
	        this._callback = undefined;
	        this._engineInstance = null;
	        this._currentMethod = null;

	        this.set(start);
	    }

	    var transitionMethods = {};

	    Transitionable.register = function register(methods) {
	        var success = true;
	        for (var method in methods) {
	            if (!Transitionable.registerMethod(method, methods[method]))
	                success = false;
	        }
	        return success;
	    };

	    Transitionable.registerMethod = function registerMethod(name, engineClass) {
	        if (!(name in transitionMethods)) {
	            transitionMethods[name] = engineClass;
	            return true;
	        }
	        else return false;
	    };

	    Transitionable.unregisterMethod = function unregisterMethod(name) {
	        if (name in transitionMethods) {
	            delete transitionMethods[name];
	            return true;
	        }
	        else return false;
	    };

	    function _loadNext() {
	        if (this._callback) {
	            var callback = this._callback;
	            this._callback = undefined;
	            callback();
	        }
	        if (this.actionQueue.length <= 0) {
	            this.set(this.get()); // no update required
	            return;
	        }
	        this.currentAction = this.actionQueue.shift();
	        this._callback = this.callbackQueue.shift();

	        var method = null;
	        var endValue = this.currentAction[0];
	        var transition = this.currentAction[1];
	        if (transition instanceof Object && transition.method) {
	            method = transition.method;
	            if (typeof method === 'string') method = transitionMethods[method];
	        }
	        else {
	            method = TweenTransition;
	        }

	        if (this._currentMethod !== method) {
	            if (!(endValue instanceof Object) || method.SUPPORTS_MULTIPLE === true || endValue.length <= method.SUPPORTS_MULTIPLE) {
	                this._engineInstance = new method();
	            }
	            else {
	                this._engineInstance = new MultipleTransition(method);
	            }
	            this._currentMethod = method;
	        }

	        this._engineInstance.reset(this.state, this.velocity);
	        if (this.velocity !== undefined) transition.velocity = this.velocity;
	        this._engineInstance.set(endValue, transition, _loadNext.bind(this));
	    }

	    /**
	     * Add transition to end state to the queue of pending transitions. Special
	     *    Use: calling without a transition resets the object to that state with
	     *    no pending actions
	     *
	     * @method set
	     *
	     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endState
	     *    end state to which we interpolate
	     * @param {transition=} transition object of type {duration: number, curve:
	     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
	     *    instantaneous.
	     * @param {function()=} callback Zero-argument function to call on observed
	     *    completion (t=1)
	     */
	    Transitionable.prototype.set = function set(endState, transition, callback) {
	        if (!transition) {
	            this.reset(endState);
	            if (callback) callback();
	            return this;
	        }

	        var action = [endState, transition];
	        this.actionQueue.push(action);
	        this.callbackQueue.push(callback);
	        if (!this.currentAction) _loadNext.call(this);
	        return this;
	    };

	    /**
	     * Cancel all transitions and reset to a stable state
	     *
	     * @method reset
	     *
	     * @param {number|Array.Number|Object.<number, number>} startState
	     *    stable state to set to
	     */
	    Transitionable.prototype.reset = function reset(startState, startVelocity) {
	        this._currentMethod = null;
	        this._engineInstance = null;
	        this._callback = undefined;
	        this.state = startState;
	        this.velocity = startVelocity;
	        this.currentAction = null;
	        this.actionQueue = [];
	        this.callbackQueue = [];
	    };

	    /**
	     * Add delay action to the pending action queue queue.
	     *
	     * @method delay
	     *
	     * @param {number} duration delay time (ms)
	     * @param {function} callback Zero-argument function to call on observed
	     *    completion (t=1)
	     */
	    Transitionable.prototype.delay = function delay(duration, callback) {
	        this.set(this.get(), {duration: duration,
	            curve: function() {
	                return 0;
	            }},
	            callback
	        );
	    };

	    /**
	     * Get interpolated state of current action at provided time. If the last
	     *    action has completed, invoke its callback.
	     *
	     * @method get
	     *
	     * @param {number=} timestamp Evaluate the curve at a normalized version of this
	     *    time. If omitted, use current time. (Unix epoch time)
	     * @return {number|Object.<number|string, number>} beginning state
	     *    interpolated to this point in time.
	     */
	    Transitionable.prototype.get = function get(timestamp) {
	        if (this._engineInstance) {
	            if (this._engineInstance.getVelocity)
	                this.velocity = this._engineInstance.getVelocity();
	            this.state = this._engineInstance.get(timestamp);
	        }
	        return this.state;
	    };

	    /**
	     * Is there at least one action pending completion?
	     *
	     * @method isActive
	     *
	     * @return {boolean}
	     */
	    Transitionable.prototype.isActive = function isActive() {
	        return !!this.currentAction;
	    };

	    /**
	     * Halt transition at current state and erase all pending actions.
	     *
	     * @method halt
	     */
	    Transitionable.prototype.halt = function halt() {
	        return this.set(this.get());
	    };

	    module.exports = Transitionable;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transitionable = __webpack_require__(49);
	    var Transform = __webpack_require__(23);
	    var Utility = __webpack_require__(24);

	    /**
	     * A class for transitioning the state of a Transform by transitioning
	     * its translate, scale, skew and rotate components independently.
	     *
	     * @class TransitionableTransform
	     * @constructor
	     *
	     * @param [transform=Transform.identity] {Transform} The initial transform state
	     */
	    function TransitionableTransform(transform) {
	        this._final = Transform.identity.slice();

	        this._finalTranslate = [0, 0, 0];
	        this._finalRotate = [0, 0, 0];
	        this._finalSkew = [0, 0, 0];
	        this._finalScale = [1, 1, 1];

	        this.translate = new Transitionable(this._finalTranslate);
	        this.rotate = new Transitionable(this._finalRotate);
	        this.skew = new Transitionable(this._finalSkew);
	        this.scale = new Transitionable(this._finalScale);

	        if (transform) this.set(transform);
	    }

	    function _build() {
	        return Transform.build({
	            translate: this.translate.get(),
	            rotate: this.rotate.get(),
	            skew: this.skew.get(),
	            scale: this.scale.get()
	        });
	    }

	    function _buildFinal() {
	        return Transform.build({
	            translate: this._finalTranslate,
	            rotate: this._finalRotate,
	            skew: this._finalSkew,
	            scale: this._finalScale
	        });
	    }

	    /**
	     * An optimized way of setting only the translation component of a Transform
	     *
	     * @method setTranslate
	     * @chainable
	     *
	     * @param translate {Array}     New translation state
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback
	     * @return {TransitionableTransform}
	     */
	    TransitionableTransform.prototype.setTranslate = function setTranslate(translate, transition, callback) {
	        this._finalTranslate = translate;
	        this._final = _buildFinal.call(this);
	        this.translate.set(translate, transition, callback);
	        return this;
	    };

	    /**
	     * An optimized way of setting only the scale component of a Transform
	     *
	     * @method setScale
	     * @chainable
	     *
	     * @param scale {Array}         New scale state
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback
	     * @return {TransitionableTransform}
	     */
	    TransitionableTransform.prototype.setScale = function setScale(scale, transition, callback) {
	        this._finalScale = scale;
	        this._final = _buildFinal.call(this);
	        this.scale.set(scale, transition, callback);
	        return this;
	    };

	    /**
	     * An optimized way of setting only the rotational component of a Transform
	     *
	     * @method setRotate
	     * @chainable
	     *
	     * @param eulerAngles {Array}   Euler angles for new rotation state
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback
	     * @return {TransitionableTransform}
	     */
	    TransitionableTransform.prototype.setRotate = function setRotate(eulerAngles, transition, callback) {
	        this._finalRotate = eulerAngles;
	        this._final = _buildFinal.call(this);
	        this.rotate.set(eulerAngles, transition, callback);
	        return this;
	    };

	    /**
	     * An optimized way of setting only the skew component of a Transform
	     *
	     * @method setSkew
	     * @chainable
	     *
	     * @param skewAngles {Array}    New skew state
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback
	     * @return {TransitionableTransform}
	     */
	    TransitionableTransform.prototype.setSkew = function setSkew(skewAngles, transition, callback) {
	        this._finalSkew = skewAngles;
	        this._final = _buildFinal.call(this);
	        this.skew.set(skewAngles, transition, callback);
	        return this;
	    };

	    /**
	     * Setter for a TransitionableTransform with optional parameters to transition
	     * between Transforms
	     *
	     * @method set
	     * @chainable
	     *
	     * @param transform {Array}     New transform state
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback
	     * @return {TransitionableTransform}
	     */
	    TransitionableTransform.prototype.set = function set(transform, transition, callback) {
	        var components = Transform.interpret(transform);

	        this._finalTranslate = components.translate;
	        this._finalRotate = components.rotate;
	        this._finalSkew = components.skew;
	        this._finalScale = components.scale;
	        this._final = transform;

	        var _callback = callback ? Utility.after(4, callback) : null;
	        this.translate.set(components.translate, transition, _callback);
	        this.rotate.set(components.rotate, transition, _callback);
	        this.skew.set(components.skew, transition, _callback);
	        this.scale.set(components.scale, transition, _callback);
	        return this;
	    };

	    /**
	     * Sets the default transition to use for transitioning betwen Transform states
	     *
	     * @method setDefaultTransition
	     *
	     * @param transition {Object} Transition definition
	     */
	    TransitionableTransform.prototype.setDefaultTransition = function setDefaultTransition(transition) {
	        this.translate.setDefault(transition);
	        this.rotate.setDefault(transition);
	        this.skew.setDefault(transition);
	        this.scale.setDefault(transition);
	    };

	    /**
	     * Getter. Returns the current state of the Transform
	     *
	     * @method get
	     *
	     * @return {Transform}
	     */
	    TransitionableTransform.prototype.get = function get() {
	        if (this.isActive()) {
	            return _build.call(this);
	        }
	        else return this._final;
	    };

	    /**
	     * Get the destination state of the Transform
	     *
	     * @method getFinal
	     *
	     * @return Transform {Transform}
	     */
	    TransitionableTransform.prototype.getFinal = function getFinal() {
	        return this._final;
	    };

	    /**
	     * Determine if the TransitionalTransform is currently transitioning
	     *
	     * @method isActive
	     *
	     * @return {Boolean}
	     */
	    TransitionableTransform.prototype.isActive = function isActive() {
	        return this.translate.isActive() || this.rotate.isActive() || this.scale.isActive() || this.skew.isActive();
	    };

	    /**
	     * Halts the transition
	     *
	     * @method halt
	     */
	    TransitionableTransform.prototype.halt = function halt() {
	        this.translate.halt();
	        this.rotate.halt();
	        this.skew.halt();
	        this.scale.halt();

	        this._final = this.get();
	        this._finalTranslate = this.translate.get();
	        this._finalRotate = this.rotate.get();
	        this._finalSkew = this.skew.get();
	        this._finalScale = this.scale.get();

	        return this;
	    };

	    module.exports = TransitionableTransform;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// Create a simple path alias to allow browserify to resolve
	// the runtime on a supported path.
	module.exports = __webpack_require__(61);


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Entity = __webpack_require__(37);
	    var SpecParser = __webpack_require__(60);

	    /**
	     * A wrapper for inserting a renderable component (like a Modifer or
	     *   Surface) into the render tree.
	     *
	     * @class RenderNode
	     * @constructor
	     *
	     * @param {Object} object Target renderable component
	     */
	    function RenderNode(object) {
	        this._object = null;
	        this._child = null;
	        this._hasMultipleChildren = false;
	        this._isRenderable = false;
	        this._isModifier = false;

	        this._resultCache = {};
	        this._prevResults = {};

	        this._childResult = null;

	        if (object) this.set(object);
	    }

	    /**
	     * Append a renderable to the list of this node's children.
	     *   This produces a new RenderNode in the tree.
	     *   Note: Does not double-wrap if child is a RenderNode already.
	     *
	     * @method add
	     * @param {Object} child renderable object
	     * @return {RenderNode} new render node wrapping child
	     */
	    RenderNode.prototype.add = function add(child) {
	        var childNode = (child instanceof RenderNode) ? child : new RenderNode(child);
	        if (this._child instanceof Array) this._child.push(childNode);
	        else if (this._child) {
	            this._child = [this._child, childNode];
	            this._hasMultipleChildren = true;
	            this._childResult = []; // to be used later
	        }
	        else this._child = childNode;

	        return childNode;
	    };

	    /**
	     * Return the single wrapped object.  Returns null if this node has multiple child nodes.
	     *
	     * @method get
	     *
	     * @return {Ojbect} contained renderable object
	     */
	    RenderNode.prototype.get = function get() {
	        return this._object || (this._hasMultipleChildren ? null : (this._child ? this._child.get() : null));
	    };

	    /**
	     * Overwrite the list of children to contain the single provided object
	     *
	     * @method set
	     * @param {Object} child renderable object
	     * @return {RenderNode} this render node, or child if it is a RenderNode
	     */
	    RenderNode.prototype.set = function set(child) {
	        this._childResult = null;
	        this._hasMultipleChildren = false;
	        this._isRenderable = child.render ? true : false;
	        this._isModifier = child.modify ? true : false;
	        this._object = child;
	        this._child = null;
	        if (child instanceof RenderNode) return child;
	        else return this;
	    };

	    /**
	     * Get render size of contained object.
	     *
	     * @method getSize
	     * @return {Array.Number} size of this or size of single child.
	     */
	    RenderNode.prototype.getSize = function getSize() {
	        var result = null;
	        var target = this.get();
	        if (target && target.getSize) result = target.getSize();
	        if (!result && this._child && this._child.getSize) result = this._child.getSize();
	        return result;
	    };

	    // apply results of rendering this subtree to the document
	    function _applyCommit(spec, context, cacheStorage) {
	        var result = SpecParser.parse(spec, context);
	        var keys = Object.keys(result);
	        for (var i = 0; i < keys.length; i++) {
	            var id = keys[i];
	            var childNode = Entity.get(id);
	            var commitParams = result[id];
	            commitParams.allocator = context.allocator;
	            var commitResult = childNode.commit(commitParams);
	            if (commitResult) _applyCommit(commitResult, context, cacheStorage);
	            else cacheStorage[id] = commitParams;
	        }
	    }

	    /**
	     * Commit the content change from this node to the document.
	     *
	     * @private
	     * @method commit
	     * @param {Context} context render context
	     */
	    RenderNode.prototype.commit = function commit(context) {
	        // free up some divs from the last loop
	        var prevKeys = Object.keys(this._prevResults);
	        for (var i = 0; i < prevKeys.length; i++) {
	            var id = prevKeys[i];
	            if (this._resultCache[id] === undefined) {
	                var object = Entity.get(id);
	                if (object.cleanup) object.cleanup(context.allocator);
	            }
	        }

	        this._prevResults = this._resultCache;
	        this._resultCache = {};
	        _applyCommit(this.render(), context, this._resultCache);
	    };

	    /**
	     * Generate a render spec from the contents of the wrapped component.
	     *
	     * @private
	     * @method render
	     *
	     * @return {Object} render specification for the component subtree
	     *    only under this node.
	     */
	    RenderNode.prototype.render = function render() {
	        if (this._isRenderable) return this._object.render();

	        var result = null;
	        if (this._hasMultipleChildren) {
	            result = this._childResult;
	            var children = this._child;
	            for (var i = 0; i < children.length; i++) {
	                result[i] = children[i].render();
	            }
	        }
	        else if (this._child) result = this._child.render();

	        return this._isModifier ? this._object.modify(result) : result;
	    };

	    module.exports = RenderNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This Source Code is licensed under the MIT license. If a copy of the
	 * MIT-license was not distributed with this file, You can obtain one at:
	 * http://opensource.org/licenses/mit-license.html.
	 *
	 * @author: Hein Rutjes (IjzerenHein)
	 * @license MIT
	 * @copyright Gloey Apps, 2014
	 */

	/*global define, console*/

	/**
	 * LayoutContext is the interface for a layout-function to access
	 * renderables in the data-source and set their size, position, tranformation, etc...
	 *
	 * @module
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * @class
	     * @alias module:LayoutContext
	     */
	    function LayoutContext(methods) {
	        for (var n in methods) {
	            this[n] = methods[n];
	        }
	    }

	    /**
	     * {Property} Size in which to layout the renderables.
	     */
	    LayoutContext.prototype.size = undefined;

	    /**
	     * {Property} Direction in which to layout the renderables (0 = X, 1 = Y).
	     */
	    LayoutContext.prototype.direction = undefined;

	    /**
	     * Get the context-node for the next renderable in the data-source. When
	     * the end of the data-source is reached, `undefined` is returned.
	     * Use this function to enumerate the contents of a data-source that is
	     * either an Array or a ViewSequence.
	     *
	     * **Example:**
	     *
	     * ```javascript
	     * function MyLayoutFunction(context, options) {
	     *   var height = 0;
	     *   var node = context.next(); // get first next node
	     *   while (node) {
	     *     context.set(node, {
	     *       size: [context.size[0], 100],
	     *       transform: [0, height, 0]
	     *     });
	     *     height += 100;
	     *     node = context.next(); // get next node
	     *   }
	     * }
	     * ```
	     *
	     * @return {Object} context-node or undefined
	     */
	    LayoutContext.prototype.next = function() {
	        // dummy implementation, override in constructor
	    };

	    /**
	     * Get the context-node for the previous renderable in the data-source. When
	     * the start of the data-source is reached, `undefined` is returned.
	     * Use this function to enumerate the contents of a data-source that is
	     * either an Array or a ViewSequence.
	     *
	     * **Example:**
	     *
	     * ```javascript
	     * function MyLayoutFunction(context, options) {
	     *   var height = 0;
	     *   var node = context.prev(); // get first previous
	     *   while (node) {
	     *     height -= 100;
	     *     context.set(node, {
	     *       size: [context.size[0], 100],
	     *       transform: [0, height, 0]
	     *     });
	     *     node = context.next(); // get prev node
	     *   }
	     * }
	     * ```
	     *
	     * @return {Object} context-node or undefined
	     */
	    LayoutContext.prototype.prev = function() {
	        // dummy implementation, override in constructor
	    };

	    /**
	     * Get the context-node for a renderable with a specific id. This function
	     * should be used to access data-sources which are key-value collections.
	     * When a data-source is an Array or a ViewSequence, use `next()`.
	     * In many cases it is not neccesary to use `get()`, instead you can pass
	     * the id of the renderable straight to the `set` function.
	     *
	     * **Example:**
	     *
	     * ```javascript
	     * var layoutController = new LayoutController({
	     *   layout: function (context, options) {
	     *     var size = context.size;
	     *     var left = context.get('left');
	     *     context.set(left, { size: [100, size[1]] });
	     *
	     *     var right = context.get('right');
	     *     context.set(right, {
	     *       size: [100, size[1]],
	     *       translate: [size[1] - 100, 0, 0]
	     *     });
	     *
	     *     var middle = context.get('middle');
	     *     context.set(middle, {
	     *       size: [size[0] - 200, size[1]],
	     *       translate: [100, 0, 0]
	     *     });
	     *   },
	     *   dataSource: {
	     *     left: new Surface({content: 'left'}),
	     *     right: new Surface({content: 'right'}),
	     *     middle: new Surface({content: 'middle'})
	     *   }
	     * });
	     * ```
	     *
	     * **Arrays:**
	     *
	     * A value at a specific id in the datasource can also be an array. To access the
	     * context-nodes in the array use `get()` to get the array and the elements in the
	     * array:
	     *
	     * ```javascript
	     * var layoutController = new LayoutController({
	     *   layout: function (context, options) {
	     *     var size = context.size;
	     *     var left = 0;
	     *
	     *     // Position title
	     *     context.set('title', { size: [100, size[1]] });
	     *     left += 100;
	     *
	     *     // Position left-items (array)
	     *     var leftItems = context.get('leftItems');
	     *     for (var i = 0; i < leftItems.length; i++) {
	     *       var leftItem = context.get(leftItems[i]);
	     *       context.set(leftItem, {
	     *         size: [100, size[1]],
	     *         translate: [left, 0, 0]
	     *       });
	     *       left += 100;
	     *     }
	     *   },
	     *   dataSource: {
	     *     title: new Surface({content: 'title'}),
	     *     leftItems: [
	     *       new Surface({content: 'item1'}),
	     *       new Surface({content: 'item2'})
	     *     ]
	     *   }
	     * });
	     * ```
	     *
	     * @param {Object|String} node context-node or node-id
	     * @return {Object} context-node or undefined
	     */
	    LayoutContext.prototype.get = function(node) {
	        // dummy implementation, override in constructor
	    };

	    /**
	     * Set the size, origin, align, translation, scale, rotate, skew & opacity for a context-node.
	     * This function should only be called only **once** for a node.
	     *
	     * **Overview of all supported properties:**
	     *
	     * ```javascript
	     * function MyLayoutFunction(context, options) {
	     *   context.set('mynode', {
	     *     size: [100, 20],
	     *     origin: [0.5, 0.5],
	     *     align: [0.5, 0.5],
	     *     translate: [50, 10, 0],
	     *     scale: [1, 1, 1],
	     *     skew: [0, 0, 0],
	     *     rotate: [Math.PI, 0, 0],
	     *     opacity: 1
	     *   })
	     * }
	     * ```
	     *
	     * @param {Object|String} node context-node or node-id
	     * @param {Object} set properties: size, origin, align, translate, scale, rotate, skew & opacity
	     */
	    LayoutContext.prototype.set = function(node, set) {
	        // dummy implementation, override in constructor
	    };

	    /**
	     * Resolve the size of a context-node by accessing the `getSize` function
	     * of the renderable.
	     *
	     * **Example:**
	     *
	     * ```javascript
	     * var layoutController = new LayoutController({
	     *   layout: function (context, options) {
	     *     var centerSize = context.resolveSize('center');
	     *     context.set('center', {origin: [0.5, 0.5]});
	     *     context.set('centerRight', {
	     *       origin: [0.5, 0.5],
	     *       translate: [centerSize[0] / 2, 0, 0]
	     *     });
	     *   },
	     *   dataSource: {
	     *     center: new Surface({content: 'center'}),
	     *     centerRight: new Surface({content: 'centerRight'}),
	     *   }
	     * });
	     * ```
	     *
	     * **When the size of the renderable is calculated by the DOM (`true` size)**
	     *
	     * When the layout-function performs its layout for the first time, it is
	     * possible that the renderable has not yet been rendered and its size
	     * is unknown. In this case, the LayoutController will cause a second
	     * reflow of the layout the next render-cycle, ensuring that the renderables
	     * are layed out as expected.
	     *
	     * @param {Object|String} node context-node, node-id or array-element
	     * @return {Size} size of the node
	     */
	    LayoutContext.prototype.resolveSize = function(node) {
	        // dummy implementation, override in constructor
	    };

	    /**
	     * Get the underlying render-node that should be layed out.
	     *
	     * @param {Object|String} node context-node or node-id
	     * @return {Renderable} Renderable or `undefined` if not found
	     */
	    LayoutContext.prototype.getRenderNode = function(node) {
	        // dummy implementation, override in constructor
	    };

	    module.exports = LayoutContext;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * EventEmitter represents a channel for events.
	     *
	     * @class EventEmitter
	     * @constructor
	     */
	    function EventEmitter() {
	        this.listeners = {};
	        this._owner = this;
	    }

	    /**
	     * Trigger an event, sending to all downstream handlers
	     *   listening for provided 'type' key.
	     *
	     * @method emit
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {Object} event event data
	     * @return {EventHandler} this
	     */
	    EventEmitter.prototype.emit = function emit(type, event) {
	        var handlers = this.listeners[type];
	        if (handlers) {
	            for (var i = 0; i < handlers.length; i++) {
	                handlers[i].call(this._owner, event);
	            }
	        }
	        return this;
	    };

	    /**
	     * Bind a callback function to an event type handled by this object.
	     *
	     * @method "on"
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {function(string, Object)} handler callback
	     * @return {EventHandler} this
	     */
	   EventEmitter.prototype.on = function on(type, handler) {
	        if (!(type in this.listeners)) this.listeners[type] = [];
	        var index = this.listeners[type].indexOf(handler);
	        if (index < 0) this.listeners[type].push(handler);
	        return this;
	    };

	    /**
	     * Alias for "on".
	     * @method addListener
	     */
	    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	   /**
	     * Unbind an event by type and handler.
	     *   This undoes the work of "on".
	     *
	     * @method removeListener
	     *
	     * @param {string} type event type key (for example, 'click')
	     * @param {function} handler function object to remove
	     * @return {EventEmitter} this
	     */
	    EventEmitter.prototype.removeListener = function removeListener(type, handler) {
	        var listener = this.listeners[type];
	        if (listener !== undefined) {
	            var index = listener.indexOf(handler);
	            if (index >= 0) listener.splice(index, 1);
	        }
	        return this;
	    };

	    /**
	     * Call event handlers with this set to owner.
	     *
	     * @method bindThis
	     *
	     * @param {Object} owner object this EventEmitter belongs to
	     */
	    EventEmitter.prototype.bindThis = function bindThis(owner) {
	        this._owner = owner;
	    };

	    module.exports = EventEmitter;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * Internal helper object to Context that handles the process of
	     *   creating and allocating DOM elements within a managed div.
	     *   Private.
	     *
	     * @class ElementAllocator
	     * @constructor
	     * @private
	     * @param {Node} container document element in which Famo.us content will be inserted
	     */
	    function ElementAllocator(container) {
	        if (!container) container = document.createDocumentFragment();
	        this.container = container;
	        this.detachedNodes = {};
	        this.nodeCount = 0;
	    }

	    /**
	     * Move the document elements from their original container to a new one.
	     *
	     * @private
	     * @method migrate
	     *
	     * @param {Node} container document element to which Famo.us content will be migrated
	     */
	    ElementAllocator.prototype.migrate = function migrate(container) {
	        var oldContainer = this.container;
	        if (container === oldContainer) return;

	        if (oldContainer instanceof DocumentFragment) {
	            container.appendChild(oldContainer);
	        }
	        else {
	            while (oldContainer.hasChildNodes()) {
	                container.appendChild(oldContainer.removeChild(oldContainer.firstChild));
	            }
	        }

	        this.container = container;
	    };

	    /**
	     * Allocate an element of specified type from the pool.
	     *
	     * @private
	     * @method allocate
	     *
	     * @param {string} type type of element, e.g. 'div'
	     * @return {Node} allocated document element
	     */
	    ElementAllocator.prototype.allocate = function allocate(type) {
	        type = type.toLowerCase();
	        if (!(type in this.detachedNodes)) this.detachedNodes[type] = [];
	        var nodeStore = this.detachedNodes[type];
	        var result;
	        if (nodeStore.length > 0) {
	            result = nodeStore.pop();
	        }
	        else {
	            result = document.createElement(type);
	            this.container.appendChild(result);
	        }
	        this.nodeCount++;
	        return result;
	    };

	    /**
	     * De-allocate an element of specified type to the pool.
	     *
	     * @private
	     * @method deallocate
	     *
	     * @param {Node} element document element to deallocate
	     */
	    ElementAllocator.prototype.deallocate = function deallocate(element) {
	        var nodeType = element.nodeName.toLowerCase();
	        var nodeStore = this.detachedNodes[nodeType];
	        nodeStore.push(element);
	        this.nodeCount--;
	    };

	    /**
	     * Get count of total allocated nodes in the document.
	     *
	     * @private
	     * @method getNodeCount
	     *
	     * @return {Number} total node count
	     */
	    ElementAllocator.prototype.getNodeCount = function getNodeCount() {
	        return this.nodeCount;
	    };

	    module.exports = ElementAllocator;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Vector = __webpack_require__(42);
	    var EventHandler = __webpack_require__(35);

	    /**
	     * Force base class.
	     *
	     * @class Force
	     * @uses EventHandler
	     * @constructor
	     */
	    function Force(force) {
	        this.force = new Vector(force);
	        this._eventOutput = new EventHandler();
	        EventHandler.setOutputHandler(this, this._eventOutput);
	    }

	    /**
	     * Basic setter for options
	     *
	     * @method setOptions
	     * @param options {Objects}
	     */
	    Force.prototype.setOptions = function setOptions(options) {
	        this._eventOutput.emit('change', options);
	    };

	    /**
	     * Adds a force to a physics body's force accumulator.
	     *
	     * @method applyForce
	     * @param targets {Array.Body} Array of bodies to apply a force to.
	     */
	    Force.prototype.applyForce = function applyForce(targets) {
	        var length = targets.length;
	        while (length--) {
	            targets[length].applyForce(this.force);
	        }
	    };

	    /**
	     * Getter for a force's potential energy.
	     *
	     * @method getEnergy
	     * @return energy {Number}
	     */
	    Force.prototype.getEnergy = function getEnergy() {
	        return 0.0;
	    };

	    module.exports = Force;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Utility = __webpack_require__(24);

	    /**
	     * Transition meta-method to support transitioning multiple
	     *   values with scalar-only methods.
	     *
	     *
	     * @class MultipleTransition
	     * @constructor
	     *
	     * @param {Object} method Transionable class to multiplex
	     */
	    function MultipleTransition(method) {
	        this.method = method;
	        this._instances = [];
	        this.state = [];
	    }

	    MultipleTransition.SUPPORTS_MULTIPLE = true;

	    /**
	     * Get the state of each transition.
	     *
	     * @method get
	     *
	     * @return state {Number|Array} state array
	     */
	    MultipleTransition.prototype.get = function get() {
	        for (var i = 0; i < this._instances.length; i++) {
	            this.state[i] = this._instances[i].get();
	        }
	        return this.state;
	    };

	    /**
	     * Set the end states with a shared transition, with optional callback.
	     *
	     * @method set
	     *
	     * @param {Number|Array} endState Final State.  Use a multi-element argument for multiple transitions.
	     * @param {Object} transition Transition definition, shared among all instances
	     * @param {Function} callback called when all endStates have been reached.
	     */
	    MultipleTransition.prototype.set = function set(endState, transition, callback) {
	        var _allCallback = Utility.after(endState.length, callback);
	        for (var i = 0; i < endState.length; i++) {
	            if (!this._instances[i]) this._instances[i] = new (this.method)();
	            this._instances[i].set(endState[i], transition, _allCallback);
	        }
	    };

	    /**
	     * Reset all transitions to start state.
	     *
	     * @method reset
	     *
	     * @param  {Number|Array} startState Start state
	     */
	    MultipleTransition.prototype.reset = function reset(startState) {
	        for (var i = 0; i < startState.length; i++) {
	            if (!this._instances[i]) this._instances[i] = new (this.method)();
	            this._instances[i].reset(startState[i]);
	        }
	    };

	    module.exports = MultipleTransition;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     *
	     * A state maintainer for a smooth transition between
	     *    numerically-specified states.  Example numeric states include floats or
	     *    Transfornm objects.
	     *
	     *    An initial state is set with the constructor or set(startValue). A
	     *    corresponding end state and transition are set with set(endValue,
	     *    transition). Subsequent calls to set(endValue, transition) begin at
	     *    the last state. Calls to get(timestamp) provide the _interpolated state
	     *    along the way.
	     *
	     *   Note that there is no event loop here - calls to get() are the only way
	     *    to find out state projected to the current (or provided) time and are
	     *    the only way to trigger callbacks. Usually this kind of object would
	     *    be part of the render() path of a visible component.
	     *
	     * @class TweenTransition
	     * @constructor
	     *
	     * @param {Object} options TODO
	     *    beginning state
	     */
	    function TweenTransition(options) {
	        this.options = Object.create(TweenTransition.DEFAULT_OPTIONS);
	        if (options) this.setOptions(options);

	        this._startTime = 0;
	        this._startValue = 0;
	        this._updateTime = 0;
	        this._endValue = 0;
	        this._curve = undefined;
	        this._duration = 0;
	        this._active = false;
	        this._callback = undefined;
	        this.state = 0;
	        this.velocity = undefined;
	    }

	    /**
	     * Transition curves mapping independent variable t from domain [0,1] to a
	     *    range within [0,1]. Includes functions 'linear', 'easeIn', 'easeOut',
	     *    'easeInOut', 'easeOutBounce', 'spring'.
	     *
	     * @property {object} Curve
	     * @final
	     */
	    TweenTransition.Curves = {
	        linear: function(t) {
	            return t;
	        },
	        easeIn: function(t) {
	            return t*t;
	        },
	        easeOut: function(t) {
	            return t*(2-t);
	        },
	        easeInOut: function(t) {
	            if (t <= 0.5) return 2*t*t;
	            else return -2*t*t + 4*t - 1;
	        },
	        easeOutBounce: function(t) {
	            return t*(3 - 2*t);
	        },
	        spring: function(t) {
	            return (1 - t) * Math.sin(6 * Math.PI * t) + t;
	        }
	    };

	    TweenTransition.SUPPORTS_MULTIPLE = true;
	    TweenTransition.DEFAULT_OPTIONS = {
	        curve: TweenTransition.Curves.linear,
	        duration: 500,
	        speed: 0 /* considered only if positive */
	    };

	    var registeredCurves = {};

	    /**
	     * Add "unit" curve to internal dictionary of registered curves.
	     *
	     * @method registerCurve
	     *
	     * @static
	     *
	     * @param {string} curveName dictionary key
	     * @param {unitCurve} curve function of one numeric variable mapping [0,1]
	     *    to range inside [0,1]
	     * @return {boolean} false if key is taken, else true
	     */
	    TweenTransition.registerCurve = function registerCurve(curveName, curve) {
	        if (!registeredCurves[curveName]) {
	            registeredCurves[curveName] = curve;
	            return true;
	        }
	        else {
	            return false;
	        }
	    };

	    /**
	     * Remove object with key "curveName" from internal dictionary of registered
	     *    curves.
	     *
	     * @method unregisterCurve
	     *
	     * @static
	     *
	     * @param {string} curveName dictionary key
	     * @return {boolean} false if key has no dictionary value
	     */
	    TweenTransition.unregisterCurve = function unregisterCurve(curveName) {
	        if (registeredCurves[curveName]) {
	            delete registeredCurves[curveName];
	            return true;
	        }
	        else {
	            return false;
	        }
	    };

	    /**
	     * Retrieve function with key "curveName" from internal dictionary of
	     *    registered curves. Default curves are defined in the
	     *    TweenTransition.Curves array, where the values represent
	     *    unitCurve functions.
	     *
	     * @method getCurve
	     *
	     * @static
	     *
	     * @param {string} curveName dictionary key
	     * @return {unitCurve} curve function of one numeric variable mapping [0,1]
	     *    to range inside [0,1]
	     */
	    TweenTransition.getCurve = function getCurve(curveName) {
	        var curve = registeredCurves[curveName];
	        if (curve !== undefined) return curve;
	        else throw new Error('curve not registered');
	    };

	    /**
	     * Retrieve all available curves.
	     *
	     * @method getCurves
	     *
	     * @static
	     *
	     * @return {object} curve functions of one numeric variable mapping [0,1]
	     *    to range inside [0,1]
	     */
	    TweenTransition.getCurves = function getCurves() {
	        return registeredCurves;
	    };

	     // Interpolate: If a linear function f(0) = a, f(1) = b, then return f(t)
	    function _interpolate(a, b, t) {
	        return ((1 - t) * a) + (t * b);
	    }

	    function _clone(obj) {
	        if (obj instanceof Object) {
	            if (obj instanceof Array) return obj.slice(0);
	            else return Object.create(obj);
	        }
	        else return obj;
	    }

	    // Fill in missing properties in "transition" with those in defaultTransition, and
	    //   convert internal named curve to function object, returning as new
	    //   object.
	    function _normalize(transition, defaultTransition) {
	        var result = {curve: defaultTransition.curve};
	        if (defaultTransition.duration) result.duration = defaultTransition.duration;
	        if (defaultTransition.speed) result.speed = defaultTransition.speed;
	        if (transition instanceof Object) {
	            if (transition.duration !== undefined) result.duration = transition.duration;
	            if (transition.curve) result.curve = transition.curve;
	            if (transition.speed) result.speed = transition.speed;
	        }
	        if (typeof result.curve === 'string') result.curve = TweenTransition.getCurve(result.curve);
	        return result;
	    }

	    /**
	     * Set internal options, overriding any default options.
	     *
	     * @method setOptions
	     *
	     *
	     * @param {Object} options options object
	     * @param {Object} [options.curve] function mapping [0,1] to [0,1] or identifier
	     * @param {Number} [options.duration] duration in ms
	     * @param {Number} [options.speed] speed in pixels per ms
	     */
	    TweenTransition.prototype.setOptions = function setOptions(options) {
	        if (options.curve !== undefined) this.options.curve = options.curve;
	        if (options.duration !== undefined) this.options.duration = options.duration;
	        if (options.speed !== undefined) this.options.speed = options.speed;
	    };

	    /**
	     * Add transition to end state to the queue of pending transitions. Special
	     *    Use: calling without a transition resets the object to that state with
	     *    no pending actions
	     *
	     * @method set
	     *
	     *
	     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endValue
	     *    end state to which we _interpolate
	     * @param {transition=} transition object of type {duration: number, curve:
	     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
	     *    instantaneous.
	     * @param {function()=} callback Zero-argument function to call on observed
	     *    completion (t=1)
	     */
	    TweenTransition.prototype.set = function set(endValue, transition, callback) {
	        if (!transition) {
	            this.reset(endValue);
	            if (callback) callback();
	            return;
	        }

	        this._startValue = _clone(this.get());
	        transition = _normalize(transition, this.options);
	        if (transition.speed) {
	            var startValue = this._startValue;
	            if (startValue instanceof Object) {
	                var variance = 0;
	                for (var i in startValue) variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
	                transition.duration = Math.sqrt(variance) / transition.speed;
	            }
	            else {
	                transition.duration = Math.abs(endValue - startValue) / transition.speed;
	            }
	        }

	        this._startTime = Date.now();
	        this._endValue = _clone(endValue);
	        this._startVelocity = _clone(transition.velocity);
	        this._duration = transition.duration;
	        this._curve = transition.curve;
	        this._active = true;
	        this._callback = callback;
	    };

	    /**
	     * Cancel all transitions and reset to a stable state
	     *
	     * @method reset
	     *
	     * @param {number|Array.Number|Object.<number, number>} startValue
	     *    starting state
	     * @param {number} startVelocity
	     *    starting velocity
	     */
	    TweenTransition.prototype.reset = function reset(startValue, startVelocity) {
	        if (this._callback) {
	            var callback = this._callback;
	            this._callback = undefined;
	            callback();
	        }
	        this.state = _clone(startValue);
	        this.velocity = _clone(startVelocity);
	        this._startTime = 0;
	        this._duration = 0;
	        this._updateTime = 0;
	        this._startValue = this.state;
	        this._startVelocity = this.velocity;
	        this._endValue = this.state;
	        this._active = false;
	    };

	    /**
	     * Get current velocity
	     *
	     * @method getVelocity
	     *
	     * @returns {Number} velocity
	     */
	    TweenTransition.prototype.getVelocity = function getVelocity() {
	        return this.velocity;
	    };

	    /**
	     * Get interpolated state of current action at provided time. If the last
	     *    action has completed, invoke its callback.
	     *
	     * @method get
	     *
	     *
	     * @param {number=} timestamp Evaluate the curve at a normalized version of this
	     *    time. If omitted, use current time. (Unix epoch time)
	     * @return {number|Object.<number|string, number>} beginning state
	     *    _interpolated to this point in time.
	     */
	    TweenTransition.prototype.get = function get(timestamp) {
	        this.update(timestamp);
	        return this.state;
	    };

	    function _calculateVelocity(current, start, curve, duration, t) {
	        var velocity;
	        var eps = 1e-7;
	        var speed = (curve(t) - curve(t - eps)) / eps;
	        if (current instanceof Array) {
	            velocity = [];
	            for (var i = 0; i < current.length; i++){
	                if (typeof current[i] === 'number')
	                    velocity[i] = speed * (current[i] - start[i]) / duration;
	                else
	                    velocity[i] = 0;
	            }

	        }
	        else velocity = speed * (current - start) / duration;
	        return velocity;
	    }

	    function _calculateState(start, end, t) {
	        var state;
	        if (start instanceof Array) {
	            state = [];
	            for (var i = 0; i < start.length; i++) {
	                if (typeof start[i] === 'number')
	                    state[i] = _interpolate(start[i], end[i], t);
	                else
	                    state[i] = start[i];
	            }
	        }
	        else state = _interpolate(start, end, t);
	        return state;
	    }

	    /**
	     * Update internal state to the provided timestamp. This may invoke the last
	     *    callback and begin a new action.
	     *
	     * @method update
	     *
	     *
	     * @param {number=} timestamp Evaluate the curve at a normalized version of this
	     *    time. If omitted, use current time. (Unix epoch time)
	     */
	    TweenTransition.prototype.update = function update(timestamp) {
	        if (!this._active) {
	            if (this._callback) {
	                var callback = this._callback;
	                this._callback = undefined;
	                callback();
	            }
	            return;
	        }

	        if (!timestamp) timestamp = Date.now();
	        if (this._updateTime >= timestamp) return;
	        this._updateTime = timestamp;

	        var timeSinceStart = timestamp - this._startTime;
	        if (timeSinceStart >= this._duration) {
	            this.state = this._endValue;
	            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
	            this._active = false;
	        }
	        else if (timeSinceStart < 0) {
	            this.state = this._startValue;
	            this.velocity = this._startVelocity;
	        }
	        else {
	            var t = timeSinceStart / this._duration;
	            this.state = _calculateState(this._startValue, this._endValue, this._curve(t));
	            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t);
	        }
	    };

	    /**
	     * Is there at least one action pending completion?
	     *
	     * @method isActive
	     *
	     *
	     * @return {boolean}
	     */
	    TweenTransition.prototype.isActive = function isActive() {
	        return this._active;
	    };

	    /**
	     * Halt transition at current state and erase all pending actions.
	     *
	     * @method halt
	     *
	     */
	    TweenTransition.prototype.halt = function halt() {
	        this.reset(this.get());
	    };

	    // Register all the default curves
	    TweenTransition.registerCurve('linear', TweenTransition.Curves.linear);
	    TweenTransition.registerCurve('easeIn', TweenTransition.Curves.easeIn);
	    TweenTransition.registerCurve('easeOut', TweenTransition.Curves.easeOut);
	    TweenTransition.registerCurve('easeInOut', TweenTransition.Curves.easeInOut);
	    TweenTransition.registerCurve('easeOutBounce', TweenTransition.Curves.easeOutBounce);
	    TweenTransition.registerCurve('spring', TweenTransition.Curves.spring);

	    TweenTransition.customCurve = function customCurve(v1, v2) {
	        v1 = v1 || 0; v2 = v2 || 0;
	        return function(t) {
	            return v1*t + (-2*v1 - v2 + 3)*t*t + (v1 + v2 - 2)*t*t*t;
	        };
	    };

	    module.exports = TweenTransition;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: david@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * Ordinary Differential Equation (ODE) Integrator.
	     * Manages updating a physics body's state over time.
	     *
	     *  p = position, v = velocity, m = mass, f = force, dt = change in time
	     *
	     *      v <- v + dt * f / m
	     *      p <- p + dt * v
	     *
	     *  q = orientation, w = angular velocity, L = angular momentum
	     *
	     *      L <- L + dt * t
	     *      q <- q + dt/2 * q * w
	     *
	     * @class SymplecticEuler
	     * @constructor
	     * @param {Object} options Options to set
	     */
	    var SymplecticEuler = {};

	    /*
	     * Updates the velocity of a physics body from its accumulated force.
	     *      v <- v + dt * f / m
	     *
	     * @method integrateVelocity
	     * @param {Body} physics body
	     * @param {Number} dt delta time
	     */
	    SymplecticEuler.integrateVelocity = function integrateVelocity(body, dt) {
	        var v = body.velocity;
	        var w = body.inverseMass;
	        var f = body.force;

	        if (f.isZero()) return;

	        v.add(f.mult(dt * w)).put(v);
	        f.clear();
	    };

	    /*
	     * Updates the position of a physics body from its velocity.
	     *      p <- p + dt * v
	     *
	     * @method integratePosition
	     * @param {Body} physics body
	     * @param {Number} dt delta time
	     */
	    SymplecticEuler.integratePosition = function integratePosition(body, dt) {
	        var p = body.position;
	        var v = body.velocity;

	        p.add(v.mult(dt)).put(p);
	    };

	    /*
	     * Updates the angular momentum of a physics body from its accumuled torque.
	     *      L <- L + dt * t
	     *
	     * @method integrateAngularMomentum
	     * @param {Body} physics body (except a particle)
	     * @param {Number} dt delta time
	     */
	    SymplecticEuler.integrateAngularMomentum = function integrateAngularMomentum(body, dt) {
	        var L = body.angularMomentum;
	        var t = body.torque;

	        if (t.isZero()) return;

	        L.add(t.mult(dt)).put(L);
	        t.clear();
	    };

	    /*
	     * Updates the orientation of a physics body from its angular velocity.
	     *      q <- q + dt/2 * q * w
	     *
	     * @method integrateOrientation
	     * @param {Body} physics body (except a particle)
	     * @param {Number} dt delta time
	     */
	    SymplecticEuler.integrateOrientation = function integrateOrientation(body, dt) {
	        var q = body.orientation;
	        var w = body.angularVelocity;

	        if (w.isZero()) return;
	        q.add(q.multiply(w).scalarMultiply(0.5 * dt)).put(q);
	//        q.normalize.put(q);
	    };

	    module.exports = SymplecticEuler;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * Owner: mark@famo.us
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(23);

	    /**
	     *
	     * This object translates the rendering instructions ("render specs")
	     *   that renderable components generate into document update
	     *   instructions ("update specs").  Private.
	     *
	     * @private
	     * @class SpecParser
	     * @constructor
	     */
	    function SpecParser() {
	        this.result = {};
	    }
	    SpecParser._instance = new SpecParser();

	    /**
	     * Convert a render spec coming from the context's render chain to an
	     *    update spec for the update chain. This is the only major entry point
	     *    for a consumer of this class.
	     *
	     * @method parse
	     * @static
	     * @private
	     *
	     * @param {renderSpec} spec input render spec
	     * @param {Object} context context to do the parse in
	     * @return {Object} the resulting update spec (if no callback
	     *   specified, else none)
	     */
	    SpecParser.parse = function parse(spec, context) {
	        return SpecParser._instance.parse(spec, context);
	    };

	    /**
	     * Convert a renderSpec coming from the context's render chain to an update
	     *    spec for the update chain. This is the only major entrypoint for a
	     *    consumer of this class.
	     *
	     * @method parse
	     *
	     * @private
	     * @param {renderSpec} spec input render spec
	     * @param {Context} context
	     * @return {updateSpec} the resulting update spec
	     */
	    SpecParser.prototype.parse = function parse(spec, context) {
	        this.reset();
	        this._parseSpec(spec, context, Transform.identity);
	        return this.result;
	    };

	    /**
	     * Prepare SpecParser for re-use (or first use) by setting internal state
	     *  to blank.
	     *
	     * @private
	     * @method reset
	     */
	    SpecParser.prototype.reset = function reset() {
	        this.result = {};
	    };

	    // Multiply matrix M by vector v
	    function _vecInContext(v, m) {
	        return [
	            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
	            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
	            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
	        ];
	    }

	    var _zeroZero = [0, 0];

	    // From the provided renderSpec tree, recursively compose opacities,
	    //    origins, transforms, and sizes corresponding to each surface id from
	    //    the provided renderSpec tree structure. On completion, those
	    //    properties of 'this' object should be ready to use to build an
	    //    updateSpec.
	    SpecParser.prototype._parseSpec = function _parseSpec(spec, parentContext, sizeContext) {
	        var id;
	        var target;
	        var transform;
	        var opacity;
	        var origin;
	        var align;
	        var size;

	        if (typeof spec === 'number') {
	            id = spec;
	            transform = parentContext.transform;
	            align = parentContext.align || _zeroZero;
	            if (parentContext.size && align && (align[0] || align[1])) {
	                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
	                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext));
	            }
	            this.result[id] = {
	                transform: transform,
	                opacity: parentContext.opacity,
	                origin: parentContext.origin || _zeroZero,
	                align: parentContext.align || _zeroZero,
	                size: parentContext.size
	            };
	        }
	        else if (!spec) { // placed here so 0 will be cached earlier
	            return;
	        }
	        else if (spec instanceof Array) {
	            for (var i = 0; i < spec.length; i++) {
	                this._parseSpec(spec[i], parentContext, sizeContext);
	            }
	        }
	        else {
	            target = spec.target;
	            transform = parentContext.transform;
	            opacity = parentContext.opacity;
	            origin = parentContext.origin;
	            align = parentContext.align;
	            size = parentContext.size;
	            var nextSizeContext = sizeContext;

	            if (spec.opacity !== undefined) opacity = parentContext.opacity * spec.opacity;
	            if (spec.transform) transform = Transform.multiply(parentContext.transform, spec.transform);
	            if (spec.origin) {
	                origin = spec.origin;
	                nextSizeContext = parentContext.transform;
	            }
	            if (spec.align) align = spec.align;

	            if (spec.size || spec.proportions) {
	                var parentSize = size;
	                size = [size[0], size[1]];

	                if (spec.size) {
	                    if (spec.size[0] !== undefined) size[0] = spec.size[0];
	                    if (spec.size[1] !== undefined) size[1] = spec.size[1];
	                }

	                if (spec.proportions) {
	                    if (spec.proportions[0] !== undefined) size[0] = size[0] * spec.proportions[0];
	                    if (spec.proportions[1] !== undefined) size[1] = size[1] * spec.proportions[1];
	                }

	                if (parentSize) {
	                    if (align && (align[0] || align[1])) transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], sizeContext));
	                    if (origin && (origin[0] || origin[1])) transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);
	                }

	                nextSizeContext = parentContext.transform;
	                origin = null;
	                align = null;
	            }

	            this._parseSpec(target, {
	                transform: transform,
	                opacity: opacity,
	                origin: origin,
	                align: align,
	                size: size
	            }, nextSizeContext);
	        }
	    };

	    module.exports = SpecParser;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*globals Handlebars: true */
	var base = __webpack_require__(62);

	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)
	var SafeString = __webpack_require__(63)["default"];
	var Exception = __webpack_require__(64)["default"];
	var Utils = __webpack_require__(65);
	var runtime = __webpack_require__(66);

	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	var create = function() {
	  var hb = new base.HandlebarsEnvironment();

	  Utils.extend(hb, base);
	  hb.SafeString = SafeString;
	  hb.Exception = Exception;
	  hb.Utils = Utils;

	  hb.VM = runtime;
	  hb.template = function(spec) {
	    return runtime.template(spec, hb);
	  };

	  return hb;
	};

	var Handlebars = create();
	Handlebars.create = create;

	exports["default"] = Handlebars;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Utils = __webpack_require__(65);
	var Exception = __webpack_require__(64)["default"];

	var VERSION = "1.3.0";
	exports.VERSION = VERSION;var COMPILER_REVISION = 4;
	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '>= 1.0.0'
	};
	exports.REVISION_CHANGES = REVISION_CHANGES;
	var isArray = Utils.isArray,
	    isFunction = Utils.isFunction,
	    toString = Utils.toString,
	    objectType = '[object Object]';

	function HandlebarsEnvironment(helpers, partials) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};

	  registerDefaultHelpers(this);
	}

	exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,

	  logger: logger,
	  log: log,

	  registerHelper: function(name, fn, inverse) {
	    if (toString.call(name) === objectType) {
	      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
	      Utils.extend(this.helpers, name);
	    } else {
	      if (inverse) { fn.not = inverse; }
	      this.helpers[name] = fn;
	    }
	  },

	  registerPartial: function(name, str) {
	    if (toString.call(name) === objectType) {
	      Utils.extend(this.partials,  name);
	    } else {
	      this.partials[name] = str;
	    }
	  }
	};

	function registerDefaultHelpers(instance) {
	  instance.registerHelper('helperMissing', function(arg) {
	    if(arguments.length === 2) {
	      return undefined;
	    } else {
	      throw new Exception("Missing helper: '" + arg + "'");
	    }
	  });

	  instance.registerHelper('blockHelperMissing', function(context, options) {
	    var inverse = options.inverse || function() {}, fn = options.fn;

	    if (isFunction(context)) { context = context.call(this); }

	    if(context === true) {
	      return fn(this);
	    } else if(context === false || context == null) {
	      return inverse(this);
	    } else if (isArray(context)) {
	      if(context.length > 0) {
	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      return fn(context);
	    }
	  });

	  instance.registerHelper('each', function(context, options) {
	    var fn = options.fn, inverse = options.inverse;
	    var i = 0, ret = "", data;

	    if (isFunction(context)) { context = context.call(this); }

	    if (options.data) {
	      data = createFrame(options.data);
	    }

	    if(context && typeof context === 'object') {
	      if (isArray(context)) {
	        for(var j = context.length; i<j; i++) {
	          if (data) {
	            data.index = i;
	            data.first = (i === 0);
	            data.last  = (i === (context.length-1));
	          }
	          ret = ret + fn(context[i], { data: data });
	        }
	      } else {
	        for(var key in context) {
	          if(context.hasOwnProperty(key)) {
	            if(data) { 
	              data.key = key; 
	              data.index = i;
	              data.first = (i === 0);
	            }
	            ret = ret + fn(context[key], {data: data});
	            i++;
	          }
	        }
	      }
	    }

	    if(i === 0){
	      ret = inverse(this);
	    }

	    return ret;
	  });

	  instance.registerHelper('if', function(conditional, options) {
	    if (isFunction(conditional)) { conditional = conditional.call(this); }

	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });

	  instance.registerHelper('unless', function(conditional, options) {
	    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
	  });

	  instance.registerHelper('with', function(context, options) {
	    if (isFunction(context)) { context = context.call(this); }

	    if (!Utils.isEmpty(context)) return options.fn(context);
	  });

	  instance.registerHelper('log', function(context, options) {
	    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
	    instance.log(level, context);
	  });
	}

	var logger = {
	  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

	  // State enum
	  DEBUG: 0,
	  INFO: 1,
	  WARN: 2,
	  ERROR: 3,
	  level: 3,

	  // can be overridden in the host environment
	  log: function(level, obj) {
	    if (logger.level <= level) {
	      var method = logger.methodMap[level];
	      if (typeof console !== 'undefined' && console[method]) {
	        console[method].call(console, obj);
	      }
	    }
	  }
	};
	exports.logger = logger;
	function log(level, obj) { logger.log(level, obj); }

	exports.log = log;var createFrame = function(object) {
	  var obj = {};
	  Utils.extend(obj, object);
	  return obj;
	};
	exports.createFrame = createFrame;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// Build out our basic SafeString type
	function SafeString(string) {
	  this.string = string;
	}

	SafeString.prototype.toString = function() {
	  return "" + this.string;
	};

	exports["default"] = SafeString;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

	function Exception(message, node) {
	  var line;
	  if (node && node.firstLine) {
	    line = node.firstLine;

	    message += ' - ' + line + ':' + node.firstColumn;
	  }

	  var tmp = Error.prototype.constructor.call(this, message);

	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }

	  if (line) {
	    this.lineNumber = line;
	    this.column = node.firstColumn;
	  }
	}

	Exception.prototype = new Error();

	exports["default"] = Exception;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint -W004 */
	var SafeString = __webpack_require__(63)["default"];

	var escape = {
	  "&": "&amp;",
	  "<": "&lt;",
	  ">": "&gt;",
	  '"': "&quot;",
	  "'": "&#x27;",
	  "`": "&#x60;"
	};

	var badChars = /[&<>"'`]/g;
	var possible = /[&<>"'`]/;

	function escapeChar(chr) {
	  return escape[chr] || "&amp;";
	}

	function extend(obj, value) {
	  for(var key in value) {
	    if(Object.prototype.hasOwnProperty.call(value, key)) {
	      obj[key] = value[key];
	    }
	  }
	}

	exports.extend = extend;var toString = Object.prototype.toString;
	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	var isFunction = function(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	if (isFunction(/x/)) {
	  isFunction = function(value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	var isFunction;
	exports.isFunction = isFunction;
	var isArray = Array.isArray || function(value) {
	  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
	};
	exports.isArray = isArray;

	function escapeExpression(string) {
	  // don't escape SafeStrings, since they're already safe
	  if (string instanceof SafeString) {
	    return string.toString();
	  } else if (!string && string !== 0) {
	    return "";
	  }

	  // Force a string conversion as this will be done by the append regardless and
	  // the regex test will do this transparently behind the scenes, causing issues if
	  // an object's to string has escaped characters in it.
	  string = "" + string;

	  if(!possible.test(string)) { return string; }
	  return string.replace(badChars, escapeChar);
	}

	exports.escapeExpression = escapeExpression;function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	exports.isEmpty = isEmpty;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Utils = __webpack_require__(65);
	var Exception = __webpack_require__(64)["default"];
	var COMPILER_REVISION = __webpack_require__(62).COMPILER_REVISION;
	var REVISION_CHANGES = __webpack_require__(62).REVISION_CHANGES;

	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = COMPILER_REVISION;

	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = REVISION_CHANGES[currentRevision],
	          compilerVersions = REVISION_CHANGES[compilerRevision];
	      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
	            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
	            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
	    }
	  }
	}

	exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

	function template(templateSpec, env) {
	  if (!env) {
	    throw new Exception("No environment passed to template");
	  }

	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
	    var result = env.VM.invokePartial.apply(this, arguments);
	    if (result != null) { return result; }

	    if (env.compile) {
	      var options = { helpers: helpers, partials: partials, data: data };
	      partials[name] = env.compile(partial, { data: data !== undefined }, env);
	      return partials[name](context, options);
	    } else {
	      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
	    }
	  };

	  // Just add water
	  var container = {
	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,
	    programs: [],
	    program: function(i, fn, data) {
	      var programWrapper = this.programs[i];
	      if(data) {
	        programWrapper = program(i, fn, data);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = program(i, fn);
	      }
	      return programWrapper;
	    },
	    merge: function(param, common) {
	      var ret = param || common;

	      if (param && common && (param !== common)) {
	        ret = {};
	        Utils.extend(ret, common);
	        Utils.extend(ret, param);
	      }
	      return ret;
	    },
	    programWithDepth: env.VM.programWithDepth,
	    noop: env.VM.noop,
	    compilerInfo: null
	  };

	  return function(context, options) {
	    options = options || {};
	    var namespace = options.partial ? options : env,
	        helpers,
	        partials;

	    if (!options.partial) {
	      helpers = options.helpers;
	      partials = options.partials;
	    }
	    var result = templateSpec.call(
	          container,
	          namespace, context,
	          helpers,
	          partials,
	          options.data);

	    if (!options.partial) {
	      env.VM.checkRevision(container.compilerInfo);
	    }

	    return result;
	  };
	}

	exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
	  var args = Array.prototype.slice.call(arguments, 3);

	  var prog = function(context, options) {
	    options = options || {};

	    return fn.apply(this, [context, options.data || data].concat(args));
	  };
	  prog.program = i;
	  prog.depth = args.length;
	  return prog;
	}

	exports.programWithDepth = programWithDepth;function program(i, fn, data) {
	  var prog = function(context, options) {
	    options = options || {};

	    return fn(context, options.data || data);
	  };
	  prog.program = i;
	  prog.depth = 0;
	  return prog;
	}

	exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
	  var options = { partial: true, helpers: helpers, partials: partials, data: data };

	  if(partial === undefined) {
	    throw new Exception("The partial " + name + " could not be found");
	  } else if(partial instanceof Function) {
	    return partial(context, options);
	  }
	}

	exports.invokePartial = invokePartial;function noop() { return ""; }

	exports.noop = noop;

/***/ }
/******/ ])