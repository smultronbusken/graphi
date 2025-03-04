import { Grid, Card, Heading, Text, Box, Container, Section, Flex } from "@radix-ui/themes";
import { useContext } from "react";
import { GraphiContext } from "@/main";
import "./Overlay.css";
import LayoutGroup from "./components/controls/LayoutGroup";
import General from "./components/controls/General";
import SearchSuggestions from "./components/search-suggestions/SearchSuggestions";
import SearchNode from "./components/search-node/SearchNode";
import { NodeAttributes } from "./components/node/NodeAttributes";

export default function Overlay() {
    const graphi = useContext(GraphiContext);
    if (!graphi) return <Text>Loading Graphi...</Text>;


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
                    <Box maxWidth={"140px"}>
                        <Card id="layout-container" className="pointer-events" m="4" >
                            <LayoutGroup />
                        </Card>
                    </Box>
                    <Box maxWidth={"200px"}>
                        <Card id="layout-container" className="pointer-events" m="4" >
                            <General />
                        </Card>
                    </Box>
                    <Box className="pointer-events" maxWidth={"200px"}>
                        <SearchNode />
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
