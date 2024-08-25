import { Document } from '../domain/Document';
import { DocumentRepository } from '../domain/DocumentRepository';
import { DocumentProperties } from '../domain/types';
import { DocumentContributor } from '../domain/valueObjects/DocumentContributor';
import { DocumentAPI, DocumentResponse } from './DocumentAPI';
import { DocumentMemoryStore } from './DocumentStore';

export class HttpDocumentRepository implements DocumentRepository {
  // Singleton instance
  // In a real world scenario, documents would typically be saved and retrieved from a persistent data store
  // The DocumentMemoryStore here acts as an in-memory store for simplicity, which wouldn't normally belong in a repository pattern
  private documentStore = DocumentMemoryStore.getInstance();

  constructor(private readonly apiClient: typeof DocumentAPI) {}

  async getDocuments(): Promise<Document[] | Error> {
    try {
      const responseData: DocumentResponse[] = await this.apiClient.fetchDocuments();
      const fetchedDocuments = this.mapToDomain(responseData);

      // Combine fetched documents with the ones already in memory
      return [...this.documentStore.getDocuments(), ...fetchedDocuments];
    } catch (error: unknown) {
      console.error('Failed to retrieve documents:', error);
      return new Error('Failed to retrieve documents');
    }
  }

  addDocument(document: Document): void {
    this.documentStore.addDocument(document);
  }

  private mapToDomain(data: DocumentResponse[]): Document[] {
    return data.map((item) => {
      const documentProperties: DocumentProperties = {
        id: item.ID,
        name: item.Title,
        contributors: item.Contributors.map((contributor) =>
          DocumentContributor.createFromProperties(contributor.ID, contributor.Name)
        ),
        version: item.Version,
        attachments: item.Attachments,
        creationDate: new Date(item.CreatedAt),
      };

      return Document.createFromProperties(documentProperties);
    });
  }
}
