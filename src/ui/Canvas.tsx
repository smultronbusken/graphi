import { GraphiContext, PixiContext } from "@/main";
import { useContext, useEffect } from "react";
import "./Canvas.css";
import input from "@/input/input";
import { ContextMenu } from "@radix-ui/themes";

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
    <ContextMenu.Root >
      <ContextMenu.Trigger>
        <div id="pixi-container" style={{ position: "absolute", top: "0" }}></div>
      </ContextMenu.Trigger>
      <ContextMenu.Content variant="solid" size="1" className="data-[state=closed]:none">
        <ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>

        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Move to project…</ContextMenu.Item>
            <ContextMenu.Item>Move to folder…</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>Advanced options…</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>

        <ContextMenu.Separator />
        <ContextMenu.Item>Share</ContextMenu.Item>
        <ContextMenu.Item>Add to favorites</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘ ⌫" color="red">
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
