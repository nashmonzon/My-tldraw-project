import { createCaller } from "@/lib/trpc/server-client";

const caller = createCaller();

export async function getDocuments() {
  try {
    const documents = await caller.document.getDocuments();
    return Array.isArray(documents) ? documents : [];
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return [];
  }
}

export async function getDocumentById(id: string) {
  try {
    const [documents, documentData] = await Promise.all([
      caller.document.getDocuments(),
      caller.document.getDocument({ id }),
    ]);

    const documentInfo = documents.find((doc) => doc.id === id);

    if (!documentInfo && documentData) {
      return {
        info: {
          id,
          title: "Untitled Document",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        data: documentData,
      };
    }

    if (!documentInfo) {
      return null;
    }

    return {
      info: documentInfo,
      data: documentData,
    };
  } catch (error) {
    console.error("Failed to fetch document:", error);
    return null;
  }
}
