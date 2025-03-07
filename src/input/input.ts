class Keyboard {

  pressed = new Set<string>();
  private listeners = new Map<string, Set<(e: KeyboardEvent) => void>>();

  constructor() {
    document.addEventListener('keydown', e => {

      this.pressed.add(e.code);
      console.log(this.listeners)
      const key = e.code.toLowerCase();

      if (this.listeners.has(key)) {
        console.log("hej")
        for (const callback of this.listeners.get(key)!) {
          console.log("hej2")
          callback(e);
        }
      }
    });
    document.addEventListener('keyup', e => {
      this.pressed.delete(e.code);
    });
  }

  public isPressed(key: string): boolean {
    return this.pressed.has(key);
  }

  public on(key: string, fn: (e: KeyboardEvent) => void): void {
    key = key.toLowerCase();
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(fn);
  }

  public off(key: string, fn: (e: KeyboardEvent) => void): void {
    key = key.toLowerCase();
    this.listeners.get(key)?.delete(fn);
  }
}

const keyboard = new Keyboard();

const input = {
  keyboard
};

export default input;
