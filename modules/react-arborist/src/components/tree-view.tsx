import React, {
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  forwardRef,
  useContext,
  useMemo,
  useRef,
} from "react";
import { TreeController } from "../controllers/tree-controller";
import { TreeViewProps } from "../types/tree-view-props";
import { useDrag, useDrop } from "react-aria";
import { FixedSizeList } from "react-window";
import { NodeController } from "../controllers/node-controller";
import { createRowAttributes } from "../row/attributes";
import { DefaultCursor } from "./default-cursor";
import { useCursorProps } from "../cursor/use-cursor-props";
import { useCursorContainerStyle } from "../cursor/use-cursor-container-style";
import { useOuterDrop } from "../dnd/outer-drop-hook";
import { useListInnerStyle } from "../list/use-list-inner-style";
import { computeDrop } from "../dnd/compute-drop";
import { useNodeDrag } from "../dnd/use-node-drag";
import { useNodeDrop } from "../dnd/use-node-drop";

export function TreeView<T>(props: TreeViewProps<T>) {
  console.log("<TreeView/>");
  const tree = new TreeController<T>(props);
  return (
    <TreeViewProvider tree={tree}>
      <TreeViewContainer />
    </TreeViewProvider>
  );
}

const Context = React.createContext<TreeController<any> | null>(null);

function TreeViewProvider<T>(props: {
  tree: TreeController<T>;
  children: any;
}) {
  return (
    <Context.Provider value={props.tree as TreeController<T>}>
      {props.children}
    </Context.Provider>
  );
}

export function useTree<T>(): TreeController<T> {
  const value = useContext(Context);
  if (!value) throw new Error("No context provided");
  return value;
}

function TreeViewContainer() {
  const tree = useTree();
  const outerRef = useRef();
  // useOuterDrop(outerRef);
  return (
    <div role="tree">
      {/* @ts-ignore */}
      <FixedSizeList
        className={tree.props.className}
        itemCount={tree.rows.length}
        height={tree.height}
        width={tree.width}
        itemSize={tree.rowHeight}
        overscanCount={tree.overscanCount}
        itemKey={(index) => tree.rows[index]?.id || index}
        outerElementType={ListOuter as any}
        outerRef={outerRef}
        innerElementType={ListInner as any}
        // onScroll={tree.props.onScroll}
        // onItemsRendered={tree.onItemsRendered.bind(tree)}
        // ref={tree.list}
      >
        {RowContainer as any}
      </FixedSizeList>
    </div>
  );
}

const ListOuter = forwardRef(function ListOuter(
  { children, ...rest }: any,
  ref,
) {
  return (
    <div {...rest} ref={ref}>
      <CursorContainer />
      {children}
    </div>
  );
});

const ListInner = forwardRef(function ListInner(
  { children, ...rest }: any,
  ref,
) {
  const tree = useTree();
  const style = useListInnerStyle(tree, rest.style);
  return (
    <div {...rest} ref={ref} style={style}>
      {children}
    </div>
  );
});

function CursorContainer() {
  const tree = useTree();
  const style = useCursorContainerStyle(tree);
  const props = useCursorProps(tree);
  if (!props) return null;
  return (
    <div style={style}>
      <DefaultCursor {...props} />
    </div>
  );
}

function RowContainer<T>(props: { style: React.CSSProperties; index: number }) {
  const tree = useTree<T>();
  const node = tree.rows[props.index];
  const attrs = createRowAttributes(tree, node, props.style);
  const ref = useRef<any>();
  const dropProps = useNodeDrop(node, ref);

  return (
    <RowRenderer node={node} attrs={{ ...attrs, ...dropProps }} innerRef={ref}>
      <NodeContainer node={node} />
    </RowRenderer>
  );
}

export function RowRenderer<T>(props: {
  node: NodeController<T>;
  attrs: HTMLAttributes<any>;
  children: ReactElement;
  innerRef: any;
}) {
  return (
    <div
      {...props.attrs}
      onFocus={(e) => e.stopPropagation()}
      ref={props.innerRef}
    >
      {props.children}
    </div>
  );
}

function NodeContainer<T>(props: { node: NodeController<T> }) {
  const { node } = props;
  const indent = node.tree.indent * node.level;
  const style = { paddingLeft: indent };
  const dragProps = useNodeDrag(node);

  return <NodeRenderer attrs={{ style, ...dragProps }} node={node} />;
}

function NodeRenderer<T>(props: {
  attrs: HTMLAttributes<any>;
  node: NodeController<T>;
}) {
  const { node, attrs } = props;

  function onSubmit(e: any) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const changes = Object.fromEntries(data.entries());
    node.submit(changes as Partial<T>);
  }

  function onClick(e: any) {
    if (e.metaKey && e.shiftKey) {
      node.tree.selectAll();
    } else if (e.metaKey) {
      node.isSelected ? node.deselect() : node.selectMulti();
    } else if (e.shiftKey) {
      node.selectContiguous();
    } else {
      node.select();
    }
  }

  return (
    <div {...attrs}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
      >
        {node.isLeaf ? "·" : node.isOpen ? "📂" : "📁"}
      </span>{" "}
      {node.isEditing ? (
        <form onSubmit={onSubmit} style={{ display: "contents" }}>
          <input
            type="text"
            name="name"
            defaultValue={
              /* @ts-ignore */
              node.data.name
            }
          />
        </form>
      ) : (
        <span style={{ color: node.isSelected ? "red" : "inherit" }}>
          <span onClick={onClick}>{node.id}</span>
          <span>
            {
              /* @ts-ignore */
              node.data.name
            }
          </span>
        </span>
      )}
    </div>
  );
}