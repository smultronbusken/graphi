import { useContext, useMemo, useState } from "react";
import { GraphiContext, PixiContext } from "@/main";
import SearchSuggestions from "../search-suggestions/SearchSuggestions";
import { Button, Flex } from "@radix-ui/themes";
import { getPath } from "@/graph/path";

export default function SearchPath() {
    const graphi = useContext(GraphiContext);
    const app = useContext(PixiContext);

    const [startNode, setStartNode] = useState<string | null>(null);
    const [endNode, setEndNode] = useState<string | null>(null);

    if (!graphi || !app) return "loading";

    const searchPath = () => {
        if (!startNode || !endNode) {
            console.warn("Please select both start and end nodes.");
            return;
        }
        const edgePaths = getPath(startNode, endNode, graphi.graph)
        graphi.hideAll()
        for (const edgePath of edgePaths) {
            for (const edge of edgePath) {
                graphi.activeEdge(edge)
            }
        }
    };

    const list = useMemo(() => {
        if (!graphi || !graphi.graph) return [];
        return graphi.graph.nodes();
    }, [graphi]);

    return (
        <Flex direction="column" gap="3">
            <SearchSuggestions list={list} onSelect={setStartNode} />
            <SearchSuggestions list={list} onSelect={setEndNode} />
            <Button onClick={searchPath} disabled={!startNode || !endNode}>
                Search Path
            </Button>
        </Flex>
    );
}
