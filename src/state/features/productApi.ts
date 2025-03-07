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
  endpoints: (builder) => ({
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
    }),
    getProductById: builder.query<{ product: GameProduct }, string>({
      query: (id) => `/products/${id}`,
    }),
    createProduct: builder.mutation<
      {
        message: string;
        product: Product & {
          price: PriceDetails;
          videoUploaded: VideoUploaded;
        };
      },
      Partial<
        Product & {
          price: PriceDetails;
          videoUploaded: VideoUploaded;
        }
      >
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
      Product & {
        price: PriceDetails;
        videoUploaded: VideoUploaded;
      },
      {
        id: string;
        product: Partial<
          Product & {
            price: PriceDetails;
            videoUploaded: VideoUploaded;
          }
        >;
      }
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
