import { PixiContext } from "@/main";
import { useContext, useEffect } from "react";
import "./Canvas.css"

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
        <div id="pixi-container">
        </div>
    );
}
