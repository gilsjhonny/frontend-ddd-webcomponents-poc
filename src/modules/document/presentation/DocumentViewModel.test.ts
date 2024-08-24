import { describe, it, expect } from 'vitest';
import { Document } from '../domain/Document';
import { DocumentProperties } from '../domain/types';
import { DocumentViewModel } from './DocumentViewModel';
import { DocumentContributor } from '../domain/valueObjects/DocumentContributor';

const mockProperties: DocumentProperties = {
  id: '1',
  name: 'Document Name',
  creationDate: new Date(),
  version: '1.0.0',
  contributors: [DocumentContributor.createFromProperties('1', 'Jane Doe')],
  attachments: ['Attachment 1', 'Attachment 2'],
};

describe('DocumentView', () => {
  it('should format the creation date', () => {
    const document = Document.createFromProperties(mockProperties);
    const documentView = DocumentViewModel.createFromDomain(document);

    expect(documentView.formattedCreationDate).toBe(
      document.getCreationDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  });

  it('should get the contributor names', () => {
    const document = Document.createFromProperties(mockProperties);
    const documentView = DocumentViewModel.createFromDomain(document);

    expect(documentView.contributorNames).toHaveLength(1);
    expect(documentView.contributorNames[0]).toBe('Jane Doe');
  });

  it('should get the document id', () => {
    const document = Document.createFromProperties(mockProperties);
    const documentView = DocumentViewModel.createFromDomain(document);

    expect(documentView.id).toBe(document.getId());
  });

  it('should get the document name', () => {
    const document = Document.createFromProperties(mockProperties);
    const documentView = DocumentViewModel.createFromDomain(document);

    expect(documentView.name).toBe(document.getName());
  });

  it('should get the document version', () => {
    const document = Document.createFromProperties(mockProperties);
    const documentView = DocumentViewModel.createFromDomain(document);

    expect(documentView.version).toBe(document.getVersion());
  });

  it('should get the document attachments', () => {
    const document = Document.createFromProperties(mockProperties);
    const documentView = DocumentViewModel.createFromDomain(document);

    expect(documentView.attachments).toHaveLength(2);
    expect(documentView.attachments).toEqual(['Attachment 1', 'Attachment 2']);
  });
});
