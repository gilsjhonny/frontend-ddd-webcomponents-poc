import { Document } from '../domain/Document';
import { DocumentRepository } from '../domain/DocumentRepository';
import { DocumentProperties } from '../domain/types';
import { DocumentContributor } from '../domain/valueObjects/DocumentContributor';
import { DocumentResponse } from './DocumentAPI';

const fakeResponse: DocumentResponse[] = [
  {
    Attachments: ['European Amber Lager', 'Wood-aged Beer'],
    Contributors: [
      {
        ID: '1b41861e-51e2-4bf4-ba13-b20f01ce81ef',
        Name: 'Jasen Crona',
      },
      {
        ID: '2a1d6ed0-7d2d-4dc6-b3ea-436a38fd409e',
        Name: 'Candace Jaskolski',
      },
      {
        ID: '9ae28565-4a1c-42e3-9ae8-e39e6f783e14',
        Name: 'Rosemarie Schaden',
      },
    ],
    CreatedAt: '1912-03-08T06:01:39.382278739Z',
    ID: '69517c79-a4b2-4f64-9c83-20e5678e4519',
    Title: 'Arrogant Bastard Ale',
    UpdatedAt: '1952-02-29T22:21:13.817038244Z',
    Version: '5.3.15',
  },
  {
    Attachments: ['Strong Ale', 'Stout', 'Dark Lager', 'Belgian Strong Ale'],
    Contributors: [
      {
        ID: '1bbb6853-390f-49aa-a002-fb60908f8b0e',
        Name: 'Hermann Lowe',
      },
    ],
    CreatedAt: '1993-11-12T00:55:44.438198299Z',
    ID: 'd7e00994-75e6-48f1-b778-e5d31ead7136',
    Title: 'Ten FIDY',
    UpdatedAt: '1946-04-15T06:09:44.564202073Z',
    Version: '5.1.15',
  },
  {
    Attachments: ['Bock', 'English Pale Ale', 'Wood-aged Beer', 'Belgian And French Ale'],
    Contributors: [
      {
        ID: 'de30f704-1102-40f4-8517-a0361378370c',
        Name: 'Velda Watsica',
      },
      {
        ID: 'f65b8ce0-1276-4a07-899c-a41387c9360c',
        Name: 'Helmer Hauck',
      },
    ],
    CreatedAt: '2007-12-11T02:35:33.701912202Z',
    ID: 'fe6ad6ed-a5bd-480b-8688-fd3652b2a6d9',
    Title: 'Orval Trappist Ale',
    UpdatedAt: '1972-01-02T13:12:29.948799707Z',
    Version: '1.3.1',
  },
  {
    Attachments: ['Belgian And French Ale', 'Belgian Strong Ale', 'Stout'],
    Contributors: [
      {
        ID: '2f0a9b3f-4f3d-4b7b-8f2e-5f9d8d9c1b4f',
        Name: 'Mariane Kiehn',
      },
      {
        ID: '9c0b8f8b-5b0f-4a2e-8b4f-1e0b8a0b5e0e',
        Name: 'Lavon Kessler',
      },
    ],
    CreatedAt: '2006-11-15T10:00:31.104715597Z',
    ID: 'f6e2a4a6-3c3e-4b8c-8f0c-7e7d8f9c1b4f',
    Title: 'Bourbon County Brand Stout',
    UpdatedAt: '1912-06-07T11:12:21.635724657Z',
    Version: '2.3.2',
  },
];

export class MockDocumentRepository implements DocumentRepository {
  async getDocuments(): Promise<Document[] | Error> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return fakeResponse.map(this.mapToDomain);
    } catch (error) {
      console.error(error);
      return new Error('Failed to fetch documents');
    }
  }

  private mapToDomain(doc: DocumentResponse): Document {
    const documentProperties: DocumentProperties = {
      id: doc.ID,
      name: doc.Title,
      contributors: doc.Contributors.map((contributor) =>
        DocumentContributor.createFromProperties(contributor.ID, contributor.Name)
      ),
      version: doc.Version,
      attachments: doc.Attachments,
      creationDate: new Date(doc.CreatedAt),
    };

    return Document.createFromProperties(documentProperties);
  }
}
