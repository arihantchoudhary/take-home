import express, { Request, Response } from 'express';
import cors from 'cors';

// Import routes
import blocksRouter from './routes/blocks-simple';
// import imagesRouter from './routes/images'; // Disabled for Render deployment (no S3)

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
// app.use('/api/images', imagesRouter); // Disabled for Render deployment (no S3)

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'notion-clone-api',
    database: 'file-based'
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
