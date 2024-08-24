import { NotificationWebSocket } from '../../infrastrcutrue/NotificationWebSocket';
import { NotificationController } from '../NotificationController';

export class NotificationsComponent extends HTMLElement {
  private notificationController: NotificationController;
  private count: number = 0;
  private countElement: HTMLElement | null = null;
  private shadow: ShadowRoot;
  private socketUrl: string = 'ws://localhost:9090/notifications';

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
    const notificationWebSocket = new NotificationWebSocket(this.socketUrl);
    this.notificationController = new NotificationController(notificationWebSocket);
  }

  connectedCallback() {
    this.render();
    this.notificationController.startListening(this.updateCount.bind(this));
  }

  disconnectedCallback() {
    this.notificationController.stopListening();
  }

  private render() {
    this.shadow.innerHTML = `
      <style>
        .button {
          border-radius: 30px;
          border: none;
          background-color: var(--gray-100);
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 6px 24px 6px 18px;
          color: var(--text-color);
          position: relative;
        }
        .button-icon-wrapper {
          position: relative;
        }
        .button-icon-wrapper svg {
          width: 24px;
          height: 24px;
          fill: var(--black);
        }
        .button-count {
          background-color: var(--blue-600);
          border: 1px solid var(--gray-200);
          color: white;
          border-radius: 50%;
          padding: 2px 2px;
          position: absolute;
          top: -3px;
          right: -9px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 12px;

        }
      </style>
      <div class="notifications">
        <div class="button-wrapper"></div>
      </div>
    `;

    this.updateButton();
  }

  private updateButton() {
    const buttonWrapper = this.shadow.querySelector('.button-wrapper');

    if (buttonWrapper) {
      buttonWrapper.innerHTML = '';
      const buttonElement = this.renderNotificationButton();
      buttonWrapper.appendChild(buttonElement);
    }
  }

  private renderNotificationButton(): HTMLButtonElement {
    const buttonElement = document.createElement('button');
    buttonElement.className = 'button';

    buttonElement.innerHTML = `
      <div class="button-icon-wrapper">
        ${this.renderIcon()}
        <div class="button-count">${this.count > 0 ? this.count : ''}</div>
      </div>
      <span>New documents added</span>
    `;

    this.countElement = buttonElement.querySelector('.button-count');

    return buttonElement;
  }

  private renderIcon(): string {
    return `
      <svg viewBox="-5 -10 110 135" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M91.172 73.656c-.457-.91-1.254-1.707-2.39-2.39-3.985-2.278-5.919-12.067-5.919-12.067s-2.617-5.82-5.804-27.332c-2.39-15.82-14.23-21.172-20.262-22.766-.114-3.64-3.075-6.601-6.72-6.601-3.64 0-6.714 2.96-6.714 6.601-6.031 1.707-17.87 6.942-20.262 22.766C19.914 53.265 17.296 59.2 17.296 59.2s-1.933 9.79-5.918 12.066c-2.05 1.254-2.843 2.961-3.074 4.325-.226 1.48.113 2.843 1.024 3.984.34.34.683.684 1.136 1.023.797.57 1.934.91 3.188.91H86.5c.91 0 1.933-.226 2.73-.683 0 0 .114 0 .114-.113 2.28-1.477 3.078-4.664 1.828-7.055zM62.258 85.207c0 6.715-5.465 12.293-12.293 12.293s-12.293-5.465-12.293-12.293z"
        />
      </svg>
    `;
  }

  private updateCount = () => {
    this.count++;

    if (this.countElement) {
      this.countElement.textContent = this.count.toString();
    } else {
      this.updateButton();
    }
  };

  static get componentName(): string {
    return 'notifications-component';
  }
}

export const registerNotificationComponent = (): void => {
  customElements.define(NotificationsComponent.componentName, NotificationsComponent);
};
