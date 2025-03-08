class Keyboard {

  pressed = new Set<string>();
  private listeners = new Map<string, Set<(e: KeyboardEvent) => void>>();

  constructor() {
    document.addEventListener('keydown', e => {

      this.pressed.add(e.code);
      const key = e.code.toLowerCase();

      if (this.listeners.has(key)) {
        for (const callback of this.listeners.get(key)!) {
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

class Mouse {
  pressed = new Set<string>();

  // Keep separate listeners for "down" and "up"
  private downListeners = new Map<string, Set<(e: MouseEvent) => void>>();
  private upListeners = new Map<string, Set<(e: MouseEvent) => void>>();

  constructor() {
    document.addEventListener('mousedown', e => {
      const button = this.mapButton(e.button);
      this.pressed.add(button);

      if (this.downListeners.has(button)) {
        for (const callback of this.downListeners.get(button)!) {
          callback(e);
        }
      }
    });

    document.addEventListener('mouseup', e => {
      const button = this.mapButton(e.button);
      this.pressed.delete(button);

      if (this.upListeners.has(button)) {
        for (const callback of this.upListeners.get(button)!) {
          callback(e);
        }
      }
    });
  }

  /**
   * Map numeric button codes to a descriptive string:
   *   0 -> "left"
   *   1 -> "middle"
   *   2 -> "right"
   * Other buttons -> string(code)
   */
  private mapButton(code: number): string {
    switch (code) {
      case 0: return 'left';
      case 1: return 'middle';
      case 2: return 'right';
      default: return code.toString();
    }
  }

  /**
   * Check if the user is currently holding down a particular button.
   */
  public isPressed(button: string): boolean {
    return this.pressed.has(button.toLowerCase());
  }

  /**
   * Register a callback for mouse-down events on a specific button.
   */
  public onDown(button: string, fn: (e: MouseEvent) => void): void {
    button = button.toLowerCase();
    if (!this.downListeners.has(button)) {
      this.downListeners.set(button, new Set());
    }
    this.downListeners.get(button)!.add(fn);
  }

  /**
   * Remove a callback for mouse-down events on a specific button.
   */
  public offDown(button: string, fn: (e: MouseEvent) => void): void {
    button = button.toLowerCase();
    this.downListeners.get(button)?.delete(fn);
  }

  /**
   * Register a callback for mouse-up events on a specific button.
   */
  public onUp(button: string, fn: (e: MouseEvent) => void): void {
    button = button.toLowerCase();
    if (!this.upListeners.has(button)) {
      this.upListeners.set(button, new Set());
    }
    this.upListeners.get(button)!.add(fn);
  }

  /**
   * Remove a callback for mouse-up events on a specific button.
   */
  public offUp(button: string, fn: (e: MouseEvent) => void): void {
    button = button.toLowerCase();
    this.upListeners.get(button)?.delete(fn);
  }
}

const mouse = new Mouse();

const input = {
  keyboard,
  mouse
};

export default input;
