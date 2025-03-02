import { useState, useContext } from "react";
import { Button, Flex, Text } from "@radix-ui/themes";
import { GraphiContext } from "@/main";
import SearchSuggestions from "../search-suggestions/SearchSuggestions";

export default function General() {
  const graphi = useContext(GraphiContext);
  const [nodeKey, setNodeKey] = useState("");

  if (!graphi) return <Text>Loading Graphi...</Text>;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      graphi.hideAll();
      graphi.expand(nodeKey);
    }
  };

  const hideAllClick = () => {
    graphi.hideAll();
  };
  const showAllClick = () => {
    graphi.showAll();
  };

  return (
    <Flex direction="column" gap="2">
      <Button onClick={hideAllClick}>Hide All</Button>
      <Button onClick={showAllClick}>Show All</Button>
      <input
        type="text"
        placeholder="Expand node"
        value={nodeKey}
        onChange={(e) => setNodeKey(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc"
        }}
      />

    </Flex>
  );
}
