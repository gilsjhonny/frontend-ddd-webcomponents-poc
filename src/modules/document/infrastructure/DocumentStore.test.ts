import { describe, it, expect, beforeEach } from 'vitest';
import { Document } from '../domain/Document';
import { DocumentContributor } from '../domain/valueObjects/DocumentContributor';
import { DocumentMemoryStore } from './DocumentStore';

describe('DocumentMemoryStore', () => {
  let store: DocumentMemoryStore;
  let mockedDocumentA: Document;
  let mockedDocumentB: Document;

  beforeEach(() => {
    store = DocumentMemoryStore.getInstance();
    store.clearDocuments();

    mockedDocumentA = Document.createFromProperties({
      id: '1',
      name: 'Test Document',
      contributors: [
        DocumentContributor.createFromProperties('1', 'John Doe'),
        DocumentContributor.createFromProperties('2', 'Jane Smith'),
      ],
      version: '1.0',
      attachments: ['file1.pdf', 'file2.pdf'],
      creationDate: new Date('2024-01-01T00:00:00Z'),
    });

    mockedDocumentB = Document.createFromProperties({
      id: '2',
      name: 'Test Document 2',
      contributors: [
        DocumentContributor.createFromProperties('3', 'John Doe'),
        DocumentContributor.createFromProperties('4', 'Jane Smith'),
      ],
      version: '1.0',
      attachments: ['file3.pdf', 'file4.pdf'],
      creationDate: new Date('2024-01-01T00:00:00Z'),
    });
  });

  it('should return an empty array when no documents are added', () => {
    const documents = store.getDocuments();
    expect(documents).toEqual([]);
  });

  it('should add a document to the store', () => {
    const document = mockedDocumentA;

    store.addDocument(mockedDocumentA);
    const documents = store.getDocuments();

    expect(documents).toHaveLength(1);
    expect(documents[0]).toEqual(document);
  });

  it('should set documents in the store', () => {
    store.setDocuments([mockedDocumentA, mockedDocumentB]);
    const documents = store.getDocuments();

    expect(documents).toHaveLength(2);
    expect(documents).toContainEqual(mockedDocumentA);
    expect(documents).toContainEqual(mockedDocumentB);
  });

  it('should clear documents from the store', () => {
    store.addDocument(mockedDocumentA);
    expect(store.getDocuments()).toHaveLength(1);

    store.clearDocuments();
    expect(store.getDocuments()).toEqual([]);
  });
});
