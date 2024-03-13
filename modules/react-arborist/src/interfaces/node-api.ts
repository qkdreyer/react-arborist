import React from "react";
import { TreeApi } from "./tree-api";
import { RowStruct } from "../nodes/flatten";

export class NodeApi<T = any> {
  constructor(
    public tree: TreeApi<T>,
    public row: RowStruct<T>,
  ) {}

  get struct() {
    return this.row.node;
  }

  get isDraggable() {
    throw new Error("implement this with the tree");
  }

  get isRoot() {
    return this.struct.parent === null;
  }

  get isInternal() {
    return !this.struct.isLeaf;
  }

  get isLeaf() {
    return this.struct.isLeaf;
  }

  get id() {
    return this.struct.id;
  }

  get data() {
    return this.struct.data;
  }

  get parent() {
    return this.struct.parent;
  }

  get rowIndex() {
    return this.row.index;
  }

  get level() {
    return this.struct.level;
  }

  get isOpen() {
    return this.isLeaf ? false : this.tree.isOpen(this.id);
  }

  get isClosed() {
    return this.isLeaf ? false : !this.tree.isOpen(this.id);
  }

  get isEditable() {
    return this.tree.isEditable(this.data);
  }

  get isEditing() {
    return this.tree.editingId === this.id;
  }

  get isSelected() {
    return this.tree.isSelected(this.id);
  }

  get isOnlySelection() {
    return this.isSelected && this.tree.hasOneSelection;
  }

  get isSelectedStart() {
    return this.isSelected && !this.prev?.isSelected;
  }

  get isSelectedEnd() {
    return this.isSelected && !this.next?.isSelected;
  }

  get isFocused() {
    return this.tree.isFocused(this.id);
  }

  get isDragging() {
    return this.tree.isDragging(this.id);
  }

  get willReceiveDrop() {
    return this.tree.willReceiveDrop(this.id);
  }

  get state() {
    return {
      isClosed: this.isClosed,
      isDragging: this.isDragging,
      isEditing: this.isEditing,
      isFocused: this.isFocused,
      isInternal: this.isInternal,
      isLeaf: this.isLeaf,
      isOpen: this.isOpen,
      isSelected: this.isSelected,
      isSelectedEnd: this.isSelectedEnd,
      isSelectedStart: this.isSelectedStart,
      willReceiveDrop: this.willReceiveDrop,
    };
  }

  get childIndex() {
    if (this.parent && this.parent.children) {
      return this.parent.children.findIndex((child) => child.id === this.id);
    } else {
      return -1;
    }
  }

  get next(): NodeApi<T> | null {
    if (this.rowIndex === null) return null;
    return this.tree.at(this.rowIndex + 1);
  }

  get prev(): NodeApi<T> | null {
    if (this.rowIndex === null) return null;
    return this.tree.at(this.rowIndex - 1);
  }

  get nextSibling(): NodeApi<T> | null {
    const i = this.childIndex;
    return this.parent?.children![i + 1] ?? null;
  }

  isAncestorOf(node: NodeApi<T> | null) {
    if (!node) return false;
    let ancestor: NodeApi<T> | null = node;
    while (ancestor) {
      if (ancestor.id === this.id) return true;
      ancestor = ancestor.parent;
    }
    return false;
  }

  select() {
    this.tree.select(this);
  }

  deselect() {
    this.tree.deselect(this);
  }

  selectMulti() {
    this.tree.selectMulti(this);
  }

  selectContiguous() {
    this.tree.selectContiguous(this);
  }

  activate() {
    this.tree.activate(this);
  }

  focus() {
    this.tree.focus(this);
  }

  toggle() {
    this.tree.toggle(this);
  }

  open() {
    this.tree.open(this);
  }

  openParents() {
    this.tree.openParents(this);
  }

  close() {
    this.tree.close(this);
  }

  submit(value: string) {
    this.tree.submit(this, value);
  }

  reset() {
    this.tree.reset();
  }

  edit() {
    return this.tree.edit(this);
  }

  handleClick = (e: React.MouseEvent) => {
    if (e.metaKey && !this.tree.props.disableMultiSelection) {
      this.isSelected ? this.deselect() : this.selectMulti();
    } else if (e.shiftKey && !this.tree.props.disableMultiSelection) {
      this.selectContiguous();
    } else {
      this.select();
      this.activate();
    }
  };
}