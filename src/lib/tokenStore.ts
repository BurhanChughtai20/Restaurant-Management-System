const TOKEN_KEY = "auth_token";

const tokenSet = new Set<string>();

export const storeToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  tokenSet.add(token);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) tokenSet.delete(token);
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) tokenSet.add(token);
  return token;
};

export const hasToken = (): boolean => tokenSet.size > 0;
