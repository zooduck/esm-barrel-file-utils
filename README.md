# zooduck/esm-barrel-file-utils

A set of utils for creating dynamic exports from an ES Module barrel file (single entry point).

This addresses the *"import one, import all"* issue when using a barrel file for ES Modules in the browser.

## Getting started

This module is hosted by the [jsdelivr.com](https://www.jsdelivr.com/) CDN. Import using the following statement:

```javascript
import esmBarrelFileUtils from 'https://cdn.jsdelivr.net/gh/zooduck/esm-barrel-file-utils@latest/dist/index.module.js'
```

## Instructions

### Create dynamic exports for your barrel file

```javascript
// soundbytes/index.module.js

import esmBarrelFileUtils from 'https://cdn.jsdelivr.net/gh/zooduck/esm-barrel-file-utils@latest/dist/index.module.js'

const modules = {
  quack: './pond/quack.module.js',
  moo: './field/moo.module.js',
  roar: './jungle/roar.module.js'
}

const { getModule, importAllModules, importModules } = esmBarrelFileUtils

const exports = new Proxy(modules, {
  get: eval(getModule) // We must use eval because import declarations are relative
})

export default {
  exports: exports,
  importAllModules: importAllModules,
  importModules: importModules
}
```

### Import individual modules from your barrel file

```javascript
// app.js

import soundbytes from './soundbytes/index.module.js'
import { moo: mooPromise, quack: quackPromise } from soundbytes.exports

const [moo, quack] = await soundbytes.importModules(mooPromise, quackPromise)

moo()
quack()
```

### Import all modules from your barrel file

```javascript
// app.js

import soundbytes from './soundbytes/index.module.js'

const { moo, quack, roar } = await soundbytes.importAllModules()

moo()
quack()
roar()
```

Warning! Only use this approach if you want to import *ALL* modules!
