import { WebSocketFacade, WebSocketListener } from '../../../lib/WebSocketFacade';
import { Notification } from '../domain/Notification';
import { WebSocketNotification } from '../types';

export class NotificationWebSocket extends WebSocketFacade {
  static url = `${import.meta.env.VITE_WS_URL}/notifications`;

  constructor() {
    super(NotificationWebSocket.url);
  }

  connect(): void {
    super.connect();
  }

  disconnect(): void {
    super.disconnect();
  }

  subscribeToNotifications(listener: WebSocketListener): void {
    this.addListener(listener);
  }

  unsubscribeFromNotifications(listener: WebSocketListener): void {
    this.removeListener(listener);
  }

  mapToDomain(data: WebSocketNotification): Notification {
    return Notification.createFromProperties({
      timestamp: new Date(data.Timestamp),
      userId: data.UserID,
      userName: data.UserName,
      documentId: data.DocumentID,
      documentTitle: data.DocumentTitle,
    });
  }
}
