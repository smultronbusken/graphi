import { useContext, useMemo } from "react";
import { GraphiContext, PixiContext } from "@/main";
import SearchSuggestions from "../search-suggestions/SearchSuggestions";
import { Point } from "pixi.js";
import input from "@/input/input";

export default function SearchNode() {
    const graphi = useContext(GraphiContext);
    const app = useContext(PixiContext);

    if (!graphi || !app) return "loading"

    const onSelect = (key: string) => {
        graphi.expand(key)
        const { x, y } = graphi.graph.getNodeAttributes(key)
        const global = app.camera.toWorld(new Point(x, y))
        const scale = app.camera.scale
        app.camera.moveCenter((global.x*scale.x) + app.camera.position.x, (global.y*scale.y) + app.camera.position.y)
    }

    const list = useMemo(() => {
        if (!graphi || !graphi.graph) return [];
        return graphi.graph.nodes();
    }, [graphi]);

    return <SearchSuggestions list={list} onSelect={onSelect} />;
}
