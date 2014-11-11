famous-flex-chat
==========

Chat-demo for famo.us using the [famous-flex](https://github.com/IjzerenHein/famous-flex) ScrollController and TableLayout. This project shows how to create a native feeling cross-platform chat application using famo.us.

![Screenshot](screenshot.gif)

The following features are demonstrated:

-	True-size chat-bubbles using [famous-flex/ScrollController](https://github.com/IjzerenHein/famous-flex/blob/master/docs/ScrollController.md)
-	Sticky headers using [famous-flex/layouts/TableLayout](https://github.com/IjzerenHein/famous-flex/blob/master/docs/layouts/TableLayout.md)
-	Resizable text-area input [famous-autosizetextarea](https://github.com/IjzerenHein/famous-autosizetextarea)
-	Responsive design principles using famous-flex

[View the live demo here](https://rawgit.com/IjzerenHein/famous-flex-chat/master/dist/index.html)


## Content

-	[Source code](./src/main.js)


## Build

To build the demo, make sure grunt, webpack and webpack-dev-server are installed globally:

```
npm install -g grunt
npm install -g webpack
npm install -g webpack-dev-server
```

Run npm to install all dev-dependencies:

```
npm install
```

To build the output (dist-folder), run the webpack command:

```
webpack
```


## Running

To run the demo either open `dist/index.html`

Or use the live-reload server:

```
grunt serve
```

The app uses Firebase as backend. A demo Firebase instance is hardcoded in main.js. 
To use your own database, register as a new user on Firebase.com and create a new free app and give it a name. Then change the firebase URL in main.js from:

```
fbMessages = new Firebase('https://famous-flex-chat.firebaseio.com/messages');
```
to this where &lt;your-app-name&gt; is the name of you Firebase app:

```
fbMessages = new Firebase('https://<your-app-name>.firebaseio.com/messages');
```

The chat should now be empty and ready for new messages. No additonal steps necessary.

## Contribute

If you like this project and want to support it, show some love
and give it a star.


## Contact
- 	@IjzerenHein
- 	http://www.gloey.nl
- 	hrutjes@gmail.com

© 2014 - Hein Rutjes
