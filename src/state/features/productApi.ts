import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PriceDetails, Product, Review, VideoUploaded } from "@prisma/client";

interface ProductResponse {
  success: boolean;
  products: (Product & {
    price: PriceDetails;
    videoUploaded: VideoUploaded;
    reviews: Review[];
  })[];
  totalProducts: number;
}

interface GameProduct extends Product {
  priceDetails: PriceDetails;
  uploadedVideo: VideoUploaded[];
  reviews: Review[];
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Products"], // Define tags for cache invalidation
  endpoints: (builder) => ({
    // Fetch all products
    getAllProducts: builder.query<
      ProductResponse,
      {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
        gameTypeFilter?: string;
      }
    >({
      query: ({ category, search, gameTypeFilter, page, limit }) => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        if (gameTypeFilter) params.append("gameTypeFilter", gameTypeFilter);
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());

        return `/products?${params.toString()}`;
      },
      providesTags: ["Products"], // Marks this data as cacheable
    }),

    // Fetch a single product by ID
    getProductById: builder.query<{ product: GameProduct }, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Products", id }], // Caches the individual product
    }),

    // Create a new product
    createProduct: builder.mutation<
      {
        message: string;
        product: Product & {
          price: PriceDetails;
          videoUploaded: VideoUploaded;
        };
      },
      Partial<Product & { price: PriceDetails; videoUploaded: VideoUploaded }>
    >({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"], // Clears cache to refetch all products
    }),

    // Optimistic Delete Product by ID
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      // Optimistic Update
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          productApi.util.updateQueryData("getAllProducts", {}, (draft) => {
            draft.products = draft.products.filter(
              (product) => product.id !== id
            );
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Rollback if API call fails
        }
      },
      invalidatesTags: ["Products"], // Refresh cache after deletion
    }),

    // Optimistic Update Product
    updateProduct: builder.mutation<
      Product & { price: PriceDetails; videoUploaded: VideoUploaded },
      {
        id: string;
        product: Partial<
          Product & { price: PriceDetails; videoUploaded: VideoUploaded }
        >;
      }
    >({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: product,
      }),
      // Optimistic Update
      onQueryStarted: async ({ id, product }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          productApi.util.updateQueryData("getAllProducts", {}, (draft) => {
            const index = draft.products.findIndex((p) => p.id === id);
            if (index !== -1) {
              draft.products[index] = { ...draft.products[index], ...product };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Rollback if API call fails
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Products", id }], // Refresh cache for updated product
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
