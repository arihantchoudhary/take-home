import express, { Request, Response } from 'express';
import cors from 'cors';

// Import routes - using DynamoDB routes for persistent storage
import blocksRouter from './routes/blocks';
import pagesRouter from './routes/pages';
// import imagesRouter from './routes/images'; // Disabled for Render deployment (no S3)

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
// Increase JSON body size limit to 50MB for cover images (base64 encoded)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/blocks', blocksRouter);
app.use('/api/pages', pagesRouter);
// app.use('/api/images', imagesRouter); // Disabled for Render deployment (no S3)

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'notion-clone-api',
    database: 'dynamodb',
    region: process.env.AWS_REGION || 'us-east-1'
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Notion Clone API',
    version: '1.0.0',
    endpoints: {
      blocks: '/api/blocks',
      pages: '/api/pages',
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
