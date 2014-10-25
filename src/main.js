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

define(function(require) {

    //<webpack>
    require('famous-polyfills');
    require('famous/core/famous.css');
    require('./styles.css');
    require('./index.html');
    //</webpack>

    // Fast-click
    var FastClick = require('fastclick/lib/fastclick');
    FastClick.attach(document.body);

    // import dependencies
    var TextareaSurface = require('famous/surfaces/TextareaSurface');
    var Firebase = require('firebase/lib/firebase-web');
    var Engine = require('famous/core/Engine');
    var ViewSequence = require('famous/core/ViewSequence');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ScrollView = require('famous-flex/ScrollView');
    var ChatLayout = require('./ChatLayout');
    var HeaderFooterLayout = require('famous-flex/layouts/HeaderFooterLayout');
    var FlowLayoutController = require('famous-flex/FlowLayoutController');
    var LayoutController = require('famous-flex/LayoutController');
    var Lagometer = require('famous-lagometer/Lagometer');

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
    var preferredMessageInputHeight = 30;
    function _createMessageInput() {
        var input = new TextareaSurface({
            rows: 1,
            classes: ['message-input']
        });

        // Detect if the content of the text-area exceeds the available space.
        // If so, increase the height to accomodate for this.
        input.render = function() {
            if (this._currentTarget) {
                if (preferredMessageInputHeight !== this._currentTarget.scrollHeight) {
                    var oldHeightStyle = this._currentTarget.style.height;
                    this._currentTarget.style.height = (this._currentTarget.scrollHeight - 16) + 'px';
                    preferredMessageInputHeight = this._currentTarget.scrollHeight;
                    //console.log('new height: ' + preferredMessageInputHeight);
                    if (!_updateMessageBarHeight()) {
                        this._currentTarget.style.height = oldHeightStyle;
                    }
                    preferredMessageInputHeight = this._currentTarget.scrollHeight;
                }
            }
            return this.id;
        }.bind(input);
        return input;
    }

    //
    // Updates the message-bar height to accomate for the text that
    // was entered in the message text-area.
    //
    function _updateMessageBarHeight() {
        var height = Math.max(Math.min(preferredMessageInputHeight + 16, 200), 50);
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
    var chatBubbleTemplate = require('./chat-bubble.handlebars');
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
});
