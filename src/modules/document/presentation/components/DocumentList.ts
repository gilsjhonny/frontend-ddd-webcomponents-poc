import { MockDocumentRepository } from '../../infrastructure/MockDocumentRepository';
import { DocumentController } from '../DocumentController';
import { DocumentViewModel } from '../DocumentViewModel';
import { DocumentCardComponent } from './DocumentCard';

export class DocumentListComponent extends HTMLElement {
  private readonly BASE_CLASS_NAME = 'document-list';
  private documentController: DocumentController;
  private viewType: 'grid' | 'list';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const viewType = this.dataset.viewType;
    this.viewType = this.isValidViewType(viewType) ? viewType : 'list';
    this.documentController = new DocumentController(new MockDocumentRepository()); // Dependency Injection of MockDocumentRepository for testing
  }

  /**
   * ============================================
   * Private Methods
   * ============================================
   */

  private async render() {
    const documentViewsOrError = await this.documentController.loadDocuments();

    this.clearShadowRoot();

    if (documentViewsOrError instanceof Error) {
      this.createErrorMessageElement(documentViewsOrError.message);
      return;
    }

    const listElement = this.createListElement(documentViewsOrError);

    this.applyStyles();

    this.shadowRoot!.appendChild(listElement);
  }

  private createListElement(documentViews: DocumentViewModel[]): HTMLElement {
    const isListView = this.viewType === 'list';
    const listElement = isListView ? document.createElement('ul') : document.createElement('div');
    listElement.className = this.BASE_CLASS_NAME;

    documentViews.forEach((documentView) => {
      const documentCard = document.createElement(DocumentCardComponent.componentName) as DocumentCardComponent;
      documentCard.documentData = documentView;
      if (!isListView) documentCard.setAttribute('compact', '');

      if (isListView) {
        const listItem = document.createElement('li');
        listItem.appendChild(documentCard);
        listElement.appendChild(listItem);
      } else {
        listElement.appendChild(documentCard);
      }
    });

    return listElement;
  }

  private createErrorMessageElement(message: string) {
    this.shadowRoot!.innerHTML = `<p>Error loading documents: ${message}</p>`;
  }

  private applyStyles() {
    const style = document.createElement('style');
    const isGrid = this.viewType === 'grid';

    style.textContent = `
      .${this.BASE_CLASS_NAME} {
        display: ${isGrid ? 'grid' : 'flex'};
        margin: 0;
        margin-block-start: 0;
        padding-inline-start: 0;

        /* Additional styles for grid view */
        ${isGrid ? 'grid-template-columns: repeat(3, 1fr);' : ''}
        ${isGrid ? 'align-items: stretch;' : ''}
        ${isGrid ? 'align-items: stretch;' : ''}
        ${isGrid ? 'gap: 16px;' : ''}

        /* Additional styles for list view */
        ${!isGrid ? 'flex-direction: column;' : ''}
        ${!isGrid ? 'gap: 16px;' : ''}
        ${!isGrid ? 'list-style-type: none;' : ''}
      }

      ${DocumentCardComponent.componentName} {
        ${isGrid ? 'display: flex;' : ''}
      }
      ${DocumentCardComponent.componentName} > div {
        ${isGrid ? 'flex: 1;' : ''}
      }
    `;
    this.shadowRoot!.appendChild(style);
  }

  private clearShadowRoot() {
    this.shadowRoot!.innerHTML = '';
  }

  private isValidViewType(value?: string): value is 'grid' | 'list' {
    return value === 'grid' || value === 'list';
  }

  /**
   * ============================================
   * Web Component Lifecycle
   * ============================================
   */

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['data-view-type'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'data-view-type' && oldValue !== newValue) {
      this.viewType = this.isValidViewType(newValue) ? newValue : 'list';
      this.render();
    }
  }

  static get componentName() {
    return 'document-list-component';
  }
}

export function registerDocumentListComponent() {
  customElements.define(DocumentListComponent.componentName, DocumentListComponent);
}
