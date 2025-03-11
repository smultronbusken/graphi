import { GraphiGraph } from "./types";
import { allSimpleEdgePaths } from 'graphology-simple-path';
import { bidirectional } from 'graphology-shortest-path';
import { singleSource as graphologySingleSource } from 'graphology-shortest-path';
import EventEmitter from 'events';
import { ShortestPathMapping } from "graphology-shortest-path/unweighted";
import { AbstractGraph, AttributeUpdatePayload } from 'graphology-types';
import { BaseEdgeAttributes, BaseNodeAttributes, State } from '@/graph/types';

export type GraphQuery = {
    name: string;
    execute(graph: GraphiGraph, queryManager: QueryManager): QueryResult[];
}

export type QueryResult = {
    nodes: Set<string>;
    edges: Set<string>;
    label: string;
}

export type QueryManagerEvents = {
    onQueryComplete: [GraphQuery, QueryResult[]];
};

export default class QueryManager extends EventEmitter<QueryManagerEvents> {
    public graph: GraphiGraph

    public currentResults: QueryResult[] = [];
    public currentQuery: GraphQuery | null = null

    constructor() {
        super()

    }

    public setGraph(graph: GraphiGraph) {
        this.graph = graph;
    }

    public runQuery(query: GraphQuery): QueryResult[] {
        const results = query.execute(this.graph, this);
        this.currentQuery = query
        this.currentResults = results
        this.emit("onQueryComplete", query, results)
        return results;
    }

}

export const AllSimpleEdgePathsQuery = (source: string, target: string): GraphQuery => ({
    name: `AllSimpleEdgePaths:${source}->${target}`,
    execute(graph: GraphiGraph): QueryResult[] {
        const paths: string[][] = allSimpleEdgePaths(graph, source, target);
        return paths.map((path: string[]) => {
            const nodes = new Set(path);
            // Optionally, you could derive edges from the path if needed.
            const edges = new Set<string>();
            return {
                nodes,
                edges,
                label: `Path: ${path.join(" -> ")}`
            };
        });
    }
});

export const ShortestPathQuery = (source: string, target: string): GraphQuery => ({
    name: `ShortestPath:${source}->${target}`,
    execute(graph: GraphiGraph): QueryResult[] {
        const path: string[] | null = bidirectional(graph, source, target);
        if (path === null) {
            return [];
        }
        const edges = new Set<string>()
        for (let i = 1; i < path.length; i++) {
            const lastStep = path[i - 1]!
            const step = path[i]!
            const edge = graph.edge(lastStep, step)
            if (!edge) {
                throw new Error(`Expected edge ${lastStep}->${step} to exist for query`)
            }
            edges.add(edge)
        }
        const nodes = new Set(path);
        return [{
            nodes,
            edges,
            label: `Shortest Path: ${path.join(" -> ")}`
        }];
    }
});

export const ShortestPathBetweenMany = (nodes: string[]): GraphQuery => ({
    name: `ShortestPathBetweenMany:${nodes.join(",")}`,
    execute(graph: GraphiGraph, queryManager: QueryManager): QueryResult[] {

        let result: QueryResult = {
            label: `ShortestPathBetweenMany:${nodes.join(",")}`,
            edges: new Set(),
            nodes: new Set(),
        }
        for (let i = 1; i < nodes.length; i++) {
            const source = nodes[i - 1]
            const target = nodes[i]
            const shortestPath = queryManager.runQuery(ShortestPathQuery(source, target));
            if (shortestPath.length === 0) {
                // A path must exist between every node
                return []
            }
            result.edges = new Set([...shortestPath[0].edges, ...result.edges]);
            result.nodes = new Set([...shortestPath[0].nodes, ...result.nodes]);
        }

        return [result]
    }
})

export const allRelevantPaths = (center: string): GraphQuery => ({
    name: `AllRelevantPaths:${center}`,
    execute(graph: AbstractGraph<BaseNodeAttributes, BaseEdgeAttributes>, queryManager): QueryResult[] {
        let results: QueryResult[] = []

        const pathsStartingFromCenter = queryManager.runQuery(SingleSourceQuery(center));
        results = results.concat(...pathsStartingFromCenter)

        graph.forEachNode((node) => {
            const shortestPath = queryManager.runQuery(ShortestPathQuery(node, center));
            results.push(...shortestPath)
        })

        return results
    }
}
)


export const SingleSourceQuery = (source: string): GraphQuery => ({
    name: `SingleSource:${source}`,
    execute(graph: AbstractGraph<BaseNodeAttributes, BaseEdgeAttributes>): QueryResult[] {
        const result: QueryResult[] = []

        const paths = graphologySingleSource(graph, source);
        for (const [target, path] of Object.entries(paths)) {
            if (path.length === 1) continue;
            const edges: string[] = []
            for (let i = 1; i < path.length; i++) {
                const lastStep = path[i - 1]!
                const step = path[i]!
                const edge = graph.edge(lastStep, step)
                if (!edge) {
                    throw new Error(`Expected edge ${lastStep}->${step} to exist for query`)
                }
                edges.push(edge)
            }
            result.push({
                label: `${source} -> ${target}`,
                edges: new Set(edges),
                nodes: new Set(path),
            })
        }
        return result;
    }
});