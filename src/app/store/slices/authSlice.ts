// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../api/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    logout: () => initialState,
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
