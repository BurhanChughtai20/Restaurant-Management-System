// store/api/authApi.ts
import { baseApi } from './baseApi';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailResponse,
} from './types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signupAdmin: builder.mutation<void, SignupRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<void, ResetPasswordRequest>({
  query: (body) => ({
    url: '/auth/reset-password',
    method: 'POST',
    body,
  }),
}),


    // New endpoint for token validation
    validateToken: builder.query<{ valid: boolean }, void>({
      query: () => '/auth/validate',
      providesTags: ['Auth'],
    }),

    logoutApi: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

        deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/delete-account',
        method: 'DELETE',
      }),
      invalidatesTags: ['Auth'], 
    }),
  }),
});

export const {
  useSignupAdminMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useValidateTokenQuery,
  useLogoutApiMutation,
  useDeleteAccountMutation,
} = authApi;