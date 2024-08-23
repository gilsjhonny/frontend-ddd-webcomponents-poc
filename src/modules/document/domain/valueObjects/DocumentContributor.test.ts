// tests/DocumentContributor.test.ts

import { describe, it, expect } from 'vitest';
import { DocumentContributor } from './DocumentContributor';

describe('DocumentContributor', () => {
  it('should create a instance with valid properties', () => {
    const contributor = DocumentContributor.createFromProperties('123', 'John Doe');

    expect(contributor).toBeInstanceOf(DocumentContributor);
    expect(contributor.getId()).toBe('123');
    expect(contributor.getName()).toBe('John Doe');
  });

  describe('when creating with an invalid id', () => {
    it('should throw an error if id is missing', () => {
      expect(() => DocumentContributor.createFromProperties('', 'John Doe')).toThrow(
        'DocumentContributor must have a valid id.'
      );
    });

    it('should throw an error if id is null or undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => DocumentContributor.createFromProperties(null as any, 'John Doe')).toThrow(
        'DocumentContributor must have a valid id.'
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => DocumentContributor.createFromProperties(undefined as any, 'John Doe')).toThrow(
        'DocumentContributor must have a valid id.'
      );
    });

    it('should throw an error if id is only whitespace', () => {
      expect(() => DocumentContributor.createFromProperties('   ', 'John Doe')).toThrow(
        'DocumentContributor must have a valid id.'
      );
    });
  });

  describe('when creating with an invalid name', () => {
    it('should throw an error if name is missing', () => {
      expect(() => DocumentContributor.createFromProperties('123', '')).toThrow(
        'DocumentContributor must have a valid name.'
      );
    });

    it('should throw an error if name is null or undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => DocumentContributor.createFromProperties('123', null as any)).toThrow(
        'DocumentContributor must have a valid name.'
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => DocumentContributor.createFromProperties('123', undefined as any)).toThrow(
        'DocumentContributor must have a valid name.'
      );
    });

    it('should throw an error if name is only whitespace', () => {
      expect(() => DocumentContributor.createFromProperties('123', '   ')).toThrow(
        'DocumentContributor must have a valid name.'
      );
    });
  });

  describe('equals method', () => {
    it('should return true when IDs match', () => {
      const contributor1 = DocumentContributor.createFromProperties('123', 'John Doe');
      const contributor2 = DocumentContributor.createFromProperties('123', 'Jane Doe');

      expect(contributor1.equals(contributor2)).toBe(true);
    });

    it('should return false when IDs do not match', () => {
      const contributor1 = DocumentContributor.createFromProperties('123', 'John Doe');
      const contributor2 = DocumentContributor.createFromProperties('456', 'Jane Doe');

      expect(contributor1.equals(contributor2)).toBe(false);
    });
  });

  describe('toDTO method', () => {
    it('should return a DTO with the contributor properties', () => {
      const contributor = DocumentContributor.createFromProperties('123', 'John Doe');
      const dto = contributor.toDTO();

      expect(dto).toEqual({
        id: '123',
        name: 'John Doe',
      });
    });

    it('should return a plain object, not an instance of DocumentContributor', () => {
      const contributor = DocumentContributor.createFromProperties('123', 'John Doe');
      const dto = contributor.toDTO();

      expect(dto).not.toBeInstanceOf(DocumentContributor);
    });
  });
});
