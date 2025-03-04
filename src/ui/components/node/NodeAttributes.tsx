import { BaseNodeAttributes } from "@/graph/types";
import { GraphiContext } from "@/main";
import { Box, Card, Heading, Text } from "@radix-ui/themes";
import { useContext, useEffect, useState } from "react";

type NodeAttributesWithKey = BaseNodeAttributes & { key: string }
export function NodeAttributes() {
    const graphi = useContext(GraphiContext);
    const [node, setNode] = useState<NodeAttributesWithKey | undefined>(undefined)

    if (!graphi) return "loading"

    useEffect(() => {
        function handleSelectedChange(key: string) {
            const attributes = graphi?.graph.getNodeAttributes(key)
            if (!attributes) return
            const attributesWithKey = { ...attributes, key }
            setNode(attributesWithKey);
        }
        graphi.events.on("onSelectedChange", handleSelectedChange);
        return () => {
            graphi.events.off("onSelectedChange", handleSelectedChange);
        };
    }, [graphi]);

    if (!node) return <></>
    return (
        <Box>
            <div key={"key"}>
                <Heading as="h4" size="1"> ID </Heading>
                <Text> {node.key} </Text>
            </div>
            <div key={"x"}>
                <Heading as="h4" size="1"> X </Heading>
                <Text> {Math.floor(node.x)} </Text>
            </div>
            <div key={"y"}> 
                <Heading as="h4" size="1"> Y </Heading>
                <Text> {Math.floor(node.y)} </Text>
            </div>
        </Box>
    )
}
