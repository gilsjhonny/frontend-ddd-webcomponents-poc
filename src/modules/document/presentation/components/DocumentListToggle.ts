export class DocumentListToggle extends HTMLElement {
  private selectedView: 'list' | 'grid' = 'list';

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
    if (!this.shadowRoot!.innerHTML) {
      this.shadowRoot!.innerHTML = `
          <style>
            button {
              background: none;
              border: none;
              cursor: pointer;
            }
          </style>
          <div>
              <button class="list-button"><list-icon></list-icon></button>
              <button class="grid-button"><grid-icon></grid-icon></button>
          </div>
        `;
    }
    this.updateButtonStyles();
  }

  private updateButtonStyles() {
    const isListView = this.selectedView === 'list';

    const listButton = this.shadowRoot!.querySelector('.list-button') as HTMLElement;
    const gridButton = this.shadowRoot!.querySelector('.grid-button') as HTMLElement;

    if (listButton) {
      listButton.style.color = isListView ? 'var(--black)' : 'var(--gray-400)';
    }

    if (gridButton) {
      gridButton.style.color = !isListView ? 'var(--black)' : 'var(--gray-400)';
    }
  }

  private toggleView(view: 'list' | 'grid') {
    this.selectedView = view;
    this.updateButtonStyles();

    const newEvent = new CustomEvent('toggle-view', {
      detail: { view },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(newEvent);
  }

  /**
   * ============================================
   * Web Component Lifecycle
   * ============================================
   */

  connectedCallback() {
    this.render();

    this.shadowRoot!.querySelector('.list-button')?.addEventListener('click', () => this.toggleView('list'));
    this.shadowRoot!.querySelector('.grid-button')?.addEventListener('click', () => this.toggleView('grid'));
  }

  disconnectedCallback() {
    this.shadowRoot!.querySelector('.list-button')?.removeEventListener('click', () => this.toggleView('list'));
    this.shadowRoot!.querySelector('.grid-button')?.removeEventListener('click', () => this.toggleView('grid'));
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'data-view-type' && newValue !== oldValue) {
      this.selectedView = newValue === 'grid' ? 'grid' : 'list';
      this.updateButtonStyles();
    }
  }

  /**
   * ============================================
   * Setters, Getters and Statics
   * ============================================
   */

  static get observedAttributes() {
    return ['data-view-type'];
  }

  static get componentName() {
    return 'document-list-toggle';
  }
}

export function registerDocumentListToggle() {
  customElements.define(DocumentListToggle.componentName, DocumentListToggle);
}
