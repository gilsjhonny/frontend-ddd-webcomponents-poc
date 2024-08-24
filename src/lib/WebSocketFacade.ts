export interface WebSocketListener {
  onMessage(data: unknown): void; // Use 'unknown' if the data type is not predetermined
  onError(error: Event): void;
  onClose(event: CloseEvent): void;
}

export class WebSocketFacade {
  private socket: WebSocket | null = null;
  private url: string;
  private listeners: WebSocketListener[] = [];

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.notifyListeners('onMessage', data);
    };

    this.socket.onerror = (event: Event) => {
      console.error('WebSocket error:', event);
      this.notifyListeners('onError', event);
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log('WebSocket connection closed:', event);
      this.notifyListeners('onClose', event);
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(data: Record<string, unknown>): void {
    // Assuming the data sent is a JSON object
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Unable to send message.');
    }
  }

  addListener(listener: WebSocketListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: WebSocketListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(eventType: keyof WebSocketListener, data: unknown): void {
    this.listeners.forEach((listener) => {
      if (typeof listener[eventType] === 'function') {
        listener[eventType](data);
      }
    });
  }
}
