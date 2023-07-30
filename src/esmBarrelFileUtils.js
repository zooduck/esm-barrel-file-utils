/**
 * A set of utils for creating dynamic exports from an
 * ES Module barrel file (single entry point).
 *
 * @example
 * // soundbytes/index.module.js
 * const modules = {
 *   quack: './pond/quack.module.js',
 *   moo: './field/moo.module.js',
 *   roar: './jungle/roar.module.js'
 * }
 *
 * const { getModule, importAllModules, importModules } = ESMBarrelFileUtils(modules)
 *
 * const exports = new Proxy(modules, {
 *   get: eval(getModule)
 * })
 *
 * export default {
 *   exports: exports,
 *   importAllModules: importAllModules,
 *   importModules: importModules
 * }
 *
 * // app.js - using importModules (only import the modules you need)
 * import soundbytes from './soundbytes/index.module.js'
 *
 * const { quack: quackPromise, moo: mooPromise } = soundbytes.exports
 * const [quack, moo] = await soundBytes.importModules(quackPromise, mooPromise)
 *
 * // app.js - using importAllModules (only use if you want to import everything!)
 * import soundbytes from './soundbytes/index.module.js'
 *
 * const { quack, moo, roar } = await soundbytes.importAllModules()
 */
function ESMBarrelFileUtils(modules) {
  return {
    /**
     * @readonly
     * @type {string}
     */
    get getModule() {
      return `(target, property) => {
        return import(target[property]).then((module) => {
          return module[property];
        });
      }`;
    },
    /**
     * @method
     * @returns {Promise<Object.<string, *>>}
     */
    async importAllModules() {
      const exports = {};
      for (const [name, file] of Object.entries(modules)) {
        const module = await import(file);
        exports[name] = module[name];
      }
      return exports;
    },
    /**
     * @method
     * @param {...Promise} modulePromises
     * @returns {Promise<*[]>}
     */
    async importModules(...modulePromises) {
      return await Promise.all(modulePromises);
    }
  };
}

export { ESMBarrelFileUtils };
