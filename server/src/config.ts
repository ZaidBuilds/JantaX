import 'dotenv/config';

const rawJwt = process.env.JWT_SECRET;
if (!rawJwt || rawJwt.length < 16) {
  // Keep fallback for local dev but warn loudly
  console.warn('[config] JWT_SECRET missing or weak — using dev fallback. Set 32+ chars in .env for production.');
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: rawJwt || 'dev-secret-change-me',
  jwtExpiresIn: '7d' as const,
  databaseUrl: process.env.DATABASE_URL,
  apiReadKey: process.env.API_READ_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};
