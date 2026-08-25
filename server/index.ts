import express from 'express';
import path from 'path';
import { apiRouter } from './apiRouter';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// In production, serve static files from dist
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV === 'production' || process.env.RUN_STANDALONE === 'true') {
  app.listen(PORT, () => {
    console.log(`[CompanyOS] Server running in production mode on port ${PORT}`);
  });
}

export default app;
