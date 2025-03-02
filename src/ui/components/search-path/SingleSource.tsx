import { useContext, useMemo, useState } from "react";
import { GraphiContext, PixiContext } from "@/main";
import SearchSuggestions from "../search-suggestions/SearchSuggestions";
import { Button, Flex } from "@radix-ui/themes";
import { getPaths } from "@/graph/path";
import { singleSource } from "graphology-shortest-path/dijkstra";

export default function SingleSource() {
    const graphi = useContext(GraphiContext);
    const app = useContext(PixiContext);

    const [sourceNode, setSourceNode] = useState<string | null>(null);

    if (!graphi || !app) return "loading";

    const searchPath = () => {
        if (!sourceNode) {
            console.warn("Please select both start and end nodes.");
            return;
        }
        graphi.hideAll()
        const result = singleSource(graphi.graph, sourceNode)
        for (const path of Object.values(result)) {
            graphi.expandPath(path)
        }
    };

    const list = useMemo(() => {
        if (!graphi || !graphi.graph) return [];
        return graphi.graph.nodes();
    }, [graphi]);

    return (
        <Flex direction="column" gap="3">
            <SearchSuggestions list={list} onSelect={setSourceNode} />
            <Button onClick={searchPath} disabled={!sourceNode}>
                Search Paths
            </Button>
        </Flex>
    );
}
