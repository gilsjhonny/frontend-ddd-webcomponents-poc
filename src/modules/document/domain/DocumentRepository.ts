import { Document } from './Document';

export interface DocumentRepository {
  addDocument(document: Document): void;
  getDocuments(): Promise<Document[] | Error>;
}
