import { anysku, site as configured } from "../../site.config";

// Set SAMPLE_DATA=1 to build with the sample sales in src/sample instead of your group's.
export const sampleMode = ["1", "true"].includes(String(import.meta.env.SAMPLE_DATA ?? "").toLowerCase());

export const site = sampleMode
  ? {
      ...configured,
      name: "Example Church Network",
      tagline: "Church sales that bring neighbours together.",
      organizationLabel: { one: "church", many: "churches" },
    }
  : configured;

export { anysku };
