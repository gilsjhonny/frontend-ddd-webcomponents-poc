import { describe, it, afterEach, beforeEach, expect, vi } from 'vitest';
import { DocumentController } from '../DocumentController';
import { DocumentViewModel } from '../DocumentViewModel';
import { DocumentCardComponent } from './DocumentCard';
import { DocumentListComponent, registerDocumentListComponent } from './DocumentList';
import { Document } from '../../domain/Document';

registerDocumentListComponent();

describe('DocumentListComponent', () => {
  let element: DocumentListComponent;
  let mockLoadDocuments: vi.SpyInstance;

  beforeEach(() => {
    element = document.createElement(DocumentListComponent.componentName) as DocumentListComponent;
    document.body.appendChild(element);

    // Mock the loadDocuments method in DocumentController
    mockLoadDocuments = vi.spyOn(DocumentController.prototype, 'loadDocuments');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    mockLoadDocuments.mockRestore();
  });

  describe('when the component is rendered', () => {
    it('should call refreshDocuments and render the document list', async () => {
      // Mock loadDocuments to return an empty array
      mockLoadDocuments.mockResolvedValueOnce([]);

      await element.refreshDocuments();

      const shadowRoot = element.shadowRoot!;
      const listContainer = shadowRoot.querySelector('.list-container');

      expect(listContainer).toBeInTheDocument();
      expect(mockLoadDocuments).toHaveBeenCalled();
    });

    it('should render documents in grid view when data-view-type is grid', async () => {
      mockLoadDocuments.mockResolvedValueOnce([
        DocumentViewModel.createFromDomain(
          Document.createFromProperties({
            id: '1',
            name: 'Document 1',
            creationDate: new Date(),
            version: '1.0',
            contributors: [],
            attachments: [],
          })
        ),
      ]);

      element.setAttribute('data-view-type', 'grid');
      await element.refreshDocuments();

      const shadowRoot = element.shadowRoot!;
      const listContainer = shadowRoot.querySelector('.list-container');
      const documentCard = shadowRoot.querySelector(DocumentCardComponent.componentName);

      expect(listContainer).toBeInTheDocument();
      expect(listContainer?.nodeName.toLowerCase()).toBe('div');
      expect(documentCard).toBeInTheDocument();
    });

    it('should render documents in list view when data-view-type is list', async () => {
      mockLoadDocuments.mockResolvedValueOnce([
        DocumentViewModel.createFromDomain(
          Document.createFromProperties({
            id: '1',
            name: 'Document 1',
            creationDate: new Date(),
            version: '1.0',
            contributors: [],
            attachments: [],
          })
        ),
      ]);

      element.setAttribute('data-view-type', 'list');
      await element.refreshDocuments();

      const shadowRoot = element.shadowRoot!;
      const listContainer = shadowRoot.querySelector('.list-container');
      const listItem = shadowRoot.querySelector('li');
      const documentCard = shadowRoot.querySelector(DocumentCardComponent.componentName);

      expect(listContainer).toBeInTheDocument();
      expect(listContainer?.nodeName.toLowerCase()).toBe('ul');
      expect(listItem).toBeInTheDocument();
      expect(documentCard).toBeInTheDocument();
    });
  });

  describe('when the data-view-type attribute changes', () => {
    it('should update the view type and re-render', () => {
      const renderSpy = vi.spyOn(element as any, 'render');

      element.setAttribute('data-view-type', 'grid');
      expect(element['viewType']).toBe('grid');
      expect(renderSpy).toHaveBeenCalled();

      element.setAttribute('data-view-type', 'list');
      expect(element['viewType']).toBe('list');
      expect(renderSpy).toHaveBeenCalled();
    });
  });

  describe('when the data-sort-criteria attribute changes', () => {
    it('should update the sort criteria, sort documents, and re-render', async () => {
      const sortSpy = vi.spyOn(DocumentController, 'sortDocuments');
      const renderSpy = vi.spyOn(element as any, 'render');

      mockLoadDocuments.mockResolvedValueOnce([
        DocumentViewModel.createFromDomain(
          Document.createFromProperties({
            id: '1',
            name: 'Document 1',
            creationDate: new Date(),
            version: '1.0',
            contributors: [],
            attachments: [],
          })
        ),
      ]);

      await element.refreshDocuments();

      element.setAttribute('data-sort-criteria', 'version');
      expect(element['sortCriteria']).toBe('version');
      expect(sortSpy).toHaveBeenCalled();
      expect(renderSpy).toHaveBeenCalled();
    });
  });
});
