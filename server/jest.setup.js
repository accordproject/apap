// Polyfill uninitialized globalThis.localStorage on Node 22+ to prevent @typescript/vfs crashes
if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.getItem !== 'function') {
  const store = new Map();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => { store.set(key, String(value)); },
      removeItem: (key) => { store.delete(key); },
      clear: () => { store.clear(); },
      key: (index) => Array.from(store.keys())[index] ?? null,
      get length() { return store.size; },
    },
    writable: true,
    configurable: true,
  });
}