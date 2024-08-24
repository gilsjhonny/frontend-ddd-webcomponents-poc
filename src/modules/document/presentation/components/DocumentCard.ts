import { DocumentViewModel } from '../DocumentViewModel';

export class DocumentCardComponent extends HTMLElement {
  private readonly BASE_CLASS_NAME = 'document-card';
  private static readonly COMPACT_ATTRIBUTE = 'compact';
  private _documentData: DocumentViewModel | null = null;

  constructor(documentView?: DocumentViewModel) {
    super();
    if (documentView) this._documentData = documentView;
    this.attachShadow({ mode: 'open' });
  }

  /**
   * ============================================
   * Private Methods
   * ============================================
   */

  private render() {
    let container: HTMLDivElement;

    this.clearShadowRoot();

    if (!this._documentData) {
      container = this.createCardWithoutDataElement();
    } else {
      container = this.createCardWithDataElement(this._documentData);
    }

    this.applyStyles();
    this.shadowRoot!.appendChild(container);
  }

  private createCardWithDataElement(documentView: DocumentViewModel): HTMLDivElement {
    const item = document.createElement('div');
    item.className = this.BASE_CLASS_NAME;
    item.innerHTML = `
        <div class="primary-info">
            <h2>${documentView.name}</h2>
            <div role="text" class="version">Version ${documentView.version}</div>
            <div role="text" class="creation-date">Created on ${documentView.formattedCreationDate}</div>
        </div>

        <ul class="contributors-list">
            ${documentView.contributorNames.map((contributor) => `<li>${contributor}</li>`).join('')}
        </ul>

        <ul class="attachments-list">
            ${documentView.attachments.map((attachment) => `<li>${attachment}</li>`).join('')}
        </ul>
    `;

    return item;
  }

  private createCardWithoutDataElement(): HTMLDivElement {
    const item = document.createElement('div');
    item.className = this.BASE_CLASS_NAME;
    item.innerHTML = `<p>No document data</p>`;

    return item;
  }

  private applyStyles() {
    const style = document.createElement('style');
    const isCompact = this.hasAttribute(DocumentCardComponent.COMPACT_ATTRIBUTE);

    style.textContent = `
            .${this.BASE_CLASS_NAME} {
                flex: 1;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 14px;
                padding: 16px;
                display: flex;
                gap: 16px;
                flex-direction: ${isCompact ? 'column' : 'row'};
                align-items: ${isCompact ? 'center' : 'flex-start'};
            }

            .primary-info {
                text-align:  ${!isCompact ? 'left' : 'center'};
                ${!isCompact ? 'flex: 1 1 50%;' : ''}
                min-width: 0;
            }
    
            h2 {
                margin: 0;
            }

            .version {
                font-size: 0.9rem;
                line-height: 1.2rem;
                margin: 0;
            }

            .creation-date {
                font-size: 0.8rem;
                line-height: 1rem;
            }

            .contributors-list,
            .attachments-list {
                list-style: none;
                padding: 0;
                margin-block-start: 0;
                margin-block-end: 0;
                ${!isCompact ? 'flex: 1 1 25%;' : ''}
                min-width: 0;
            }
    
            .contributors-list li,
            .attachments-list li {
                margin: 4px 0;
            }
        `;

    this.shadowRoot!.appendChild(style);
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
  }

  static get observedAttributes() {
    return [DocumentCardComponent.COMPACT_ATTRIBUTE];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === DocumentCardComponent.COMPACT_ATTRIBUTE && oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * ============================================
   * Properties
   * ============================================
   */

  set documentData(documentView: DocumentViewModel) {
    this._documentData = documentView;
    this.render();
  }

  get documentData(): DocumentViewModel | null {
    return this._documentData;
  }

  static get componentName() {
    return 'document-card';
  }
}

export function registerDocumentCardComponent() {
  customElements.define(DocumentCardComponent.componentName, DocumentCardComponent);
}
