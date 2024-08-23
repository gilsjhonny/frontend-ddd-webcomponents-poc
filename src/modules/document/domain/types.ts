import { DocumentContributor } from './valueObjects/DocumentContributor';

export type DocumentProperties = {
  id: string;
  name: string;
  contributors: DocumentContributor[];
  version: string;
  attachments: string[];
  creationDate: Date;
};

export interface DocumentContributorDTO {
  id: string;
  name: string;
}
