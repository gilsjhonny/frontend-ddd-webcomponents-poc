import { it, expect, describe, vi, beforeEach } from 'vitest';
import { DocumentRepository } from '../domain/DocumentRepository';
import { Document } from '../domain/Document';
import { DocumentController } from './DocumentController';
import { DocumentViewModel } from './DocumentViewModel';
import { DocumentProperties } from '../domain/types';

describe('DocumentController', () => {
  const document = Document.createFromProperties({
    id: '1',
    name: 'Document Name',
    creationDate: new Date('2023-01-01'),
    version: '1.0.0',
    contributors: [],
    attachments: [],
  });

  const anotherDocument = Document.createFromProperties({
    id: '2',
    name: 'Another Document',
    creationDate: new Date('2024-01-01'),
    version: '1.1.0',
    contributors: [],
    attachments: [],
  });

  const documentWithoutDate = Document.createFromProperties({
    id: '3',
    name: 'No Date Document',
    creationDate: null,
    version: '1.2.0',
    contributors: [],
    attachments: [],
  });

  const addDocumentMock = vi.fn();
  const documentRepository: DocumentRepository = {
    addDocument: addDocumentMock,
    getDocuments: async () => [document, anotherDocument, documentWithoutDate],
  };

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
      const anotherDocumentView = DocumentViewModel.createFromDomain(anotherDocument);
      const documentWithoutDateView = DocumentViewModel.createFromDomain(documentWithoutDate);

      expect(documents).toEqual([documentView, anotherDocumentView, documentWithoutDateView]);
    });

    it('should return an error if the repository fails', async () => {
      const documentController = new DocumentController(failingDocumentRepository);

      const documents = (await documentController.loadDocuments()) as Error;

      expect(documents).toBeInstanceOf(Error);
      expect(documents.message).toBe('Failed to load documents');
    });
  });

  describe('sortDocuments', () => {
    it('should sort documents by name', () => {
      const documentView1 = DocumentViewModel.createFromDomain(document);
      const documentView2 = DocumentViewModel.createFromDomain(anotherDocument);

      const sortedDocuments = DocumentController.sortDocuments([documentView2, documentView1], 'name');

      expect(sortedDocuments).toEqual([documentView2, documentView1]);
    });

    it('should sort documents by version', () => {
      const documentView1 = DocumentViewModel.createFromDomain(document);
      const documentView2 = DocumentViewModel.createFromDomain(anotherDocument);

      const sortedDocuments = DocumentController.sortDocuments([documentView1, documentView2], 'version');

      expect(sortedDocuments).toEqual([documentView1, documentView2]);
    });

    it('should sort documents by creation date', () => {
      const documentView1 = DocumentViewModel.createFromDomain(document);
      const documentView2 = DocumentViewModel.createFromDomain(anotherDocument);

      const sortedDocuments = DocumentController.sortDocuments([documentView1, documentView2], 'creation-date');

      expect(sortedDocuments).toEqual([documentView2, documentView1]);
    });
  });
});
