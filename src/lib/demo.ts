import { demoMode } from "./site";

// The demo pages only exist on the demo site (DEMO_SITE or SAMPLE_DATA). Each one exports this as its getStaticPaths.
export function demoOnly() {
  return demoMode ? [{ params: { page: undefined } }] : [];
}
