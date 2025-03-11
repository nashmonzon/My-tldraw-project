import { notFound } from "next/navigation";
import EditorPage from "@/components/editor-page";
import { Suspense } from "react";

import { getDocumentById } from "@/app/actions/documents";
import Loading from "@/app/loading";

interface EditorRouteProps {
  params: {
    id: string;
  };
}

export default async function EditorRoute({ params }: EditorRouteProps) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }

  const document = await getDocumentById(id);
  if (!document) {
    return notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <EditorPage
        documentId={id}
        initialDocumentData={document.data}
        documentTitle={document.info.title}
      />
    </Suspense>
  );
}
