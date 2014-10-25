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

/**
 * Lays out a sections and cells and makes the section stick to the top (or left) side
 * of the scollview.
 *
 * |options|type|description|
 * |---|---|---|
 * |`[isSectionCallback]`|Function|Callback that is called in order to check if a render-node is a section rather than a cell.|
 * |`[itemSize]`|Number|Height or width in pixels of an item (used when renderNode has no size)|
 *
 * Example:
 *
 * ```javascript
 * var TableLayout = require('famous-flex-tablelayout/TableLayout');
 *
 * new LayoutController({
 *   layout: TableLayout,
 *   layoutOptions: {
 *     isSectionCallback: _isSection,
 *   },
 *   dataSource: [
 *     // first section
 *     _createSection(),
 *     _createCell(),
 *     _createCell(),
 *     // second section
 *     _createSection(),
 *     _createCell(),
 *   ]
 * })
 *
 * function _createCell() {
 *   return new Surface({
 *     size: [undefined, 50],
 *     content: 'my cell'
 *   });
 * }
 *
 * function _createSection() {
 *   var section = new Surface({
 *     size: [undefined, 30],
 *     content: 'my sticky section'
 *   });
 *   section.isSection = true; // mark renderNode as section
 *   return section;
 * }
 *
 * function _isSection(renderNode) {
 *   return renderNode.isSection;
 * }
 * ```
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var Utility = require('famous/utilities/Utility');

    // Define capabilities of this layout function
    var capabilities = {
        sequence: true,
        direction: [Utility.Direction.Y, Utility.Direction.X],
        scrolling: true,
        trueSize: true,
        sequentialScrollingOptimized: true,
        debug: {
            testPrev: false
        }
    };

    // Layout function
    function TableLayout(context, options) {

        // Prepare
        var size = context.size;
        var direction = context.direction;
        var offset = context.scrollOffset;
        var node;
        var nodeSize;
        var itemSize;
        var set;
        var lastSectionBeforeVisibleCell;
        var firstVisibleCell;
        var lastCellOffsetInFirstVisibleSection;
        var firstCell;
        var firstCellOffset;
        var lastCell;
        var lastCellOffset;

        //
        // Determine item-size or use true=size
        //
        if ((options.itemSize === true) || !options.hasOwnProperty('itemSize')) {
            itemSize = true;
        }
        else {
            itemSize = (options.itemSize === undefined) ? size[direction] : options.itemSize;
        }

        //
        // Process all next nodes
        //
        while (offset < context.scrollEnd) {
            node = context.next();
            if (!node) {
                break;
            }
            nodeSize = (itemSize === true) ? context.resolveSize(node, size)[direction] : itemSize;

            //
            // Detect the first and last cell
            //
            if (!firstCell) {
                firstCell = node;
                firstCellOffset = offset;
                if (options.isPullToRefreshCallback && options.isPullToRefreshCallback(context.getRenderNode(firstCell))) {
                    nodeSize = 0;
                }
            }
            lastCell = node;
            lastCellOffset = offset;

            //
            // Position node
            //
            set = {
                size: direction ? [size[0], nodeSize] : [nodeSize, size[1]],
                translate: direction ? [0, offset, 0] : [offset, 0, 0],
                scrollLength: nodeSize
            };
            context.set(node, set);
            offset += nodeSize;

            //
            // Keep track of the last section before the first visible cell
            //
            if (options.isSectionCallback && options.isSectionCallback(context.getRenderNode(node))) {
                if (!firstVisibleCell) {
                    lastSectionBeforeVisibleCell = node;
                } else if (lastCellOffsetInFirstVisibleSection === undefined) {
                    lastCellOffsetInFirstVisibleSection = offset - nodeSize;
                }
            } else if (!firstVisibleCell && (offset >= 0)) {
                firstVisibleCell = node;
            }
        }
        if (!lastCell) {
            lastCell = context.next();
            lastCellOffset = offset;
        }

        //
        // Process previous nodes
        //
        offset = context.scrollOffset;
        while (offset > context.scrollStart) {
            node = context.prev();
            if (!node) {
                break;
            }

            //
            // Keep track of the last section before the first visible cell
            //
            if (options.isSectionCallback && options.isSectionCallback(context.getRenderNode(node))) {
                if (!lastSectionBeforeVisibleCell) {
                    lastSectionBeforeVisibleCell = node;
                }
            } else if (offset >= 0) {
                firstVisibleCell = node;
                if (lastSectionBeforeVisibleCell) {
                    lastCellOffsetInFirstVisibleSection = offset;
                }
                lastSectionBeforeVisibleCell = undefined;
            }

            //
            // Position node
            //
            nodeSize = options.itemSize || context.resolveSize(node, size)[direction];
            set = {
                size: direction ? [size[0], nodeSize] : [nodeSize, size[1]],
                translate: direction ? [0, offset - nodeSize, 0] : [offset - nodeSize, 0, 0],
                scrollLength: nodeSize
            };
            context.set(node, set);
            offset -= nodeSize;

            //
            // Detect the first and last cell
            //
            firstCell = node;
            firstCellOffset = offset;
            if (!lastCell) {
                lastCell = node;
                lastCell = offset;
            }
        }

        //
        // When no first section is in the scrollable range, then
        // look back further in search for the that section
        //
        if (node && !lastSectionBeforeVisibleCell && options.isSectionCallback) {
            node = context.prev();
            while (node && !lastSectionBeforeVisibleCell) {
                if (options.isSectionCallback && options.isSectionCallback(context.getRenderNode(node))) {
                    lastSectionBeforeVisibleCell = node;
                    nodeSize = options.itemSize || context.resolveSize(node, size)[direction];
                    set = {
                        size: direction ? [size[0], nodeSize] : [nodeSize, size[1]],
                        translate: direction ? [0, offset - nodeSize, 0] : [offset - nodeSize, 0, 0]
                    };
                    context.set(node, set);
                }
                else {
                    node = context.prev();
                }
            }
        }

        //
        // Reposition "last section before first visible cell" to the top of the layout
        //
        if (lastSectionBeforeVisibleCell) {
            var translate = lastSectionBeforeVisibleCell.set.translate;
            translate[direction] = 0;
            translate[2] = 1; // put section on top, so that it overlays cells
            if ((lastCellOffsetInFirstVisibleSection !== undefined) &&
                (lastSectionBeforeVisibleCell.set.size[direction] > lastCellOffsetInFirstVisibleSection)) {
                translate[direction] = lastCellOffsetInFirstVisibleSection - lastSectionBeforeVisibleCell.set.size[direction];
            }
            context.set(lastSectionBeforeVisibleCell, {
                size: lastSectionBeforeVisibleCell.set.size,
                translate: translate,
                scrollLength: lastSectionBeforeVisibleCell.set.scrollLength
            });
        }

        //
        // Reposition "pull to refresh" renderable at the top
        //
        if (firstCell && (firstCellOffset > 0) &&
           options.isPullToRefreshCallback && options.isPullToRefreshCallback(context.getRenderNode(firstCell))) {
            firstCell.set.translate[direction] = 0;
            firstCell.set.size[direction] = firstCellOffset;
            context.set(firstCell, {
                size: firstCell.set.size,
                translate: firstCell.set.translate,
                scrollLength: firstCell.set.scrollLength
            });
        }

        //
        // Reposition "pull to refresh" renderable at the bottom
        //
        if (lastCell && (lastCellOffset < context.size[direction]) &&
           options.isPullToRefreshCallback && options.isPullToRefreshCallback(context.getRenderNode(lastCell))) {
            lastCell.set.translate[direction] = lastCellOffset;
            lastCell.set.size[direction] = context.size[direction] - lastCellOffset;
            context.set(lastCell, {
                size: lastCell.set.size,
                translate: lastCell.set.translate,
                scrollLength: 0
            });
        }
    }

    TableLayout.Capabilities = capabilities;
    TableLayout.Name = 'TableLayout';
    TableLayout.Description = 'Layout for sections and cells';
    module.exports = TableLayout;
});
