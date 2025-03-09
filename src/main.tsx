import "@radix-ui/themes/styles.css"
import { Application, Renderer } from "pixi.js"
import { createContext, StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { initDevtools } from '@pixi/devtools'
import { Camera } from "./pixi/camera.ts"
import { Drag } from "./pixi/controls/drag.ts"
import { Graphi } from "./Graphi.ts"
import { loadAssets } from "./util/asset-loader.ts"
import generateGraph from "./util/generate-graph.ts"
import { Theme } from "@radix-ui/themes"
import input from "./input/input.ts"
import createBackground from "./pixi/background.ts"
import QueryManager from "./graph/QueryManager.ts"

export type PixiContextData = {
  pixi: Application<Renderer>
  camera: Camera
}

export const PixiContext = createContext<PixiContextData | null>(null);
export const GraphiContext = createContext<Graphi | null>(null);

const createPixiApp = async () => {
  await loadAssets();

  const app = new Application();

  await app.init({
    background: "#111113",
    resizeTo: window,
    resolution: window.devicePixelRatio,
    antialias: true,
    autoDensity: true,
  });

  //@ts-ignore
  globalThis.__PIXI_APP__ = app;
  await initDevtools({ app });
  return app
}

const Root = () => {
  const [pixiContextData, setPixiContextData] = useState<PixiContextData | null>(null);
  const [graphi, setGraphi] = useState<Graphi | null>(null);

  useEffect(() => {
    const init = async () => {
      const app = await createPixiApp();
      const camera = new Camera({
        app,
        events: app.renderer.events,
        passiveWheel: false
      })
      const context = {
        camera: camera,
        pixi: app
      }
      createBackground(app)
      const graph = await generateGraph("animals")
      const pixiGraph = new Graphi({
        graph: graph,
        drag: new Drag(context)
      });
      camera.addChild(pixiGraph.container)
      setPixiContextData(context)
      setGraphi(pixiGraph)

      const handleSpaceKeyDown = (event: KeyboardEvent, pixiGraph: Graphi, camera: Camera) => {

        if (event.ctrlKey && !event.shiftKey && !event.altKey) {
          if (!pixiGraph.selected) return
          const { x, y } = pixiGraph.graph.getNodeAttributes(pixiGraph.selected)
          camera.moveTo(x, y)
          camera.zoomTo()
          event.preventDefault();
        }
        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
          camera.moveTo(0, 0)
          event.preventDefault();
        }

      }

      input.keyboard.on("Space", (e) => handleSpaceKeyDown(e, pixiGraph, camera));
    }
    init()
    return () => {}
  }, []);

  if (!pixiContextData?.camera || !pixiContextData.pixi) return <div>Loading...</div>;

  return (
    <StrictMode>
      <PixiContext.Provider value={pixiContextData}>
        <GraphiContext.Provider value={graphi}>
          <Theme appearance="dark" radius="small">
            <App />
          </Theme>
        </GraphiContext.Provider>
      </PixiContext.Provider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);