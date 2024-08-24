import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NotificationWebSocket } from './NotificationWebSocket';
import { WebSocketListener } from '../../../lib/WebSocketFacade';

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
});
