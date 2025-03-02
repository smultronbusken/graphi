import { GraphiGraph } from "./types"
import {allSimpleEdgePaths} from 'graphology-simple-path';


export const getPath = (source: string, target: string, graph: GraphiGraph) => {
    const paths = allSimpleEdgePaths(graph, source, target) 
    return paths
}