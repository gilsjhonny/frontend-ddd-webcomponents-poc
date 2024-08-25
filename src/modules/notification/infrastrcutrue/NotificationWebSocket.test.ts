import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NotificationWebSocket } from './NotificationWebSocket';
import { WebSocketListener } from '../../../lib/WebSocketFacade';
import { WebSocketNotification } from '../types';
import { Notification } from '../domain/Notification';

describe('NotificationWebSocket', () => {
  let mockSocket: Partial<WebSocket>;
  let notificationWebSocket: NotificationWebSocket;
  const url = 'ws://example.com';

  beforeEach(() => {
    mockSocket = {
      close: vi.fn(),
      send: vi.fn(),
      readyState: WebSocket.OPEN,
      onmessage: null,
      onerror: null,
      onclose: null,
    };

    // Mock global WebSocket
    global.WebSocket = vi.fn(() => mockSocket as WebSocket);

    notificationWebSocket = new NotificationWebSocket(url);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('connect', () => {
    it('should establish a WebSocket connection', () => {
      notificationWebSocket.connect();
      expect(global.WebSocket).toHaveBeenCalledWith(url);
    });
  });

  describe('disconnect', () => {
    it('should close the WebSocket connection', () => {
      notificationWebSocket.connect();
      notificationWebSocket.disconnect();
      expect(mockSocket.close).toHaveBeenCalled();
      expect(notificationWebSocket['socket']).toBeNull();
    });
  });

  describe('subscribeToNotifications', () => {
    it('should add a listener', () => {
      const listener: WebSocketListener = {
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      notificationWebSocket.subscribeToNotifications(listener);
      expect(notificationWebSocket['listeners']).toContain(listener);
    });

    it('should notify the listener on message', () => {
      const listener: WebSocketListener = {
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      notificationWebSocket.subscribeToNotifications(listener);
      notificationWebSocket.connect();

      const mockEvent = { data: JSON.stringify({ key: 'value' }) } as MessageEvent;

      if (mockSocket.onmessage) {
        mockSocket.onmessage(mockEvent);
      }

      expect(listener.onMessage).toHaveBeenCalledWith({ key: 'value' });
    });
  });

  describe('unsubscribeFromNotifications', () => {
    it('should remove a listener', () => {
      const listener: WebSocketListener = {
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      notificationWebSocket.subscribeToNotifications(listener);
      notificationWebSocket.unsubscribeFromNotifications(listener);
      expect(notificationWebSocket['listeners']).not.toContain(listener);
    });
  });

  describe('mapToDomain', () => {
    it('should map WebSocket data to a domain Notification object', () => {
      const webSocketData: WebSocketNotification = {
        Timestamp: new Date(),
        UserID: '123',
        UserName: 'John Doe',
        DocumentID: '456',
        DocumentTitle: 'Test Document',
      };

      const notification = notificationWebSocket.mapToDomain(webSocketData);

      expect(notification).toBeInstanceOf(Notification);
      expect(notification.getTimestamp()).toBe(webSocketData.Timestamp);
      expect(notification.getUserId()).toBe(webSocketData.UserID);
      expect(notification.getUserName()).toBe(webSocketData.UserName);
      expect(notification.getDocumentId()).toBe(webSocketData.DocumentID);
      expect(notification.getDocumentTitle()).toBe(webSocketData.DocumentTitle);
    });
  });
});
