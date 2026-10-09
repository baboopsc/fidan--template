export const selectUser = (state) => state.auth?.user ?? null;
export const selectToken = (state) => state.auth?.token ?? null;
export const selectIsLoggedIn = (state) => state.auth?.isLoggedIn ?? false;
export const selectIsRefreshing = (state) => state.auth?.isRefreshing ?? false;
