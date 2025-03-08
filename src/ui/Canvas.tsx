import { GraphiContext, PixiContext } from "@/main";
import { useContext, useEffect } from "react";
import "./Canvas.css";
import input from "@/input/input";
import { ContextMenu } from "@radix-ui/themes";
import GraphiContextMenu from "./GraphiContextMenu";

export default function Canvas() {
  const app = useContext(PixiContext);

  useEffect(() => {
    if (!app) return;

    const container = document.getElementById("pixi-container");
    if (container && !container.hasChildNodes()) {
      container.appendChild(app.pixi.canvas);
    }
  }, [app]);

  return (
    <GraphiContextMenu>
      {/* Whatever you want to right-click on goes as children */}
      <div id="pixi-container" style={{ position: "absolute", top: 0 }} />
    </GraphiContextMenu>
  );
}
