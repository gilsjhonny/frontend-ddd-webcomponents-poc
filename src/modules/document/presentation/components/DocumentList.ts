import { DocumentAPI } from '../../infrastructure/DocumentAPI';
import { HttpDocumentRepository } from '../../infrastructure/HttpDocumentRepository';
import { DocumentController } from '../DocumentController';
import { DocumentViewModel } from '../DocumentViewModel';
import { DocumentCardComponent } from './DocumentCard';

export class DocumentListComponent extends HTMLElement {
  private readonly BASE_CLASS_NAME = 'document-list';
  private documentController: DocumentController;
  private viewType: 'grid' | 'list';
  private documentViews: DocumentViewModel[] = [];
  private sortCriteria: 'name' | 'version' | 'creation-date' = 'name';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const viewType = this.dataset.viewType;
    this.viewType = this.isValidViewType(viewType) ? viewType : 'list';
    this.documentController = new DocumentController(new HttpDocumentRepository(DocumentAPI)); // Dependency Injection of MockDocumentRepository for testing
  }

  public async refreshDocuments() {
    const documentViewsOrError = await this.documentController.loadDocuments();

    if (documentViewsOrError instanceof Error) {
      this.renderErrorMessageElement(documentViewsOrError.message);
    } else {
      this.documentViews = documentViewsOrError;
      this.render();
    }
  }

  /**
   * ============================================
   * Private Methods
   * ============================================
   */

  private async initialRender() {
    this.refreshDocuments();
    this.render();
  }

  private async render() {
    this.clearShadowRoot();
    // Main container
    const container = document.createElement('div');

    container.className = this.BASE_CLASS_NAME;
    // List element with all the document cards
    const listElement = this.createListElement(this.documentViews);

    // Top bar with slots for additional content
    const topBar = this.createTopBar();

    // Append styles, slots, and the list
    this.shadowRoot!.appendChild(this.getStyles());
    this.shadowRoot!.appendChild(container);
    container.appendChild(topBar);
    container.appendChild(listElement);
  }

  private createListElement(documentViews: DocumentViewModel[]): HTMLElement {
    const isListView = this.viewType === 'list';
    const listElement = isListView ? document.createElement('ul') : document.createElement('div');
    listElement.className = 'list-container';

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

  private renderErrorMessageElement(message: string) {
    this.shadowRoot!.innerHTML = `<p>Error loading documents: ${message}</p>`;
  }

  private createTopBar(): HTMLElement {
    const topBar = document.createElement('div');
    topBar.className = 'top-bar';
    topBar.innerHTML = `
      <slot name="top-left"></slot>
      <slot name="top-right"></slot>
    `;

    return topBar;
  }

  private getStyles(): HTMLStyleElement {
    const style = document.createElement('style');
    const isGrid = this.viewType === 'grid';

    style.textContent = `
      ${this.BASE_CLASS_NAME} {
        display: flex;
      }

      .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
    
      .list-container {
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
        display: flex;
      }
    `;

    return style;
  }

  private sortBy() {
    this.documentViews = DocumentController.sortDocuments(this.documentViews, this.sortCriteria);
  }

  private clearShadowRoot() {
    this.shadowRoot!.innerHTML = '';
  }

  private isValidViewType(value?: string): value is 'grid' | 'list' {
    return value === 'grid' || value === 'list';
  }

  private isValidSortCriteria(value: string): value is 'name' | 'version' | 'creation-date' {
    return value === 'name' || value === 'version' || value === 'creation-date';
  }

  /**
   * ============================================
   * Web Component Lifecycle
   * ============================================
   */

  connectedCallback() {
    this.initialRender();
  }

  static get observedAttributes() {
    return ['data-view-type', 'data-sort-criteria'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'data-view-type' && oldValue !== newValue) {
      this.viewType = this.isValidViewType(newValue) ? newValue : 'list';
      this.render();
    }

    if (name === 'data-sort-criteria' && oldValue !== newValue) {
      this.sortCriteria = this.isValidSortCriteria(newValue) ? newValue : 'name';
      this.sortBy();
      this.render();
    }
  }

  /**
   * ============================================
   * Setters, Getters and Statics
   * ============================================
   */

  static get componentName() {
    return 'document-list-component';
  }
}

export function registerDocumentListComponent() {
  customElements.define(DocumentListComponent.componentName, DocumentListComponent);
}
