const TOKEN_KEY = "auth_token";

const tokenSet = new Set<string>();

export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    console.log("TokenStore: Running on Server (No access to localStorage)");
    return null;
  }
  const token = localStorage.getItem(TOKEN_KEY);
  console.log("TokenStore: Retrieved from localStorage:", token ? "FOUND" : "NOT FOUND");
  if (token) tokenSet.add(token);
  return token;
};

export const storeToken = (token: string) => {
  if (typeof window === "undefined") return;
  console.log("TokenStore: Saving token to localStorage");
  localStorage.setItem(TOKEN_KEY, token);
  tokenSet.add(token);
};

export const hasToken = (): boolean => tokenSet.size > 0;
