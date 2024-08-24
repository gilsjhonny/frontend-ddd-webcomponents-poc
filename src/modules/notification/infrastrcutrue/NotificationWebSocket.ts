import { WebSocketFacade, WebSocketListener } from '../../../lib/WebSocketFacade';

export class NotificationWebSocket extends WebSocketFacade {
  constructor(url: string) {
    super(url);
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
}
