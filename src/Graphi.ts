import { AbstractGraph, AttributeUpdatePayload } from 'graphology-types';
import { Container, PointData } from 'pixi.js';
import { Drag } from './pixi/controls/drag';
import { PixiEdge } from './pixi/components/edge';
import { PixiNode } from './pixi/components/node';
import input from '@/input/input';
import { BaseEdgeAttributes, BaseNodeAttributes, State } from '@/graph/types';
import EventEmitter from 'events';


export interface GraphOptions<NodeAttributes extends BaseNodeAttributes = BaseNodeAttributes, EdgeAttributes extends BaseEdgeAttributes = BaseEdgeAttributes> {
    graph: AbstractGraph<NodeAttributes, EdgeAttributes>;
    drag: Drag
}

type GraphiEvents = {
    onSelectedChange: [string];
};


// TODO make a cache of graph.nodes() and only update it when any nodes has been added or removed as the serach suggestion boxes ui uses that alot i think(?)
export class Graphi<NodeAttributes extends BaseNodeAttributes = BaseNodeAttributes, EdgeAttributes extends BaseEdgeAttributes = BaseEdgeAttributes> {

    graph: AbstractGraph<NodeAttributes, EdgeAttributes>;
    private keyNodeMap = new Map<string, PixiNode>();
    private edgeKeyMap = new Map<string, PixiEdge>();

    public readonly container: Container;
    private nodeLayer: Container;
    private edgeLayer: Container;

    public drag: Drag;

    public events: EventEmitter<GraphiEvents> = new EventEmitter();

    public selected: string | null = null;

    constructor(options: GraphOptions<NodeAttributes, EdgeAttributes>) {
        this.graph = options.graph;
        this.container = new Container({ label: "graph" });

        this.edgeLayer = new Container({ label: "edges", isRenderGroup: true });
        this.nodeLayer = new Container({ label: "nodes", isRenderGroup: true });

        this.container.addChild(this.edgeLayer);
        this.container.addChild(this.nodeLayer);

        this.drag = options.drag;
        this.drag.events.on("move", this.onDragMove.bind(this));
        this.drag.events.on("stop", (node: PixiNode, _) => this.onDragStop(node));
        this.drag.events.on("start", (node: PixiNode, _) => this.onDragStart(node));

        this.graph.forEachNode(this.createNode.bind(this));
        this.graph.forEachEdge(this.createEdge.bind(this));

        this.graph.on('nodeAttributesUpdated', this.onNodeAttributesUpdate.bind(this));
        this.graph.on('edgeAttributesUpdated', this.onEdgeAttributesUpdate.bind(this));
    }

    destroy() {
        this.drag.destroy();
    }

    private async createNode(nodeKey: string, attributes: NodeAttributes) {
        const node = new PixiNode(nodeKey, attributes);

        const containerToNode = (container: Container): PixiNode => (
            this.keyToNode(container.label)
        )

        const events = node.events;
        events.on("positionChanged", this.onNodePosChange.bind(this))

        events.on("pointerenter", (e) => containerToNode(e.target)?.onHoverStart());
        events.on("pointerdown", (e) => this.onNodeClick(containerToNode(e.target)));
        events.on("pointerleave", (e) => containerToNode(e.target)?.onHoverStop());

        this.nodeLayer.addChild(node.graphics);
        this.keyNodeMap.set(nodeKey, node);
    }

    private async createEdge(edgeKey: string, attributes: EdgeAttributes, sourceNodeKey: string, targetNodeKey: string, __: NodeAttributes, ___: NodeAttributes) {
        const sourceNode = this.keyToNode(sourceNodeKey);
        const targetNode = this.keyToNode(targetNodeKey);
        if (attributes.state === undefined) attributes.state = "normal"
        if (attributes.hidden === undefined) attributes.hidden = false
        const edge = new PixiEdge(edgeKey, attributes, sourceNode, targetNode);

        this.edgeLayer.addChild(edge.graphics);
        this.edgeKeyMap.set(edgeKey, edge);
    }

    private keyToNode(nodeKey: string) {
        const node = this.keyNodeMap.get(nodeKey);
        if (!node) throw new Error(`Expected node with key ${nodeKey} to exist.`);
        return node;
    }

    private keyToEdge(edgeKey: string) {
        const edge = this.edgeKeyMap.get(edgeKey);
        if (!edge) throw new Error(`Expected edge with key ${edgeKey} to exist.`);
        return edge
    }

