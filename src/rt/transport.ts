/**
 * Raw message format from the transport layer
 * Can be either a string (JSON) or an object
 */
export type RawMessage = string | Record<string, unknown>;

/**
 * Generic transport interface for realtime communication
 * Implementations: Socket.IO, MQTT, WebSocket, etc.
 *
 * This interface decouples the realtime layer from specific transport implementations,
 * making it easy to switch between different realtime technologies.
 */
export interface Transport {
  /**
   * Connect to the realtime server
   * @param opts - Connection options (token, url, etc.)
   */
  connect: (opts: { token: string; url?: string }) => Promise<void>;

  /**
   * Disconnect from the realtime server
   */
  disconnect: () => void;

  /**
   * Publish an event to the server
   * @param event - Event name
   * @param data - Event payload
   */
  publish: (event: string, data?: unknown) => void;

  /**
   * Register a callback for incoming messages
   * @param cb - Callback function to handle messages
   */
  onMessage: (cb: (msg: RawMessage) => void) => void;

  /**
   * Register event listeners for connection lifecycle
   * @param event - Event type (connected, disconnected, error)
   * @param cb - Callback function
   */
  on: (event: "connected" | "disconnected" | "error", cb: () => void) => void;

  /**
   * Check if the transport is currently connected
   * @returns true if connected, false otherwise
   */
  isConnected: () => boolean;
}
