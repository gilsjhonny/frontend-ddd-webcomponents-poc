import { it, expect, describe, vi, beforeEach } from 'vitest';
import { DocumentRepository } from '../domain/DocumentRepository';
import { Document } from '../domain/Document';
import { DocumentController } from './DocumentController';
import { DocumentViewModel } from './DocumentViewModel';
import { DocumentProperties } from '../domain/types';

describe('DocumentController', () => {
  // Mocking the Document
  const document = Document.createFromProperties({
    id: '1',
    name: 'Document Name',
    creationDate: new Date(),
    version: '1.0.0',
    contributors: [],
    attachments: [],
  });

  // Mocking the DocumentRepository
  const addDocumentMock = vi.fn();
  const documentRepository: DocumentRepository = {
    addDocument: addDocumentMock,
    getDocuments: async () => [document],
  };

  // Mocking DocumentRepository for failing tests
  const failingDocumentRepository: DocumentRepository = {
    addDocument: () => new Error(),
    getDocuments: async () => new Error(),
  };

  beforeEach(() => {
    addDocumentMock.mockClear();
  });

  describe('createDocument', () => {
    it('should call addDocument with the correct arguments', async () => {
      const documentController = new DocumentController(documentRepository);

      const documentProps: DocumentProperties = {
        id: '1',
        name: 'Document Name',
        creationDate: new Date(),
        version: '1.0.0',
        contributors: [],
        attachments: [],
      };

      await documentController.createDocument(documentProps);

      expect(addDocumentMock).toHaveBeenCalledTimes(1);
      expect(addDocumentMock).toHaveBeenCalledWith(
        expect.objectContaining(Document.createFromProperties(documentProps))
      );
    });
  });

  describe('loadDocuments', () => {
    it('should load documents', async () => {
      const documentController = new DocumentController(documentRepository);

      const documents = await documentController.loadDocuments();
      const documentView = DocumentViewModel.createFromDomain(document);

      expect(documents).toEqual([documentView]);
    });

    it('should return an error if the repository fails', async () => {
      const documentController = new DocumentController(failingDocumentRepository);

      const documents = (await documentController.loadDocuments()) as Error;

      expect(documents).toBeInstanceOf(Error);
      expect(documents.message).toBe('Failed to load documents');
    });
  });
});
