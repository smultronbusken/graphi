import { PixiContext } from "@/main";
import { Flex, Grid, Heading, Switch, Text } from "@radix-ui/themes";
import { CRTFilter, PixelateFilter } from "pixi-filters";
import { Filter } from "pixi.js";
import { useContext, useEffect } from "react";



export default function FilterControls() {
    const app = useContext(PixiContext);


    if (!app) return "loading"


    const crtFilter = new CRTFilter({
        vignetting: 0.5,
        vignettingAlpha: 0.5,
        vignettingBlur: 0.01
    })
    const pixelFilter = new PixelateFilter(4)

    const addFilter = (filter: Filter) => app.camera.addFilter(filter, app.pixi)
    const removeFilter = (filter: Filter) => app.camera.removeFilter(filter, app.pixi)
    const handleCheckChange = (checked: boolean, filter: Filter) => {
        if (checked) {
            addFilter(filter)
        } else {
            removeFilter(filter)
        }
    }

    useEffect(() => {

    })

    return (
        <Grid columns="1" align="center" gap="2">
            <Heading as="h4" size={"2"}>
                Filter
            </Heading>
            <Text as="label" size="2">
                <Flex gap="2">
                    <Switch
                        radius="full"
                        onCheckedChange={(boolean) => handleCheckChange(boolean, pixelFilter)}
                    />
                    Pixalate
                </Flex>
            </Text>
            <Text as="label" size="2">
                <Flex gap="2">
                    <Switch
                        radius="full"
                        onCheckedChange={(boolean) => handleCheckChange(boolean, crtFilter)}
                    />
                    CRT
                </Flex>
            </Text>
        </Grid>
    );
}
