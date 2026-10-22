import { sampleMode } from "./site";

// The demo pages only exist in sample mode. Each one exports this as its getStaticPaths.
export function demoOnly() {
  return sampleMode ? [{ params: { page: undefined } }] : [];
}
