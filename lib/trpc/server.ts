import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { documentStore } from "../document-store";
import { revalidatePath } from "next/cache";

const t = initTRPC.create();

export const appRouter = t.router({
  document: t.router({
    getDocuments: t.procedure.query(async () => {
      try {
        const documents = await documentStore.getDocuments();

        return documents
          .map((doc) => ({
            id: doc.id,
            title: doc.title,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            data: doc.data,
          }))
          .sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
      } catch (error) {
        console.error("Error retrieving documents:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to retrieve documents",
        });
      }
    }),

    getDocument: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const document = await documentStore.getDocument(input.id);

          if (!document) {
            return {
              version: 1,
              shapes: {},
              bindings: {},
              assets: {},
            };
          }

          return (
            document.data || {
              version: 1,
              shapes: {},
              bindings: {},
              assets: {},
            }
          );
        } catch (error) {
          console.error("Error retrieving document:", error);
          return {
            version: 1,
            shapes: {},
            bindings: {},
            assets: {},
          };
        }
      }),

    createDocument: t.procedure
      .input(z.object({ title: z.string().default("Untitled Document") }))
      .mutation(async ({ input }) => {
        try {
          const newDoc = await documentStore.createDocument(input.title);
          revalidatePath("/");

          return {
            id: newDoc.id,
            title: newDoc.title,
          };
        } catch (error) {
          console.error("Error creating document:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to create document",
          });
        }
      }),

    saveDocument: t.procedure
      .input(
        z.object({
          id: z.string(),
          data: z.any(),
          title: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const success = await documentStore.saveDocument(
            input.id,
            input.data,
            input.title
          );

          if (!success) {
            await documentStore.createDocument(
              input.title || "Untitled Document"
            );
          }

          return { success: true };
        } catch (error) {
          console.error("Error saving document:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to save document",
          });
        }
      }),
    deleteDocument: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const success = await documentStore.deleteDocument(input.id);

          if (!success) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Document with ID ${input.id} not found`,
            });
          }

          revalidatePath("/");

          return { success: true };
        } catch (error) {
          console.error("Error deleting document:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to delete document",
          });
        }
      }),

    deleteAllDocuments: t.procedure.mutation(async () => {
      try {
        const success = await documentStore.deleteAllDocuments();

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete all documents",
          });
        }
        revalidatePath("/");

        return { success: true };
      } catch (error) {
        console.error("Error deleting all documents:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete all documents",
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