    private onNodeAttributesUpdate({ key, attributes }: AttributeUpdatePayload<NodeAttributes>) {
        const node = this.keyToNode(key)
        node.setAttributes(attributes)
        if (key === this.selected)
            this.events.emit("onSelectedChange", this.selected)

    }

    private onEdgeAttributesUpdate({ key, attributes }: AttributeUpdatePayload<EdgeAttributes>) {
        const edge = this.keyToEdge(key)
        edge.setAttributes(attributes)
        edge.draw()
    }

    private onNodePosChange(_: PointData, __: PointData, key: string) {
        this.graph.forEachEdge(key, (edgeKey) => {
            const edge = this.edgeKeyMap.get(edgeKey);
            if (edge) {
                edge.draw();
            }
        });
    }

    private onNodeClick(node: PixiNode) {
        const attr = this.graph.getNodeAttributes(node.key)
        if (input.keyboard.isPressed("ControlLeft")) {
            this.expand(node.key)
            if (attr.state === "inactive") {
                this.drag.start(node);
                return
            }
        }
        if (attr.hidden || attr.state === "inactive")
            return
        this.drag.start(node);
        this.selected = node.key
        this.events.emit("onSelectedChange", this.selected)
    }

    private onDragMove(node: PixiNode, point: PointData) {
        const { x, y } = point
        this.graph.updateNodeAttributes(node.key, attr => (
            {
                ...attr,
                y,
                x
            }
        ));
    }

    private onDragStop(node: PixiNode) {
        this.graph.setNodeAttribute(node.key, "state", "normal")
    }

    private onDragStart(node: PixiNode) {
        this.graph.setNodeAttribute(node.key, "state", "active")
    }

    public expand(key: string) {
        this.graph.setNodeAttribute(key, "hidden", false);
        this.graph.setNodeAttribute(key, "state", "normal");

        this.graph.forEachEdge(key, (edgeKey, _attr, source, target, sourceAttr, targetAttr) => {

            const otherNodeKey = source === key ? target : source;
            const otherNodeAttr = source === key ? targetAttr : sourceAttr;

            if (otherNodeAttr.hidden) {
                this.graph.setNodeAttribute(otherNodeKey, "state", "inactive");
            }
            this.graph.setNodeAttribute(otherNodeKey, "hidden", false);

            const activeOrNormal = (state: State) => ["normal", "active"].includes(state)

            this.graph.setEdgeAttribute(edgeKey, "hidden", false);
            if (activeOrNormal(sourceAttr.state) && activeOrNormal(targetAttr.state)) {
                this.graph.setEdgeAttribute(edgeKey, "state", "normal");
            } else {
                this.graph.setEdgeAttribute(edgeKey, "state", "inactive");
            }
        });

    }

    public hideAll() {
        this.graph.nodes().forEach(key => this.graph.setNodeAttribute(key, "state", "inactive"));
        this.graph.edges().forEach(key => this.graph.setEdgeAttribute(key, "state", "inactive"));
        this.graph.nodes().forEach(key => this.graph.setNodeAttribute(key, "hidden", true));
        this.graph.edges().forEach(key => this.graph.setEdgeAttribute(key, "hidden", true));
    }

    public showAll() {
        this.graph.nodes().forEach(key => this.graph.setNodeAttribute(key, "state", "normal"));
        this.graph.edges().forEach(key => this.graph.setEdgeAttribute(key, "state", "normal"));
        this.graph.nodes().forEach(key => this.graph.setNodeAttribute(key, "hidden", false));
        this.graph.edges().forEach(key => this.graph.setEdgeAttribute(key, "hidden", false));
    }

    public path(path: string[]) {

        if (path.length === 0) return;

        const first = path[0]
        this.graph.setNodeAttribute(first, "hidden", false);
        this.graph.setNodeAttribute(first, "state", "normal");
        this.expand(first)
        for (let i = 0; i < path.length - 1; i++) {
            const curr = path[i]!
            const next = path[i + 1]!

            const edge = this.graph.edge(curr, next)
            this.graph.setEdgeAttribute(edge, "hidden", false);
            this.graph.setEdgeAttribute(edge, "state", "normal");

            this.graph.setNodeAttribute(next, "hidden", false);
            this.graph.setNodeAttribute(next, "state", "normal");
            this.expand(next)
        }
    }

}
