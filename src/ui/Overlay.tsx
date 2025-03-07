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
    >
      <Section size="1" dir="row" mt="40px">
        <Flex direction={"column"}>
          <Box maxWidth={"140px"} className="box-fit-content">
            <Card id="layout-container" className="pointer-events" m="4">
              <CollapsibleSection title="Layout">
                <LayoutGroup />
              </CollapsibleSection>
            </Card>
          </Box>
          <Box className="box-fit-content">
            <Card id="layout-container" className="pointer-events" m="4">
              <CollapsibleSection title="General">
                <General />
              </CollapsibleSection>
            </Card>
          </Box>
          <Box className="pointer-events box-fit-content">
            <Card id="layout-container" className="pointer-events" m="4">
              <CollapsibleSection title="Search">
                <SearchNode />
              </CollapsibleSection>
            </Card>
          </Box>
        </Flex>
      </Section>
      <Section size="1" dir="row" mt="40px">
        <Flex justify={"end"}>
          <Box className="pointer-events box-fit-content" m="4" p="4">
            <NodeAttributes />
          </Box>
        </Flex>
      </Section>
    </Grid>
  );
}
