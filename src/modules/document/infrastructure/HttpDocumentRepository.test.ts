import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { HttpDocumentRepository } from './HttpDocumentRepository';
import { DocumentAPI, DocumentResponse } from './DocumentAPI';
import { DocumentContributor } from '../domain/valueObjects/DocumentContributor';
import { Document } from '../domain/Document';

describe('HttpDocumentRepository', () => {
  let repository: HttpDocumentRepository;
  let mockDocumentAPI: Partial<typeof DocumentAPI>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDocumentAPI = {
      fetchDocuments: vi.fn(),
    };

    repository = new HttpDocumentRepository(mockDocumentAPI as typeof DocumentAPI);
  });

  it('should fetch and map documents successfully', async () => {
    const mockResponse: DocumentResponse[] = [
      {
        ID: '1',
        Title: 'Test Document',
        Contributors: [
          { ID: '1', Name: 'John Doe' },
          { ID: '2', Name: 'Jane Smith' },
        ],
        Version: '1.0',
        Attachments: ['file1.pdf', 'file2.pdf'],
        CreatedAt: '2024-01-01T00:00:00Z',
        UpdatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    (mockDocumentAPI.fetchDocuments as Mock).mockResolvedValue(mockResponse);

    const results = (await repository.getDocuments()) as Document[];

    expect(mockDocumentAPI.fetchDocuments).toHaveBeenCalledTimes(1);

    const expectedDocument = Document.createFromProperties({
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

    expect(results).toHaveLength(1);
    expect(results).toEqual([expectedDocument]);
    expect(results[0]).toBeInstanceOf(Document);
  });

  it('should return an error if fetching documents fails', async () => {
    (mockDocumentAPI.fetchDocuments as Mock).mockRejectedValue(new Error('Failed to fetch documents'));

    const results = (await repository.getDocuments()) as Error;

    expect(mockDocumentAPI.fetchDocuments).toHaveBeenCalledTimes(1);
    expect(results).toBeInstanceOf(Error);
    expect(results.message).toBe('Failed to retrieve documents');
  });
});
