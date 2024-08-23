import { Document } from '../domain/Document';
import { DocumentRepository } from '../domain/DocumentRepository';
import { DocumentProperties } from '../domain/types';
import { DocumentContributor } from '../domain/valueObjects/DocumentContributor';
import { DocumentAPI, DocumentResponse } from './DocumentAPI';

export class HttpDocumentRepository implements DocumentRepository {
  constructor(private readonly apiClient: typeof DocumentAPI) {}

  async getDocuments(): Promise<Document[] | Error> {
    try {
      const responseData: DocumentResponse[] = await this.apiClient.fetchDocuments();
      return this.mapToDomain(responseData);
    } catch (error: unknown) {
      console.error('Failed to retrieve documents:', error);
      return new Error('Failed to retrieve documents');
    }
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
