import { GraphiGraph } from "./types"
import { allSimpleEdgePaths } from 'graphology-simple-path';
import { bidirectional } from 'graphology-shortest-path';

export const getPaths = (source: string, target: string, graph: GraphiGraph) => {
    // Ehmmmm this is not directed search
    const paths = allSimpleEdgePaths(graph, source, target)
    return paths
}


export const shortestPath = (source: string, target: string, graph: GraphiGraph) => {
    const path = bidirectional(graph, source, target)
    console.log()
    return path
}
