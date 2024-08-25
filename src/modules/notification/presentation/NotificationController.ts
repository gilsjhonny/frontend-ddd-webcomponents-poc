import { Notification } from '../domain/Notification';
import { NotificationWebSocket } from '../infrastrcutrue/NotificationWebSocket';
import { WebSocketNotification } from '../types';

export class NotificationController {
  private notificationWebSocket: NotificationWebSocket;

  constructor(notificationWebSocket: NotificationWebSocket) {
    this.notificationWebSocket = notificationWebSocket;
  }

  // Retrieve notifications using the WebSocket
  public startListening(listener: (notification: Notification) => void): void {
    this.notificationWebSocket.addListener({
      onMessage: (data: WebSocketNotification) => {
        const notification = this.notificationWebSocket.mapToDomain(data);
        listener(notification);
      },
      onError: (error: Event) => {
        console.error('WebSocket error occurred:', error);
      },
      onClose: (event: CloseEvent) => {
        console.log('WebSocket connection closed:', event);
      },
    });
    this.notificationWebSocket.connect();
  }

  public stopListening(): void {
    this.notificationWebSocket.disconnect();
  }
}
