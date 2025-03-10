import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";

// Create a simple in-memory store for the document data
// In a real app, you would use a database
type DocumentData = {
  version: number;
  shapes: Record<string, unknown>;
  bindings: Record<string, unknown>;
  assets: Record<string, unknown>;
};
let documentStore: DocumentData | null = null;
const t = initTRPC.create();

// Create the router
export const appRouter = t.router({
  document: t.router({
    getDocument: t.procedure.query(async () => {
      try {
        // Simulate a delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate a random error (10% chance) for testing error handling
        if (Math.random() < 0.1) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve document data from the server",
          });
        }

        // Return the document data or a default empty document
        return (
          documentStore || {
            version: 1,
            shapes: {},
            bindings: {},
            assets: {},
          }
        );
      } catch (error) {
        console.error("Error retrieving document:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to retrieve document",
        });
      }
    }),

    saveDocument: t.procedure.input(z.any()).mutation(async ({ input }) => {
      try {
        // Simulate a delay to show saving state
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate a random error (10% chance) for testing error handling
        if (Math.random() < 0.1) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save document data to the server",
          });
        }

        // Save the document data
        documentStore = input;

        return { success: true };
      } catch (error) {
        console.error("Error saving document:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to save document",
        });
      }
    }),
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
