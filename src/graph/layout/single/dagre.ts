import Graph from "graphology";
import dagre from "@dagrejs/dagre";
import { Layout } from "@/graph/types";


export class DagreLayout implements Layout<dagre.configUnion> {
    public run(graph: Graph, options?: dagre.configUnion) {
        var g = new dagre.graphlib.Graph();
        g.setGraph({});
        g.setDefaultEdgeLabel(function () { return {}; });
        graph.forEachNode(n => {
            g.setNode(n, { width: 40, height: 40 })
        })
        graph.forEachEdge((n, atr, s, t) => {
            g.setEdge(s, t)
        })
        dagre.layout(g, options);


        for (const key of g.nodes()) {
            const { x, y } = g.node(key)
            const scale = 1
            graph.updateNodeAttributes(key, attr => ({
                ...attr,
                x: x * scale,
                y: y * scale
            }));
        }

        for (const edge of g.edges()) {
            const { v, w } = edge
            const { points } = g.edge(edge)
            const scale = 1
            points.map(p => p.x = p.x * scale)
            points.map(p => p.y = p.y * scale)
            const realEdge = graph.edge(v, w)
            graph.setEdgeAttribute(realEdge, "points", points)
        }

    }
}

