import { Container, ContainerEvents, EventEmitter } from "pixi.js";
import { PixiNode } from "./node";
import { Line } from "./line";
import {  BaseEdgeAttributes, State } from "@/graph/types";
import { AnyEvent } from "../types";

export class PixiEdge {
  events: EventEmitter<ContainerEvents<Container> & AnyEvent>;
  graphics: Container;
  private edgeLine: Line;
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
    this.draw();
  }

  public draw() {
    const { x: x1, y: y1 } = this.source.center();
    const { x: x2, y: y2 } = this.target.center();
    this.edgeLine.draw(x1, y1, x2, y2, this.attributes.state);
  }

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
