import { Document } from '../domain/Document';

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

  // Clears the documents in the memory store
  public clearDocuments(): void {
    this.documents = [];
  }
}
