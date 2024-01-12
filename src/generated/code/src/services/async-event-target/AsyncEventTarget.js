/**
 * a class that mimics the interface of EventTarget but uses async events and performs an await on each listener
 */

class AsyncEventTarget {
  constructor() {
    this.listeners = {};
  }

  addEventListener(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  removeEventListener(type, listener) {
    if (!this.listeners[type]) {
      return;
    }
    const index = this.listeners[type].indexOf(listener);
    if (index > -1) {
      this.listeners[type].splice(index, 1);
    }
  }

  async dispatchEvent(event) {
    if (!this.listeners[event.type]) {
      return;
    }
    for (const listener of this.listeners[event.type]) {
      await listener(event);
    }
  }
}

export default AsyncEventTarget;