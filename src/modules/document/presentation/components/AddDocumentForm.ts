import { DocumentProperties } from '../../domain/types';
import { DocumentContributor } from '../../domain/valueObjects/DocumentContributor';

export class AddDocumentFormComponent extends HTMLElement {
  private documentData: {
    name: DocumentProperties['name'];
    contributors: DocumentContributor[];
    version: DocumentProperties['version'];
    attachments: DocumentProperties['attachments'];
  } = {
    name: '',
    contributors: [],
    version: '',
    attachments: [],
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * ============================================
   * Private Methods
   * ============================================
   */

  private render() {
    this.clearShadowRoot();

    this.shadowRoot!.appendChild(this.createFormElement());
    this.shadowRoot!.appendChild(this.getStyles());
  }

  private createFormElement(): HTMLFormElement {
    const form = document.createElement('form');

    form.innerHTML = `
      <form>
        <div class="form-group">
          <label for="name">Document Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div class="form-group">
          <label for="version">Version</label>
          <input type="text" id="version" name="version" required />
        </div>
        <div class="form-group">
          <label for="contributors">Contributors (format: id1:name1, id2:name2)</label>
          <input type="text" id="contributors" name="contributors" />
        </div>
        <div class="form-group">
          <label for="attachments">Attachments (comma-separated)</label>
          <input type="text" id="attachments" name="attachments" />
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-button" disabled>Create Document</button>
        </div>
      </form>
    `;

    return form;
  }

  private getStyles(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = `
      .form-group {
        margin-bottom: 16px;
      }
      .form-group label {
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
        font-size: 0.9rem;
        color: var(--black);
      }
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
      }
      .form-group input {
        height: 45px;
        border: 1px solid var(--gray-200);
        border-radius: 4px;  
      }
      .form-group input:focus {
        outline: 1px solid var(--blue-600);
      }
      .form-actions {
        margin-top: 20px;
        text-align: right;
      }
      .submit-button {
        padding: 10px 20px;
        background-color: var(--blue-600);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 6px;
      }
      .submit-button:disabled {
        background-color: var(--gray-300);
        cursor: not-allowed;
      }
    `;

    return style;
  }

  private handleSubmit(event: Event) {
    event.preventDefault();

    const cEvent = new CustomEvent('document-submitted', {
      detail: this.getDocumentData(),
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(cEvent);
  }
  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;

    switch (name) {
      case 'name':
        this.documentData.name = value;
        break;
      case 'contributors': {
        const contributors = value
          .split(',')
          .map((contributor) => {
            const [id, name] = contributor.split(':').map((part) => part.trim());
            if (id && name) {
              return DocumentContributor.createFromProperties(id, name);
            } else {
              console.error(`Invalid contributor format: "${contributor}"`);
              return null;
            }
          })
          .filter((contributor) => contributor !== null) as DocumentContributor[];
        this.documentData.contributors = contributors;
        break;
      }
      case 'version':
        this.documentData.version = value;
        break;
      case 'attachments':
        this.documentData.attachments = value.split(',').map((attachment) => attachment.trim());
        break;
    }

    this.updateSubmitButtonState();
  }

  private updateSubmitButtonState() {
    const submitButton = this.shadowRoot!.querySelector('.submit-button') as HTMLButtonElement;
    const isNameValid = this.documentData.name.trim() !== '';

    submitButton.disabled = !isNameValid;
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
    this.attachEventListeners();
  }

  private attachEventListeners() {
    const form = this.shadowRoot!.querySelector('form');
    form?.addEventListener('input', this.handleInputChange.bind(this));
    form?.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * ============================================
   * Setters, Getters and Statics
   * ============================================
   */

  getDocumentData() {
    return this.documentData;
  }

  static get componentName() {
    return 'document-form-component';
  }
}

export function registerAddDocumentFormComponent() {
  customElements.define(AddDocumentFormComponent.componentName, AddDocumentFormComponent);
}
