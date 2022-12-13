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
          options: {
            filter: ({ parent }) => {
              const existingEntries = parent
                .map((existingEntry) => existingEntry._ref)
                .filter((item) => Boolean(item));
              return {
                filter: "!(_id in $existingEntries)",
                params: {
                  existingEntries,
                },
              };
            },
          },
        },
      ],
    },
  ],
};
