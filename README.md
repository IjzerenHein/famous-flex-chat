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


## Contribute

If you like this project and want to support it, show some love
and give it a star.


## Contact
- 	@IjzerenHein
- 	http://www.gloey.nl
- 	hrutjes@gmail.com

© 2014 - Hein Rutjes
