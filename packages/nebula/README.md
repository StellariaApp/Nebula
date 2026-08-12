# @stellaria/nebula

**This package ships no code.** It exists so the name points somewhere honest, and to say which
package you actually want.

Nebula is a universal UI library — Web and React Native — where the contract lives in the tokens and
each platform only implements the visual layer. Two products that look nothing alike ship from the
same components: you change the theme, never the code.

## Which one do I install?

| Package | What it is |
| ------- | ---------- |
| [`@stellaria/nebula-web`](https://www.npmjs.com/package/@stellaria/nebula-web) | **Start here for the web.** 158 components on React Aria, Vanilla Extract and `motion`. |
| [`@stellaria/nebula-themes`](https://www.npmjs.com/package/@stellaria/nebula-themes) | The official `light` and `dark` themes, and the runtime validator for your own. |
| [`@stellaria/nebula-tokens`](https://www.npmjs.com/package/@stellaria/nebula-tokens) | The `NebulaTheme` contract, the base tokens and the 20 generated palettes. Zero dependencies. |
| [`@stellaria/nebula-hooks`](https://www.npmjs.com/package/@stellaria/nebula-hooks) | Cross-platform hooks with no UI — same API on both platforms. |
| [`@stellaria/nebula-icons`](https://www.npmjs.com/package/@stellaria/nebula-icons) | One `Icon` over an extensible registry. |

For a web app, this is the whole install:

```bash
pnpm add @stellaria/nebula-web @stellaria/nebula-themes @stellaria/nebula-tokens @stellaria/nebula-hooks
```

## Why there is no meta-package

A single `@stellaria/nebula` that re-exported everything would be convenient, and it would undo the
thing that makes the library cheap: heavy dependencies live behind subpaths, so importing a button
does not pull in a charting engine. Re-exporting would erase that boundary. The install above is one
line, and it keeps it.

## Documentation

<https://nebula.stellaria.app>

## Licence

MIT.
