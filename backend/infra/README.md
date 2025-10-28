# Notion Clone Infrastructure

This directory contains Terraform configurations for deploying the Notion Clone backend to AWS.

## Architecture

```
Infrastructure Components:
├── DynamoDB Tables (10)
│   ├── Workspaces
│   ├── Pages (with GSIs: WorkspaceIndex, ParentPageIndex)
│   ├── Blocks (with GSI: PageIndex)
│   ├── Users (with GSI: EmailIndex)
│   ├── Workspace Members (with GSI: UserIndex)
│   ├── Page Shares (with GSI: UserIndex)
│   ├── Comments (with GSIs: PageIndex, BlockIndex)
│   ├── Notifications (with GSI: UserIndex)
│   ├── Favorites (with GSI: OrderIndex)
│   └── Templates (with GSI: CategoryIndex)
├── ECR Repository (for Docker images)
├── App Runner Service (container hosting)
└── IAM Roles & Policies (service permissions)
```

## Resources Managed

### DynamoDB Tables
- **10 tables** for comprehensive Notion clone functionality
- **PAY_PER_REQUEST** billing mode for cost-effectiveness
- **Global Secondary Indexes** for efficient querying
- All tables tagged with `Environment` and `Name`

### Container Infrastructure
- **ECR Repository**: Stores Docker images for the backend API
- **App Runner Service**: Runs the containerized backend
  - Auto-scaling enabled
  - Health checks configured
  - Environment variables injected
  - IAM role with DynamoDB permissions

### IAM Configuration
- **Service Role**: Allows App Runner to access DynamoDB
- **ECR Access Role**: Enables App Runner to pull images
- **Least Privilege**: Only necessary permissions granted

## Prerequisites

- AWS CLI configured with credentials
- Terraform 1.0+
- Docker (for building and pushing images)
- Bash shell (for deployment script)

## Quick Start

### 1. Initialize Terraform

```bash
cd /Users/ari/GitHub/take-home/backend/infra
terraform init
```

### 2. Review Infrastructure Plan

```bash
terraform plan -var="environment=dev" -var="aws_region=us-east-1"
```

### 3. Deploy Infrastructure

```bash
terraform apply -var="environment=dev" -var="aws_region=us-east-1"
```

### 4. Note the Outputs

After deployment, Terraform will output:
- All DynamoDB table names
- ECR repository URL
- App Runner service URL
- App Runner service ID

## Configuration

### Variables

Edit `variables.tf` or create `terraform.tfvars`:

```hcl
aws_region  = "us-east-1"
environment = "dev"  # or "staging", "prod"
```

### Environments

The infrastructure supports multiple environments:
- **dev** - Development environment
- **staging** - Staging environment
- **prod** - Production environment

Table names are prefixed with the environment: `{environment}-notion-{table}`

## Deployment

### Automated Deployment

Use the deployment script from the backend directory:

```bash
cd /Users/ari/GitHub/take-home/backend
./deploy.sh
```

The script will:
1. Deploy infrastructure with Terraform
2. Build Docker image
3. Push image to ECR
4. Trigger App Runner deployment
5. Wait for deployment to complete

### Manual Deployment

#### Step 1: Deploy Infrastructure
```bash
cd infra
terraform init
terraform apply
```

#### Step 2: Build and Push Docker Image
```bash
cd ..
# Get ECR URL from Terraform output
ECR_URL=$(cd infra && terraform output -raw ecr_repository_url && cd ..)

# Build image
docker build -t notion-backend-api .

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_URL

# Tag and push
docker tag notion-backend-api:latest $ECR_URL:latest
docker push $ECR_URL:latest
```

#### Step 3: Trigger Deployment
```bash
# Get service ID
SERVICE_ID=$(cd infra && terraform output -raw apprunner_service_id && cd ..)

# Trigger deployment
aws apprunner start-deployment --service-arn $SERVICE_ID --region us-east-1
```

## Outputs

After deployment, access outputs with:

```bash
terraform output
```

Key outputs:
- `apprunner_service_url` - Your API endpoint
- `ecr_repository_url` - Docker registry URL
- `*_table_name` - All DynamoDB table names

## Monitoring

### Health Check
```bash
SERVICE_URL=$(terraform output -raw apprunner_service_url)
curl $SERVICE_URL/health
```

### Service Status
```bash
SERVICE_ID=$(terraform output -raw apprunner_service_id)
aws apprunner describe-service --service-arn $SERVICE_ID --region us-east-1
```

### View Logs
```bash
aws logs tail /aws/apprunner/$SERVICE_ID --follow
```

## Cost Optimization

- **DynamoDB**: PAY_PER_REQUEST mode - only pay for actual usage
- **App Runner**: Auto-scales to zero when not in use (in supported configurations)
- **ECR**: Minimal storage costs for Docker images

Estimated costs for low-traffic development:
- DynamoDB: ~$1-5/month
- App Runner: ~$10-30/month
- Total: ~$15-40/month

## Cleanup

To destroy all infrastructure:

```bash
terraform destroy
```

**Warning**: This will delete all data in DynamoDB tables!

For production, consider:
1. Backup DynamoDB tables first
2. Export data to S3
3. Use lifecycle policies for ECR images

## Troubleshooting

### Deployment Fails

Check App Runner service status:
```bash
aws apprunner describe-service --service-arn <SERVICE_ARN> --region us-east-1
```

View logs:
```bash
aws logs tail /aws/apprunner/<SERVICE_ID> --follow
```

### Table Already Exists

If tables exist from a previous deployment:
```bash
terraform import aws_dynamodb_table.workspaces dev-notion-workspaces
# Repeat for all tables
```

### ECR Push Fails

Re-authenticate:
```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <ECR_URL>
```

## Security

### Best Practices

1. **IAM Roles**: Service uses IAM roles, not access keys
2. **Least Privilege**: Only necessary DynamoDB permissions granted
3. **Environment Variables**: Sensitive data via environment, not code
4. **Image Scanning**: ECR scans images for vulnerabilities

### Production Hardening

For production deployments:
1. Enable DynamoDB point-in-time recovery
2. Set up CloudWatch alarms
3. Configure VPC for App Runner
4. Enable WAF for API protection
5. Use AWS Secrets Manager for sensitive config

## Updates

### Infrastructure Changes

1. Edit Terraform files
2. Run `terraform plan` to review
3. Run `terraform apply` to apply changes

### Application Updates

1. Build new Docker image
2. Push to ECR with new tag or `:latest`
3. Trigger App Runner deployment

App Runner automatically pulls and deploys the new image.

## Support

For issues:
1. Check Terraform state: `terraform show`
2. Review AWS Console for resource status
3. Check CloudWatch Logs for application errors
4. Verify IAM permissions

## Related Documentation

- [Backend README](../README.md) - Application architecture
- [API Documentation](../API_DOCUMENTATION.md) - API endpoints
- [Main README](../../README.md) - Project overview
