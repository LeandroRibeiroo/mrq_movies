export class MMKV {
  constructor(options) {
    this.options = options;
    this.storage = new Map();
  }

  set(key, value) {
    this.storage.set(key, value);
  }

  getString(key) {
    return this.storage.get(key) || undefined;
  }

  getNumber(key) {
    const value = this.storage.get(key);
    return typeof value === "number" ? value : undefined;
  }

  getBoolean(key) {
    const value = this.storage.get(key);
    return typeof value === "boolean" ? value : undefined;
  }

  delete(key) {
    this.storage.delete(key);
  }

  clearAll() {
    this.storage.clear();
  }
}
