import Graph from "graphology";
import dagre from "@dagrejs/dagre";
import { Layout } from "@/graph/types";
import { Graphi } from "@/Graphi";


export class DagreLayout implements Layout<dagre.configUnion> {
    public run(graphi: Graphi, options?: dagre.configUnion) {
        const graph = graphi.graph
        var g = new dagre.graphlib.Graph();

        g.setGraph({});
        g.setDefaultEdgeLabel(function () { return {}; });
        graph.forEachNode((n, attr) => {
            if (attr.hidden) return
            g.setNode(n, { width: 40, height: 40 })
        })
        graph.forEachEdge((n, atr, s, t, sa, ta) => {
            if (sa.hidden || ta.hidden) return
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

