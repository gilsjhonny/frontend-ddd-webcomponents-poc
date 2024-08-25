export class SelectComponent extends HTMLElement {
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
    this.shadowRoot!.appendChild(this.createSelect());
    this.shadowRoot!.appendChild(this.getStyles());

    this.initializeOptions();
  }

  private createSelect(): HTMLElement {
    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'select-wrapper';

    // Create the select box
    const selectBox = document.createElement('div');
    selectBox.className = 'select-box';

    // Create the selected value
    const selectedValue = document.createElement('span');
    selectedValue.className = 'selected-value';
    selectedValue.textContent = 'Select one...';
    selectBox.appendChild(selectedValue);

    // Caret Down Icon
    const caretDownIcon = document.createElement('caret-down-icon');
    caretDownIcon.setAttribute('width', '12px');
    caretDownIcon.setAttribute('height', '12px');
    selectBox.appendChild(caretDownIcon);

    // Options Wrapper
    const optionsWrapper = document.createElement('div');
    optionsWrapper.className = 'options-wrapper';
    const options = document.createElement('slot');
    optionsWrapper.appendChild(options);

    selectWrapper.appendChild(selectBox);
    selectWrapper.appendChild(optionsWrapper);

    return selectWrapper;
  }

  private getStyles(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = `
      .select-wrapper {
        display: inline-block;
        position: relative;
      }
      .select-box {
        background-color: transparent;
        min-width: 120px;
        cursor: pointer;
        color: var(--blue-600);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .options-wrapper {
        display: none;
        position: absolute;
        background-color: var(--white);
        border: 1px solid var(--gray-200);
        border-radius: 4px;
        width: 100%;
        z-index: 3;
        top: 100%;
        left: 0;
        flex-direction: column;
        margin-top: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .option {
        padding: 4px 8px;
        cursor: pointer;
        font-size: 0.9rem;
      }
      .options-wrapper .option:hover {
        background-color: var(--blue-100);
      }
      ::slotted(option) {
        display: none;
      }   
    `;

    return style;
  }

  private initializeOptions() {
    const slot = this.shadowRoot!.querySelector('slot');
    const optionsWrapper = this.shadowRoot!.querySelector('.options-wrapper') as HTMLElement;
    const selectBox = this.shadowRoot!.querySelector('.select-box') as HTMLElement;
    const selectedValueElement = this.shadowRoot!.querySelector('.selected-value') as HTMLElement;

    const assignedNodes = slot!.assignedNodes() as HTMLElement[];

    assignedNodes.forEach((node: HTMLElement) => {
      if (node.tagName === 'OPTION') {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = node.textContent;
        optionDiv.dataset.value = node.getAttribute('value') || '';

        optionDiv.addEventListener('click', () => {
          selectedValueElement.textContent = node.textContent;
          this.toggleOpen();
          this.dispatchEvent(
            new CustomEvent('onchange', {
              bubbles: true,
              composed: true,
              detail: { value: node.getAttribute('value') },
            })
          );
        });

        optionsWrapper.appendChild(optionDiv);
      }
    });

    selectBox.addEventListener('click', this.toggleOpen);
  }

  private toggleOpen = () => {
    const optionsWrapper = this.shadowRoot!.querySelector('.options-wrapper') as HTMLElement;
    if (optionsWrapper) {
      optionsWrapper.style.display = optionsWrapper.style.display === 'flex' ? 'none' : 'flex';
    }
  };

  /**
   * ============================================
   * Public methods
   * ============================================
   */

  connectedCallback() {
    this.render();

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  disconnectedCallback() {
    this.shadowRoot!.querySelector('.select-box')!.removeEventListener('click', this.toggleOpen);
  }

  static get componentName() {
    return 'custom-select';
  }
}

export function registerSelectComponent() {
  customElements.define(SelectComponent.componentName, SelectComponent);
}
