import { animate } from "motion";
import { GlowFilter, OutlineFilter } from "pixi-filters";
import { ColorMatrixFilter, Container, ContainerEvents, EventEmitter, Graphics, GraphicsContext, PointData, Sprite } from "pixi.js";
import TEXTURES from "../../util/asset-loader";
import { Label } from "./label";
import { BaseAttributes, BaseNodeAttributes, State } from "@/graph/types";
import { AnyEvent } from "../types";
import { Badge } from "@radix-ui/themes";

export interface NodeEvents {
    positionChanged: { node: PixiNode, new: PointData; old: PointData };
    stateChanged: { node: PixiNode, new: BaseAttributes["state"]; old: BaseAttributes["state"] };
    hiddenChanged: { node: PixiNode, new: BaseAttributes["hidden"], old: BaseAttributes["hidden"] };
    changed: { node: PixiNode };
}

export class PixiNode {

    private SCALE = {
        NORMAL: 1,
        HOVER: 1.5,
        INACTIVE: .6
    }

    public graphics: Container;

    private circleContainer: Container;
    private sprite: Sprite | undefined;
    private circleBackground: Graphics;

    private label: Label;

    private attributes: BaseNodeAttributes

    events: EventEmitter<NodeEvents & ContainerEvents<Container> & AnyEvent>;
    private grayscaleFilter = new ColorMatrixFilter();
    private glowFilter = new GlowFilter({
        distance: 10,
        outerStrength: 4,
        innerStrength: 0,
        color: 0xffd700,
    });

    public readonly _radius = 30;
    public radius = () => this.circleContainer.scale.x * 30;

    center = () => ({
        x: this.graphics.position.x,
        y: this.graphics.position.y,
    });

    currentState = () => this.attributes.state;

    public hovering: boolean = false;

    public outlineFilter: OutlineFilter
    public outlineFilterSecondary: OutlineFilter
    public outlineCircle: Graphics
    public outlineCircleSecondary: Graphics

    constructor(public key: string, attributes: BaseNodeAttributes) {

        this.events = new EventEmitter();
        this.graphics = new Container({ label: this.key });
        this.circleContainer = new Container({ label: this.key + "circle" });
        this.graphics.addChild(this.circleContainer)

        this.circleBackground = this.createCircleBackground();
        this.circleContainer.addChild(this.circleBackground);

        this.sprite = this.createSprite(attributes.type);
        if (this.sprite) {
            this.circleContainer.addChild(this.sprite);
        }

        this.label = new Label(this.key);
        this.label.position.set(0, this._radius + 15);
        this.graphics.addChild(this.label);

        this.outlineFilter = new OutlineFilter({
            thickness: 2,
            alpha: 1,
            color: 0xffd700,
            knockout: true  // <--- important!
        });
        this.outlineCircle = new Graphics();
        this.outlineCircle.circle(0, 0, this._radius)
            .fill({ color: 0xffffff, alpha: 1 });
            this.outlineCircle.filters = [this.outlineFilter];
        this.circleContainer.addChild(this.outlineCircle);
        this.setSelected(false)

        this.outlineFilterSecondary = new OutlineFilter({
            thickness: 2,
            alpha: 1,
            color: 0x5b5bd6,
            knockout: true  // <--- important!
        });
        this.outlineCircleSecondary = new Graphics();
        this.outlineCircleSecondary.circle(0, 0, this._radius*1.1)
            .fill({ color: 0xffffff, alpha: 1 });
            this.outlineCircleSecondary.filters = [this.outlineFilterSecondary];
        this.circleContainer.addChild(this.outlineCircleSecondary);
        this.setSecondary(false)



        this.graphics.eventMode = "static";
        this.events = this.graphics;

        //this.circleContainer.cacheAsTexture(true)
        this.attributes = attributes
        this.setAttributes(attributes)
    }

    public setSelected(selected: boolean) {
        this.outlineFilter.enabled = selected
        this.outlineCircle.visible = selected
        if (selected) {

        }
    }


    public setSecondary(selected: boolean) {
        this.outlineFilterSecondary.enabled = selected
        this.outlineCircleSecondary.visible = selected
        if (selected) {

        }
    }

    private createCircleBackground(): Graphics {
        const bg = new Graphics();
        bg.circle(0, 0, this._radius).fill({ color: 0xffffff, alpha: 0.2 })
        return bg;
    }

    private createSprite(type: string): Sprite {
        const texture = TEXTURES.get(type || "bunny");
        const sprite = new Sprite({ texture, label: "sprite" });

        sprite.anchor.set(0.5);
        sprite.position.set(0, 0);

        const maxSize = this._radius * 2 * 0.8;
        const scale = Math.min(maxSize / sprite.width, maxSize / sprite.height);
        sprite.scale.set(scale);

        return sprite;
    }

    public startHoverEffects() {
        const { state, hidden } = this.attributes
        if (state === "inactive" || hidden)
            return;
        this.hovering = true;
        this.setScale(this.SCALE.HOVER)
    }

    public stopHoverEffects() {
        const { state, hidden } = this.attributes
        if (state === "inactive" || hidden || !this.hovering)
            return;
        this.hovering = false;
        this.setScale(this.SCALE.NORMAL)
    }

    public setScale(newScale: number, duration = 0.1) {
        animate(
            this.circleContainer.scale,
            { x: newScale, y: newScale },
            { duration, onUpdate: (_) => this.events.emit("changed", this) }
        );
        animate(
            this.label.position,
            { x: this.label.position.x, y: this._radius * newScale + 15 },
            { duration },
        );
    }

    public setAttributes(attributes: BaseNodeAttributes) {
        const { state, hidden, x, y } = attributes
        this.setPosition({ x, y })

        if (this.attributes.hidden !== hidden) {
            this.setHidden(hidden)
        }

        if (this.attributes.state !== state) {
            this.setState(state)
        }

        this.attributes = { ...attributes }
    }

    public setState(state: State) {
        switch (state) {
            case "normal":
                this.graphics.zIndex = 1;
                animate(this.graphics, { alpha: 1 }, { duration: 0.1 });
                if (!this.hovering) {
                    this.setScale(this.SCALE.NORMAL);
                }
                this.circleContainer.filters = [];
                break;
            case "active":
                this.graphics.zIndex = 10;
                this.graphics.alpha = 1;
                this.circleContainer.filters = [this.glowFilter];
                break;
            case "inactive":
                this.setScale(this.SCALE.INACTIVE);
                animate(this.graphics, { alpha: 0.5 }, { duration: 0.4 });
                this.circleContainer.filters = [this.grayscaleFilter];
                this.grayscaleFilter.desaturate();
                break;
        }
    }

    public setPosition(pos: PointData) {
        const { x: oldX, y: oldY } = this.attributes
        const { x: newX, y: newY } = pos
        this.graphics.position.set(newX, newY);
        this.events.emit("positionChanged", { x: oldX, y: oldY }, { x: newX, y: newY }, this.key)
    }

    public setHidden(hidden: boolean) {
        this.graphics.visible = !hidden
    }

}
