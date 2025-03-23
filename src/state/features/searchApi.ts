// services/searchApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    createSearchQuery: builder.mutation<void, { keyword: string }>({
      query: ({ keyword }) => ({
        url: "/search",
        method: "POST",
        body: { keyword },
      }),
    }),
  }),
});

export const { useCreateSearchQueryMutation } = searchApi;
