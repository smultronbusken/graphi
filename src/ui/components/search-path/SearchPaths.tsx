import { useContext, useMemo, useState } from "react";
import { GraphiContext, PixiContext } from "@/main";
import SearchSuggestions from "../search-suggestions/SearchSuggestions";
import { Button, Flex } from "@radix-ui/themes";
import { getPaths } from "@/graph/path";

export default function SearchPaths() {
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
        const edgePaths = getPaths(startNode, endNode, graphi.graph)
        graphi.hideAll()
        for (const edgePath of edgePaths) {
            graphi.expandEdgePath(edgePath)
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
                Search Paths
            </Button>
        </Flex>
    );
}
