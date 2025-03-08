import { Assets } from "pixi.js"

const TEXTURES = new Map<string, any>

export const loadAssets = async () => {
    await loadTexture("bunny", "/assets/bunny.png")
    await loadTexture("bird", "/assets/nn.webp")
    await loadTexture("overlay", "/assets/overlay.png")
    await loadTexture("displacement", "/assets/displacement.jpg")
    await Assets.load("/fonts/monaco.ttf")
}

export const loadTexture = async (key: string, path: string) => {
    const loaded = await Assets.load(path)
    TEXTURES.set(key, loaded)
    return TEXTURES
}

export default TEXTURES