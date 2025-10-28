# Notion Clone - Backend API

A comprehensive backend API for a Notion-like application built with Express, TypeScript, and AWS DynamoDB.

## Features

This backend implements all the core Notion features from the training video:

### Content Management
- ✅ Multiple block types (text, image, video, embed, divider, checkbox)
- ✅ Text formatting (headings, paragraphs, lists, quotes, code)
- ✅ Block ordering and organization
- ✅ Color and background customization

### Page System
- ✅ Hierarchical page structure (pages nested inside pages)
- ✅ Page metadata (title, icon, cover image)
- ✅ Private and shared pages
- ✅ Parent-child page relationships

### Workspace Features
- ✅ Multi-workspace support
- ✅ Workspace members with roles (owner, admin, member)
- ✅ Guest access to individual pages
- ✅ Permission management

### Collaboration
- ✅ Comments on pages and blocks
- ✅ Threaded discussions
- ✅ @mentions to notify users
- ✅ Comment resolution
- ✅ Real-time notification system

### Organization
- ✅ Favorites for quick access
- ✅ Full-text search across pages and blocks
- ✅ Templates for reusable page structures
- ✅ Advanced filtering in search

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: AWS DynamoDB
- **Infrastructure**: Terraform (AWS)
- **Tools**: ts-node, nodemon

## Project Structure

```
backend/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── workspaces.ts
│   │   ├── pages.ts
│   │   ├── blocks.ts
│   │   ├── users.ts
│   │   ├── comments.ts
│   │   ├── notifications.ts
│   │   ├── favorites.ts
│   │   ├── search.ts
│   │   └── templates.ts
│   ├── types.ts          # TypeScript type definitions
│   ├── dynamodb.ts       # DynamoDB database operations
│   ├── server.ts         # Express server setup
│   └── database.ts       # Legacy file-based database (for reference)
├── infra/                # Terraform infrastructure
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── package.json
├── tsconfig.json
├── .env.example
├── API_DOCUMENTATION.md  # Complete API reference
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS account with credentials configured
- Terraform (for infrastructure deployment)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS configuration
   ```

3. **Deploy infrastructure (optional - for AWS)**
   ```bash
   cd infra
   terraform init
   terraform apply
   # Note the table names from outputs
   cd ..
   ```

4. **Update environment with table names**
   ```bash
   # Update .env with table names from Terraform outputs
   ```

### Running the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start at `http://localhost:3001`

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference with all endpoints, request/response formats, and examples.

### Quick API Overview

- `POST /api/workspaces` - Create workspace
- `POST /api/pages` - Create page
- `GET /api/pages/:pageId/blocks` - Get page blocks
- `POST /api/blocks` - Create block (text, image, etc.)
- `PUT /api/blocks/:blockId` - Update block
- `POST /api/comments` - Add comment with mentions
- `POST /api/search` - Search pages and blocks
- `GET /api/favorites/:userId` - Get user favorites
- `GET /api/notifications/:userId` - Get notifications

## Database Schema

### DynamoDB Tables

1. **Workspaces** - Organization containers
2. **Pages** - Document pages with hierarchy
3. **Blocks** - Content blocks within pages
4. **Users** - User accounts
5. **Workspace Members** - Workspace membership
6. **Page Shares** - Guest access control
7. **Comments** - Discussions and mentions
8. **Notifications** - User notifications
9. **Favorites** - User's favorite pages
10. **Templates** - Reusable page templates

All tables use GSIs (Global Secondary Indexes) for efficient querying by workspace, user, page, etc.

## Development

### TypeScript

The project uses TypeScript for type safety. Types are defined in `src/types.ts`:

- `Block` types (TextBlock, ImageBlock, VideoBlock, etc.)
- `Page`, `Workspace`, `User` types
- `Comment`, `Notification`, `Favorite` types
- API request/response types

### Database Operations

All database operations are in `src/dynamodb.ts`:

- CRUD operations for all entities
- Query operations using GSIs
- Relationship management (workspace members, page shares, etc.)
- Search functionality

### Adding New Features

1. Define types in `src/types.ts`
2. Add database operations in `src/dynamodb.ts`
3. Create route handler in `src/routes/`
4. Import and register route in `src/server.ts`
5. Document API in `API_DOCUMENTATION.md`

## Testing

You can test the API using curl, Postman, or any HTTP client:

```bash
# Health check
curl http://localhost:3001/health

# Create a user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Create a workspace
curl -X POST http://localhost:3001/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{"name":"My Workspace","ownerId":"USER_ID"}'

# Create a page
curl -X POST http://localhost:3001/api/pages \
  -H "Content-Type: application/json" \
  -d '{"workspaceId":"WORKSPACE_ID","title":"My First Page","userId":"USER_ID"}'

# Create a text block
curl -X POST http://localhost:3001/api/blocks \
  -H "Content-Type: application/json" \
  -d '{"pageId":"PAGE_ID","type":"text","textType":"h1","value":"Hello World","order":0,"userId":"USER_ID"}'
```

## Infrastructure

### Terraform (AWS)

The `infra/` directory contains Terraform configuration for AWS:

- DynamoDB tables with appropriate indexes
- PAY_PER_REQUEST billing mode (cost-effective for development)
- Configurable region and environment

Deploy with:
```bash
cd infra
terraform init
terraform plan
terraform apply
```

Destroy when done:
```bash
terraform destroy
```

### Local Development

For local development without AWS:

1. Use DynamoDB Local:
   ```bash
   docker run -p 8000:8000 amazon/dynamodb-local
   ```

2. Set `DYNAMODB_ENDPOINT=http://localhost:8000` in `.env`

3. Create tables manually or use AWS CLI

## Environment Variables

See `.env.example` for all configuration options:

- `PORT` - Server port (default: 3001)
- `AWS_REGION` - AWS region for DynamoDB
- `DYNAMODB_ENDPOINT` - Optional local DynamoDB endpoint
- `*_TABLE` - Table names for all entities

## Architecture Decisions

### Why DynamoDB?

- **Scalability**: Seamlessly scales with usage
- **Performance**: Single-digit millisecond latency
- **Serverless**: No infrastructure management
- **Cost-effective**: Pay-per-request model for variable workloads

### Why Express?

- **Simplicity**: Easy to understand and extend
- **Ecosystem**: Rich middleware ecosystem
- **Performance**: Fast and lightweight
- **TypeScript**: First-class TypeScript support

### Why Terraform?

- **Infrastructure as Code**: Version-controlled infrastructure
- **Reproducibility**: Consistent deployments
- **AWS Integration**: Native AWS provider
- **State Management**: Track infrastructure changes

## Future Enhancements

Potential improvements for production:

1. **Authentication**: Implement JWT or OAuth2
2. **Real-time**: Add WebSocket support for live collaboration
3. **File Storage**: Integrate S3 for image/file uploads
4. **Search**: Replace basic search with AWS OpenSearch
5. **Caching**: Add Redis for frequently accessed data
6. **Rate Limiting**: Prevent API abuse
7. **Logging**: Structured logging with CloudWatch
8. **Monitoring**: Add APM and error tracking
9. **Testing**: Unit and integration tests
10. **CI/CD**: Automated deployment pipeline

## License

MIT

## Author

Built as a comprehensive backend for a Notion clone application.
