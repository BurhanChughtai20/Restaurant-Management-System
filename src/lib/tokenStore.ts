// src/lib/tokenStore.ts
const TOKEN_KEY = "auth_token";

// Fast O(1) lookup using Set
const tokenSet = new Set<string>();

export const storeToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  tokenSet.add(token);
};

export const removeToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) tokenSet.delete(token);
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) tokenSet.add(token); 
  return token;
};

// O(1) check if token exists
export const hasToken = (): boolean => tokenSet.size > 0;
