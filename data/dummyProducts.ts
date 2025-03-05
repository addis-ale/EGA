export const dummyProducts = [
  {
    id: "1",
    productName: "Game of Thrones: The Board Game",
    productDescription: "A strategic board game based on the hit TV series.",
    uploadedCoverImage:
      "https://via.placeholder.com/300x200?text=Game+of+Thrones+Board+Game",
    price: 59.99, // For sale price
    pricePerHour: 1.99, // Price per hour for rent
    productType: "SALE", // This is a sale-only product
    availableProduct: 10,
    ageRestriction: 16,
    gameType: "Board Game",
    views: 120,
    salesCount: 30,
  },
  {
    id: "2",
    productName: "FIFA 22",
    productDescription: "The latest edition of the FIFA soccer video game.",
    uploadedCoverImage: "https://via.placeholder.com/300x200?text=FIFA+22",
    price: 49.99, // For sale price
    pricePerHour: 3.49, // Price per hour for rent
    productType: "RENT", // This is a rent-only product
    availableProduct: 15,
    ageRestriction: 3,
    gameType: "Video Game",
    views: 450,
    salesCount: 150,
  },
  {
    id: "3",
    productName: "Minecraft",
    productDescription:
      "A sandbox video game that allows players to build and explore worlds.",
    uploadedCoverImage: "https://via.placeholder.com/300x200?text=Minecraft",
    price: 25.0, // For sale price
    pricePerHour: 1.0, // Price per hour for rent
    productType: "BOTH", // Available for both sale and rent
    availableProduct: 20,
    ageRestriction: 7,
    gameType: "Video Game",
    views: 1200,
    salesCount: 300,
  },
  {
    id: "4",
    productName: "Red Dead Redemption 2",
    productDescription:
      "An action-adventure game set in the American Wild West.",
    uploadedCoverImage:
      "https://via.placeholder.com/300x200?text=Red+Dead+Redemption+2",
    price: 39.99, // For sale price
    pricePerHour: 2.5, // Price per hour for rent
    productType: "BOTH", // Available for both sale and rent
    availableProduct: 8,
    ageRestriction: 18,
    gameType: "Video Game",
    views: 800,
    salesCount: 120,
  },
  {
    id: "5",
    productName: "The Legend of Zelda: Breath of the Wild",
    productDescription:
      "An open-world action-adventure game with exploration and puzzle-solving.",
    uploadedCoverImage:
      "https://via.placeholder.com/300x200?text=Zelda+Breath+of+the+Wild",
    price: 59.99, // For sale price
    pricePerHour: 4.0, // Price per hour for rent
    productType: "SALE", // This is a sale-only product
    availableProduct: 5,
    ageRestriction: 10,
    gameType: "Video Game",
    views: 500,
    salesCount: 200,
  },
];

export default dummyProducts;
