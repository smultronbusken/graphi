import { IViewportOptions, Viewport } from "pixi-viewport";
import { Application, Point } from "pixi.js";

export class Camera extends Viewport {
    constructor(options: IViewportOptions & { app: Application }) {
        super(options)
        this.label = "viewport";
        this.drag()
            .pinch()
            .wheel()
            .decelerate()
            .clampZoom({ maxScale: 3 });
        options.app.stage.addChild(this);
    }

    public moveTo(x: number, y: number) {
        const global = this.toWorld(new Point(x, y));
        const scale = this.scale;
        this.moveCenter(
            global.x * scale.x + this.position.x,
            global.y * scale.y + this.position.y
        );
    }

}