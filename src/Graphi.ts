import { AbstractGraph, AttributeUpdatePayload } from 'graphology-types';
import { Container, PointData } from 'pixi.js';
import { Drag } from './pixi/controls/drag';
import { PixiEdge } from './pixi/components/edge';
import { PixiNode } from './pixi/components/node';
import input from '@/input/input';
import { BaseEdgeAttributes, BaseNodeAttributes, State } from '@/graph/types';
import EventEmitter from 'events';
import { AsciiFilter, BulgePinchFilter, CRTFilter } from 'pixi-filters';


export interface GraphOptions<NodeAttributes extends BaseNodeAttributes = BaseNodeAttributes, EdgeAttributes extends BaseEdgeAttributes = BaseEdgeAttributes> {
    graph: AbstractGraph<NodeAttributes, EdgeAttributes>;
    drag: Drag
}

type GraphiEvents = {
    onSelectedChange: [string[]];
    onSecondarySelectedChange: [string | null];
};

// TODO make a cache of graph.nodes() and only update it when any nodes has been added or removed as the serach suggestion boxes ui uses that alot i think(?)
export class Graphi<NodeAttributes extends BaseNodeAttributes = BaseNodeAttributes, EdgeAttributes extends BaseEdgeAttributes = BaseEdgeAttributes> {

    graph!: AbstractGraph<NodeAttributes, EdgeAttributes>;
    private keyNodeMap = new Map<string, PixiNode>();
    private edgeKeyMap = new Map<string, PixiEdge>();

    public readonly container: Container;
    private nodeLayer: Container;
    private edgeLayer: Container;

    public drag: Drag;

    public events: EventEmitter<GraphiEvents> = new EventEmitter();

    public selected: string[] = [];
    public secondarySelected: string | null = null;

    constructor(options: GraphOptions<NodeAttributes, EdgeAttributes>) {

        this.container = new Container({ label: "graph" });

        this.edgeLayer = new Container({ label: "edges", isRenderGroup: true });
        this.nodeLayer = new Container({ label: "nodes", isRenderGroup: true });

        this.container.addChild(this.edgeLayer);
        this.container.addChild(this.nodeLayer);

        const asciiFilter = new CRTFilter({ vignetting: 0 })
        this.edgeLayer.filters = [asciiFilter]

        const asciiFilter2 = new CRTFilter({ vignetting: 0 })
        this.nodeLayer.filters = [asciiFilter2]

        this.drag = options.drag;
        this.drag.events.on("move", this.onDragMove.bind(this));
        this.drag.events.on("stop", (node: PixiNode, _) => this.onDragStop(node));
        this.drag.events.on("start", (node: PixiNode, _) => this.onDragStart(node));

        input.keyboard.on("Escape", (_) => {
            this.setSelected()
            this.resetSecondary()
        })

        this.setGraph(options.graph)
    }

    public resetSecondary() {
        if (this.secondarySelected) {
            const secondary = this.keyToNode(this.secondarySelected)
            secondary.setSecondary(false)
            secondary.stopHoverEffects()
            this.secondarySelected = null
            this.events.emit("onSecondarySelectedChange", this.secondarySelected)
        }
    }

    destroy() {
        this.drag.destroy();
    }

    public setGraph(graph: AbstractGraph<NodeAttributes, EdgeAttributes>) {
        if (this.graph) {
            graph.off('nodeAttributesUpdated', this.onNodeAttributesUpdate.bind(this));
            graph.off('edgeAttributesUpdated', this.onEdgeAttributesUpdate.bind(this));
            while (this.nodeLayer.children[0]) {
                this.nodeLayer.removeChild(this.nodeLayer.children[0]);
            }
            while (this.edgeLayer.children[0]) {
                this.edgeLayer.removeChild(this.edgeLayer.children[0]);
            }
            this.keyNodeMap.clear()
            this.edgeKeyMap.clear()
        }

        graph.forEachNode(this.createNode.bind(this));
        graph.forEachEdge(this.createEdge.bind(this));
        graph.on('nodeAttributesUpdated', this.onNodeAttributesUpdate.bind(this));
        graph.on('edgeAttributesUpdated', this.onEdgeAttributesUpdate.bind(this));
        graph.on('nodeDropped', this.onNodeDropped.bind(this));
        graph.on('edgeDropped', this.onEdgeDropped.bind(this));
        this.graph = graph;

    }

    private onNodeDropped(payload: { key: string, attributes: NodeAttributes }) {
        const { key, attributes } = payload
        const pixiNode = this.keyToNode(key)
        this.nodeLayer.removeChild(pixiNode.graphics);
    }
    private onEdgeDropped(payload: { key: string, attributes: EdgeAttributes }) {
        const { key, attributes } = payload
        const pixiEdge = this.keyToEdge(key)
        this.edgeLayer.removeChild(pixiEdge.graphics);
    }


    private async createNode(nodeKey: string, attributes: NodeAttributes) {
        const node = new PixiNode(nodeKey, attributes);

        const containerToNode = (container: Container): PixiNode => (
            this.keyToNode(container.label)
        )

        const events = node.events;
        events.on("positionChanged", this.onNodePosChange.bind(this))
        events.on("changed", (n) => {
            this.graph.forEachEdge(n.key, (edgeKey) => {
                const edge = this.edgeKeyMap.get(edgeKey);
                if (edge) {
                    edge.draw();
                }
            });
        })

        events.on("pointerenter", (e) => containerToNode(e.target)?.startHoverEffects());
        events.on("mousedown", (e) => this.onNodeClick(containerToNode(e.target)));
        events.on("pointerleave", (e) => {
            const node = containerToNode(e.target);
            if (!node) return
            if (node.key === this.secondarySelected) return
            node.stopHoverEffects()
        });

        events.on("rightup", (e) => this.onNodeSecondaryUp(containerToNode(e.target)));

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
    }

    public setSelected(...keys: string[]) {
        for (const key of this.selected) {
            const node = this.keyToNode(key)
            node.setSelected(false)
        }
        for (const key of keys) {
            const node = this.keyToNode(key)
            node.setSelected(true)
        }
        this.selected = [...keys]
        this.events.emit("onSelectedChange", this.selected)
    }

    public addSelected(key: string) {
        const node = this.keyToNode(key)
        node.setSelected(true)
        this.selected?.push(key)
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

    private onNodeSecondaryUp(node: PixiNode) {
        this.secondarySelected = node.key
        node.setSecondary(true)
        this.events.emit("onSecondarySelectedChange", this.secondarySelected)
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

        if (input.keyboard.isPressed("ShiftLeft")) {
            this.expand(node.key)
            this.addSelected(node.key)
            this.drag.start(node);
            return
        }
        this.drag.start(node);
        this.setSelected(node.key)

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

    public expandEdgePath(path: string[]) {
        for (const edge of path) {
            this.expandEdge(edge)
        }
    }

    public expandPath(path: string[]) {
        for (let i = 0; i < path.length - 1; i++) {
            const curr = path[i];
            const next = path[i + 1]!;
            const edge = this.graph.edge(curr, next)
            if (!edge) {
                throw new Error(`Expected edge ${curr} -> ${next} to exist.`);
            }
            this.expandEdge(edge)
        }
    }

    public expandEdge(edge: string) {
        this.graph.setEdgeAttribute(edge, "state", "normal")
        const [source, target] = this.graph.extremities(edge);

        this.expand(source)
        this.expand(target)
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
