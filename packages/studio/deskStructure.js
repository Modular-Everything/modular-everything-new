import S from "@sanity/desk-tool/structure-builder";

export default function deskStructure() {
  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .child(
          S.document()
            .schemaType("homepage")
            .documentId("homepage")
            .title("Homepage")
            .views([S.view.form()])
        ),
    ]);
}
