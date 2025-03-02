import { Graphics } from "pixi.js";
import { GlowFilter } from "pixi-filters";
import { ColorMatrixFilter } from "pixi.js";

export class Line {
    public line: Graphics;
    private glowFilter = new GlowFilter({
        distance: 8,
        outerStrength: 4,
        innerStrength: 0,
        color: 0xffd700,
    });
    private grayscaleFilter = new ColorMatrixFilter();

    constructor() {
        this.line = new Graphics();
    }

    public draw(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        state: string,
    ) {
        this.line.clear();
        this.line.moveTo(x1, y1);

        this.line.lineTo(x2, y2);

        this.applyStateStyle(state);
    }

    private applyStateStyle(state: string) {
        switch (state) {
            case "normal":
                this.line.filters = [];
                this.line.stroke({ width: 3, color: 0xbbbbbb, alpha: 1 });
                break;
            case "active":
                this.line.filters = [this.glowFilter];
                this.line.stroke({ width: 5, color: 0xffd700, alpha: 1 });
                break;
            case "inactive":
                this.line.filters = [this.grayscaleFilter];
                this.grayscaleFilter.desaturate();
                this.line.stroke({ width: 1, color: 0xaaaaaa, alpha: 0.5 });
                break;
        }
    }
}
