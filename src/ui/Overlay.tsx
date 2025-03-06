import {
  Grid,
  Card,
  Heading,
  Text,
  Box,
  Container,
  Section,
  Flex,
  Button,
  Separator,
} from "@radix-ui/themes";
import { useContext, useState } from "react";
import { GraphiContext } from "@/main";
import "./Overlay.css";
import LayoutGroup from "./components/controls/LayoutGroup";
import General from "./components/controls/General";
import SearchSuggestions from "./components/search-suggestions/SearchSuggestions";
import SearchNode from "./components/search-node/SearchNode";
import { NodeAttributes } from "./components/node/NodeAttributes";
import { Collapsible } from "radix-ui";
import {
  CaretDownIcon,
  CaretUpIcon,
  Cross2Icon,
  RowSpacingIcon,
} from "@radix-ui/react-icons";
import { CollapsibleSection } from "./components/collapsable-section/CollapsibleSection";

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
          <Box maxWidth={"200px"} className="box-fit-content">
            <Card id="layout-container" className="pointer-events" m="4">
              <CollapsibleSection title="General">
                <General />
              </CollapsibleSection>
            </Card>
          </Box>
          <Box className="pointer-events box-fit-content">
            <Card id="layout-container" className="pointer-events" m="4">
              <CollapsibleSection title="Layout">
                <SearchNode />
              </CollapsibleSection>
            </Card>
          </Box>
        </Flex>
      </Section>
      <Section size="1" dir="row" mt="40px">
        <Flex justify={"end"}>
          <Box className="pointer-events" maxWidth={"200px"} m="4">
            <NodeAttributes />
          </Box>
        </Flex>
      </Section>
    </Grid>
  );
}
