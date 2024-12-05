import React from "react";
import { TreeApi } from "./tree-api";
type Params<T> = {
    id: string;
    data: T;
    level: number;
    children: NodeApi<T>[] | null;
    parent: NodeApi<T> | null;
    isDraggable: boolean;
    rowIndex: number | null;
    tree: TreeApi<T>;
};
export declare class NodeApi<T = any> {
    tree: TreeApi<T>;
    id: string;
    data: T;
    level: number;
    children: NodeApi<T>[] | null;
    parent: NodeApi<T> | null;
    isDraggable: boolean;
    rowIndex: number | null;
    constructor(params: Params<T>);
    get isRoot(): boolean;
    get isLeaf(): boolean;
    get isInternal(): boolean;
    get isOpen(): boolean;
    get isClosed(): boolean;
    get isEditable(): boolean;
    get isEditing(): boolean;
    get isSelected(): boolean;
    get isOnlySelection(): boolean;
    get isSelectedStart(): boolean;
    get isSelectedEnd(): boolean;
    get isFocused(): boolean;
    get isDragging(): boolean;
    get willReceiveDrop(): boolean;
    get state(): {
        isClosed: boolean;
        isDragging: boolean;
        isEditing: boolean;
        isFocused: boolean;
        isInternal: boolean;
        isLeaf: boolean;
        isOpen: boolean;
        isSelected: boolean;
        isSelectedEnd: boolean;
        isSelectedStart: boolean;
        willReceiveDrop: boolean;
    };
    get childIndex(): number;
    get next(): NodeApi<T> | null;
    get prev(): NodeApi<T> | null;
    get nextSibling(): NodeApi<T> | null;
    isAncestorOf(node: NodeApi<T> | null): boolean;
    select(): void;
    deselect(): void;
    selectMulti(): void;
    selectContiguous(): void;
    activate(): void;
    focus(): void;
    toggle(): void;
    open(): void;
    openParents(): void;
    close(): void;
    submit(value: string): void;
    reset(): void;
    clone(): NodeApi<T>;
    edit(): Promise<import("..").EditResult>;
    handleClick: (e: React.MouseEvent) => void;
}
export {};
