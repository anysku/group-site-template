// Everything a group changes to make the site its own. Page text lives in src/pages and src/content.

export const site = {
  name: "Your Group",
  tagline: "Local sales that bring people together.",
  description: "Our member organizations run local sales on anySKU. Find a sale near you, or bring one to your community.",

  // Your group's address on anySKU: anysku.com/g/{groupSlug}
  groupSlug: "your-group",

  // What you call the organizations in your group, singular and plural.
  organizationLabel: { one: "organization", many: "organizations" },

  // Event times are shown in this time zone.
  timeZone: "America/New_York",

  contactEmail: "hello@example.org",

  // Leave a link empty to hide it.
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
  },

  // The overview video. Empty hides the section.
  overviewVideoUrl: "",
};

export const anysku = {
  siteUrl: "https://www.anysku.com",
  apiUrl: "https://app-api.anysku.com",
};
