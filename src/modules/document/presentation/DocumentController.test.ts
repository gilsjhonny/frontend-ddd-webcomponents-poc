import { it, expect, describe } from 'vitest';
import { DocumentRepository } from '../domain/DocumentRepository';
import { Document } from '../domain/Document';
import { DocumentController } from './DocumentController';
import { DocumentViewModel } from './DocumentViewModel';

describe('DocumentController', () => {
  const document = Document.createFromProperties({
    id: '1',
    name: 'Document Name',
    creationDate: new Date(),
    version: '1.0.0',
    contributors: [],
    attachments: [],
  });

  class MockDocumentRepository implements DocumentRepository {
    async getDocuments() {
      return [document];
    }
  }

  class FailingDocumentRepository implements DocumentRepository {
    async getDocuments() {
      return new Error('Failed to load documents');
    }
  }

  describe('loadDocuments', () => {
    it('should load documents', async () => {
      const documentRepository = new MockDocumentRepository();
      const documentController = new DocumentController(documentRepository);

      const documents = await documentController.loadDocuments();
      const documentView = DocumentViewModel.createFromDomain(document);

      expect(documents).toEqual([documentView]);
    });

    it('should return an error if the repository fails', async () => {
      const documentRepository = new FailingDocumentRepository();
      const documentController = new DocumentController(documentRepository);

      const documents = (await documentController.loadDocuments()) as Error;

      expect(documents).toBeInstanceOf(Error);
      expect(documents.message).toBe('Failed to load documents');
    });
  });
});
