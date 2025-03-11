import { createCaller } from "@/lib/trpc/server-client";
import HomePage from "@/components/home-page";

export default async function HomeRoute() {
  const caller = createCaller();
  const documents = await caller.document.getDocuments();
  if (!documents) {
    return <HomePage initialDocuments={[]} />;
  }

  return <HomePage initialDocuments={documents} />;
}
