// Truncate long text to a given length
export const truncateText = (text: string, maxLength = 5): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Format price as currency
export const formatPrice = (
  price: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
};

// Format large numbers (views, sales count) into readable format
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

// Calculate discount price
export const getDiscountedPrice = (price: number, discount: number): number => {
  return parseFloat((price - price * (discount / 100)).toFixed(2));
};

// Convert ISO date to readable format
export const formatDate = (date: string | Date, locale: string = "en-US") => {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(date)
  );
};

// Capitalize the first letter of a string
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generate a random unique ID (for client-side uses)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Debounce function to optimize performance (useful for search inputs)
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timer: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  }) as T;
};

// Convert camelCase to readable text (e.g. "gameType" → "Game Type")
export const camelCaseToTitle = (text: string): string => {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
