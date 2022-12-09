export default {
  name: "homepage",
  type: "document",
  title: "Homepage",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "selected_works",
      title: "Selected Works",
      type: "string",
    },
    {
      name: "comment",
      title: "Comment",
      type: "string",
    },
    {
      name: "projects",
      title: "Projects",
      type: "array",
      validation: (Rule) => Rule.unique(),
      of: [
        {
          name: "project",
          title: "Project",
          type: "reference",
          to: [
            {
              type: "project",
            },
          ],
        },
      ],
    },
  ],
};
