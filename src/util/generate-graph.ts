import { BaseAttributes, BaseEdgeAttributes, BaseNodeAttributes } from "@/graph/types";
import Graph, { DirectedGraph } from "graphology";
import { clusters } from "graphology-generators/random";
import gexf from "graphology-gexf/browser"

async function createGraphFromFile(path: string): Promise<Graph<BaseNodeAttributes, BaseEdgeAttributes, BaseAttributes>> {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load graph data: ${response.status}`);
    }
    const graphData = await response.json() as {
        nodes: { key: string, attributes: any }[],
        edges: { source: string, target: string, attributes: any }[]
    };
    const graph = new Graph<BaseNodeAttributes, BaseEdgeAttributes, BaseAttributes>({
        multi: false,
        allowSelfLoops: false
    });
    graphData.nodes.forEach(({ key, attributes }) => {
        graph.addNode(key, { ...attributes, state: "normal", hidden: false });
    });
    graphData.edges.forEach(({ source, target, attributes }) => {
        if (graph.hasNode(source) && graph.hasNode(target)) {
            graph.addEdge(source, target, { ...attributes, state: "normal", hidden: false });
        }
    });
    return graph
}

async function createGraphFromGexf(path: string): Promise<Graph<BaseNodeAttributes, BaseEdgeAttributes, BaseAttributes>> {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load GEXF file: ${response.status}`);
    }
    const xml = await response.text();

    const graph = gexf.parse(DirectedGraph, xml, {

    }) as Graph<BaseNodeAttributes, BaseEdgeAttributes, BaseAttributes>;
    return graph;
}

function generateRandomFlowChart(): Graph<BaseNodeAttributes, BaseEdgeAttributes, BaseAttributes> {
    const graph = new DirectedGraph<BaseNodeAttributes, BaseEdgeAttributes, BaseAttributes>({
        multi: false,
        allowSelfLoops: false
    });
    const maxNode = 10
    const maxLevel = 100
    const getRandomInt = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;
    const levelCount = getRandomInt(4, maxLevel);
    const levels: string[][] = [];
    const canvasWidth = 800;
    const verticalSpacing = 100;
    levels.push(["Start"]);
    graph.addNode("Start", {
        x: canvasWidth / 2,
        y: 50,
        type: "bunny",
        state: "normal",
        hidden: false
    });
    for (let i = 1; i < levelCount - 1; i++) {
        const nodeCount = getRandomInt(1, maxNode);
        const levelNodes: string[] = [];
        for (let j = 0; j < nodeCount; j++) {
            const key = `${graph.order}`//`L${i}_N${j}`;
            const spacing = canvasWidth / (nodeCount + 1);
            const x = spacing * (j + 1);
            const y = 50 + i * verticalSpacing;
            const type = Math.random() < 0.5 ? "bunny" : "bird";
            graph.addNode(key, { x, y, type, state: "normal", hidden: false });
            levelNodes.push(key);
        }
        levels.push(levelNodes);
    }
    levels.push(["End"]);
    graph.addNode("End", {
        x: canvasWidth / 2,
        y: 50 + (levelCount - 1) * verticalSpacing,
        type: "bunny",
        state: "normal",
        hidden: false
    });
    for (let i = 0; i < levels.length - 1; i++) {
        const currentLevel = levels[i];
        const nextLevel = levels[i + 1];
        for (const child of nextLevel) {
            const parent = currentLevel[getRandomInt(0, currentLevel.length - 1)];
            graph.addEdge(parent, child, { state: "normal", hidden: false });
        }
        for (const parent of currentLevel) {
            for (const child of nextLevel) {
                if (Math.random() < 0.3 && !graph.hasEdge(parent, child)) {
                    graph.addEdge(parent, child, { state: "normal", hidden: false });
                }
            }
        }
    }
    return graph;
}

function createRandomGraph(): Graph<BaseNodeAttributes, BaseEdgeAttributes, BaseAttributes> {
    const randomGraph = clusters(
        DirectedGraph<BaseNodeAttributes, BaseEdgeAttributes, BaseAttributes>,
        {
            order: 1000,
            size: 1000,
            clusters: 11,
        },
    );
    return randomGraph
}

export default async function generateGraph(type: "random" | "animals" | "flowchart" | 'randomFlowchart' | string): Promise<Graph<BaseNodeAttributes, BaseEdgeAttributes>> {
    switch (type) {
        case "animals":
            return await createGraphFromFile('/graphs/animals.json')
        case "flowchart":
            return await createGraphFromFile('/graphs/flowchart.json')
        case 'random':
            return createRandomGraph()
        case 'randomFlowchart':
            return generateRandomFlowChart()
        default:
            return generateRandomFlowChart()
            
    }
}