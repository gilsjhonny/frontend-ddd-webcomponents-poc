export class BellIcon extends HTMLElement {
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
            <svg viewBox="-5 -10 110 135" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                d="M91.172 73.656c-.457-.91-1.254-1.707-2.39-2.39-3.985-2.278-5.919-12.067-5.919-12.067s-2.617-5.82-5.804-27.332c-2.39-15.82-14.23-21.172-20.262-22.766-.114-3.64-3.075-6.601-6.72-6.601-3.64 0-6.714 2.96-6.714 6.601-6.031 1.707-17.87 6.942-20.262 22.766C19.914 53.265 17.296 59.2 17.296 59.2s-1.933 9.79-5.918 12.066c-2.05 1.254-2.843 2.961-3.074 4.325-.226 1.48.113 2.843 1.024 3.984.34.34.683.684 1.136 1.023.797.57 1.934.91 3.188.91H86.5c.91 0 1.933-.226 2.73-.683 0 0 .114 0 .114-.113 2.28-1.477 3.078-4.664 1.828-7.055zM62.258 85.207c0 6.715-5.465 12.293-12.293 12.293s-12.293-5.465-12.293-12.293z"
                />
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
    return 'bell-icon';
  }
}

export function registerBellIcon() {
  customElements.define(BellIcon.componentName, BellIcon);
}
