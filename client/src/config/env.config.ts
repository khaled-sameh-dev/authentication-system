const getBaseUrl = () => {
  const url =
    import.meta.env.VITE_API_BASE_URL ||
    "https://authentication-system-production-40b5.up.railway.app";

  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
};

const rawBaseUrl = getBaseUrl();
const cleanBaseUrl = rawBaseUrl.replace(/\/$/, "");

export const ENV = {
  API_BASE_URL: `${cleanBaseUrl}/api/v1`,
  IS_DEV: import.meta.env.DEV,
};
