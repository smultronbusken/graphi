import { GraphiGraph } from "./types"
import {allSimpleEdgePaths} from 'graphology-simple-path';


export const getPaths = (source: string, target: string, graph: GraphiGraph) => {
    // Ehmmmm this is not directed search
    const paths = allSimpleEdgePaths(graph, source, target) 
    return paths
}
