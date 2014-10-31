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
    function ChatLayout(context, options) {

        // Prepare
        var size = context.size;
        var direction = context.direction;
        var offset = context.scrollOffset;
        var node;
        var nodeSize;
        var itemSize;
        var lastSectionBeforeVisibleCell;
        var lastSectionBeforeVisibleCellOffset;
        var lastSectionBeforeVisibleCellLength;
        var firstVisibleCell;
        var lastCellOffsetInFirstVisibleSection;
        var firstCell;
        var firstCellOffset;
        var lastCell;
        var lastCellOffset;
        var set = {
            size: [size[0], size[1]],
            translate: [0, 0, 0]
        };

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
            set.size[direction] = nodeSize;
            set.translate[direction] = offset;
            set.scrollLength = nodeSize;
            context.set(node, set);
            offset += nodeSize;

            //
            // Keep track of the last section before the first visible cell
            //
            if (options.isSectionCallback && options.isSectionCallback(context.getRenderNode(node))) {
                if (!firstVisibleCell) {
                    lastSectionBeforeVisibleCell = node;
                    lastSectionBeforeVisibleCellOffset = offset - nodeSize;
                    lastSectionBeforeVisibleCellLength = nodeSize;
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

            // Get node size
            nodeSize = options.itemSize || context.resolveSize(node, size)[direction];

            //
            // Keep track of the last section before the first visible cell
            //
            if (options.isSectionCallback && options.isSectionCallback(context.getRenderNode(node))) {
                if (!lastSectionBeforeVisibleCell) {
                    lastSectionBeforeVisibleCell = node;
                    lastSectionBeforeVisibleCellOffset = offset - nodeSize;
                    lastSectionBeforeVisibleCellLength = nodeSize;
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
            offset -= nodeSize;
            set.size[direction] = nodeSize;
            set.translate[direction] = offset;
            set.scrollLength = nodeSize;
            context.set(node, set);

            //
            // Detect the first and last cell
            //
            firstCell = node;
            firstCellOffset = offset;
            if (!lastCell) {
                lastCell = node;
                lastCellOffset = offset;
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
                    set.size[direction] = nodeSize;
                    lastSectionBeforeVisibleCellOffset = offset - nodeSize;
                    lastSectionBeforeVisibleCellLength = nodeSize;
                    set.translate[direction] = offset - nodeSize;
                    set.scrollLength = undefined;
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
            set.translate[direction] = Math.max(0, lastSectionBeforeVisibleCellOffset);
            if ((lastCellOffsetInFirstVisibleSection !== undefined) &&
                (lastSectionBeforeVisibleCellLength > lastCellOffsetInFirstVisibleSection)) {
                set.translate[direction] = lastCellOffsetInFirstVisibleSection - lastSectionBeforeVisibleCellLength;
            }
            set.size[direction] = lastSectionBeforeVisibleCellLength;
            set.scrollLength = lastSectionBeforeVisibleCellLength;
            set.translate[2] = 1; // put section on top, so that it overlays cells
            context.set(lastSectionBeforeVisibleCell, set);
            set.translate[2] = 0; // restore..
        }

        //
        // Reposition "pull to refresh" renderable at the top
        //
        /*if (firstCell && (firstCellOffset > 0) &&
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
        }*/
    }

    ChatLayout.Capabilities = capabilities;
    ChatLayout.Name = 'ChatLayout';
    ChatLayout.Description = 'Layout for chat view';
    module.exports = ChatLayout;
});
