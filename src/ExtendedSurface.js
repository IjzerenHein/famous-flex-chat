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
  var Surface = require('famous/core/Surface');

  function ExtendedSurface(){
    Surface.apply(this, arguments);
    this._superDeploy = Surface.prototype.deploy;
  }

  ExtendedSurface.prototype = Object.create(Surface.prototype);
  ExtendedSurface.prototype.constructor = ExtendedSurface;

  ExtendedSurface.prototype.deploy = function deploy(target) {
    this._superDeploy(target);
    var size = this.getSize();
    this.setSize([this._currentTarget.clientWidth,this._currentTarget.clientHeight]);
    this.realHeight = this._currentTarget.clientHeight;
    this.realWidth = this._currentTarget.clientWidth;
    this._eventOutput.emit('isDeployed');
  }

  module.exports = ExtendedSurface;
});
