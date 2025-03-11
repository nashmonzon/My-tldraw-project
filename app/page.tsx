import HomePage from "@/components/home-page";
import { Suspense } from "react";
import Loading from "./loading";
import { getDocuments } from "./actions/documents";

export default async function HomeRoute() {
  const documentsPromise = getDocuments();

  return (
    <Suspense fallback={<Loading />}>
      <HomePage initialDocuments={await documentsPromise} />
    </Suspense>
  );
}
