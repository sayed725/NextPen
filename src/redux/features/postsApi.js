import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include', // Include cookies for Clerk session
  }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts',
      providesTags: ['Posts'],
    }),
    getPost: builder.query({
      query: (id) => `posts/${id}`,
      providesTags: ['Posts'],
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: 'posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Posts'],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...post }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: post,
      }),
      invalidatesTags: ['Posts'],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts'],
    }),
    addComment: builder.mutation({
      query: ({ id, comment }) => ({
        url: `posts/${id}/comments`,
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: ['Posts'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddCommentMutation,
} = postsApi;