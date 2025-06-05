"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header/Header";
import { Context } from "../../context";
import { erDocWithoutLocation } from "../../util/common";
import { DiagramChange, ErDocChangeEvent } from "../../types/CodeEditor";
import { ER } from "../../../ERDoc/types/parser/ER";
import { useJSON, ErJSON } from "../../hooks/useJSON";
import { useMonaco } from "@monaco-editor/react";
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";
import { debounce } from "lodash";

const Body = dynamic(() => import("../../components/Body"), { ssr: false });

const Page = () => {
  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState<boolean | null>(
    null,
  );
  const [erDoc, setErDoc] = useState<ER | null>(null);
  const [lastChange, setLastChange] = useState<DiagramChange | null>(null);

  const monaco = useMonaco();
  const params = useParams();
  const locale = useLocale();
  const router = useRouter();
  const modelId = params.modelId as string;
  const [modelName, setModelName] = useState<string>("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const saveRef = useRef<(id: string) => void>();
  const [initialJson, setInitialJson] = useState<ErJSON | null>(null);

 useEffect(() => {
    if (!monaco) return;
    saveRef.current = debounce((id: string) => {
      const editorModels = monaco.editor.getModels();
      if (!editorModels?.length) return; 
      const editorValue = editorModels[0].getValue();
      fetch(`/api/diagram/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: editorValue }),
      }).catch((err) => console.error("Error saving model:", err));
    }, 2000);
  }, [monaco]);
  
  const onErDocChange = (evt: ErDocChangeEvent) => {
    switch (evt.type) {
      case "json": {
        setLastChange({
          type: "json",
          positions: evt.positions,
        });
        return;
      }

      case "localStorage": {
        setLastChange({
          type: "localStorage",
          positions: evt.positions,
        });
        return;
      }

      case "userInput": {
        const { er } = evt;
        setErDoc((currentEr) => {
          if (currentEr === null) return er;
          const currentErNoLoc = erDocWithoutLocation(currentEr);
          const newErNoLoc = erDocWithoutLocation(er);
          const sameSemanticValue =
            JSON.stringify(currentErNoLoc) === JSON.stringify(newErNoLoc);
          return sameSemanticValue ? currentEr : er;
        });
        if (modelId) {
          saveRef.current?.(modelId);
        }
        return;
      }

      default: {
        const exhaustiveCheck: never = evt;
        throw new Error(`Unhandled event type: ${exhaustiveCheck}`);
      }
    }
  };

  const { importJSON } = useJSON(onErDocChange);

  useEffect(() => {
    if (!modelId || !monaco) return;
    const fetchModel = async () => {
      const res = await fetch(`/api/diagram/${modelId}`, {
        credentials: "include"
      });
      if (res.status === 401) {
        router.push(`/${locale}/login`);
        return;
      }
      const data = await res.json();
      if (!data.isAuthorized) {
        setShowJoinModal(true);
      } else {
        setModelName(data.model.name); 
        setInitialJson(data.model.json); 
      }
    };
    fetchModel().catch((err) => console.error("Error fetching model:", err));;
  }, [modelId, monaco]);

  return (
    <Context.Provider
      value={{
        autoLayoutEnabled,
        setAutoLayoutEnabled,
      }}
    >
      <div className="flex h-screen w-screen flex-col">
        <div className="flex h-[10%] w-full justify-between border-b border-b-border  bg-[#232730] min-[1340px]:h-[5%]">
          <Header onErDocChange={onErDocChange} />
        </div>
        <div className="h-[90%] w-full min-[1340px]:h-[95%]">
          <Body
            erDoc={erDoc}
            lastChange={lastChange}
            onErDocChange={onErDocChange}
            modelName={modelName}
            modelId={modelId}
            initialJson={initialJson ?? null}
          />
        </div>
      </div>
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Unirse al diagrama</h2>
            <p className="mb-4">No formas parte de este modelo. ¿Quieres unirte?</p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={() => router.push(`/${locale}/user`)}
              >
                Cancelar
              </button>
              <button
                className="bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  const res = await fetch(`/api/diagram/${modelId}/join`, {
                    method: "POST",
                    credentials: "include",
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setModelName(data.model.name); 
                    setInitialJson(data.model.json); 
                    setShowJoinModal(false)
                  }
                }}
              >
                Unirme
              </button>
            </div>
          </div>
        </div>
      )}
    </Context.Provider>
  );
};

export default Page;
