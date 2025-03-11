import { notFound } from "next/navigation";
import EditorPage from "@/components/editor-page";
import { createCaller } from "@/lib/trpc/server-client";

interface EditorRouteProps {
  params: {
    id: string;
  };
}

export default async function EditorRoute({ params }: EditorRouteProps) {
  if (!params.id) {
    return notFound();
  }

  const caller = createCaller();
  const documents = await caller.document.getDocuments();
  const documentInfo = documents.find((doc) => doc.id === params.id);

  const documentData = await caller.document.getDocument({ id: params.id });

  let docInfo = documentInfo;
  if (!docInfo && documentData) {
    docInfo = {
      id: params.id,
      title: "Untitled Document",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  if (!docInfo) {
    return notFound();
  }

  return (
    <EditorPage
      documentId={params.id}
      initialDocumentData={documentData}
      documentTitle={docInfo.title}
    />
  );
}
