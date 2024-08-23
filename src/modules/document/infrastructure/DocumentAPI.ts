export interface DocumentResponse {
  ID: string;
  Title: string;
  Contributors: {
    ID: string;
    Name: string;
  }[];
  Version: string;
  Attachments: string[];
  CreatedAt: string;
  UpdatedAt: string;
}

export class DocumentAPI {
  private static endpoint = `http://localhost:9090/documents`;

  static async fetchDocuments(): Promise<DocumentResponse[]> {
    try {
      const response = await fetch(this.endpoint);

      if (!response.ok) {
        throw new DocumentFetchError(`Failed to fetch documents: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      throw new DocumentFetchError('An unexpected error occurred while fetching or parsing documents', error);
    }
  }
}

export class DocumentFetchError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'DocumentFetchError';
  }
}
