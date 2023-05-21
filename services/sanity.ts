import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-21",
  token: process.env.SANITY_SECRET_TOKEN,
});

export default client;
