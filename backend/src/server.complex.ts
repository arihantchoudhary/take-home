import express, { Request, Response } from 'express';
import cors from 'cors';

// Import routes
import workspacesRouter from './routes/workspaces';
import pagesRouter from './routes/pages';
import blocksRouter from './routes/blocks';
import usersRouter from './routes/users';
import commentsRouter from './routes/comments';
import notificationsRouter from './routes/notifications';
import favoritesRouter from './routes/favorites';
import searchRouter from './routes/search';
import templatesRouter from './routes/templates';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/workspaces', workspacesRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/blocks', blocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/search', searchRouter);
app.use('/api/templates', templatesRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'notion-clone-api'
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Notion Clone API',
    version: '1.0.0',
    endpoints: {
      workspaces: '/api/workspaces',
      pages: '/api/pages',
      blocks: '/api/blocks',
      users: '/api/users',
      comments: '/api/comments',
      notifications: '/api/notifications',
      favorites: '/api/favorites',
      search: '/api/search',
      templates: '/api/templates',
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🚀 Notion Clone API Server                         ║
  ║                                                       ║
  ║   Server: http://localhost:${PORT}                      ║
  ║   Health: http://localhost:${PORT}/health               ║
  ║                                                       ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
  ║   AWS Region: ${process.env.AWS_REGION || 'us-east-1'}                        ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
