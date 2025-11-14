import { useEffect } from "react";
import { SocketIOTransport } from "./socketio.transport";
import { store } from "@/store";
import { dispatchIncoming } from "@/store/middleware/eventRouter";

/**
 * RealtimeProvider component that manages the realtime connection
 * Features:
 * - Automatic connection on mount
 * - Exponential backoff reconnection strategy
 * - Routes incoming messages to Redux store
 * - Sends join_sala event on connection
 *
 * @example
 * ```tsx
 * <RealtimeProvider>
 *   <App />
 * </RealtimeProvider>
 * ```
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const transport = new SocketIOTransport();
    let attempts = 0;
    const MAX_ATTEMPTS = 30;

    /**
     * Attempt to connect to the realtime server
     */
    const connect = async () => {
      try {
        // TODO: Replace with actual auth token from your auth system
        await transport.connect({
          token: "YOUR_AUTH_TOKEN_HERE",
          url: import.meta.env.VITE_BASE_PATH,
        });
      } catch (error) {
        console.error("Failed to connect to realtime server:", error);
      }
    };

    /**
     * Schedule a reconnection attempt with exponential backoff
     */
    const scheduleReconnect = () => {
      if (attempts >= MAX_ATTEMPTS) {
        console.error("Max reconnection attempts reached");
        return;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, ... up to 15s
      const delay = Math.min(1000 * 2 ** attempts, 15000);
      attempts++;

      console.log(`Reconnecting in ${delay}ms (attempt ${attempts})`);
      setTimeout(connect, delay);
    };

    /**
     * Handle successful connection
     */
    transport.on("connected", () => {
      console.log("Connected to realtime server");
      attempts = 0; // Reset attempts on successful connection

      // Send join_sala event to subscribe to updates
      transport.publish("join_sala", {
        messageKey: crypto.randomUUID?.() ?? Math.random().toString(36),
      });
    });

    /**
     * Handle disconnection
     */
    transport.on("disconnected", () => {
      console.log("Disconnected from realtime server");
      scheduleReconnect();
    });

    /**
     * Handle connection errors
     */
    transport.on("error", () => {
      console.error("Realtime connection error");
      scheduleReconnect();
    });

    /**
     * Route incoming messages to Redux store
     */
    transport.onMessage((raw) => {
      try {
        // Parse message if it's a string
        const message = typeof raw === "string" ? JSON.parse(raw) : raw;

        // Dispatch to Redux if it has a type property
        if (message && typeof message === "object" && "type" in message) {
          dispatchIncoming(store, message);
        }
      } catch (error) {
        console.error("Failed to process realtime message:", error);
      }
    });

    // Initial connection
    connect();

    // Cleanup on unmount
    return () => {
      transport.disconnect();
    };
  }, []);

  return <>{children}</>;
}
