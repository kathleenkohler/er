"use client";
import { useState, useEffect } from "react";
import Body from "../components/Body";
import Header from "../components/Header/Header";
import { Context } from "../context";
import { erDocWithoutLocation, fetchExample } from "../util/common";
import { DiagramChange, ErDocChangeEvent } from "../types/CodeEditor";
import { ER } from "../../ERDoc/types/parser/ER";
import { useSearchParams } from "next/navigation";
import { useJSON } from "../hooks/useJSON";

const Page = () => {
  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState<boolean | null>(
    null,
  );

  const [erDoc, setErDoc] = useState<ER | null>(null);
  const [lastChange, setLastChange] = useState<DiagramChange | null>(null);
  const searchParams = useSearchParams();

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
    const exampleName = searchParams.get("example");
    if (!exampleName) return;

    fetchExample(exampleName)
      .then((example) => {
        if (example) {
          importJSON(example);
        }
      })
      .catch((err) => console.error("Error loading example", err));
  }, [searchParams]);

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
          />
        </div>
      </div>
    </Context.Provider>
  );
};

export default Page;
