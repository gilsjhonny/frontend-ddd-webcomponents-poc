import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationWebSocket } from '../infrastrcutrue/NotificationWebSocket';
import { Notification } from '../domain/Notification';
import { NotificationController } from './NotificationController';

describe('NotificationController', () => {
  let mockWebSocket: Partial<NotificationWebSocket>;
  let notificationController: NotificationController;
  const mockNotificationData = {
    Timestamp: '2023-08-24T10:00:00Z',
    UserID: 'user123',
    UserName: 'John Doe',
    DocumentID: 'doc456',
    DocumentTitle: 'Sample Document',
  };

  beforeEach(() => {
    mockWebSocket = {
      addListener: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as Partial<NotificationWebSocket>;

    notificationController = new NotificationController(mockWebSocket as NotificationWebSocket);
  });

  describe('startListening', () => {
    it('should add a listener and connect to the WebSocket', () => {
      const listener = vi.fn();

      notificationController.startListening(listener);

      expect(mockWebSocket.addListener).toHaveBeenCalled();
      expect(mockWebSocket.connect).toHaveBeenCalled();
    });

    it('should handle incoming messages and pass notifications to the listener', () => {
      const listener = vi.fn();

      notificationController.startListening(listener);

      const mockOnMessage = (mockWebSocket.addListener as vi.Mock).mock.calls[0][0].onMessage;
      const notification = Notification.createFromResponse(mockNotificationData);

      mockOnMessage(mockNotificationData);

      expect(listener).toHaveBeenCalledWith(notification);
    });

    it('should handle WebSocket errors', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      notificationController.startListening(() => {});

      const mockOnError = (mockWebSocket.addListener as vi.Mock).mock.calls[0][0].onError;
      const mockErrorEvent = {} as Event;

      mockOnError(mockErrorEvent);

      expect(consoleErrorSpy).toHaveBeenCalledWith('WebSocket error occurred:', mockErrorEvent);
    });

    it('should handle WebSocket close events', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      notificationController.startListening(() => {});

      const mockOnClose = (mockWebSocket.addListener as vi.Mock).mock.calls[0][0].onClose;
      const mockCloseEvent = {} as CloseEvent;

      mockOnClose(mockCloseEvent);

      expect(consoleLogSpy).toHaveBeenCalledWith('WebSocket connection closed:', mockCloseEvent);
    });
  });

  describe('stopListening', () => {
    it('should disconnect from the WebSocket', () => {
      notificationController.stopListening();
      expect(mockWebSocket.disconnect).toHaveBeenCalled();
    });
  });
});
