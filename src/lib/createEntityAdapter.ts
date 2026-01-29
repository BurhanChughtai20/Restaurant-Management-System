import { createEntityAdapter, EntityId, EntityAdapter, EntityState } from "@reduxjs/toolkit";

export function createReusableAdapter<
  T extends { id: EntityId; createdAt?: string },
  ExtraState extends Record<string, unknown> = Record<string, unknown>
>(extraState: ExtraState) {
  const adapter: EntityAdapter<T, string | number> = createEntityAdapter<T, string | number>({
    selectId: (entity) => entity.id,
    sortComparer: (a, b) => {
      const aDate = a.createdAt ?? "";
      const bDate = b.createdAt ?? "";
      return bDate.localeCompare(aDate);
    },
  })

  const initialState: EntityState<T, string | number> & ExtraState = adapter.getInitialState(extraState);

  return { adapter, initialState };
}
