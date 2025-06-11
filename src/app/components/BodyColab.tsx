"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ER } from "../../ERDoc/types/parser/ER";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { DiagramChange, ErDocChangeEvent } from "../types/CodeEditor";
import { ErDiagram } from "./ErDiagram/ErDiagramColab";
import type * as Y from "yjs";
import type { WebsocketProvider } from "y-websocket";

const CodeEditor = dynamic(() => import("./CodeEditor/CodeEditorColab"), {ssr: false});

type BodyProps = {
  erDoc: ER | null;
  onErDocChange: (evt: ErDocChangeEvent) => void;
  lastChange: DiagramChange | null;
  modelName: string;
  ydoc: Y.Doc;
  provider: WebsocketProvider;
};

const Body = ({ erDoc, lastChange, onErDocChange, modelName, ydoc, provider }: BodyProps) => {
  const [erDocHasError, setErDocHasError] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const lg = (width ?? Infinity) >= 1024;

  return (
    <PanelGroup direction={lg ? "horizontal" : "vertical"}>
      <Panel defaultSize={40} minSize={25}>
        <div
          className={`flex h-full w-full flex-col  ${
            lg ? "overflow-hidden" : ""
          }`}
        >
          <CodeEditor
            onErDocChange={onErDocChange}
            onErrorChange={setErDocHasError}
            modelName={modelName}
            ydoc={ydoc}
            provider={provider}
          />
        </div>
      </Panel>

      <PanelResizeHandle
        className={`relative w-1 ${dragging ? "bg-secondary" : "bg-primary"}`}
        onDragging={(isDragging) => {
          setDragging(isDragging);
        }}
      >
        <div className="h-full w-1 bg-primary hover:bg-secondary"></div>
      </PanelResizeHandle>

      <Panel defaultSize={60} className={`${!lg ? "float-left" : ""}`}>
        <div className="h-full pt-1">
          <ErDiagram
            erDoc={erDoc!}
            erDocHasError={erDocHasError}
            lastChange={lastChange}
          />
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default Body;