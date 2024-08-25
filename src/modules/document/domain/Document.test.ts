import { describe, it, expect } from 'vitest';
import { DocumentContributor } from './valueObjects/DocumentContributor';
import { Document } from './Document';
import { DocumentProperties } from './types';
import { DocumentException } from './exceptions/DocumentException';
import { DocumentErrors } from './exceptions/DocumentError';

describe('Document', () => {
  const mockProperties: DocumentProperties = {
    id: '123',
    name: 'Test Document',
    contributors: [],
    version: '1.0',
    attachments: [],
    creationDate: new Date(),
  };

  it('should create a Document instance with valid properties', () => {
    const document = Document.createFromProperties(mockProperties);

    expect(document).toBeInstanceOf(Document);
    expect(document.getId()).toBe('123');
    expect(document.getName()).toBe('Test Document');
    expect(document.getVersion()).toBe('1.0');
    expect(document.getAttachments()).toEqual([]);
    expect(document.getCreationDate()).toEqual(mockProperties.creationDate);
    expect(document.getContributors()).toEqual([]);
  });

  describe('when creating with no id', () => {
    it('should create a Document instance with valid properties and generate a unique ID', () => {
      const document = Document.createFromProperties({ ...mockProperties, id: undefined });

      expect(document).toBeInstanceOf(Document);
      expect(document.getId()).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
      expect(document.getName()).toBe('Test Document');
      expect(document.getVersion()).toBe('1.0');
      expect(document.getAttachments()).toEqual([]);
      expect(document.getCreationDate()).toEqual(mockProperties.creationDate);
      expect(document.getContributors()).toEqual([]);
    });
  });

  describe('when creating with an invalid name', () => {
    it('should throw a DocumentException if name is missing or empty', () => {
      const invalidProperties = { ...mockProperties, name: '' };

      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentException);
      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentErrors.INVALID_NAME);
    });

    it('should throw a DocumentException if name is only whitespace', () => {
      const invalidProperties = { ...mockProperties, name: '   ' };

      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentException);
      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentErrors.INVALID_NAME);
    });

    it('should throw a DocumentException if name is null or undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let invalidProperties = { ...mockProperties, name: undefined as any };

      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentException);
      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentErrors.INVALID_NAME);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invalidProperties = { ...mockProperties, name: null as any };

      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentException);
      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentErrors.INVALID_NAME);
    });
  });

  describe('when creating with no creation date', () => {
    it('should create a Document instance with valid properties and generate a creation date', () => {
      const document = Document.createFromProperties({ ...mockProperties, creationDate: undefined });

      expect(document).toBeInstanceOf(Document);
      expect(document.getId()).toBe('123');
      expect(document.getName()).toBe('Test Document');
      expect(document.getVersion()).toBe('1.0');
      expect(document.getAttachments()).toEqual([]);
      expect(document.getCreationDate()).toBeInstanceOf(Date);
      expect(document.getContributors()).toEqual([]);
    });
  });

  describe('when creating with an invalid version', () => {
    it('should throw a DocumentException if version is missing', () => {
      const invalidProperties = { ...mockProperties, version: '' };

      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentException);
      expect(() => Document.createFromProperties(invalidProperties)).toThrow(DocumentErrors.INVALID_VERSION);
    });
  });

  describe('when adding a contributor', () => {
    const mockContributor = DocumentContributor.createFromProperties('456', 'John Doe');

    it('should add a contributor if not already present', () => {
      const document = Document.createFromProperties(mockProperties);

      document.addContributor(mockContributor);

      expect(document.getContributors().length).toBe(1);
      expect(document.getContributors()[0]).toEqual(mockContributor.toDTO());
    });

    it('should not add a duplicate contributor', () => {
      const document = Document.createFromProperties(mockProperties);

      document.addContributor(mockContributor);
      document.addContributor(mockContributor);

      expect(document.getContributors().length).toBe(1);
    });
  });

  describe('when adding an attachment', () => {
    it('should add an attachment', () => {
      const document = Document.createFromProperties(mockProperties);
      const attachment = 'file.pdf';

      document.addAttachment(attachment);

      expect(document.getAttachments()).toContain(attachment);
    });

    it('should throw an exception if attachment is missing', () => {
      const document = Document.createFromProperties(mockProperties);

      expect(() => document.addAttachment('')).toThrow(DocumentException);
      expect(() => document.addAttachment('')).toThrow(DocumentErrors.EMPTY_ATTACHMENT);
    });
  });
});
