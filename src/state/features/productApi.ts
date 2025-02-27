import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "@prisma/client";

interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // Adjust based on your setup
  endpoints: (builder) => ({
    getAllProducts: builder.query<
      ProductResponse,
      { category?: string; search?: string; page?: number; limit?: number }
    >({
      query: ({ category, search, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return `/products?${params.toString()}`;
      },
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),
    createProduct: builder.mutation<
      { message: string; product: Product },
      Partial<Product>
    >({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
    }),
    // DELETE Product by ID
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
    //update product
    updateProduct: builder.mutation<
      Product,
      { id: string; product: Partial<Product> }
    >({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: product,
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;
