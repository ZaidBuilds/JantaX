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

// Simple in-memory rate limit: 120 req / 15m per IP (anon), 1000 auth
const _rateMap = new Map();
app.use((req, res, next) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'local';
  const key = 'rl:' + ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = req.headers.authorization ? 1000 : 120;
  let entry = _rateMap.get(key);
  if (!entry || now > entry.reset) {
    entry = { count: 0, reset: now + windowMs };
  }
  entry.count += 1;
  _rateMap.set(key, entry);
  if (entry.count > max) {
    return res.status(429).json({ error: 'Too many requests - slow down' });
  }
  // cleanup occasionally
  if (_rateMap.size > 5000) {
    for (const [k, v] of _rateMap.entries()) {
      if (now > v.reset) {
        _rateMap.delete(k);
      }
    }
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

