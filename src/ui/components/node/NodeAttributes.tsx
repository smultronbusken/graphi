import { BaseNodeAttributes } from "@/graph/types";
import { GraphiContext, PixiContext } from "@/main";
import { CopyIcon, ThickArrowRightIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Card,
  Code,
  DataList,
  Flex,
  Heading,
  IconButton,
  Link,
  Section,
  Separator,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { useContext, useEffect, useState } from "react";

type NodeAttributesWithKey = BaseNodeAttributes & { key: string };
export function NodeAttributes() {
  const graphi = useContext(GraphiContext);
  const app = useContext(PixiContext);
  const [node, setNode] = useState<NodeAttributesWithKey | undefined>(
    undefined
  );

  if (!graphi || !app) return "loading";

  useEffect(() => {
    function handleSelectedChange(key: string) {
      const attributes = graphi?.graph.getNodeAttributes(key);
      if (!attributes) return;
      const attributesWithKey = { ...attributes, key };
      setNode(attributesWithKey);
    }
    graphi.events.on("onSelectedChange", handleSelectedChange);
    return () => {
      graphi.events.off("onSelectedChange", handleSelectedChange);
    };
  }, [graphi]);

  const onClick = () => {
    const { x, y } = graphi.graph.getNodeAttributes(node?.key);
    app.camera.moveTo(x, y);
    
  };

  if (!node) return <></>;

  return (
    <Card>
      <Flex direction={"column"} align={"center"} justify={"center"}>
        <Heading size="2">Node</Heading>
        <Separator orientation="horizontal" size="4" mt="2" mb="2" />

        <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Type</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {node.type}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">ID</DataList.Label>
            <DataList.Value>
              <Flex align="center" gap="2">
                <Code variant="ghost">{node.key}</Code>
                <Tooltip content="Copy">
                  <IconButton
                    size="1"
                    aria-label="Copy"
                    color="gray"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(node.key);
                    }}
                  >
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
              </Flex>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Position</DataList.Label>
            <DataList.Value>
              <Flex align="center" gap="2">
                <Box>
                  <Code variant="ghost">{Math.floor(node.x)}</Code>
                  {",\u00A0"}
                  <Code variant="ghost">{Math.floor(node.y)}</Code>
                </Box>
                <Tooltip content="Go to">
                  <IconButton
                    size="1"
                    aria-label="Go to"
                    color="gray"
                    variant="ghost"
                    onClick={onClick}
                    
                  >
                    <ThickArrowRightIcon />
                  </IconButton>
                </Tooltip>
              </Flex>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Flex>
    </Card>
  );
}
