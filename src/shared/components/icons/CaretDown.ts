export class CaretDownIcon extends HTMLElement {
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
    const width = this.getAttribute('width') || '24px';
    const height = this.getAttribute('height') || '24px';

    this.shadowRoot!.innerHTML = `
            <style>
                svg {
                    width: ${width};
                    height: ${height};
                    fill: currentColor;
                }
            </style>
            <svg viewBox="0 0 36 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="1.41421" y1="1.58579" x2="19.4142" y2="19.5858" stroke="currentColor" stroke-width="4"/>
                <line x1="1.41421" y1="1.58579" x2="19.4142" y2="19.5858" stroke="currentColor" stroke-width="4"/>
                <line y1="-2" x2="25.4558" y2="-2" transform="matrix(-0.707107 0.707107 0.707107 0.707107 36 3)" stroke="currentColor" stroke-width="4"/>
            </svg>
        `;
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
    return ['width', 'height'];
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * ============================================
   * Setters, Getters and Statics
   * ============================================
   */

  static get componentName() {
    return 'caret-down-icon';
  }
}

export function registerCaretDownIcon() {
  customElements.define(CaretDownIcon.componentName, CaretDownIcon);
}
