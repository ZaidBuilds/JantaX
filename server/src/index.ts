import express from 'express';
import cors from 'cors';
import { config } from './config';
import { requireAuth } from './middleware/auth';
import pincodeRoutes from './routes/pincode';
import recordsRoutes from './routes/records';
import reportsRoutes from './routes/reports';
import correctionsRoutes from './routes/corrections';
import sourcesRoutes from './routes/sources';
import adminSyncRoutes from './routes/adminSync';
import searchRoutes from './routes/search';
import locationsRoutes from './routes/locations';
import schoolsRoutes from './routes/schools';
import infrastructureRoutes from './routes/infrastructure';
import contractorsRoutes from './routes/contractors';
import reraRoutes from './routes/rera';
import issuesRoutes from './routes/issues';
import methodologyRoutes from './routes/methodology';
import staffingRoutes from './routes/staffing';
import moderationRoutes from './routes/moderation';
import v1Routes from './routes/v1';
import authRoutes from './routes/auth';
import airRoutes from './routes/air';
import dataRoutes from './routes/data';

const app = express();

// Security headers (helmet-lite)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// Request logger (morgan-lite -> pino)
app.use((req, _res, next) => {
  if (config.nodeEnv !== 'test') {
    console.log('[api] ' + new Date().toISOString() + ' ' + req.method + ' ' + req.originalUrl);
  }
  next();
});

// In-memory rate limit per IP. Reads are generous: one page view makes several API calls, and many Indian
// mobile users share a single public IP (carrier NAT). Writes (reports, sign-ups, imports) stay strict.
const RATE_WINDOW_MS = 5 * 60 * 1000;
const READ_LIMIT = Number(process.env.RATE_LIMIT_READS) || 1500;
const WRITE_LIMIT = Number(process.env.RATE_LIMIT_WRITES) || 60;
const _rateMap = new Map<string, { count: number; reset: number }>();
app.use((req, res, next) => {
  if (req.path === '/health' || req.method === 'OPTIONS') return next();
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'local';
  const write = !['GET', 'HEAD'].includes(req.method);
  const key = `${write ? 'w' : 'r'}:${ip}`;
  const now = Date.now();
  let entry = _rateMap.get(key);
  if (!entry || now > entry.reset) entry = { count: 0, reset: now + RATE_WINDOW_MS };
  entry.count += 1;
  _rateMap.set(key, entry);
  const max = (write ? WRITE_LIMIT : READ_LIMIT) * (req.headers.authorization ? 5 : 1);
  if (entry.count > max) {
    res.setHeader('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
    return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
  }
  if (_rateMap.size > 5000) {
    for (const [k, v] of _rateMap.entries()) if (now > v.reset) _rateMap.delete(k);
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({ name: 'JantaX API', status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use(requireAuth);
app.use('/api/auth', authRoutes);

// Routers that declare full paths (/pincode/:code, /reports, ...) share the /api prefix.
app.use('/api', pincodeRoutes);
app.use('/api', recordsRoutes);
app.use('/api', reportsRoutes);
app.use('/api', correctionsRoutes);
app.use('/api', sourcesRoutes);
app.use('/api', adminSyncRoutes);
app.use('/api', moderationRoutes);
app.use('/api', airRoutes);
app.use('/api', dataRoutes);
// Resource routers declare '/' and '/:id', so each needs its own prefix.
app.use('/api/search', searchRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/infrastructure', infrastructureRoutes);
app.use('/api/contractors', contractorsRoutes);
app.use('/api/rera', reraRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/methodology', methodologyRoutes);
app.use('/api/staffing', staffingRoutes);
app.use('/api/v1', v1Routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler (Prisma P2002 -> 409, JWT -> 401, zod -> 400)
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('[api:error]', err?.message || err);
  if (err?.code === 'P2002') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  const status = err?.status || err?.statusCode || 500;
  const msg = status === 500 ? 'Internal server error' : err?.message || 'Unknown error';
  res.status(status).json({ error: msg });
});

import { startIngestionCron } from './jobs/cron';
startIngestionCron();

app.listen(config.port, () => {
  console.log('JantaX API listening on port ' + config.port + ' [' + config.nodeEnv + ']');
});

export default app;

