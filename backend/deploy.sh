#!/bin/bash

# Notion Clone Backend - Deployment Script
# This script deploys the backend to AWS App Runner via ECR

set -e  # Exit on error

echo "🚀 Notion Clone Backend Deployment"
echo "==================================="
echo ""

# Check if required tools are installed
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed. Aborting." >&2; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo "❌ Terraform is required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-dev}"

echo "📋 Configuration:"
echo "   AWS Region: $AWS_REGION"
echo "   Environment: $ENVIRONMENT"
echo ""

# Step 1: Deploy Infrastructure
echo "🏗️  Step 1: Deploying infrastructure with Terraform..."
cd infra

if [ ! -f "terraform.tfstate" ]; then
    echo "   Initializing Terraform..."
    terraform init
fi

echo "   Planning infrastructure changes..."
terraform plan -var="aws_region=$AWS_REGION" -var="environment=$ENVIRONMENT"

read -p "   Continue with terraform apply? (yes/no): " -n 3 -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]
then
    echo "❌ Deployment cancelled."
    exit 1
fi

echo "   Applying infrastructure changes..."
terraform apply -var="aws_region=$AWS_REGION" -var="environment=$ENVIRONMENT" -auto-approve

# Get outputs from Terraform
echo "   Getting infrastructure outputs..."
ECR_URL=$(terraform output -raw ecr_repository_url)
APPRUNNER_SERVICE_ID=$(terraform output -raw apprunner_service_id)

cd ..

echo "✅ Infrastructure deployed successfully!"
echo ""

# Step 2: Build Docker image
echo "🐳 Step 2: Building Docker image..."
docker build -t notion-backend-api:latest .

echo "✅ Docker image built successfully!"
echo ""

# Step 3: Push to ECR
echo "📤 Step 3: Pushing image to ECR..."
echo "   ECR Repository: $ECR_URL"

# Login to ECR
echo "   Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

# Tag image
echo "   Tagging image..."
docker tag notion-backend-api:latest $ECR_URL:latest

# Push image
echo "   Pushing image..."
docker push $ECR_URL:latest

echo "✅ Image pushed to ECR successfully!"
echo ""

# Step 4: Update App Runner
echo "🔄 Step 4: Triggering App Runner deployment..."
aws apprunner start-deployment \
    --service-arn $APPRUNNER_SERVICE_ID \
    --region $AWS_REGION

echo "✅ Deployment triggered!"
echo ""

# Step 5: Wait for deployment (optional)
echo "⏳ Waiting for deployment to complete..."
echo "   (This may take a few minutes...)"

aws apprunner wait service-created \
    --service-arn $APPRUNNER_SERVICE_ID \
    --region $AWS_REGION 2>/dev/null || true

# Get service URL
cd infra
SERVICE_URL=$(terraform output -raw apprunner_service_url)
cd ..

echo ""
echo "✅ Deployment Complete!"
echo "=================================="
echo ""
echo "🌐 Your API is now available at:"
echo "   $SERVICE_URL"
echo ""
echo "🔍 Health Check:"
echo "   $SERVICE_URL/health"
echo ""
echo "📊 View service status:"
echo "   aws apprunner describe-service --service-arn $APPRUNNER_SERVICE_ID --region $AWS_REGION"
echo ""
echo "📝 View logs:"
echo "   aws logs tail /aws/apprunner/$APPRUNNER_SERVICE_ID --follow"
echo ""
