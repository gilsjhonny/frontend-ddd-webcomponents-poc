import { DocumentListComponent } from '../../modules/document/presentation/components/DocumentList';
import { DocumentListToggle } from '../../modules/document/presentation/components/DocumentListToggle';
import { NotificationsComponent } from '../../modules/notification/presentation/components/NotificationsComponent';
import { AddDocumentFormComponent } from '../../modules/document/presentation/components/AddDocumentForm';
import { DocumentProperties } from '../../modules/document/domain/types';
import { DocumentController } from '../../modules/document/presentation/DocumentController';
import { HttpDocumentRepository } from '../../modules/document/infrastructure/HttpDocumentRepository';
import { DocumentAPI } from '../../modules/document/infrastructure/DocumentAPI';
import { ModalComponent } from '../../shared/components/Modal';

export class HomePageComponent extends HTMLElement {
  private listViewType: 'list' | 'grid' = 'list';
  private sortCriteria: 'name' | 'version' | 'creation-date' = 'creation-date';
  private documentController = new DocumentController(new HttpDocumentRepository(DocumentAPI));

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  private displayError(title: string, message: string) {
    console.error(`${title}: ${message}`);
  }

  /**
   * ============================================
   * Private Methods
   * ============================================
   */

  private render() {
    this.clearShadowRoot();

    this.shadowRoot!.innerHTML = `
      ${this.getStyles()}
      <div class="home-page">
          <div class="notifications">
              <${NotificationsComponent.componentName}></${NotificationsComponent.componentName}>
          </div>
          <h1 class="header">Documents</h1>
          <${DocumentListComponent.componentName} data-view-type="${this.listViewType}">
              <div slot="top-left">
                <div class="sort-by">
                  <div>Sort by:</div>
                <custom-select>
                  <option value="name">Name</option>
                  <option value="creation-date">Creation date</option>
                  <option value="version">Version</option>
                </custom-select>
                </div>
              </div>
              <${DocumentListToggle.componentName} slot="top-right" data-view-type="${this.listViewType}"></${DocumentListToggle.componentName}>
          </${DocumentListComponent.componentName}>
          <button class="add-document-button">+ Add document</button>
      </div>
      
      <${ModalComponent.componentName}>
          <h3 slot="title">Add a new document</h3>
          <${AddDocumentFormComponent.componentName} slot="content"></${AddDocumentFormComponent.componentName}>
      </${ModalComponent.componentName}>
    `;
  }

  private getStyles(): string {
    return `
      <style>
        .home-page {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 16px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .notifications {
          margin-bottom: 16px;
          display: flex;
          justify-content: center;
        }

        .add-document-button {
          background-color: var(--gray-100);
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--blue-600);
          height: 90px;
          cursor: pointer;
          margin-top: 26px;
        }

        .sort-by {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }
      </style>
    `;
  }

  private bindEventHandlers() {
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleAddDocumentClick = this.handleAddDocumentClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleDocumentSubmission = this.handleDocumentSubmission.bind(this);
    this.handleSortCriteriaChange = this.handleSortCriteriaChange.bind(this);

    const shadowRoot = this.shadowRoot!;
    shadowRoot.addEventListener('toggle-view', this.handleToggleView as EventListener);
    shadowRoot.addEventListener('document-submitted', (event) => this.handleDocumentSubmission(event as CustomEvent));
    shadowRoot.querySelector('.add-document-button')?.addEventListener('click', this.handleAddDocumentClick);
    shadowRoot
      .querySelector('custom-select')
      ?.addEventListener('onchange', this.handleSortCriteriaChange as EventListener);
  }

  private unbindEventHandlers() {
    const shadowRoot = this.shadowRoot!;
    shadowRoot.removeEventListener('toggle-view', this.handleToggleView);
    shadowRoot.querySelector('.add-document-button')?.removeEventListener('click', this.handleAddDocumentClick);
    shadowRoot
      .querySelector('custom-select')
      ?.removeEventListener('onchange', this.handleSortCriteriaChange as EventListener);
  }

  private handleToggleView(event: Event) {
    const viewType = (event as CustomEvent).detail.view;
    this.listViewType = viewType;
    this.updateDocumentListAndToggle();
  }

  private handleSortCriteriaChange(event: CustomEvent) {
    this.sortCriteria = event.detail.value as 'name' | 'version' | 'creation-date';
    const documentList = this.shadowRoot!.querySelector<DocumentListComponent>(DocumentListComponent.componentName);
    documentList?.setAttribute('data-sort-criteria', this.sortCriteria);
  }

  private async handleDocumentSubmission(event: CustomEvent) {
    const documentData = event.detail as DocumentProperties;
    const result = await this.documentController.createDocument(documentData);

    if (result instanceof Error) {
      this.displayError('Failed to create document', result.message);
    } else {
      this.handleModalClose();
      this.refreshDocumentList();
    }
  }

  private handleAddDocumentClick() {
    const modal = this.shadowRoot!.querySelector(ModalComponent.componentName);
    modal?.setAttribute('open', '');
  }

  private handleModalClose() {
    const modal = this.shadowRoot!.querySelector(ModalComponent.componentName);
    modal?.removeAttribute('open');
  }

  private updateSelectValue() {
    const select = this.shadowRoot!.querySelector('select');
    if (select) {
      select.value = this.sortCriteria;
    }
  }

  private async refreshDocumentList() {
    const documentList = this.shadowRoot!.querySelector<DocumentListComponent>(DocumentListComponent.componentName);
    await documentList?.refreshDocuments();
  }

  private updateDocumentListAndToggle() {
    const documentList = this.shadowRoot!.querySelector<DocumentListComponent>(DocumentListComponent.componentName);
    const documentToggle = this.shadowRoot!.querySelector<DocumentListToggle>(DocumentListToggle.componentName);

    documentList?.setAttribute('data-view-type', this.listViewType);
    documentToggle?.setAttribute('data-view-type', this.listViewType);
  }

  private clearShadowRoot() {
    this.shadowRoot!.innerHTML = '';
  }

  /**
   * ============================================
   * Web Component Lifecycle
   * ============================================
   */

  connectedCallback() {
    this.render();
    this.bindEventHandlers();
    this.updateSelectValue();
  }

  disconnectedCallback() {
    this.unbindEventHandlers();
  }

  static get componentName() {
    return 'home-page-component';
  }
}

export function registerHomePageComponent() {
  customElements.define(HomePageComponent.componentName, HomePageComponent);
}
