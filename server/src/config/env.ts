import "dotenv/config";

const env = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  CLIENT_URL: process.env.CLIENT_URL,
};

export default env;
