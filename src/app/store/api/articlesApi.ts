import api from "./baseApi";
import { Article } from "./types";

interface CreateArticleInput {
  title: string;
  description: string;
  image?: string;
  restaurantName: string;
  restaurantWebsite?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;
  openingHours?: string;
  socialLinks?: Record<string, string>;
  isPublished?: boolean;
}

interface UpdateArticleInput {
  title?: string;
  description?: string;
  image?: string;
  restaurantName?: string;
  restaurantWebsite?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;
  openingHours?: string;
  socialLinks?: Record<string, string>;
  isPublished?: boolean;
}

interface AutoCreateArticleInput {
  title: string;
  restaurantName: string;
  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;
  image?: string;
  isPublished?: boolean;
}

interface ArticleResponse {
  data: Article[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

/**
 * Articles API endpoints
 * Manages blog/article content with AI auto-generation support
 */
export const articlesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all articles (paginated)
    getArticles: builder.query<ArticleResponse, { page?: number }>({
      query: ({ page = 1 }) => `/article?page=${page}`,
      providesTags: ["Articles"],
    }),

    // Search articles
    searchArticles: builder.query<Article[], { q: string }>({
      query: ({ q }) => `/article/search?q=${encodeURIComponent(q)}`,
      providesTags: ["Articles"],
    }),

    // Create article
    createArticle: builder.mutation<Article, CreateArticleInput>({
      query: (body) => ({
        url: "/article/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Articles"],
    }),

    // Auto-create article with AI
    autoCreateArticle: builder.mutation<Article, AutoCreateArticleInput>({
      query: (body) => ({
        url: "/article/auto-create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Articles"],
    }),

    // Update article
    updateArticle: builder.mutation<
      Article,
      { id: number; data: UpdateArticleInput }
    >({
      query: ({ id, data }) => ({
        url: `/article/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Articles"],
    }),

    // Delete article
    deleteArticle: builder.mutation<
      { message: string; article: Article },
      number
    >({
      query: (id) => ({
        url: `/article/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Articles"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useSearchArticlesQuery,
  useCreateArticleMutation,
  useAutoCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;
