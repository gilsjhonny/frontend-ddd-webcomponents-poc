import { describe, it, expect, beforeEach } from 'vitest';
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

describe('DocumentViewModel', () => {
  let document: Document;
  let documentView: DocumentViewModel;

  beforeEach(() => {
    document = Document.createFromProperties(mockProperties);
    documentView = DocumentViewModel.createFromDomain(document);
  });

  describe('Formatted Creation Date', () => {
    it('should format the creation date', () => {
      expect(documentView.formattedCreationDate).toBe(
        document.getCreationDate()?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    });
  });

  describe('Contributor Names', () => {
    it('should get the contributor names', () => {
      expect(documentView.contributorNames).toHaveLength(1);
      expect(documentView.contributorNames[0]).toBe('Jane Doe');
    });
  });

  describe('Document Properties', () => {
    it('should get the document id', () => {
      expect(documentView.id).toBe(document.getId());
    });

    it('should get the document name', () => {
      expect(documentView.name).toBe(document.getName());
    });

    it('should get the document version', () => {
      expect(documentView.version).toBe(document.getVersion());
    });

    it('should get the document attachments', () => {
      expect(documentView.attachments).toHaveLength(2);
      expect(documentView.attachments).toEqual(['Attachment 1', 'Attachment 2']);
    });
  });
});
