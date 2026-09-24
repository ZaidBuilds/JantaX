import 'dotenv/config';

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const rawJwt = process.env.JWT_SECRET;
if (!rawJwt || rawJwt.length < 32) {
  if (isProd) {
    // Never run production with a guessable signing key.
    throw new Error('[config] JWT_SECRET must be set to 32+ chars in production.');
  }
  console.warn('[config] JWT_SECRET missing or weak — using dev fallback. Set 32+ chars in .env.');
}

if (!process.env.DATABASE_URL) {
  throw new Error('[config] DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
}

// Comma-separated list of allowed browser origins. Empty in dev = allow all.
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (isProd && corsOrigins.length === 0) {
  throw new Error('[config] CORS_ORIGIN must list the frontend origin(s) in production.');
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: rawJwt || 'dev-secret-change-me',
  jwtExpiresIn: '7d' as const,
  databaseUrl: process.env.DATABASE_URL,
  apiReadKey: process.env.API_READ_KEY || '',
  corsOrigins,
  nodeEnv,
  isProd,
};
