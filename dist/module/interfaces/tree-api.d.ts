import { EditResult } from "../types/handlers";
import { Identity, IdObj } from "../types/utils";
import { TreeProps } from "../types/tree-props";
import { MutableRefObject } from "react";
import { Align, FixedSizeList, ListOnItemsRenderedProps } from "react-window";
import { DefaultRow } from "../components/default-row";
import { DefaultNode } from "../components/default-node";
import { NodeApi } from "./node-api";
import { Actions, RootState } from "../state/root-reducer";
import { DefaultDragPreview } from "../components/default-drag-preview";
import { DefaultContainer } from "../components/default-container";
import { Cursor } from "../dnd/compute-drop";
import { Store } from "redux";
export declare class TreeApi<T> {
    store: Store<RootState, Actions>;
    props: TreeProps<T>;
    list: MutableRefObject<FixedSizeList | null>;
    listEl: MutableRefObject<HTMLDivElement | null>;
    static editPromise: null | ((args: EditResult) => void);
    root: NodeApi<T>;
    visibleNodes: NodeApi<T>[];
    visibleStartIndex: number;
    visibleStopIndex: number;
    idToIndex: {
        [id: string]: number;
    };
    constructor(store: Store<RootState, Actions>, props: TreeProps<T>, list: MutableRefObject<FixedSizeList | null>, listEl: MutableRefObject<HTMLDivElement | null>);
    update(props: TreeProps<T>): void;
    dispatch(action: Actions): {
        type: "FOCUS";
        id: string | null;
    } | {
        readonly type: "TREE_BLUR";
    } | {
        type: "EDIT";
        id: string | null;
    } | import("../types/utils").ActionTypes<{
        open(id: string, filtered: boolean): {
            type: "VISIBILITY_OPEN";
            id: string;
            filtered: boolean;
        };
        close(id: string, filtered: boolean): {
            type: "VISIBILITY_CLOSE";
            id: string;
            filtered: boolean;
        };
        toggle(id: string, filtered: boolean): {
            type: "VISIBILITY_TOGGLE";
            id: string;
            filtered: boolean;
        };
        clear(filtered: boolean): {
            type: "VISIBILITY_CLEAR";
            filtered: boolean;
        };
    }> | import("../types/utils").ActionTypes<{
        clear: () => {
            type: "SELECTION_CLEAR";
        };
        only: (id: string | IdObj) => {
            type: "SELECTION_ONLY";
            id: string;
        };
        add: (id: string | string[] | IdObj | IdObj[]) => {
            type: "SELECTION_ADD";
            ids: string[];
        };
        remove: (id: string | string[] | IdObj | IdObj[]) => {
            type: "SELECTION_REMOVE";
            ids: string[];
        };
        set: (args: {
            ids: Set<string>;
            anchor: string | null;
            mostRecent: string | null;
        }) => {
            ids: Set<string>;
            anchor: string | null;
            mostRecent: string | null;
            type: "SELECTION_SET";
        };
        mostRecent: (id: string | null | IdObj) => {
            type: "SELECTION_MOST_RECENT";
            id: string | null;
        };
        anchor: (id: string | null | IdObj) => {
            type: "SELECTION_ANCHOR";
            id: string | null;
        };
    }> | import("../types/utils").ActionTypes<{
        cursor(cursor: Cursor): {
            type: "DND_CURSOR";
            cursor: Cursor;
        };
        dragStart(id: string, dragIds: string[]): {
            type: "DND_DRAG_START";
            id: string;
            dragIds: string[];
        };
        dragEnd(): {
            type: "DND_DRAG_END";
        };
        hovering(parentId: string | null, index: number | null): {
            type: "DND_HOVERING";
            parentId: string | null;
            index: number | null;
        };
    }>;
    get state(): {
        nodes: {
            focus: import("../state/focus-slice").FocusState;
            edit: import("../state/edit-slice").EditState;
            open: import("../state/open-slice").OpenSlice;
            selection: import("../state/selection-slice").SelectionState;
            drag: import("../state/drag-slice").DragSlice;
        };
        dnd: import("../state/dnd-slice").DndState;
    };
    get openState(): import("../state/open-slice").OpenMap;
    get width(): string | number;
    get height(): number;
    get indent(): number;
    get rowHeight(): number;
    get overscanCount(): number;
    get searchTerm(): string;
    get matchFn(): (node: NodeApi<T>) => boolean;
    accessChildren(data: T): readonly T[] | null;
    accessId(data: T): string;
    get firstNode(): NodeApi<T>;
    get lastNode(): NodeApi<T>;
    get focusedNode(): NodeApi<T> | null;
    get mostRecentNode(): NodeApi<T> | null;
    get nextNode(): NodeApi<T> | null;
    get prevNode(): NodeApi<T> | null;
    get(id: string | null): NodeApi<T> | null;
    at(index: number): NodeApi<T> | null;
    nodesBetween(startId: string | null, endId: string | null): NodeApi<T>[];
    indexOf(id: string | null | IdObj): number | null;
    get editingId(): string | null;
    createInternal(): Promise<void>;
    createLeaf(): Promise<void>;
    create(opts?: {
        type?: "internal" | "leaf";
        parentId?: null | string;
        index?: null | number;
    }): Promise<void>;
    delete(node: string | IdObj | null | string[] | IdObj[]): Promise<void>;
    edit(node: string | IdObj): Promise<EditResult>;
    submit(identity: Identity, value: string): Promise<void>;
    reset(): void;
    activate(id: string | IdObj | null): void;
    private resolveEdit;
    get selectedIds(): Set<string>;
    get selectedNodes(): NodeApi<T>[];
    focus(node: Identity, opts?: {
        scroll?: boolean;
    }): void;
    pageUp(): void;
    pageDown(): void;
    select(node: Identity, opts?: {
        align?: Align;
        focus?: boolean;
    }): void;
    deselect(node: Identity): void;
    selectMulti(identity: Identity): void;
    selectContiguous(identity: Identity): void;
    deselectAll(): void;
    selectAll(): void;
    setSelection(args: {
        ids: (IdObj | string)[] | null;
        anchor: IdObj | string | null;
        mostRecent: IdObj | string | null;
    }): void;
    get cursorParentId(): string | null;
    get cursorOverFolder(): boolean;
    get dragNodes(): NodeApi<T>[];
    get dragNode(): NodeApi<T> | null;
    get dragDestinationParent(): NodeApi<T> | null;
    get dragDestinationIndex(): number | null;
    canDrop(): boolean;
    hideCursor(): void;
    showCursor(cursor: Cursor): void;
    open(identity: Identity): void;
    close(identity: Identity): void;
    toggle(identity: Identity): void;
    openParents(identity: Identity): void;
    openSiblings(node: NodeApi<T>): void;
    openAll(): void;
    closeAll(): void;
    scrollTo(identity: Identity, align?: Align): Promise<void> | undefined;
    get isEditing(): boolean;
    get isFiltered(): boolean;
    get hasFocus(): boolean;
    get hasNoSelection(): boolean;
    get hasOneSelection(): boolean;
    get hasMultipleSelections(): boolean;
    isSelected(id?: string): boolean;
    isOpen(id?: string): boolean;
    isEditable(data: T): boolean;
    isDraggable(data: T): boolean;
    isDragging(node: string | IdObj | null): boolean;
    isFocused(id: string): boolean;
    isMatch(node: NodeApi<T>): boolean;
    willReceiveDrop(node: string | IdObj | null): boolean;
    onFocus(): void;
    onBlur(): void;
    onItemsRendered(args: ListOnItemsRenderedProps): void;
    get renderContainer(): import("react").ElementType<{}> | typeof DefaultContainer;
    get renderRow(): import("react").ElementType<import("..").RowRendererProps<T>> | typeof DefaultRow;
    get renderNode(): import("react").ElementType<import("..").NodeRendererProps<T>> | typeof DefaultNode;
    get renderDragPreview(): import("react").ElementType<import("..").DragPreviewProps> | typeof DefaultDragPreview;
    get renderCursor(): import("react").ElementType<import("..").CursorProps> | import("react").NamedExoticComponent<import("..").CursorProps>;
}
