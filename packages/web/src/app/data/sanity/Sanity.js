import SanityClient from "@sanity/client";

export default class SanityHook {
  async getData() {
    const client = SanityClient({
      projectId: process.env.VITE_SANITY_PROJECT_ID,
      dataset: process.env.VITE_SANITY_DATASET,
      apiVersion: "2022-12-02",
      useCdn: false,
    });

    const homepage = await client.fetch(`
      *[_type == 'homepage'][0] {
        ...,
        projects[]->
      }
    `);

    console.log(homepage);

    return { homepage };
  }
}
