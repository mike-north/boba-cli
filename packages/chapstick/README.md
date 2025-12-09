# @suds/chapstick

TypeScript port of Charmbracelet Lip Gloss for styling terminal strings. Implements a fluent `Style` API with colors, padding/margin, borders, alignment, joins/placement, and ANSI-aware rendering using `terminal-reflowjs`.

## Install

```bash
pnpm add @suds/chapstick
```

## Quickstart

```ts
import { Style, borderStyles } from "@suds/chapstick";

const card = new Style()
  .padding(1)
  .border(borderStyles.rounded)
  .borderForeground("#7c3aed")
  .align("center")
  .render("Hello Suds");

console.log(card);
```

### Composition

```ts
import { Style, joinHorizontal, place } from "@suds/chapstick";

const label = new Style().foreground("#10b981").bold();
const left = label.render("Left");
const right = label.render("Right");

console.log(joinHorizontal(2, left, right));

// Place content inside a 20x5 area, centered
console.log(place(20, 5, "center", "center", label.render("Centered")));
```

## Scripts

- `pnpm -C packages/chapstick build`
- `pnpm -C packages/chapstick test`
- `pnpm -C packages/chapstick lint`
- `pnpm -C packages/chapstick generate:api-report`

## License

MIT
