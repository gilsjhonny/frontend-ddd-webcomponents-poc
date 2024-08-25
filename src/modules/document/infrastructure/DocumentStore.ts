import { Document } from '../domain/Document';

// Singleton class to store documents in memory this is a simple implementation
export class DocumentMemoryStore {
  private static instance: DocumentMemoryStore;
  private documents: Document[] = [];

  private constructor() {}

  public static getInstance(): DocumentMemoryStore {
    if (!DocumentMemoryStore.instance) {
      DocumentMemoryStore.instance = new DocumentMemoryStore();
    }
    return DocumentMemoryStore.instance;
  }

  public getDocuments(): Document[] {
    return this.documents;
  }

  public setDocuments(documents: Document[]): void {
    this.documents = documents;
  }

  public addDocument(document: Document): void {
    this.documents.push(document);
  }

  public clearDocuments(): void {
    this.documents = [];
  }
}
