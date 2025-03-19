import { memo } from "react";
import { NodeResizer, useNodeId, useStore } from "reactflow";
import NodeHandles from "./NodeHandles";

const DefaultAggregation = ({
  data: { label },
}: {
  data: { label: string };
}) => {
  // HACK: we set the width and height of the node with props because the auto layout also
  // gives us the dimensions of the subgraph, which corresponds to the dimensions of the agg. container
  // tailwind doesn't seem to update the width and height of the node when we change the props, so we use
  // inline styles.
  const nodeId = useNodeId();
  const node = useStore((store) => (nodeId ? store.nodeInternals.get(nodeId) : null));

  return (
    <div className="relative">
    <NodeResizer 
      minWidth={300} 
      minHeight={300}
      handleStyle={{
        width: "12px",
        height: "12px",
        backgroundColor: "blue",
        borderRadius: "50%",
      }}
    />

      <div
        style={{
          width: node?.width?? 500,
          height: node?.height?? 500,
        }}
        className={`z-10 flex border-2 border-dashed border-sky-700 bg-sky-200/[.26] p-2`}
      >
        <div>{label}</div>
      </div>
      <NodeHandles
        TopHandleStyle={[
          { top: "-1%" },
          { top: "-1%", left: "2%" },
          { top: "-1%", left: "25%" },
          { top: "-1%", left: "75%" },
          { top: "-1%", left: "98%" },
        ]}
        BottomHandleStyle={[
          { bottom: "-1%" },
          { bottom: "-1%", left: "2%" },
          { bottom: "-1%", left: "25%" },
          { bottom: "-1%", left: "75%" },
          { bottom: "-1%", left: "98%" },
        ]}
        LeftHandleStyle={[
          { left: "-1%" },
          { left: "-1%", top: "2%" },
          { left: "-1%", top: "25%" },
          { left: "-1%", top: "75%" },
          { left: "-1%", top: "98%" },
        ]}
        RightHandleStyle={[
          { right: "-1%" },
          { right: "-1%", top: "2%" },
          { right: "-1%", top: "25%" },
          { right: "-1%", top: "75%" },
          { right: "-1%", top: "98%" },
        ]}
        use5PerSide={true}
      />
    </div>
  );
};

export default memo(DefaultAggregation);
