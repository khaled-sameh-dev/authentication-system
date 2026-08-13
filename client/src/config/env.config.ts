const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://authentication-system-production-40b5.up.railway.app";

const cleanBaseUrl = rawBaseUrl.replace(/\/$/, "");

export const ENV = {
  API_BASE_URL: `${cleanBaseUrl}/api/v1`,
  IS_DEV: import.meta.env.DEV,
};
