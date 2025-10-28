import express, { Request, Response } from 'express';
import cors from 'cors';

// Import routes
import blocksRouter from './routes/blocks-simple';

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
app.use('/api/blocks', blocksRouter);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'notion-clone-api',
    database: 'dynamodb',
    region: process.env.AWS_REGION || 'us-east-1',
    tables: {
      blocks: process.env.BLOCKS_TABLE || 'dev-notion-blocks',
      pages: process.env.PAGES_TABLE || 'dev-notion-pages',
      workspaces: process.env.WORKSPACES_TABLE || 'dev-notion-workspaces'
    }
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Notion Clone API',
    version: '1.0.0',
    endpoints: {
      blocks: '/api/blocks',
      health: '/health'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('  🚀 Notion Clone API Server');
  console.log('='.repeat(50));
  console.log(`  Server: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log(`  Blocks: http://localhost:${PORT}/api/blocks`);
  console.log('='.repeat(50) + '\n');
});
