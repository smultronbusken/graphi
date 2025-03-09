import { GraphiContext } from "@/main";
import { useContext, useEffect, useState } from "react";
import { Box, Card, CheckboxCards, Flex, Heading, Text } from "@radix-ui/themes";
import { GraphQuery, QueryResult } from "@/graph/QueryManager";

export default function QueryView() {
  const graphi = useContext(GraphiContext);
  if (!graphi) return <Text>Loading Graphi...</Text>;

  const [queryResult, setQueryResult] = useState<QueryResult[]>([]);
  const [active, setActive] = useState<number[]>([]);
  const [query, setQuery] = useState<GraphQuery | null>(null);



  useEffect(() => {
    const onQueryComplete = (query: GraphQuery, results: QueryResult[]) => {
      setQuery(query);
      setQueryResult(results);
    };

    graphi.queries.on("onQueryComplete", onQueryComplete);
    return () => {
      graphi.queries.off("onQueryComplete", onQueryComplete);
    };
  }, [graphi]);

  useEffect(() => {

  }, [active])

  const onValueChange = (values: string[]) => {
    setActive(values.map(v => Number.parseInt(v)))
  }

  return (
    <Flex gap="3" align="center" justify={"center"} direction={"column"}>
      {
        query ? Title(query, queryResult) : <></>
      }

      <CheckboxCards.Root
        columns={{ initial: "1", sm: "3" }}
        style={{ flexDirection: "column", display: "flex" }}
        onValueChange={onValueChange}
      >
        {queryResult.map((result, idx) => (
          <CheckboxCards.Item
            key={idx}
            value={idx.toString()}
          >
            <Flex direction="column" width="100%">
              <Text weight="bold">{result.label}</Text>
              <Text>{`Nodes: ${result.nodes.size}, Edges: ${result.edges.size}`}</Text>
            </Flex>
          </CheckboxCards.Item>
        ))}
      </CheckboxCards.Root>
      {
        query ? Footer(query, queryResult) : <></>
      }
    </Flex>
  );
}


const Title = (query: GraphQuery, result: QueryResult[]) => (
  <Box maxWidth="240px">

    <Flex gap="3" align="center" justify={"center"} direction={"column"}>
      <Heading> Query </Heading>
      <Text as="div" size="2" weight="bold">
        {query.name}
      </Text>
    </Flex>

  </Box>
)

const Footer = (query: GraphQuery, result: QueryResult[]) => (
  <Text as="div" size="2" color="gray">
    {result.length} results
  </Text>
)