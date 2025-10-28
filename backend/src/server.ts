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
    message: 'Notion Clone API - Full Featured',
    version: '2.0.0',
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
      health: '/health'
    },
    documentation: 'See API_DOCUMENTATION.md for full API reference'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(67));
  console.log('  🚀 Notion Clone API Server - Full Featured');
  console.log('='.repeat(67));
  console.log(`  Server: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log('');
  console.log('  Available Endpoints:');
  console.log(`  - Workspaces:     http://localhost:${PORT}/api/workspaces`);
  console.log(`  - Pages:          http://localhost:${PORT}/api/pages`);
  console.log(`  - Blocks:         http://localhost:${PORT}/api/blocks`);
  console.log(`  - Users:          http://localhost:${PORT}/api/users`);
  console.log(`  - Comments:       http://localhost:${PORT}/api/comments`);
  console.log(`  - Notifications:  http://localhost:${PORT}/api/notifications`);
  console.log(`  - Favorites:      http://localhost:${PORT}/api/favorites`);
  console.log(`  - Search:         http://localhost:${PORT}/api/search`);
  console.log(`  - Templates:      http://localhost:${PORT}/api/templates`);
  console.log('='.repeat(67) + '\n');
});
