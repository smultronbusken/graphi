import { Grid, Card, Heading, Text, Box, Container, Section } from "@radix-ui/themes";
import { useContext } from "react";
import { GraphiContext } from "@/main";
import "./Overlay.css";
import LayoutGroup from "./components/controls/LayoutGroup";
import General from "./components/controls/General";
import SearchSuggestions from "./components/search-suggestions/SearchSuggestions";
import SearchNode from "./components/search-node/SearchNode";
import FilterControls from "./components/pixi/filter/FilterControls";

export default function Overlay() {
    const graphi = useContext(GraphiContext);
    if (!graphi) return <Text>Loading Graphi...</Text>;


    return (
        <Grid
            position="absolute"
            top="0"
            left="0"
            height="100vh"
            p={"0"}
            columns={"1"}
            className="overlay"
            id="overlay"
        >
            <Section size="1" dir="row" mt="40px" >
                <Box maxWidth={"140px"} className="pointer-events">
                    <Card id="layout-container" className="pointer-events" m="4" >
                        <LayoutGroup />
                    </Card>
                </Box>
                <Box maxWidth={"200px"} className="pointer-events">
                    <Card id="layout-container" m="4" >
                        <General />
                    </Card>
                </Box>
                <Box maxWidth={"200px"} className="pointer-events">
                    <SearchNode />
                </Box>
                <Box className="pointer-events" maxWidth={"200px"}>
                    <Card id="layout-container" m="4" >
                        <FilterControls />
                    </Card>
                </Box>
            </Section>
        </Grid>
    );
}
