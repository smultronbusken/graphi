import { Application, Graphics, BlurFilter, TilingSprite, Container } from 'pixi.js';
import { AdjustmentFilter, AsciiFilter, BulgePinchFilter, ColorGradientFilter, ShockwaveFilter, TwistFilter } from 'pixi-filters';
import { CRTFilter, DotFilter } from 'pixi-filters'; // or wherever they're from
import TEXTURES from '@/util/asset-loader';

const createBackground = async (app: Application) => {
    const bg = new Graphics()
        .rect(0, 0, app.screen.width, app.screen.height)
        .fill({ color: '0x3e63dd', alpha: 0.4 });
    bg.zIndex = -1;

    const bgContainer = new Container()
    app.stage.addChild(bgContainer);

    const overlay = new TilingSprite({
        texture: TEXTURES.get("overlay"),
        width: app.screen.width,
        height: app.screen.height,
    });
    overlay.zIndex = -1
    bgContainer.addChild(overlay)
    bgContainer.addChild(bg)



    const radialGradient = new ColorGradientFilter({
        stops: [
            { color: '0x000000', alpha: 1, offset: 0 },
            { color: '0x111113', alpha: 1, offset: 1 },
        ],
        type: 2, 
        alpha: 1,
    });

   
    const linearGradient = new ColorGradientFilter({
        stops: [
            { color: '0x000000', alpha: 1, offset: 0 },
            { color: '0x111113', alpha: 1, offset: 1 },
        ],
        type: 0, 
        alpha: 1,
    });


    const blurFilter = new BlurFilter({
        quality: 1,
        strength: 1,
    });

    const crtFilter = new CRTFilter({});
    const twistFilter = new TwistFilter({
        angle: 4,
        radius: 400,
        offset: { x: app.screen.width / 2, y: app.screen.height / 2 }
    });

    const bulgePinchFilter = new BulgePinchFilter({
        radius: 1000,
        strength: -1,
        center: { x: 1.2, y: 0.5 }
    })
    const bulgePinchFilter2 = new BulgePinchFilter({
        radius: 1000,
        strength: -2,
        center: { x: -0.2, y: 0.5 }
    })

    const asciiFilter = new AsciiFilter({
        replaceColor: false,
        size: 8
    })

    const adjustmentFilter = new AdjustmentFilter({
        alpha: 0.8
    })

    bgContainer.filters = [blurFilter, twistFilter, bulgePinchFilter, bulgePinchFilter2,asciiFilter, adjustmentFilter, crtFilter];

    let elapsed = 0;
    let timeSinceUpdate = 0;
    let totalDelta = 0
    app.ticker.add((delta) => {
        const dt = delta.deltaMS / 1000; 
        timeSinceUpdate += dt;
        totalDelta += delta.deltaMS

        overlay.tilePosition.x = totalDelta * -1 * 0.04;
        overlay.tilePosition.y = totalDelta * -1 * 0.04;
        if (timeSinceUpdate >= 111) {
            elapsed += (timeSinceUpdate);

            radialGradient.angle += 0.2 * elapsed;
            linearGradient.angle -= 0.2 * elapsed;

            const offsetRadial = 0.5 + 0.4 * Math.sin(elapsed);
            radialGradient.stops = [
                { color: '0x000000', alpha: 0.6, offset: offsetRadial },
                { color: '0x111113', alpha: 0.1, offset: 0.5 },
                { color: '0x3e63dd', alpha: 1, offset: 1 - offsetRadial },
            ];

            const offsetLinear = 0.5 + 0.4 * Math.cos(elapsed * 0.5);
            linearGradient.stops = [
                { color: '0x000000', alpha: 0.6, offset: offsetLinear },
                { color: '0x3e63dd', alpha: 0.8, offset: 0.5 },
                { color: '0x111113', alpha: 0.6, offset: 1 - offsetLinear },
            ];

            bg.filters = [radialGradient, linearGradient];


            timeSinceUpdate = 0;
        }
    });
};

export default createBackground;
