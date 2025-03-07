import { GraphiContext } from "@/main";
import { Box, Card, Flex, Grid, Section, Text } from "@radix-ui/themes";
import { useContext, useState } from "react";
import "./Overlay.css";
import { CollapsibleSection } from "./components/collapsable-section/CollapsibleSection";
import General from "./components/controls/General";
import LayoutGroup from "./components/controls/LayoutGroup";
import { NodeAttributes } from "./components/node/NodeAttributes";
import SearchNode from "./components/search-node/SearchNode";

export default function Overlay() {
  const graphi = useContext(GraphiContext);
  if (!graphi) return <Text>Loading Graphi...</Text>;
  const [open, setOpen] = useState(false);

  return (
    <Grid
      position="absolute"
      top="0"
      left="0"
      height="100%"
      width="100%"
      p={"0"}
      columns={"2"}
      className="overlay"
      id="overlay"
      mt="90px"
    >
      <Box dir="row">
        <Flex direction={"column"}>
          <Section className="box-fit-content pointer-events" m="4" p="4">
            <CollapsibleSection title="Layout">
              <LayoutGroup />
            </CollapsibleSection>
          </Section>
          <Section className="box-fit-content pointer-events" m="4" p="4">
            <CollapsibleSection title="General">
              <General />
            </CollapsibleSection>
          </Section>
          <Section className="box-fit-content pointer-events" m="4" p="4">
            <CollapsibleSection title="Search">
              <SearchNode />
            </CollapsibleSection>
          </Section>
        </Flex>
      </Box>
      <Box dir="row" mt="40px">
        <Flex justify={"end"}>
          <Section className="box-fit-content pointer-events" m="4" p="4">
            <NodeAttributes />
          </Section>
        </Flex>
      </Box>
    </Grid>
  );
}
