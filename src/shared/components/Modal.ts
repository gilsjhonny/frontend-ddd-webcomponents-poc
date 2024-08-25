export class ModalComponent extends HTMLElement {
  private BASE_CLASS_NAME = 'simple-modal';
  static TEST_IDS = {
    MODAL: 'modal',
    CLOSE_BUTTON: 'close-button',
    CONTENT: 'content',
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * ============================================
   * Private methods
   * ============================================
   */

  private render() {
    this.clearShadowRoot();

    this.shadowRoot?.appendChild(this.createModalElement());
    this.shadowRoot?.appendChild(this.getStyles());
  }

  private createModalElement(): HTMLElement {
    // Main wrapper
    const mainWrapper = document.createElement('div');
    mainWrapper.className = this.BASE_CLASS_NAME;
    mainWrapper.setAttribute('role', 'dialog');

    // Close button (outside the modal content)
    const closeButton = document.createElement('button');
    closeButton.className = `${this.BASE_CLASS_NAME}__close-button`;
    closeButton.textContent = '×';
    closeButton.setAttribute('data-testid', ModalComponent.TEST_IDS.CLOSE_BUTTON);

    // Modal content wrapper
    const modalContent = document.createElement('div');
    modalContent.className = `${this.BASE_CLASS_NAME}__content`;
    modalContent.setAttribute('data-testid', ModalComponent.TEST_IDS.CONTENT);

    // Slot for the title
    const titleSlot = document.createElement('slot');
    titleSlot.name = 'title';

    // Slot for the content
    const slot = document.createElement('slot');
    slot.name = 'content';

    mainWrapper.appendChild(modalContent);
    modalContent.appendChild(titleSlot);
    modalContent.appendChild(slot);
    modalContent.appendChild(closeButton);

    return mainWrapper;
  }

  private getStyles(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = `
    .${this.BASE_CLASS_NAME} {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: none;
        justify-content: center;
        align-items: center;
        background: rgba(128, 128, 128, 0.5);
        z-index: 1000;
    }

    .${this.BASE_CLASS_NAME}__content {
        background: var(--white);
        padding: 40px 20px 20px 30px;
        border-radius: 8px;
        max-width: 600px;
        width: 100%;
        box-shadow: 0 4px 8px var(--gray-400);
        width: 500px;
        position: relative;
    }

    ::slotted([slot='title']) {
        font-size: 1.5rem;
        margin: 0 0 20px 0;
    }

    .${this.BASE_CLASS_NAME}__close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
    }

    .${this.BASE_CLASS_NAME}__close-button:hover {
        color: red;
    }
  `;

    return style;
  }

  private clearShadowRoot() {
    this.shadowRoot!.innerHTML = '';
  }

  private show() {
    const modal = this.shadowRoot?.querySelector(`.${this.BASE_CLASS_NAME}`) as HTMLElement;
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  private hide() {
    const modal = this.shadowRoot?.querySelector(`.${this.BASE_CLASS_NAME}`) as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * ============================================
   * Web Component Lifecycle
   * ============================================
   */

  connectedCallback() {
    this.render();

    // Close button event listener
    const closeButton = this.shadowRoot?.querySelector(`.${this.BASE_CLASS_NAME}__close-button`) as HTMLButtonElement;
    closeButton.addEventListener('click', () => this.hide());
  }

  static get observedAttributes() {
    return ['open'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attributeChangedCallback(name: string, _oldValue: string | null, _newValue: string | null) {
    if (name === 'open') {
      if (this.hasAttribute('open')) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  /**
   * ============================================
   * Setters, Getters and Statics
   * ============================================
   */

  static get componentName() {
    return 'modal-component';
  }
}

export function registerModal() {
  customElements.define(ModalComponent.componentName, ModalComponent);
}
