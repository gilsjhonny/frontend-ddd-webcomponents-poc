import { describe, it, beforeEach, expect } from 'vitest';
import { DocumentAPI, DocumentFetchError, DocumentResponse } from './DocumentAPI';
import { FetchMock } from 'vitest-fetch-mock';

describe('DocumentAPI', () => {
  beforeEach(() => {
    (fetch as FetchMock).resetMocks();
  });

  describe('when fetch is successful', () => {
    it('makes a successful GET request', async () => {
      const response: DocumentResponse[] = [
        {
          ID: '1',
          Title: 'First document',
          Contributors: [],
          Version: '1.0',
          Attachments: [],
          CreatedAt: '2021-01-01T00:00:00Z',
          UpdatedAt: '2021-01-01T00:00:00Z',
        },
      ];

      (fetch as FetchMock).mockResponseOnce(JSON.stringify(response));

      const docs = await DocumentAPI.fetchDocuments();

      expect(docs).toEqual(response);
    });

    it('throws a DocumentFetchError if the response is not ok', async () => {
      (fetch as FetchMock).mockResponseOnce('', { status: 500, statusText: 'Internal Server Error' });

      await expect(DocumentAPI.fetchDocuments()).rejects.toThrow(DocumentFetchError);
    });
  });

  describe('when fetch fails', () => {
    it('throws a DocumentFetchError with the original error', async () => {
      const originalError = new Error('Failed to fetch');
      (fetch as FetchMock).mockRejectOnce(originalError);

      await expect(DocumentAPI.fetchDocuments()).rejects.toThrow(DocumentFetchError);
    });
  });
});
