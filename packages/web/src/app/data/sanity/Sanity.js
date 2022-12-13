import SanityClient from "@sanity/client";

export default class SanityHook {
  constructor() {
    this.client = SanityClient({
      projectId: "5u4gnb55",
      dataset: "production",
      apiVersion: "2022-12-02",
      useCdn: false,
    });
  }

  async getPages() {
    const homepage = await this.client.fetch(`
      *[_type == 'homepage'][0] {
        ...,
        projects[]->
      }
    `);

    return { homepage };
  }

  async getProject(id) {
    return await this.client.fetch(
      `
        *[_type == 'project' && slug.current == $id][0]
      `,
      { id }
    );
  }
}
