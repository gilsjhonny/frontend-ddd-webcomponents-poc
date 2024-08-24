import { DocumentRepository } from '../domain/DocumentRepository';
import { DocumentViewModel } from './DocumentViewModel';

export class DocumentController {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async loadDocuments(): Promise<DocumentViewModel[] | Error> {
    try {
      const documents = await this.documentRepository.getDocuments();

      if (documents instanceof Error) {
        throw documents;
      }

      const documentViews = documents.map((doc) => DocumentViewModel.createFromDomain(doc));

      return documentViews;
    } catch (error) {
      console.error(error);
      return new Error('Failed to load documents');
    }
  }

  // In a scenario where its a real application, we would have a method to create a new document, update a document, delete a document, etc.
}
