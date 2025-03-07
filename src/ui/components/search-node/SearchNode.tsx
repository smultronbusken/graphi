import { useContext, useMemo } from "react";
import { GraphiContext, PixiContext } from "@/main";
import SearchSuggestions from "../search-suggestions/SearchSuggestions";
import { Point } from "pixi.js";

export default function SearchNode() {
  const graphi = useContext(GraphiContext);
  const app = useContext(PixiContext);

  if (!graphi || !app) return "loading";

  const onSelect = (key: string) => {
    graphi.expand(key);
    const { x, y } = graphi.graph.getNodeAttributes(key);
    app.camera.moveTo(x, y);
    graphi.setSelected(key);
};

  const onValueChange = (searchString: string, searchValue: string[]) => {
    if (searchString === "") return;
    if (!searchValue[0]) return;
    const { x, y } = graphi.graph.getNodeAttributes(searchValue[0]);
    app.camera.moveTo(x, y);
  };

  const list = useMemo(() => {
    if (!graphi || !graphi.graph) return [];
    return graphi.graph.nodes();
  }, [graphi]);

  return (
    <SearchSuggestions
      list={list}
      onSelect={onSelect}
      onValueChange={onValueChange}
    />
  );
}
