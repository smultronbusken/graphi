import Graph from "graphology";
import { Attributes } from 'graphology-types';
import forceLayout, { ForceLayoutParameters } from 'graphology-layout-force';
import { LayoutMapping, SupervisedLayout } from "@/graph/types";

export type ForceLayoutOption = ForceLayoutParameters<Attributes, Attributes>

export class ForceLayout implements SupervisedLayout<ForceLayoutOption> {
    tick(graph: Graph, options: ForceLayoutOption): void {
        const positions: LayoutMapping = forceLayout(graph, options);


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