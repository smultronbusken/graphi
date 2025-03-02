import { PixiContextData } from "@/main";
import { EventEmitter, Point, PointData } from "pixi.js";
import { PixiNode } from "../components/node";

type DragEventTypes = "stop" | "start" | "move";
type DragEventCallback = (n: PixiNode, p: PointData) => void;

export class Drag {
    public  draggingNode: PixiNode | undefined;
    private dragOffset: Point | undefined;
    public readonly events: EventEmitter<DragEventTypes, DragEventCallback>;

    constructor(public context: PixiContextData) {
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.events = new EventEmitter();
    }

    destroy() {
        document.removeEventListener("mousemove", this.onMouseMove.bind(this));
        document.removeEventListener("mouseup", this.onMouseUp.bind(this));
    }

    private onMouseMove(event: MouseEvent) {
        if (!this.draggingNode || !this.dragOffset) return;

        const eventPosition = new Point(event.offsetX, event.offsetY);
        const worldPosition = this.context.camera.toWorld(eventPosition);

        const newPosition = new Point(
            worldPosition.x - this.dragOffset.x,
            worldPosition.y - this.dragOffset.y
        );

        this.moveNode(this.draggingNode, newPosition);
    }

    private onMouseUp(_: MouseEvent) {
        if (!this.draggingNode) return;
        this.stop();
    }

    private moveNode(node: PixiNode, point: PointData) {
        this.events.emit("move", node, point);
    }

    public start(node: PixiNode) {
        const worldPosition = this.context.camera.toWorld(this.context.pixi.renderer.events.pointer.global); 
        
        this.dragOffset = new Point(
            worldPosition.x - node.graphics.position.x,
            worldPosition.y - node.graphics.position.y
        );

        this.events.emit("start", node, worldPosition);
        this.draggingNode = node;
        this.context.camera.pause = true;
    }

    public stop() {
        this.events.emit("stop", this.draggingNode, undefined);
        this.draggingNode = undefined;
        this.dragOffset = undefined;
        this.context.camera.pause = false;
    }
}
