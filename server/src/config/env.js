import 'dotenv/config';

for (const key of ['MONGODB_URI', 'SESSION_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((u) => u.trim()),
  isProd: process.env.NODE_ENV === 'production',
  cookieSameSite: process.env.COOKIE_SAMESITE || 'lax',
};
