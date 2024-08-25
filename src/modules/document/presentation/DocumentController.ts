import { DocumentRepository } from '../domain/DocumentRepository';
import { DocumentViewModel } from './DocumentViewModel';
import { Document } from '../domain/Document';
import { DocumentProperties } from '../domain/types';

export class DocumentController {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async createDocument(properties: DocumentProperties): Promise<DocumentViewModel | Error> {
    const newDocument = Document.createFromProperties(properties);
    this.documentRepository.addDocument(newDocument);

    return DocumentViewModel.createFromDomain(newDocument);
  }

  async loadDocuments(): Promise<DocumentViewModel[] | Error> {
    try {
      const documents = await this.documentRepository.getDocuments();

      if (documents instanceof Error) throw documents;

      const documentViews = documents.map((doc) => DocumentViewModel.createFromDomain(doc));

      return documentViews;
    } catch (error) {
      console.error(error);
      return new Error('Failed to load documents');
    }
  }

  static sortDocuments(
    documentViews: DocumentViewModel[],
    criteria: 'name' | 'version' | 'creation-date'
  ): DocumentViewModel[] {
    return documentViews.sort((a, b) => {
      switch (criteria) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'version':
          return a.version.localeCompare(b.version);
        case 'creation-date':
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        default:
          return 0;
      }
    });
  }
}
