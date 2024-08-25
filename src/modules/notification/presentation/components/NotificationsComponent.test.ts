import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { NotificationsComponent, registerNotificationComponent } from './NotificationsComponent';
import { Notification } from '../../domain/Notification';
import { NotificationController } from '../NotificationController';
import { BellIcon } from '../../../../shared/components/icons/BellIcon';
import { DateUtils } from '../../../../shared/utils/DateUtils';

// Register the custom element
registerNotificationComponent();

describe('NotificationsComponent', () => {
  let element: NotificationsComponent;
  let mockNotificationController: vi.SpyInstance;

  beforeEach(() => {
    // Mock the NotificationController
    mockNotificationController = vi.spyOn(NotificationController.prototype, 'startListening');
    vi.spyOn(NotificationController.prototype, 'stopListening').mockImplementation(() => {});

    // Create the component
    element = document.createElement(NotificationsComponent.componentName) as NotificationsComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('connectedCallback', () => {
    it('should render the notifications component', () => {
      const shadowRoot = element.shadowRoot!;

      expect(shadowRoot.querySelector('.notifications')).toBeInTheDocument();
      expect(shadowRoot.querySelector(BellIcon.componentName)).toBeInTheDocument();
    });

    it('should start listening for notifications', () => {
      expect(mockNotificationController).toHaveBeenCalled();
    });

    it('should set up an interval to update notification timestamps', () => {
      expect(element['updateInterval']).not.toBeNull();
    });
  });

  describe('disconnectedCallback', () => {
    it('should stop listening for notifications', () => {
      const stopListeningSpy = vi.spyOn(element['notificationController'], 'stopListening');
      element.disconnectedCallback();
      expect(stopListeningSpy).toHaveBeenCalled();
    });

    it('should clear the interval for updating timestamps', () => {
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
      const intervalId = element['updateInterval'];
      element.disconnectedCallback();
      expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId);
    });
  });

  describe('notification handling', () => {
    it('should update the notification count when a new notification is received', () => {
      const mockNotification = Notification.createFromProperties({
        timestamp: new Date(),
        userId: 'user123',
        userName: 'John Doe',
        documentId: 'doc456',
        documentTitle: 'Important Document',
      });

      element['handleNewNotifications'](mockNotification);

      const buttonCount = element.shadowRoot!.querySelector('.button-count') as HTMLElement;
      expect(buttonCount.textContent).toBe('1');
    });

    it('should add a new notification to the notification box', () => {
      const mockNotification = Notification.createFromProperties({
        timestamp: new Date(),
        userId: 'user123',
        userName: 'John Doe',
        documentId: 'doc456',
        documentTitle: 'Important Document',
      });

      element['handleNewNotifications'](mockNotification);

      const notificationItems = element.shadowRoot!.querySelectorAll('.notification-item');
      expect(notificationItems.length).toBe(1);
      expect(notificationItems[0].querySelector('.user-name')?.textContent).toContain('John Doe');
      expect(notificationItems[0].querySelector('.document-title')?.textContent).toBe('Important Document');
    });

    it('should update notification timestamps periodically', () => {
      const mockNotification = Notification.createFromProperties({
        timestamp: new Date(),
        userId: 'user123',
        userName: 'John Doe',
        documentId: 'doc456',
        documentTitle: 'Important Document',
      });

      element['handleNewNotifications'](mockNotification);

      const humanizeDateSpy = vi.spyOn(DateUtils, 'humanizeDate');
      element['updateNotificationTimestamps']();

      expect(humanizeDateSpy).toHaveBeenCalledWith(mockNotification.getTimestamp());
    });
  });

  describe('toggleNotificationBox', () => {
    it('should toggle the notification box visibility when the button is clicked', () => {
      const notificationBox = element.shadowRoot!.querySelector('.notification-box') as HTMLElement;
      const button = element.shadowRoot!.querySelector('.button') as HTMLButtonElement;

      expect(notificationBox.classList.contains('show')).toBe(false);

      button.click();
      expect(notificationBox.classList.contains('show')).toBe(true);

      button.click();
      expect(notificationBox.classList.contains('show')).toBe(false);
    });
  });
});
