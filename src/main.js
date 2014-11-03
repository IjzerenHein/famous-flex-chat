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
    var StockScrollView = require('famous/views/ScrollView');
    var ScrollView = require('famous-flex/ScrollView');
    var ChatLayout = require('./ChatLayout');
    var HeaderFooterLayout = require('famous-flex/layouts/HeaderFooterLayout');
    var LayoutController = require('famous-flex/LayoutController');
    var Lagometer = require('famous-lagometer/Lagometer');
    var AutosizeTextareaSurface = require('./AutosizeTextareaSurface');
    var Timer = require('famous/utilities/Timer');
    var Console = require('./Console');
    var InputSurface = require('famous/surfaces/InputSurface');
    var moment = require('moment/moment');
    var cuid = require('cuid');
    var browser = require('ua_parser').userAgent(window.navigator.userAgent);
    // templates
    var chatBubbleTemplate = require('./chat-bubble.handlebars');
    var daySectionTemplate = require('./day-section.handlebars');

    // debugging
    var flow = true;
    var debug = false;
    var useContainer = false;
    var stockScrollView = false;
    var stickySections = true;
    var duplicateCount = 1;
    var trueSize = true;

    // On mobile or other devices that have keyboards that slide in, ensure
    // that container mode is enabled.
    if ((browser.platform === 'tablet') || (browser.platform === 'mobile')) {
        useContainer = true;
    }

    // Initialize
    //var mobileDetect = new MobileDetect(window.navigator.userAgent);
    var mainContext = Engine.createContext();
    var viewSequence = new ViewSequence();
    _setupFirebase();
    mainContext.add(_createMainLayout());
    //_createLagometer();
    //_loadDemoData();

    // Fix for android, which causes a repaint after a resize, which
    // repositions the keyboard correctly.
    if (browser.os.android) {
        _createConsole();
    }

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
        if (stockScrollView) {
            scrollView = new StockScrollView();
            scrollView.sequenceFrom(viewSequence);
        }
        else {
            scrollView = new ScrollView({
                layout: ChatLayout,
                layoutOptions: {
                    // callback that is called by the layout-function to check
                    // whether a node is a section
                    isSectionCallback: function(renderNode) {
                        return renderNode.properties.isSection && stickySections;
                    },
                    isPullToRefreshCallback: function(renderNode) {
                        return renderNode.isPullToRefresh;
                    }
                },
                dataSource: viewSequence,
                flow: flow,
                alignment: 1,
                useContainer: useContainer,
                mouseMove: true,
                debug: debug
            });
        }
        return scrollView;
    }

    //
    // Test for getLastVisibleItem
    //
    /*scrollView.on('reflow', function() {
        var item = scrollView.getLastVisibleItem();
        if (item) {
            var chatText = item.renderNode.properties.message;
            console.log('Chat: last item: ' + chatText);
        }
        else {
            console.log('Chat: no last item found');
        }
    });*/

    //
    // Adds a message to the scrollview
    //
    var afterInitialRefreshTimerId;
    var afterInitialRefresh;
    function _addMessage(data) {
        var time = moment(data.timeStamp || new Date());
        data.time = time.format('LT');
        if (!data.author || (data.author === '')) {
            data.author = 'Anonymous bastard';
        }

        // Insert section
        //var day = time.calander();
        var day = time.format('LL');
        if (day !== lastSectionDay) {
            lastSectionDay = day;
            var daySection = _createDaySection(day);
            if (stockScrollView || !useContainer) {
                daySection.pipe(scrollView);
            }
            viewSequence.push(daySection);
        }
        //console.log('adding message: ' + JSON.stringify(data));
        for (var i = 0; i < duplicateCount; i++) {
            var chatBubble = _createChatBubble(data);
            if (stockScrollView || !useContainer) {
                chatBubble.pipe(scrollView);
            }
            viewSequence.push(chatBubble);
        }
        if (!stockScrollView) {
            if (afterInitialRefresh) {
                scrollView.goToLastPage();
                scrollView.reflowLayout();
            }
            else {
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
    var lastSectionDay;
    function _setupFirebase() {
        fbMessages = new Firebase('https://famous-flex-chat.firebaseio.com/messages');
        fbMessages.limit(30).on('child_added', function(snapshot) {
            _addMessage(snapshot.val());
        });
    }

    //
    // Create a chat-bubble
    //
    function _createChatBubble(data) {
        var surface = new Surface({
            size: [undefined, trueSize ? true : 65],
            classes: ['message-bubble', (data.userId === _getUserId()) ? 'send' : 'received'],
            content: chatBubbleTemplate(data),
            properties: {
                message: data.message
            }
        });
        /*surface.on('onresize', function(event) {
            console.log('whut');
        });*/
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

    //
    // Shows the Console
    //
    function _loadDemoData() {
        var data = require('./demoMessages.json');
        for (var i = 0 ; i < data.length; i++) {
            _addMessage(data[i]);
        }
    }

    //
    // Shows the Console
    //
    function _createConsole() {
        var consoleMod = new Modifier({
            size: [undefined, 2],
            align: [0, 1],
            origin: [0, 1],
            transform: Transform.translate(0, 0, 1000)
        });
        var console = new Console();
        mainContext.add(consoleMod).add(console);

        // IMPORTANT NOTE: For some reason the following code prevents a
        // very annoying bug on android from triggering. The bug occurs when the
        // keyboard is shown, and the content would become invisible and you
        // had to scroll down to make the main layout visible....
        mainLayout.on('layoutstart', function(event) {
            console.log('oldSize: ' + JSON.stringify(event.oldSize) + ', newSize: ' + JSON.stringify(event.size));
        });
    }

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
