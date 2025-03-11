import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { TRPCClientErrorLike } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";

export interface Document {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  data: {
    version: number;
    shapes: Record<string, unknown>;
    bindings: Record<string, unknown>;
    assets: Record<string, unknown>;
  };
}
export interface DocumentClient {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  data: Document["data"];
}

export type Error = TRPCClientErrorLike<{
  errorShape: DefaultErrorShape;
  transformer: false;
}> | null;

const DATA_FILE = path.join(process.cwd(), ".document-store.json");

class DocumentStore {
  private static instance: DocumentStore;
  private documents: Record<string, Document> = {};
  private initialized = false;

  public static getInstance(): DocumentStore {
    if (!DocumentStore.instance) {
      DocumentStore.instance = new DocumentStore();
    }
    return DocumentStore.instance;
  }

  public async init() {
    if (this.initialized) return;

    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        const parsed = JSON.parse(data);

        Object.keys(parsed).forEach((key) => {
          parsed[key].createdAt = new Date(parsed[key].createdAt);
          parsed[key].updatedAt = new Date(parsed[key].updatedAt);
        });

        this.documents = parsed;
      } else {
        const sampleDocs = [
          { id: uuidv4(), title: "Untitled Document", data: null },
          { id: uuidv4(), title: "Project Wireframes", data: null },
          { id: uuidv4(), title: "UI Design Concepts", data: null },
        ];

        sampleDocs.forEach((doc) => {
          const now = new Date();
          this.documents[doc.id] = {
            ...doc,
            createdAt: now,
            updatedAt: now,
          };
        });

        await this.save();
      }

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing document store:", error);
      this.documents = {};
      this.initialized = true;
    }
  }

  private async save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.documents, null, 2));
    } catch (error) {
      console.error("Error saving document store:", error);
    }
  }

  public async getDocuments(): Promise<Document[]> {
    await this.init();
    return Object.values(this.documents);
  }

  public async getDocument(id: string): Promise<Document | null> {
    await this.init();

    const doc = this.documents[id];
    if (!doc) {
      return null;
    }

    if (!doc.data) {
      doc.data = {
        version: 1,
        shapes: {},
        bindings: {},
        assets: {},
      };
      await this.save();
    }

    return doc;
  }

  public async createDocument(title: string): Promise<Document> {
    await this.init();

    const id = uuidv4();
    const now = new Date();

    const newDoc: Document = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      data: {
        version: 1,
        shapes: {},
        bindings: {},
        assets: {},
      },
    };

    this.documents[id] = newDoc;
    await this.save();

    return newDoc;
  }

  public async saveDocument(
    id: string,
    data: Document["data"],
    title?: string
  ): Promise<boolean> {
    await this.init();

    if (!this.documents[id]) {
      return false;
    }

    this.documents[id] = {
      ...this.documents[id],
      title: title || this.documents[id].title,
      data,
      updatedAt: new Date(),
    };

    await this.save();
    return true;
  }
}

// Exportar una instancia única
export const documentStore = DocumentStore.getInstance();
