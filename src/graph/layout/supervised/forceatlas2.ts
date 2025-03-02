import forceAtlas2, { ForceAtlas2Settings } from 'graphology-layout-forceatlas2';
import Graph from "graphology";
import { LayoutMapping, SupervisedLayout } from "@/graph/types";

type OptionType = ForceAtlas2Settings;

export class ForceAtlas2Layout implements SupervisedLayout<OptionType> {
    tick(graph: Graph, options?: OptionType): void {
        const sensibleSettings = forceAtlas2.inferSettings(graph);
        const positions: LayoutMapping = forceAtlas2(graph, {
            iterations: 1,
            settings: sensibleSettings

        });
        for (const [key, { x, y }] of Object.entries(positions)) {
            graph.updateNodeAttributes(key, attr => ({
                ...attr,
                x,
                y
            }));
        }
    }

    stop(): void {

    }

}