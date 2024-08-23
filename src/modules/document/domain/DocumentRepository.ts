import { Document } from './Document';

export interface DocumentRepository {
  getDocuments(): Promise<Document[] | Error>;
}
