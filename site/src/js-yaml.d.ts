// js-yaml ships transitively with Astro (its file() loader depends on it) but
// has no bundled type declarations. content.config.ts imports it to inject ids
// into the ordered data-file collections. Minimal ambient declaration so
// `astro check` resolves the module.
declare module 'js-yaml' {
  const yaml: { load: (input: string, opts?: unknown) => unknown };
  export default yaml;
}
