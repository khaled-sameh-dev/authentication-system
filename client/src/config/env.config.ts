export const ENV = {
  API_BASE_URL:
    `${import.meta.env.VITE_API_BASE_URL}/api/v1` ||
    "https://authentication-system-one-orpin.vercel.app/register/api/v1",
  IS_DEV: import.meta.env.DEV,
};
