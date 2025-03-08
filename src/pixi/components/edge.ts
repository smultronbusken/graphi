import { Container, ContainerEvents, EventEmitter, Graphics } from "pixi.js";
import { PixiNode } from "./node";
import { Line } from "./line";
import { BaseEdgeAttributes, State } from "@/graph/types";
import { AnyEvent } from "../types";

export class PixiEdge {
  events: EventEmitter<ContainerEvents<Container> & AnyEvent>;
  graphics: Container;
  private edgeLine: Line;

  // New: arrowhead shape
  private arrow: Graphics;

  private source: PixiNode;
  private target: PixiNode;

  constructor(
    public key: string,
    public attributes: BaseEdgeAttributes,
    source: PixiNode,
    target: PixiNode
  ) {
    this.source = source;
    this.target = target;
    this.events = new EventEmitter();
    this.graphics = new Container({ label: this.key });
    this.edgeLine = new Line();
    this.graphics.addChild(this.edgeLine.line);

    // Create and add arrowhead
    this.arrow = new Graphics();
    this.graphics.addChild(this.arrow);

    this.draw();
  }

  public draw() {
    // 1. Calculate offset line endpoints
    const { x: x1, y: y1 } = this.source.center();
    const { x: x2, y: y2 } = this.target.center();

    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return;

    const nx = dx / distance;
    const ny = dy / distance;

    // Offset by radius
    const sx = x1 + nx * this.source.radius();
    const sy = y1 + ny * this.source.radius();
    const tx = x2 - nx * this.target.radius();
    const ty = y2 - ny * this.target.radius();

    // 2. Draw the main edge line
    this.edgeLine.draw(sx, sy, tx, ty, this.attributes.state);

    // 3. Draw the arrowhead at the target end
    this.arrow.clear();

    // 1) Compute angle from (sx, sy) to (tx, ty)
    const angle = Math.atan2(ty - sy, tx - sx);

    // 2) Clear & redraw your arrow shape pointing UP in local coords
    this.arrow.clear();
    this.arrow.fill({ color: "#FFFFFF", alpha: this.attributes.state === "normal" ? 1 : 0.5 });
    this.arrow.moveTo(0, 0);    // tip
    this.arrow.lineTo(-5, -15);
    this.arrow.lineTo(5, -15);
    this.arrow.lineTo(0, 0);
    this.arrow.endFill();

    // 3) Position arrow at line's end
    this.arrow.position.set(tx, ty);

    // 4) Rotate arrow by angle - 90°
    this.arrow.rotation = angle - Math.PI / 2;

  }

  // ... (rest of your methods below)

  public setAttributes(attributes: BaseEdgeAttributes) {
    this.attributes = { ...this.attributes, ...attributes };
    this.setState(this.attributes.state);
    this.setHidden(this.attributes.hidden);
  }

  public setState(state: State) {
    this.attributes.state = state;
    this.draw();
  }

  public setHidden(hidden: boolean) {
    this.graphics.visible = !hidden;
  }
}
