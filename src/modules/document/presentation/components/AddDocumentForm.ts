import { DocumentContributor } from '../../domain/valueObjects/DocumentContributor';

export class AddDocumentFormComponent extends HTMLElement {
  private documentData: {
    id: string;
    name: string;
    contributors: DocumentContributor[];
    version: string;
    attachments: string[];
    creationDate: Date;
  } = {
    id: '',
    name: '',
    contributors: [],
    version: '',
    attachments: [],
    creationDate: new Date(),
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  private attachEventListeners() {
    const form = this.shadowRoot!.querySelector('form');
    form?.addEventListener('input', this.handleInputChange.bind(this));
    form?.addEventListener('submit', this.handleSubmit.bind(this));
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
      case 'id':
        this.documentData.id = value;
        break;
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
      case 'creationDate':
        this.documentData.creationDate = new Date(value);
        break;
    }
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        h2 {
            margin: 0 0 20px 0;
        }
        .form-group {
          margin-bottom: 10px;
        }
        .form-group label {
          display: block;
          margin-bottom: 4px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
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
          font-size: 16px;
          border-radius: 4px;
        }
      </style>
      <form>
        <div class="form-group">
          <label for="id">Document ID</label>
          <input type="text" id="id" name="id" required />
        </div>
        <div class="form-group">
          <label for="name">Document Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div class="form-group">
          <label for="contributors">Contributors (format: id1:name1, id2:name2)</label>
          <input type="text" id="contributors" name="contributors" />
        </div>
        <div class="form-group">
          <label for="version">Version</label>
          <input type="text" id="version" name="version" required />
        </div>
        <div class="form-group">
          <label for="attachments">Attachments (comma-separated)</label>
          <input type="text" id="attachments" name="attachments" />
        </div>
        <div class="form-group">
          <label for="creationDate">Creation Date</label>
          <input type="date" id="creationDate" name="creationDate" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-button">Create Document</button>
        </div>
      </form>
    `;
  }

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
