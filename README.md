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

As default Firebase is used as a backend server and connects to a ready made demo database. To set up your own database quickly, register as a new user on firebase.com and create a new free app. Then change this line in main.js to your database. 

```
fbMessages = new Firebase('https://famous-flex-chat.firebaseio.com/messages');
```
to 

```
fbMessages = new Firebase('https://<your-app-name>.firebaseio.com/messages');
```

That's it and that's that. Your chat page should now be empty and ready to be filled up with new messages.

## Contribute

If you like this project and want to support it, show some love
and give it a star.


## Contact
- 	@IjzerenHein
- 	http://www.gloey.nl
- 	hrutjes@gmail.com

© 2014 - Hein Rutjes
