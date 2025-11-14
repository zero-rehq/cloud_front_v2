import { makeCrudSlice } from "./makeCrudSlice";

/**
 * Article entity type
 */
export type Article = {
  id: number;
  ref: string;
  name: string;
  description?: string;
  createdAt?: string;
};

/**
 * Articles slice with normalized state management
 * Supports actions: articles/upsertMany, articles/update, articles/remove, articles/clear
 */
export const { reducer: articlesReducer, adapter: articlesAdapter } =
  makeCrudSlice<Article>("articles");
