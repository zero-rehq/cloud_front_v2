import {  io } from "socket.io-client";
import type {Socket} from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import type { RawMessage, Transport } from "./transport";

/**
 * Socket.IO implementation of the Transport interface
 * Handles connection, disconnection, and message routing
 */
export class SocketIOTransport implements Transport {
  private socket?: Socket<DefaultEventsMap, DefaultEventsMap>;
  private msgCallback?: (msg: RawMessage) => void;
  private callbacks = {
    connected: [] as Array<() => void>,
    disconnected: [] as Array<() => void>,
    error: [] as Array<() => void>,
  };

  /**
   * Check if the transport is currently connected
   */
  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  /**
   * Connect to the Socket.IO server
   * @param token - Authentication token
   * @param url - Server URL (optional, defaults to VITE_BASE_PATH env var)
   */
  async connect({ token, url }: { token: string; url?: string }): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    const serverUrl = url ?? import.meta.env.VITE_BASE_PATH ?? "";

    this.socket = io(serverUrl, {
      reconnection: false,
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    // Register connection lifecycle listeners
    this.socket.on("connect", () => {
      this.callbacks.connected.forEach((cb) => cb());
    });

    this.socket.on("disconnect", () => {
      this.callbacks.disconnected.forEach((cb) => cb());
    });

    this.socket.on("connect_error", () => {
      this.callbacks.error.forEach((cb) => cb());
    });

    // Listen for data events (realtime messages)
    this.socket.on("data_event", (envelope: RawMessage) => {
      this.msgCallback?.(envelope);
    });
  }

  /**
   * Disconnect from the Socket.IO server
   */
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = undefined;
  }

  /**
   * Publish an event to the server
   * @param event - Event name
   * @param data - Event payload
   */
  publish(event: string, data?: unknown): void {
    this.socket?.emit(event, data);
  }

  /**
   * Register a callback for incoming messages
   * @param cb - Callback function to handle messages
   */
  onMessage(cb: (msg: RawMessage) => void): void {
    this.msgCallback = cb;
  }

  /**
   * Register event listeners for connection lifecycle
   * @param event - Event type (connected, disconnected, error)
   * @param cb - Callback function
   */
  on(event: "connected" | "disconnected" | "error", cb: () => void): void {
    this.callbacks[event].push(cb);
  }
}
