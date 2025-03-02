import { Layout } from "@/graph/types";
import Graph from "graphology";


export class DagreLayout implements Layout<any> {
    public run(graph: Graph, options?: any) {
        /* const elk = new ELK()
         const nodes: any[] = []
         const edges: any[] = []
         graph.forEachNode(n => {
           nodes.push({ id: n, width: 290, height: 290 })
         })
         graph.forEachEdge((n, atr, s, t) => {
           edges.push({ id: n, sources: [s], targets: [t] })
         })
         const graphData = {
           id: "root",
           layoutOptions: { 'elk.algorithm': 'layered' },
           children: nodes,
           edges: edges
         }
         const layout = await elk.layout(graphData)
         for (const node of layout.children!) {
           const { x, y } = node
           const scale = 5
           pixiGraph.graph.updateNodeAttributes(node.id, attr => ({
             ...attr,
             x: x! ,
             y: y!
           }));
         }
       
         for (const edge of layout.edges!) {
       
           const { sections } = edge
           const points = []
           points.push(sections![0]!.startPoint)
           if (sections![0]!.bendPoints)
             points.push(...sections![0]!.bendPoints)
           points.push(sections![0]!.endPoint)
       
           const realEdge = graph.edge(edge.sources[0], edge.targets[0])
           graph.setEdgeAttribute(realEdge, "points", points)
         }*/
    }
}
