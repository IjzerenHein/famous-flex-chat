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
    var FlexScrollView = require('famous-flex/ScrollView');
    var HeaderFooterLayout = require('famous-flex/layouts/HeaderFooterLayout');
    var LayoutController = require('famous-flex/LayoutController');
    var Lagometer = require('famous-lagometer/Lagometer');
    var AutosizeTextareaSurface = require('famous-autosizetextarea/AutosizeTextareaSurface');
    var Timer = require('famous/utilities/Timer');
    var InputSurface = require('famous/surfaces/InputSurface');
    var RefreshLoader = require('famous-refresh-loader/RefreshLoader');
    var moment = require('moment/moment');
    var cuid = require('cuid');
    // templates
    var chatBubbleTemplate = require('./chat-bubble.handlebars');
    var daySectionTemplate = require('./day-section.handlebars');

    // Initialize
    var mainContext = Engine.createContext();
    var viewSequence = new ViewSequence();
    _createPullToRefreshCell();
    _setupFirebase();
    mainContext.add(_createMainLayout());
    //_createLagometer();
    //_loadDemoData();

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
            classes: ['message-input'],
            placeholder: 'famous-flex-chat...',
            properties: {
                resize: 'none'
            }
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
        scrollView = new FlexScrollView({
            layoutOptions: {
                // callback that is called by the layout-function to check
                // whether a node is a section
                isSectionCallback: function(renderNode) {
                    return renderNode.properties.isSection;
                },
                margins: [5, 0, 0, 0]
            },
            dataSource: viewSequence,
            flow: true,
            alignment: 1,
            mouseMove: true,
            debug: false,
            pullToRefreshHeader: pullToRefreshHeader
        });
        return scrollView;
    }

    //
    // Adds a message to the scrollview
    //
    var afterInitialRefreshTimerId;
    var afterInitialRefresh;
    var firstKey;
    function _addMessage(data, top, key) {
        var time = moment(data.timeStamp || new Date());
        data.time = time.format('LT');
        if (!data.author || (data.author === '')) {
            data.author = 'Anonymous bastard';
        }

        // Store first key
        firstKey = firstKey || key;
        if (top && key) {
            firstKey = key;
        }

        // Insert section
        var day = time.format('LL');
        var daySection;
        if (!top && (day !== lastSectionDay)) {
            lastSectionDay = day;
            firstSectionDay = firstSectionDay || day;
            daySection = _createDaySection(day);
            daySection.pipe(scrollView);
            scrollView.push(daySection);
        } else if (top && (day !== firstSectionDay)) {
            firstSectionDay = day;
            daySection = _createDaySection(day);
            daySection.pipe(scrollView);
            scrollView.insert(0, daySection);
        }

        //console.log('adding message: ' + JSON.stringify(data));
        var chatBubble = _createChatBubble(data);
        chatBubble.pipe(scrollView);
        if (top) {
            scrollView.insert(1, chatBubble);
        }
        else {
            scrollView.push(chatBubble);
        }
        if (!top) {

            // Scroll the latest (newest) chat message
            if (afterInitialRefresh) {
                scrollView.goToLastPage();
                scrollView.reflowLayout();
            }
            else {

                // On startup, set datasource to the last page immediately
                // so it doesn't scroll from top to bottom all the way
                viewSequence = viewSequence.getNext() || viewSequence;
                scrollView.setDataSource(viewSequence);
                scrollView.goToLastPage();
                if (afterInitialRefreshTimerId === undefined) {
                    afterInitialRefreshTimerId = Timer.setTimeout(function() {
                        afterInitialRefresh = true;
                    }, 100);
                }
            }
        }
    }

    //
    // setup firebase
    //
    var fbMessages;
    var firstSectionDay;
    var lastSectionDay;
    function _setupFirebase() {
        fbMessages = new Firebase('https://famous-flex-chat.firebaseio.com/messages');
        fbMessages.limitToLast(30).on('child_added', function(snapshot) {
            _addMessage(snapshot.val(), false, snapshot.key());
        });
    }

    //
    // Create a chat-bubble
    //
    function _createChatBubble(data) {
        var surface = new Surface({
            size: [undefined, true],
            classes: ['message-bubble', (data.userId === _getUserId()) ? 'send' : 'received'],
            content: chatBubbleTemplate(data),
            properties: {
                message: data.message
            }
        });
        return surface;
    }

    //
    // Create a day section
    //
    function _createDaySection(day) {
        return new Surface({
            size: [undefined, 42],
            classes: ['message-day'],
            content: daySectionTemplate({text: day}),
            properties: {
                isSection: true
            }
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
        messageInputTextArea.focus();
    }

    /**
     * Create pull to refresh header
     */
    var pullToRefreshHeader;
    function _createPullToRefreshCell() {
        pullToRefreshHeader = new RefreshLoader({
            size: [undefined, 60],
            pullToRefresh: true,
            pullToRefreshBackgroundColor: 'white'
        });
    }
    scrollView.on('refresh', function(event) {
        var queryKey = firstKey;
        fbMessages.endAt(null, firstKey).limitToLast(2).once('value', function(snapshot) {
            var val = snapshot.val();
            for (var key in val) {
                if (key !== queryKey) {
                    _addMessage(val[key], true, key);
                }
            }
            Timer.setTimeout(function() {
                scrollView.hidePullToRefresh(event.footer);
            }, 200);
        });

    });

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
