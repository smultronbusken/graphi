import { IViewportOptions, Viewport } from "pixi-viewport";
import { Application, BlurFilter, ColorMatrixFilter, Filter, Point } from "pixi.js";

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

    public addFilter(filter: Filter, app: Application) {
        app.stage.filters = [filter]
        if (Array.isArray(app.stage.filters)) {
            app.stage.filters = [...app.stage.filters, filter];
        } else {
            app.stage.filters = [app.stage.filters, filter];
        }
    }

    public removeFilter(filter: Filter, app: any) {
        if (Array.isArray(app.filters)) {
            app.filters = app.filters.filter((f: Filter) => f !== filter)
        } else {
            if (app.filters === filter) {
                app.filters = [];
            }
        }
    }
    
}