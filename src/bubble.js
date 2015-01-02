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

define(function(require) {

	// import dependencies
	var Surface = require('famous/core/Surface');
	var Modifier = require('famous/core/Modifier');
	var View = require('famous/core/View');
	var RenderNode = require('famous/core/RenderNode');
	var ExtendedSurface = require('./ExtendedSurface');

	//
	// Base class for bling items.
	//
	function Bubble(options) {
		View.apply(this, arguments);

		var origin;
		var align;
		var backgroundColor;
		var content;
		var picture;
		var widthScreen = window.innerWidth;
		var heightScreen = window.innerHeight;

		var renderNode = new RenderNode({
			size: [undefined, 0.1*heightScreen]
		});

		if (this.options.user){
			content = '<div style="max-width:'+ widthScreen*0.6 + 'px; margin-right: 10px; margin-left: 10px; margin-bottom: 10px; margin-top: 10px; color: #fff; font-family: Open Sans, sans-serif; font-size:'+ heightScreen / 40 +'px;">'+ this.options.message +'</div>';
			origin = [1.0, 0.5];
			align = [0.95, 0.5];
			backgroundColor = '#66ccff';
		}
		else {
			content = '<div style="max-width:'+ widthScreen*0.6 + 'px; margin-right: 10px; margin-left: 10px; margin-bottom: 10px; margin-top: 10px; color: #000; font-family: Open Sans, sans-serif; font-size:'+ heightScreen / 40 +'px;">'+ this.options.message + '</div>';
			origin = [0, 0.5];
			align = [0.2, 0.5];
			backgroundColor = '#f0f0f0';
			picture = new ImageSurface({
				content: this.options.picture,
				size: [0.075*heightScreen, 0.075*heightScreen],
				properties: {
					borderRadius: '50%'
				}
			});
			var pictureMod = new Modifier({
				origin: [0.5,0.5],
				align: [0.1, 0.8]
			});

			this.add(pictureMod).add(picture);
		}

		// problem is here where i set the size to [true,true], extended surface emits an event output after deployed and i grab the real height and width
		this.bubble = new ExtendedSurface({
			size: [true, true],
			content: content,
			properties: {
				backgroundColor : backgroundColor,
				borderRadius: '15px'
			}
		});
		var bubbleMod = new Modifier({
			origin: origin,
			align: align
		});

		this.bubble.on('isDeployed', function() {
			this.setOptions({size : [undefined, this.bubble.realHeight]});
		}.bind(this));

		this.add(bubbleMod).add(this.bubble);
		this.add(renderNode);
	};
	Bubble.prototype = Object.create(View.prototype);
    Bubble.prototype.constructor = Bubble;

	return Bubble;
});
