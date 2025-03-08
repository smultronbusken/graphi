import { BitmapText, Container, Graphics, Text, TextStyle } from "pixi.js";

export class Label extends Container {
    constructor(text: string) {
        super();

        /* const style = new TextStyle({
             fontFamily: "Arial",
             fontSize: 14,
             fill: 0xffffff, 
             align: "center",
         });
         const textObj = new Text({ style, text: text });
 */
        const textObj = new BitmapText({
            text: text,
            style: {
                fontFamily: 'monaco',
                fontSize: 32,
                align: 'center',
                fill: 0xffffff,  
            },
        });

        textObj.anchor.set(0.5, 0.5);

        const padding = 4;
        const background = new Graphics();
        background.roundRect(
            -textObj.width / 2 - padding,
            -textObj.height / 2 - padding,
            textObj.width + padding * 2,
            textObj.height + padding * 2,
            5
        );
        background.fill({ color: 0x000000, alpha: 0.2 });
        this.addChild(background);
        this.addChild(textObj);
    }
}
