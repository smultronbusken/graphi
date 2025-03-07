import { GraphiContext } from "@/main";
import { Box, Card, Flex, Grid, Section, Text } from "@radix-ui/themes";
import { useContext, useState } from "react";
import "./Overlay.css";
import { CollapsibleSection } from "./components/collapsable-section/CollapsibleSection";
import LayoutGroup from "./components/controls/LayoutGroup";
import { NodeAttributes } from "./components/node/NodeAttributes";
import SearchNode from "./components/search-node/SearchNode";
import { SideNav } from "./components/side-nav/SideNav";
import { Search } from "./components/search/Search";

export default function Overlay() {
    const graphi = useContext(GraphiContext);
    if (!graphi) return <Text>Loading Graphi...</Text>;
    const [open, setOpen] = useState(false);

    return (
        <SideNav>

            <Box pt="4" px="3" pb="9">
                <Box mb="4" pr="4">
                    <Search />
                </Box>

                <Grid
                    height="100%"
                    width="100%"
                    p={"0"}
                    columns={"2"}
                    className="overlay"
                    id="overlay"
                >
                    <Box dir="row">
                        <Flex direction={"column"}>
                            <Section className="box-fit-content pointer-events" m="4" p="4">
                                <CollapsibleSection title="Layout">
                                    <LayoutGroup />
                                </CollapsibleSection>
                            </Section>
                        </Flex>
                    </Box>
                </Grid>
            </Box>
        </SideNav>



    );
}
