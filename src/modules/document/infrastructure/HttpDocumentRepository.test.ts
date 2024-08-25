import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { HttpDocumentRepository } from './HttpDocumentRepository';
import { DocumentAPI, DocumentResponse } from './DocumentAPI';
import { DocumentContributor } from '../domain/valueObjects/DocumentContributor';
import { Document } from '../domain/Document';
import { DocumentMemoryStore } from './DocumentStore';

describe('HttpDocumentRepository', () => {
  let repository: HttpDocumentRepository;
  let mockDocumentAPI: Partial<typeof DocumentAPI>;
  const mockResponse: DocumentResponse[] = [
    {
      ID: '1',
      Title: 'Test Document',
      Contributors: [{ ID: '1', Name: 'John Doe' }],
      Version: '1.0',
      Attachments: ['file1.pdf', 'file2.pdf'],
      CreatedAt: '2024-01-01T00:00:00Z',
      UpdatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    DocumentMemoryStore.getInstance().clearDocuments();
    mockDocumentAPI = {
      fetchDocuments: vi.fn(),
    };

    repository = new HttpDocumentRepository(mockDocumentAPI as typeof DocumentAPI);
  });

  it('should fetch and map documents successfully', async () => {
    (mockDocumentAPI.fetchDocuments as Mock).mockResolvedValue(mockResponse);

    const results = (await repository.getDocuments()) as Document[];

    expect(mockDocumentAPI.fetchDocuments).toHaveBeenCalledTimes(1);

    const expectedDocument = Document.createFromProperties({
      id: '1',
      name: 'Test Document',
      contributors: [DocumentContributor.createFromProperties('1', 'John Doe')],
      version: '1.0',
      attachments: ['file1.pdf', 'file2.pdf'],
      creationDate: new Date('2024-01-01T00:00:00Z'),
    });

    expect(results).toHaveLength(1);
    expect(results).toEqual([expectedDocument]);
    expect(results[0]).toBeInstanceOf(Document);
  });

  it('should return an error if fetching documents fails', async () => {
    (mockDocumentAPI.fetchDocuments as Mock).mockRejectedValue(new Error());

    const results = (await repository.getDocuments()) as Error;

    expect(mockDocumentAPI.fetchDocuments).toHaveBeenCalledTimes(1);
    expect(results).toBeInstanceOf(Error);
    expect(results.message).toBe('Failed to retrieve documents');
  });

  it('should add a document to the memory store', () => {
    const newDocument = Document.createFromProperties({
      id: '2',
      name: 'New Document',
      contributors: [DocumentContributor.createFromProperties('1', 'John Doe')],
      version: '1.0',
      attachments: [],
      creationDate: new Date('2024-01-01T00:00:00Z'),
    });

    repository.addDocument(newDocument);
    const storedDocuments = DocumentMemoryStore.getInstance().getDocuments();

    expect(storedDocuments).toHaveLength(1);
    expect(storedDocuments[0]).toEqual(newDocument);
  });

  it('should combine fetched documents with those in the memory store', async () => {
    const newDocument = Document.createFromProperties({
      id: '2',
      name: 'New Document',
      contributors: [DocumentContributor.createFromProperties('1', 'John Doe')],
      version: '1.0',
      attachments: [],
      creationDate: new Date('2024-01-01T00:00:00Z'),
    });

    DocumentMemoryStore.getInstance().addDocument(newDocument);

    (mockDocumentAPI.fetchDocuments as Mock).mockResolvedValue(mockResponse);

    const results = (await repository.getDocuments()) as Document[];

    expect(results).toHaveLength(2);
    expect(results).toContainEqual(newDocument);

    const expectedDocument = Document.createFromProperties({
      id: '1',
      name: 'Test Document',
      contributors: [DocumentContributor.createFromProperties('1', 'John Doe')],
      version: '1.0',
      attachments: ['file1.pdf', 'file2.pdf'],
      creationDate: new Date('2024-01-01T00:00:00Z'),
    });

    expect(results).toContainEqual(expectedDocument);
  });
});
