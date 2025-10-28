# Notion Clone Backend - Deployment Guide

Quick reference for deploying the Notion Clone backend to AWS.

## Prerequisites Checklist

- [x] AWS CLI installed and configured
- [x] Terraform installed (v1.0+)
- [x] Docker installed and running
- [x] Node.js 18+ installed
- [x] AWS credentials with appropriate permissions

## Quick Deployment (5 minutes)

### Option 1: Automated Script

```bash
cd /Users/ari/GitHub/take-home/backend
./deploy.sh
```

This will:
1. Deploy all infrastructure with Terraform
2. Build Docker image
3. Push to ECR
4. Deploy to App Runner
5. Output the API URL

### Option 2: Manual Steps

#### Step 1: Deploy Infrastructure (2 min)
```bash
cd infra
terraform init
terraform apply -auto-approve
```

#### Step 2: Get Infrastructure Details
```bash
ECR_URL=$(terraform output -raw ecr_repository_url)
SERVICE_ID=$(terraform output -raw apprunner_service_id)
SERVICE_URL=$(terraform output -raw apprunner_service_url)
```

#### Step 3: Build & Push Docker Image (2 min)
```bash
cd ..
docker build -t notion-backend-api .
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_URL
docker tag notion-backend-api:latest $ECR_URL:latest
docker push $ECR_URL:latest
```

#### Step 4: Deploy to App Runner (1 min)
```bash
aws apprunner start-deployment \
  --service-arn $SERVICE_ID \
  --region us-east-1
```

#### Step 5: Verify
```bash
# Wait a moment for deployment
sleep 30

# Test the API
curl $SERVICE_URL/health
```

## Post-Deployment

### Get Your API URL
```bash
cd infra
terraform output apprunner_service_url
```

### Test the API
```bash
# Health check
curl https://your-service-url.awsapprunner.com/health

# Get API info
curl https://your-service-url.awsapprunner.com/

# Create a user
curl -X POST https://your-service-url.awsapprunner.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### View Logs
```bash
# Get service ID
SERVICE_ID=$(cd infra && terraform output -raw apprunner_service_id)

# Tail logs
aws logs tail /aws/apprunner/$SERVICE_ID --follow
```

## Environment Configuration

### Development
```bash
export AWS_REGION=us-east-1
export ENVIRONMENT=dev
./deploy.sh
```

### Production
```bash
export AWS_REGION=us-east-1
export ENVIRONMENT=prod
./deploy.sh
```

## Update Deployment

### Application Changes
```bash
# Build new image
docker build -t notion-backend-api .

# Push to ECR
docker push $ECR_URL:latest

# Trigger deployment
aws apprunner start-deployment --service-arn $SERVICE_ID --region us-east-1
```

### Infrastructure Changes
```bash
cd infra
terraform plan    # Review changes
terraform apply   # Apply changes
```

## Troubleshooting

### Build Fails
```bash
# Check Docker
docker --version
docker ps

# Rebuild
docker build --no-cache -t notion-backend-api .
```

### Push to ECR Fails
```bash
# Re-authenticate
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_URL

# Retry push
docker push $ECR_URL:latest
```

### App Runner Issues
```bash
# Check service status
aws apprunner describe-service --service-arn $SERVICE_ID

# View logs
aws logs tail /aws/apprunner/$SERVICE_ID --follow
```

### Health Check Fails
```bash
# Wait for deployment
aws apprunner wait service-created --service-arn $SERVICE_ID

# Check again
curl $SERVICE_URL/health
```

## Cleanup

### Destroy Everything
```bash
cd infra
terraform destroy -auto-approve
```

**Warning**: This deletes all data!

### Keep Data, Stop Services
```bash
# Stop App Runner (manual via AWS Console)
# Keep DynamoDB tables for data persistence
```

## Cost Management

### Monitor Costs
```bash
# View current month's costs
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

### Optimize Costs
- DynamoDB: Already using PAY_PER_REQUEST
- App Runner: Consider pausing for unused environments
- ECR: Delete old images regularly

## Next Steps

1. **Test the API** - See API_DOCUMENTATION.md for all endpoints
2. **Configure Frontend** - Point frontend to your API URL
3. **Set up Monitoring** - CloudWatch alarms for errors
4. **Add Authentication** - Implement JWT/OAuth
5. **Enable HTTPS** - Already enabled via App Runner

## Support

- **Infrastructure Issues**: Check infra/README.md
- **API Issues**: Check API_DOCUMENTATION.md
- **Application Issues**: Check backend/README.md
- **AWS Console**: https://console.aws.amazon.com/apprunner/

## Quick Commands Reference

```bash
# Deploy
./deploy.sh

# Get API URL
cd infra && terraform output apprunner_service_url

# View logs
aws logs tail /aws/apprunner/$(cd infra && terraform output -raw apprunner_service_id) --follow

# Redeploy
aws apprunner start-deployment --service-arn $(cd infra && terraform output -raw apprunner_service_id) --region us-east-1

# Destroy
cd infra && terraform destroy
```
