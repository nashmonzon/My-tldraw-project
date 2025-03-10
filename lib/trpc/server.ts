import { initTRPC } from "@trpc/server";
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

// Initialize tRPC
const t = initTRPC.create();

// Create the router
export const appRouter = t.router({
  document: t.router({
    getDocument: t.procedure.query(async () => {
      // Simulate a delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return the document data or a default empty document
      return (
        documentStore || {
          version: 1,
          shapes: {},
          bindings: {},
          assets: {},
        }
      );
    }),

    saveDocument: t.procedure.input(z.any()).mutation(async ({ input }) => {
      // Simulate a delay to show saving state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save the document data
      documentStore = input;

      return { success: true };
    }),
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
