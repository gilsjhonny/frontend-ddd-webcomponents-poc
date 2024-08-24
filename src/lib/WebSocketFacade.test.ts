import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebSocketFacade, WebSocketListener } from './WebSocketFacade';

describe('WebSocketFacade', () => {
  let mockSocket: Partial<WebSocket>;
  let websocketFacade: WebSocketFacade;
  const url = 'ws://example.com';

  beforeEach(() => {
    mockSocket = {
      close: vi.fn(),
      send: vi.fn(),
      readyState: WebSocket.OPEN,
    };

    // @ts-ignore: Ignore the type error because we're mocking the WebSocket
    global.WebSocket = vi.fn(() => mockSocket as WebSocket);

    websocketFacade = new WebSocketFacade(url);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('connect', () => {
    it('should establish a WebSocket connection', () => {
      websocketFacade.connect();
      expect(global.WebSocket).toHaveBeenCalledWith(url);
    });

    it('should notify listeners on message', () => {
      const listener: WebSocketListener = {
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      websocketFacade.addListener(listener);
      websocketFacade.connect();

      const mockEvent = { data: JSON.stringify({ key: 'value' }) } as MessageEvent;
      mockSocket.onmessage?.(mockEvent);

      expect(listener.onMessage).toHaveBeenCalledWith({ key: 'value' });
    });

    it('should notify listeners on error', () => {
      const listener: WebSocketListener = {
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      websocketFacade.addListener(listener);
      websocketFacade.connect();

      const mockErrorEvent = {} as Event;
      mockSocket.onerror?.(mockErrorEvent);

      expect(listener.onError).toHaveBeenCalledWith(mockErrorEvent);
    });

    it('should notify listeners on close', () => {
      const listener: WebSocketListener = {
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      websocketFacade.addListener(listener);
      websocketFacade.connect();

      const mockCloseEvent = {} as CloseEvent;
      mockSocket.onclose?.(mockCloseEvent);

      expect(listener.onClose).toHaveBeenCalledWith(mockCloseEvent);
    });
  });

  describe('disconnect', () => {
    it('should close the WebSocket connection', () => {
      websocketFacade.connect();
      websocketFacade.disconnect();
      expect(mockSocket.close).toHaveBeenCalled();
      expect(websocketFacade['socket']).toBeNull();
    });
  });

  describe('send', () => {
    it('should send data if WebSocket is open', () => {
      websocketFacade.connect();
      const data = { key: 'value' };
      websocketFacade.send(data);
      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify(data));
    });
  });

  describe('addListener', () => {
    it('should add a listener', () => {
      const listener: WebSocketListener = {
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      websocketFacade.addListener(listener);
      expect(websocketFacade['listeners']).toContain(listener);
    });
  });

  describe('removeListener', () => {
    it('should remove a listener', () => {
      const listener: WebSocketListener = {
        onMessage: vi.fn(),
        onError: vi.fn(),
        onClose: vi.fn(),
      };

      websocketFacade.addListener(listener);
      websocketFacade.removeListener(listener);
      expect(websocketFacade['listeners']).not.toContain(listener);
    });
  });
});
