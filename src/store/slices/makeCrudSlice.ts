import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

/**
 * Factory function to create normalized CRUD slices with EntityAdapter
 * Automatically handles upsertMany, update, remove, and clear actions
 *
 * @param name - The name of the slice (e.g., "articles", "tags")
 * @returns An object with the reducer and adapter for the slice
 *
 * @example
 * ```ts
 * export type Article = { id: number; ref: string; name: string };
 * export const { reducer: articlesReducer, adapter: articlesAdapter } =
 *   makeCrudSlice<Article>("articles");
 * ```
 *
 * Supported actions:
 * - `${name}/upsertMany` - Insert or update multiple entities
 * - `${name}/update` - Update a single entity
 * - `${name}/remove` - Remove a single entity by id
 * - `${name}/clear` - Remove all entities
 */
export function makeCrudSlice<T extends { id: string | number }>(name: string) {
  const adapter = createEntityAdapter<T>({
    selectId: (entity) => entity.id,
  });

  const slice = createSlice({
    name,
    initialState: adapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
      // Handle upsertMany: insert or update multiple entities
      builder.addCase(`${name}/upsertMany` as any, (state, action: any) => {
        adapter.upsertMany(state, action.payload);
      });

      // Handle update: update a single entity
      builder.addCase(`${name}/update` as any, (state, action: any) => {
        adapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      });

      // Handle remove: remove a single entity by id
      builder.addCase(`${name}/remove` as any, (state, action: any) => {
        adapter.removeOne(state, action.payload);
      });

      // Handle clear: remove all entities
      builder.addCase(`${name}/clear` as any, (state) => {
        adapter.removeAll(state);
      });
    },
  });

  return { reducer: slice.reducer, adapter };
}
