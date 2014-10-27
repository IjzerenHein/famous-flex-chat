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
    var Firebase = require('firebase/lib/firebase-web');
    var Engine = require('famous/core/Engine');
    var ViewSequence = require('famous/core/ViewSequence');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ScrollView = require('famous-flex/ScrollView');
    var ChatLayout = require('./ChatLayout');
    var HeaderFooterLayout = require('famous-flex/layouts/HeaderFooterLayout');
    //var FlowLayoutController = require('famous-flex/FlowLayoutController');
    var LayoutController = require('famous-flex/LayoutController');
    var Lagometer = require('famous-lagometer/Lagometer');
    var AutosizeTextareaSurface = require('./AutosizeTextareaSurface');
    var InputSurface = require('famous/surfaces/InputSurface');
    var moment = require('moment/moment');
    var cuid = require('cuid');

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
        mainLayout = new LayoutController({
            layout: HeaderFooterLayout,
            layoutOptions: {
                headerHeight: 34,
                footerHeight: 50
            },
            dataSource: {
                header: _createNameBar(),
                content: _createScrollView(),
                footer: _createMessageBar()
            }
        });
        mainContext.add(mainLayout);
        return mainLayout;
    }

    //
    // Creates the top input field for the name
    //
    var nameBar;
    function _createNameBar() {
        nameBar = new InputSurface({
            classes: ['name-input'],
            placeholder: 'Your name...',
            value: localStorage.name
        });
        nameBar.on('change', function() {
            localStorage.name = nameBar.getValue();
        });
        return nameBar;
    }

    //
    // Message-bar holding textarea input and send button
    //
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
    // Message-input textarea
    //
    var messageInputTextArea;
    function _createMessageInput() {
        messageInputTextArea = new AutosizeTextareaSurface({
            rows: 1,
            classes: ['message-input'],
            placeholder: 'famous-flex-chat...'
        });
        messageInputTextArea.on('scrollHeightChanged', _updateMessageBarHeight);
        messageInputTextArea.on('keydown', function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                _sendMessage();
            }
        });
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

    //
    // Create send button
    //
    function _createSendButton() {
        var button = new Surface({
            classes: ['message-send'],
            content: 'Send',
            size: [60, undefined]
        });
        button.on('click', _sendMessage);
        return button;
    }

    //
    // Create scrollview
    //
    var scrollView;
    function _createScrollView() {
        scrollView = new ScrollView({
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
            reverse: true,
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
    var fbMessages;
    function _setupFirebase() {
        fbMessages = new Firebase('https://famous-flex-chat.firebaseio.com/messages');
        fbMessages.limit(20).on('child_added', function(snapshot) {
            var data = snapshot.val();
            data.time = moment(data.timeStamp).format('LT');
            if (!data.author || (data.author === '')) {
                data.author = 'Anonymous bastard';
            }
            var chatBubble = _createChatBubble(data);
            viewSequence.push(chatBubble);
            scrollView.reflowLayout();
            scrollView.goToRenderNode(chatBubble);
        });
    }

    //
    // Create a chat-bubble
    //
    var chatBubbleTemplate = require('./chat-bubble.handlebars');
    function _createChatBubble(data) {
        return new Surface({
            size: [undefined, true],
            classes: ['message-bubble', (data.userId === _getUserId()) ? 'send' : 'received'],
            content: chatBubbleTemplate(data)
        });
    }

    //
    // Generates a unique id for every user so that received messages
    // can be distinguished comming from this user or another user.
    //
    var userId;
    function _getUserId() {
        if (!userId) {
            userId = localStorage.userId;
            if (!userId) {
                userId = cuid();
                localStorage.userId = userId;
            }
        }
        return userId;
    }

    //
    // Sends a new message
    //
    function _sendMessage() {
        var value = messageInputTextArea.getValue();
        if (!value || (value === '')) {
            return;
        }
        messageInputTextArea.setValue('');
        fbMessages.push({
            author: nameBar.getValue(),
            userId: _getUserId(),
            message: value,
            timeStamp: new Date().getTime()
        });
    }

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
            transform: Transform.translate(-10, 10, 1000)
        });
        var lagometer = new Lagometer({
            size: lagometerMod.getSize()
        });
        mainContext.add(lagometerMod).add(lagometer);
    }
});
