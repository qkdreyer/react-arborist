"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDragHook = useDragHook;
const react_1 = require("react");
const react_dnd_1 = require("react-dnd");
const react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
const context_1 = require("../context");
const dnd_slice_1 = require("../state/dnd-slice");
const utils_1 = require("../utils");
const create_root_1 = require("../data/create-root");
function useDragHook(node) {
    const tree = (0, context_1.useTreeApi)();
    const ids = tree.selectedIds;
    const [_, ref, preview] = (0, react_dnd_1.useDrag)(() => ({
        canDrag: () => node.isDraggable,
        type: "NODE",
        item: () => {
            // This is fired once at the begging of a drag operation
            const dragIds = tree.isSelected(node.id) ? Array.from(ids) : [node.id];
            tree.dispatch(dnd_slice_1.actions.dragStart(node.id, dragIds));
            return { id: node.id, dragIds };
        },
        end: () => {
            tree.hideCursor();
            let { parentId, index, dragIds } = tree.state.dnd;
            // If they held down meta, we need to create a copy
            // if (drop.dropEffect === "copy")
            if (tree.canDrop()) {
                (0, utils_1.safeRun)(tree.props.onMove, {
                    dragIds,
                    parentId: parentId === create_root_1.ROOT_ID ? null : parentId,
                    index: index === null ? 0 : index, // When it's null it was dropped over a folder
                    dragNodes: tree.dragNodes,
                    parentNode: tree.get(parentId),
                });
                tree.open(parentId);
            }
            tree.dispatch(dnd_slice_1.actions.dragEnd());
        },
    }), [ids, node]);
    (0, react_1.useEffect)(() => {
        preview((0, react_dnd_html5_backend_1.getEmptyImage)());
    }, [preview]);
    return ref;
}
