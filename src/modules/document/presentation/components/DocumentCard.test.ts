import { describe, it, afterEach, beforeEach, expect } from 'vitest';
import { DocumentCardComponent, registerDocumentCardComponent } from './DocumentCard';
import { DocumentViewModel } from '../DocumentViewModel';
import { Document } from '../../domain/Document';
import { DocumentContributor } from '../../domain/valueObjects/DocumentContributor';
import { getByTextFromShadowRoot } from '../../../../tests/shadow-dom-utils';

registerDocumentCardComponent();

describe('DocumentCardComponent', () => {
  let element: DocumentCardComponent;
  const documentView = DocumentViewModel.createFromDomain(
    Document.createFromProperties({
      id: '1',
      name: 'Document',
      creationDate: new Date('2021-01-01'),
      version: '1.0',
      contributors: [DocumentContributor.createFromProperties('1', 'John Doe')],
      attachments: ['attachment1', 'attachment2'],
    })
  );

  beforeEach(() => {
    element = document.createElement(DocumentCardComponent.componentName) as DocumentCardComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when compact attribute is not applied', () => {
    describe('when no document data is provided', () => {
      it('should render with no document data', () => {
        expect(getByTextFromShadowRoot(element.shadowRoot!, 'No document data')).toBeInTheDocument();
      });
    });

    describe('when document data is provided', () => {
      beforeEach(() => {
        element.documentData = documentView;
      });

      it('should render with document data', () => {
        const shadowRoot = element.shadowRoot!;

        expect(getByTextFromShadowRoot(shadowRoot, 'Document')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, 'Version 1.0')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, 'John Doe')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, 'attachment1')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, 'attachment2')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, documentView?.creationDateHumanized(), false)).toBeInTheDocument();
      });
    });
  });

  describe('when compact attribute is applied', () => {
    describe('when no document data is provided', () => {
      beforeEach(() => {
        element.setAttribute('compact', '');
      });

      it('should render with no document data', () => {
        expect(getByTextFromShadowRoot(element.shadowRoot!, 'No document data')).toBeInTheDocument();
      });
    });

    describe('when document data is provided', () => {
      beforeEach(() => {
        element.setAttribute('compact', '');
        element.documentData = documentView;
      });

      it('should render with document data', () => {
        const shadowRoot = element.shadowRoot!;

        expect(getByTextFromShadowRoot(shadowRoot, 'Document')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, 'Version 1.0')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, 'John Doe')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, 'attachment1')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, 'attachment2')).toBeInTheDocument();
        expect(getByTextFromShadowRoot(shadowRoot, documentView.creationDateHumanized(), false)).toBeInTheDocument();
      });
    });
  });

  describe('when accessing the documentData property', () => {
    it('should return the document view model when set', () => {
      element.documentData = documentView;

      expect(element.documentData).toEqual(documentView);
    });

    it('should return null when not set', () => {
      expect(element.documentData).toBeNull();
    });
  });
});
