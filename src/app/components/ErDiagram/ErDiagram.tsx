import { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  EdgeTypes,
  Node,
  NodeTypes,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { ER } from "../../../ERDoc/types/parser/ER";
import { ErNotation } from "../../types/ErDiagram";
import { erToReactflowElements } from "../../util/erToReactflowElements";
import { ControlPanel } from "./ControlPanel";
import CustomSVGs from "./CustomSVGs";
import ArrowNotation from "./notations/ArrowNotation";
import { useD3LayoutedElements } from "./useD3LayoutedElements";
import {
  getLayoutedElements,
  useLayoutedElements,
} from "./useLayoutedElements";

type ErDiagramProps = {
  erDoc: ER;
  erNodeTypes: NodeTypes;
  erEdgeTypes: EdgeTypes;
  erEdgeNotation: ErNotation["edgeMarkers"];
};

const NotationSelectorErDiagramWrapper = ({ erDoc }: { erDoc: ER }) => {
  const [currentNotation, _] = useState<ErNotation>(ArrowNotation);
  return (
    <ReactFlowProvider>
      <ErDiagram
        erDoc={erDoc}
        erNodeTypes={currentNotation.nodeTypes}
        erEdgeTypes={currentNotation.edgeTypes}
        erEdgeNotation={currentNotation.edgeMarkers}
      />
    </ReactFlowProvider>
  );
};

const ErDiagram = ({
  erDoc,
  erNodeTypes,
  erEdgeTypes,
  erEdgeNotation,
}: ErDiagramProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { layoutElements } = useLayoutedElements();
  const { D3LayoutElements } = useD3LayoutedElements();

  const nodeTypes = useMemo(() => erNodeTypes, []);
  const edgeTypes = useMemo(() => erEdgeTypes, []);

  const isFirstRenderRef = useRef<boolean | null>(true);
  const nodesInitialized = useNodesInitialized();
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (erDoc === null) return;
    const [newNodes, newEdges] = erToReactflowElements(erDoc, erEdgeNotation);

    setNodes((nodes) => {
      for (const n of newNodes) {
        const oldNode = nodes.find((nd) => nd.id === n.id) as Node<{
          height: number;
          width: number;
        }>;
        // hack: on first render, hide the nodes before they are layouted
        if (isFirstRenderRef.current === true) {
          n.style = {
            ...n.style,
            opacity: 0,
          };
        }
        // if the node already exists, keep its position
        if (oldNode !== undefined) {
          n.position = oldNode.position;
          // for aggregations, don't modify its size
          if (oldNode.type === "aggregation" && n.type === "aggregation") {
            n.data.height = oldNode.data.height;
            n.data.width = oldNode.data.width;
          }
        }
      }
      return newNodes;
    });

    setEdges(() => {
      // same hack as above
      if (isFirstRenderRef.current === true) {
        return newEdges.map((e) => {
          e.hidden = true;
          return e;
        });
      } else return newEdges;
    });
  }, [erDoc]);

  /* auto layout on initial render */
  useEffect(() => {
    if (isFirstRenderRef.current === true && nodesInitialized) {
      const updateElements = async () => {
        const layoutedElements = await getLayoutedElements(nodes, edges);
        setNodes(
          layoutedElements.map((n) => ({
            ...n,
            style: {
              ...n.style,
              opacity: 1,
            },
          })),
        );
        setEdges((eds) =>
          eds.map((e) => {
            e.hidden = false;
            return e;
          }),
        );
        window.requestAnimationFrame(() => fitView());
        isFirstRenderRef.current = false;
      };
      void updateElements();
    } else if (isFirstRenderRef.current === false) {
      window.requestAnimationFrame(() => fitView());
      isFirstRenderRef.current = null;
    }
  }, [nodes, edges]);

  // auto layout
  useEffect(() => {
    if (nodesInitialized) {
      console.log("using effect");
      void layoutElements({
        "elk.algorithm": "org.eclipse.elk.force",
        "elk.force.temperature": "0.05",
        "elk.spacing.nodeNode": "4",
        "elk.force.iterations": "700",
      })
        .then(() => window.requestAnimationFrame(() => fitView()))
        .catch(() => {});
    }
  }, [nodes.length, nodesInitialized, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgeTypes={edgeTypes}
      proOptions={{ hideAttribution: true }}
    >
      {/* <Background variant={BackgroundVariant.Cross} /> */}

      <Panel position="top-right">
        <br />
        <button
          onClick={() => {
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.stress",
              "elk.stress.desiredEdgeLength": "110",
            });
          }}
        >
          ELK stress layout
        </button>
        <br />
        <button
          onClick={() => {
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.radial",
              "elk.portLabels.placement": "ALWAYS_SAME_SIDE",
            });
          }}
        >
          ELK radial layout
        </button>

        <br />
        <button
          onClick={() => {
            void layoutElements({
              "elk.algorithm": "org.eclipse.elk.force",
              // "elk.force.model": "EADES",
              // "elk.force.repulsion": "20",
              "elk.force.temperature": "0.05",
              "elk.spacing.nodeNode": "4",
              "elk.force.iterations": "1500",
            });
          }}
        >
          ELK force layout
        </button>

        <br />
        <button onClick={D3LayoutElements}>d3-force Layout</button>
      </Panel>

      <ControlPanel />
      <CustomSVGs />
    </ReactFlow>
  );
};

export { NotationSelectorErDiagramWrapper as ErDiagram };
