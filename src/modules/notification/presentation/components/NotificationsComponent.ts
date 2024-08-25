import { BellIcon } from '../../../../shared/components/icons/BellIcon';
import { DateUtils } from '../../../../shared/utils/DateUtils';
import { NotificationWebSocket } from '../../infrastrcutrue/NotificationWebSocket';
import { NotificationController } from '../NotificationController';

export class NotificationsComponent extends HTMLElement {
  private notificationController: NotificationController;
  private newNotifications: any[] = [];
  private notificationBox: HTMLElement | null = null;
  private updateInterval: number | null = null;
  private socketUrl: string = 'ws://localhost:9090/notifications';

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const notificationWebSocket = new NotificationWebSocket(this.socketUrl);
    this.notificationController = new NotificationController(notificationWebSocket);
  }

  /**
   * ============================================
   * Private Methods
   * ============================================
   */

  private render() {
    this.clearShadowRoot();

    this.shadowRoot!.appendChild(this.createNotificationsElement());
    this.shadowRoot!.appendChild(this.getStyles());
  }

  private createNotificationsElement(): HTMLElement {
    const notificationsElement = document.createElement('div');
    notificationsElement.className = 'notifications';

    notificationsElement.appendChild(this.createNotificationButton());
    notificationsElement.appendChild(this.createNotificationBox());

    return notificationsElement;
  }

  private createNotificationButton(): HTMLButtonElement {
    const buttonElement = document.createElement('button');
    buttonElement.className = 'button';

    const count = this.newNotifications.length;

    buttonElement.innerHTML = `
      <div class="button-icon-wrapper">
        <${BellIcon.componentName} width="24px" height="24px"></${BellIcon.componentName}>
        <div class="button-count">${count > 0 ? count : 0}</div>
      </div>
      <span>New documents added</span>
    `;

    return buttonElement;
  }

  private createNotificationBox(): HTMLElement {
    const notificationBox = document.createElement('div');
    notificationBox.className = 'notification-box';

    this.notificationBox = notificationBox;

    return notificationBox;
  }

  private createNewNotificationItem(notification: any): HTMLElement {
    const notificationItem = document.createElement('div');

    const userName = document.createElement('span');
    userName.className = 'user-name';
    userName.innerHTML = `<strong>${notification.userName}</strong> added `;

    const documentTitle = document.createElement('span');
    documentTitle.className = 'document-title';
    documentTitle.textContent = notification.documentTitle;

    const createdAt = document.createElement('span');
    createdAt.className = 'created-at';
    createdAt.textContent = ` ${DateUtils.humanizeDate(notification.timestamp)}`;

    notificationItem.className = 'notification-item';
    notificationItem.appendChild(userName);
    notificationItem.appendChild(documentTitle);
    notificationItem.appendChild(createdAt);

    return notificationItem;
  }

  private getStyles(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = `
       .notifications {
          position: relative;
        }
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
          cursor: pointer;
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
        .notification-box {
          position: absolute;
          top: 50px;
          right: 50%;
          transform: translateX(50%);
          width: 450px;
          height: 400px;
          background-color: var(--white);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 16px;
          display: none;
          flex-direction: column;
          overflow-y: auto;
        }
        .notification-box.show {
          display: flex;
        }
        .notification-item {
          padding: 10px;
          border-bottom: 1px solid var(--gray-200);
          font-size: 0.9rem;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
        .document-title {
          color: var(--black);
          font-weight: bold;
        }
        .created-at {
          color: var(--gray-400);
          font-style: italic;
        }
    `;

    return style;
  }

  private toggleNotificationBox() {
    if (this.notificationBox) {
      this.notificationBox.classList.toggle('show');
    }
  }

  private addNotificationToBox(notification: any) {
    if (this.notificationBox) {
      const notificationItem = this.createNewNotificationItem(notification);
      this.notificationBox.prepend(notificationItem);
    }
  }

  private updateNotificationCount() {
    const buttonCount = this.shadowRoot!.querySelector('.button-count') as HTMLElement;
    buttonCount.textContent = this.newNotifications.length.toString();
  }

  private handleNewNotifications(notification: any) {
    this.newNotifications.push(notification);
    this.addNotificationToBox(notification);
    this.updateNotificationCount();
  }

  private updateNotificationTimestamps() {
    const notificationItems = this.shadowRoot!.querySelectorAll('.notification-item .created-at');
    notificationItems.forEach((item, index) => {
      item.textContent = ` ${DateUtils.humanizeDate(this.newNotifications[index].timestamp)}`;
    });
  }

  /**
   * ============================================
   * Web Component Lifecycle
   * ============================================
   */

  connectedCallback() {
    this.render();
    this.notificationController.startListening((notification) => this.handleNewNotifications(notification));
    this.shadowRoot!.querySelector('.button')!.addEventListener('click', () => this.toggleNotificationBox());

    this.updateInterval = window.setInterval(() => this.updateNotificationTimestamps(), 5000);
  }

  disconnectedCallback() {
    this.notificationController.stopListening();
    this.shadowRoot!.querySelector('.button')!.removeEventListener('click', () => this.toggleNotificationBox());

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private clearShadowRoot() {
    this.shadowRoot!.innerHTML = '';
  }

  /**
   * ============================================
   * Setters, Getters and Statics
   * ============================================
   */

  static get componentName(): string {
    return 'notifications-component';
  }
}

export const registerNotificationComponent = (): void => {
  customElements.define(NotificationsComponent.componentName, NotificationsComponent);
};
