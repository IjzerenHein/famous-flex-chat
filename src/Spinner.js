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

  // import dependencies
  var Surface = require('famous/core/Surface');
  var View = require('famous/core/View');
  var LayoutController = require('famous-flex/LayoutController');

  function Spinner(options) {
    View.apply(this, arguments);

    // Create background surface behind which the spinner hides
    var background = new Surface({
      properties: {
        backgroundColor: this.options.backgroundColor || 'white'
      }
    });
    background.pipe(this._eventOutput);

    // Create spinner
    var spinner = new Surface({
      classes: ['pull-to-refresh']
    });
    spinner.pipe(this._eventOutput);

    // Create layout
    this.layoutController = new LayoutController({
      layout: function(context) {
        context.set('back', {
          size: this.options.size,
          translate: [0, context.size[1], 0]
        });
        context.set('spinner', {
          size: this.options.size,
          translate: [0, 0, -1]
        });
      }.bind(this),
      dataSource: {
        back: background,
        spinner: spinner
      }
    });
    this.add(this.layoutController);
  }
  Spinner.prototype = Object.create(View.prototype);
  Spinner.prototype.constructor = Spinner;

  //
  // Called by the scrollview whenever the pull-to-refresh renderable is shown
  // or the state has changed. States:
  // 0: hidden/showing
  // 1: shown
  // 2: hiding
  //
  Spinner.prototype.setPullToRefreshStatus = function(status) {
    if (this._status !== status) {
      this._status = status;
      this.layoutController.reflowLayout();
    }
  };

  return Spinner;
});
