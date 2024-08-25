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
  private listViewType: 'list' | 'grid';
  private sortCriteria: 'name' | 'version' | 'creation-date' = 'creation-date';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.listViewType = 'list';
  }

  connectedCallback() {
    this.render();

    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleAddDocumentClick = this.handleAddDocumentClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleDocumentSubmission = this.handleDocumentSubmission.bind(this);
    this.handleSortCriteriaChange = this.handleSortCriteriaChange.bind(this);

    this.shadowRoot!.addEventListener('toggle-view', this.handleToggleView);
    this.shadowRoot!.addEventListener('document-submitted', this.handleDocumentSubmission);
    this.shadowRoot!.querySelector('.add-document-button')?.addEventListener('click', this.handleAddDocumentClick);
    this.shadowRoot!.querySelector('select')?.addEventListener('change', this.handleSortCriteriaChange);

    this.updateSelectValue();
  }

  disconnectedCallback() {
    this.shadowRoot!.removeEventListener('toggle-view', this.handleToggleView);
    this.shadowRoot!.querySelector('.add-document-button')?.removeEventListener('click', this.handleAddDocumentClick);
  }

  private handleToggleView(event: Event) {
    const customEvent = event as CustomEvent;
    const viewType = customEvent.detail.view;
    this.listViewType = viewType;

    const documentList = this.shadowRoot!.querySelector<DocumentListComponent>(DocumentListComponent.componentName);
    const documentToggle = this.shadowRoot!.querySelector<DocumentListToggle>(DocumentListToggle.componentName);

    if (documentList) {
      documentList.setAttribute('data-view-type', this.listViewType);
    }

    if (documentToggle) {
      documentToggle.setAttribute('data-view-type', this.listViewType);
    }
  }

  private handleSortCriteriaChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortCriteria = select.value as 'name' | 'version' | 'creation-date';

    console.log('Sort criteria:', this.sortCriteria);
    const documentList = this.shadowRoot!.querySelector<DocumentListComponent>(DocumentListComponent.componentName);
    documentList?.setAttribute('data-sort-criteria', this.sortCriteria);
  }

  private async handleDocumentSubmission(event: CustomEvent) {
    const documentData = event.detail as DocumentProperties;

    const documentController = new DocumentController(new HttpDocumentRepository(DocumentAPI));
    const result = await documentController.createDocument(documentData);

    if (result instanceof Error) {
      console.error('Failed to create document:', result.message);
    } else {
      console.log('Document created successfully:', result);
      this.handleModalClose(); // Close the modal after creating the document

      // Refresh the document list
      const documentList = this.shadowRoot!.querySelector<DocumentListComponent>(DocumentListComponent.componentName);
      await documentList?.refreshDocuments();
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

  private render() {
    this.clearShadowRoot();

    this.shadowRoot!.innerHTML = `
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
        </style>
  
        <div class="home-page">
            <div class="notifications">
                <${NotificationsComponent.componentName}></${NotificationsComponent.componentName}>
            </div>
            <h1 class="header">Documents</h1>
            <${DocumentListComponent.componentName} data-view-type="${this.listViewType}">
                <div slot="top-left">
                  <div>
                    <div>Sort by:</div>
                    <select name="sort-criteria" value="${this.sortCriteria}">
                      <option value="name">Name</option>
                      <option value="version">Version</option>
                      <option value="creation-date">Creation Date</option>
                    </select>
                  </div>
                </div>
                <${DocumentListToggle.componentName} slot="top-right" data-view-type="${this.listViewType}"></${DocumentListToggle.componentName}>
            </${DocumentListComponent.componentName}>
            <button class="add-document-button">+ Add document</button>
        </div>
        
        <${ModalComponent.componentName}>
            <${AddDocumentFormComponent.componentName}></${AddDocumentFormComponent.componentName}>
        </${ModalComponent.componentName}>
      `;

    this.shadowRoot!.querySelector('.close-modal-button')?.addEventListener('click', this.handleModalClose);
  }

  private clearShadowRoot() {
    this.shadowRoot!.innerHTML = '';
  }

  static get componentName() {
    return 'home-page-component';
  }
}

export function registerHomePageComponent() {
  customElements.define(HomePageComponent.componentName, HomePageComponent);
}
