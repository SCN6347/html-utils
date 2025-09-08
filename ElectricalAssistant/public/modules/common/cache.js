// Shared cache utility (classic style)
window.Cache = (function () {
  const store = {};

  return {
    set(module, data) {
      store[module] = data;
    },
    get(module) {
      return store[module] || null;
    },
    reset(module) {
      delete store[module];
    },
    resetAll() {
      for (let key in store) delete store[key];
    }
  };
})();
