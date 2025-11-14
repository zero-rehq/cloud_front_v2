import type { Middleware } from "@reduxjs/toolkit";

/**
 * Middleware that routes incoming realtime events to Redux
 * Events from the transport layer pass through this middleware
 */
export const eventRouterMiddleware: Middleware = () => (next) => (action) => {
  return next(action);
};

/**
 * Dispatches incoming realtime events to the Redux store
 * Used by the RealtimeProvider to forward events from the transport layer
 */
export function dispatchIncoming(
  store: { dispatch: (action: any) => void },
  envelope: any
) {
  const { type, payload, meta } = envelope ?? {};
  if (typeof type !== "string") return;

  store.dispatch({ type, payload, meta });
}
