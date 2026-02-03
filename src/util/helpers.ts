// lib/helpers.ts

// Format date to DD/MM/YYYY
export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

// Format number as currency (e.g., RWF)
export const formatCurrency = (amount: number, currency = "RWF") => {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Capitalize first letter
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// Generate random ID (optional for frontend temp objects)
export const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate URL-safe slug from text (for company handles, etc.)
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Decode URL-encoded handle (for matching database values)
export const decodeHandle = (handle: string): string => {
  try {
    return decodeURIComponent(handle);
  } catch {
    return handle;
  }
};
