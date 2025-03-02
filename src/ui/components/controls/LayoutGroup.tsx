import { useContext } from "react";
import { Grid, Heading } from "@radix-ui/themes";
import { GraphiContext } from "@/main";
import { DagreLayout } from "@/graph/layout/single/dagre";
import { ForceLayout, ForceLayoutOption } from "@/graph/layout/supervised/force";
import { ForceAtlas2Layout } from "@/graph/layout/supervised/forceatlas2";
import SupervisedLayoutControls from "../layout/supervised-layout-controls/SupervisedLayoutControls";
import LayoutControls from "../layout/layout-controls/LayoutControls";

export default function LayoutGroup() {
    const graphi = useContext(GraphiContext);
    if (!graphi) return null;

    // Dagre Layout
    const dagreLayout = new DagreLayout();

    // Force Layout
    const forceLayout = new ForceLayout();
    const forceLayoutOptions: ForceLayoutOption = {
        maxIterations: 1,
        settings: {
            attraction: 0,
            repulsion: 1,
            gravity: 0.0001,
            inertia: 0,
            maxMove: 20,
        },
        isNodeFixed: (n, a) => graphi.drag.draggingNode?.key === n,
        shouldSkipNode: (n, a) => a.hidden,
        shouldSkipEdge: (edgeKey, _attr, source, target, sourceAttr, targetAttr) =>
            _attr.hidden,
    };
    const getIt = () => forceLayoutOptions
    const tickFnForce = (_: any) => {
        forceLayout.tick(graphi.graph, getIt());
    };

    // ForceAtlas2 Layout
    const forceAtlas2Layout = new ForceAtlas2Layout();
    const tickFnForceAtlas2 = (_: any) => {
        forceAtlas2Layout.tick(graphi.graph, {});
    };

    return (
        <Grid columns="1" gap="2">
            <Heading as="h4" size="1">
                Dagre
            </Heading>
            <LayoutControls layout={dagreLayout} graph={graphi.graph} />

            <Heading as="h4" size="1">
                Force
            </Heading>
            <SupervisedLayoutControls tickFn={tickFnForce} />

            <Heading as="h4" size="1">
                ForceAtlas2
            </Heading>
            <SupervisedLayoutControls tickFn={tickFnForceAtlas2} />
        </Grid>
    );
}
