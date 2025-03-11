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
  if (!params.id) {
    return notFound();
  }

  const document = await getDocumentById(params.id);
  if (!document) {
    return notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <EditorPage
        documentId={params.id}
        initialDocumentData={document.data}
        documentTitle={document.info.title}
      />
    </Suspense>
  );
}
