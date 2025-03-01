export const getProductById = async (id: string) => {
  try {
    const response = await fetch(`/api/getGame/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return { success: false, error: (error as Error).message };
  }
};
