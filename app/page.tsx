import HomePage from "@/components/home-page";
import { Suspense } from "react";
import Loading from "./loading";
import { getDocuments } from "./actions/documents";
import { AIChatButton } from "@/components/chat-ia/chat-button";

export default async function HomeRoute() {
  const documentsPromise = getDocuments();
  const hasApiKey = !!process.env.OPENAI_API_KEY;

  return (
    <Suspense fallback={<Loading />}>
      <HomePage initialDocuments={await documentsPromise} />
      {hasApiKey && <AIChatButton />}
    </Suspense>
  );
}
