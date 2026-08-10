export const ENV = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5003/api/v1",
  IS_DEV: import.meta.env.DEV,
};
