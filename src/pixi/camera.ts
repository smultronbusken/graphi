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
        const { x: wx, y: wy } = this.toWorld(new Point(x, y))
        this.moveCenter(wx + this.position.x, wy + this.position.y)
    }
}