import { anysku, site as configured } from "../../site.config";

const on = (value: unknown) => ["1", "true"].includes(String(value ?? "").toLowerCase());

// SAMPLE_DATA=1 builds with the sample sales in src/sample instead of asking anySKU (works offline).
export const sampleData = on(import.meta.env.SAMPLE_DATA);

// DEMO_SITE=1 builds the public demo: the example banner and names, and the /demo/ pages.
// SAMPLE_DATA implies it.
export const demoMode = sampleData || on(import.meta.env.DEMO_SITE);

export const site = demoMode
  ? {
      ...configured,
      name: "Example Church Network",
      tagline: "Church sales that bring neighbours together.",
      organizationLabel: { one: "church", many: "churches" },
    }
  : configured;

export { anysku };
