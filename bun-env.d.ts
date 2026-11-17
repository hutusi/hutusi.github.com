// Site-local: load Bun's globals (`Bun`, `bun:test`) for the whole program.
// TypeScript 6 no longer auto-includes @types/*, and upstream amytis only gets
// these types through its tests/ folder, which this site doesn't carry. This
// lives in its own file so copying a new amytis release over scripts/ can't
// drop it.
/// <reference types="bun" />
