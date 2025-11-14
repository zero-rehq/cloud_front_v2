import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { eventRouterMiddleware } from "./middleware/eventRouter";
import { articlesReducer } from "./slices/articles.slice";

/**
 * Root reducer combining all feature slices
 */
const rootReducer = combineReducers({
  articles: articlesReducer,
  // Add more slices here: tags, lists, locals, etc.
});

/**
 * Redux store configured with:
 * - Feature slices (articles, tags, lists, locals)
 * - eventRouterMiddleware for realtime events
 * - DevTools enabled
 * - Serializable check disabled for realtime compatibility
 */
export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(eventRouterMiddleware),
});

/**
 * Root state type for type-safe selectors
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * App dispatch type for type-safe dispatching
 */
export type AppDispatch = typeof store.dispatch;
