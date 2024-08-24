export class ListIcon extends HTMLElement {
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
        <svg viewBox="0 0 80 63" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 25.7727V37.2273C12 38.8051 11.102 40.0909 10 40.0909H2C0.898 40.0909 0 38.8051 0 37.2273V25.7727C0 24.1949 0.898 22.9091 2 22.9091H10C11.102 22.9091 12 24.1949 12 25.7727ZM78 22.9091H18C16.898 22.9091 16 24.1949 16 25.7727V37.2273C16 38.8051 16.898 40.0909 18 40.0909H78C79.102 40.0909 80 38.8051 80 37.2273V25.7727C80 24.1949 79.102 22.9091 78 22.9091ZM10 0H2C0.898 0 0 1.28577 0 2.86364V14.3182C0 15.896 0.898 17.1818 2 17.1818H10C11.102 17.1818 12 15.896 12 14.3182V2.86364C12 1.28577 11.102 0 10 0ZM78 0H18C16.898 0 16 1.28577 16 2.86364V14.3182C16 15.896 16.898 17.1818 18 17.1818H78C79.102 17.1818 80 15.896 80 14.3182V2.86364C80 1.28577 79.102 0 78 0ZM10 45.8182H2C0.898 45.8182 0 47.104 0 48.6818V60.1364C0 61.7142 0.898 63 2 63H10C11.102 63 12 61.7142 12 60.1364V48.6818C12 47.104 11.102 45.8182 10 45.8182ZM78 45.8182H18C16.898 45.8182 16 47.104 16 48.6818V60.1364C16 61.7142 16.898 63 18 63H78C79.102 63 80 61.7142 80 60.1364V48.6818C80 47.104 79.102 45.8182 78 45.8182Z" fill="currentColor"/>
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
    return 'list-icon';
  }
}

export function registerListIcon() {
  customElements.define(ListIcon.componentName, ListIcon);
}
