/* ------------------------------------- */
/* @zooduck/esm-barrel-file-utils v0.0.1 */
/* ------------------------------------- */
export default function ESMBarrelFileUtils(modules) {
  return {
    get getModule() {
      return `(target, property) => {
        return import(target[property]).then((module) => {
          return module[property];
        });
      }`;
    },
    async importAllModules() {
      const exports = {};
      for (const [name, file] of Object.entries(modules)) {
        const module = await import(file);
        exports[name] = module[name];
      }
      return exports;
    },
    async importModules(...modulePromises) {
      return await Promise.all(modulePromises);
    }
  };
}