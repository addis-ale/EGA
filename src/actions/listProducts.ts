// src/actions/productActions.js or wherever you keep your action functions

export const fetchProducts = async (category: string, page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `/api/products?category=${category}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    return { success: true, products: data };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, error: (error as Error).message };
  }
};
