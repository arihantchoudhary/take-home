terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Workspaces Table
resource "aws_dynamodb_table" "workspaces" {
  name           = "${var.environment}-notion-workspaces"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "workspaceId"

  attribute {
    name = "workspaceId"
    type = "S"
  }

  tags = {
    Name        = "Notion Workspaces"
    Environment = var.environment
  }
}

# Pages Table
resource "aws_dynamodb_table" "pages" {
  name           = "${var.environment}-notion-pages"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "pageId"

  attribute {
    name = "pageId"
    type = "S"
  }

  attribute {
    name = "workspaceId"
    type = "S"
  }

  attribute {
    name = "parentPageId"
    type = "S"
  }

  global_secondary_index {
    name            = "WorkspaceIndex"
    hash_key        = "workspaceId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "ParentPageIndex"
    hash_key        = "parentPageId"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Pages"
    Environment = var.environment
  }
}

# Blocks Table
resource "aws_dynamodb_table" "blocks" {
  name           = "${var.environment}-notion-blocks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "blockId"

  attribute {
    name = "blockId"
    type = "S"
  }

  attribute {
    name = "pageId"
    type = "S"
  }

  attribute {
    name = "order"
    type = "N"
  }

  global_secondary_index {
    name            = "PageIndex"
    hash_key        = "pageId"
    range_key       = "order"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Blocks"
    Environment = var.environment
  }
}

# Users Table
resource "aws_dynamodb_table" "users" {
  name           = "${var.environment}-notion-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Users"
    Environment = var.environment
  }
}

# Workspace Members Table
resource "aws_dynamodb_table" "workspace_members" {
  name           = "${var.environment}-notion-workspace-members"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "workspaceId"
  range_key      = "userId"

  attribute {
    name = "workspaceId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "UserIndex"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Workspace Members"
    Environment = var.environment
  }
}

# Page Shares (Guests) Table
resource "aws_dynamodb_table" "page_shares" {
  name           = "${var.environment}-notion-page-shares"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "pageId"
  range_key      = "userId"

  attribute {
    name = "pageId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "UserIndex"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Page Shares"
    Environment = var.environment
  }
}

# Comments Table
resource "aws_dynamodb_table" "comments" {
  name           = "${var.environment}-notion-comments"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "commentId"

  attribute {
    name = "commentId"
    type = "S"
  }

  attribute {
    name = "pageId"
    type = "S"
  }

  attribute {
    name = "blockId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "N"
  }

  global_secondary_index {
    name            = "PageIndex"
    hash_key        = "pageId"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "BlockIndex"
    hash_key        = "blockId"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Comments"
    Environment = var.environment
  }
}

# Notifications Table
resource "aws_dynamodb_table" "notifications" {
  name           = "${var.environment}-notion-notifications"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "notificationId"

  attribute {
    name = "notificationId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "N"
  }

  global_secondary_index {
    name            = "UserIndex"
    hash_key        = "userId"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Notifications"
    Environment = var.environment
  }
}

# Favorites Table
resource "aws_dynamodb_table" "favorites" {
  name           = "${var.environment}-notion-favorites"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "pageId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "pageId"
    type = "S"
  }

  attribute {
    name = "order"
    type = "N"
  }

  global_secondary_index {
    name            = "OrderIndex"
    hash_key        = "userId"
    range_key       = "order"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Favorites"
    Environment = var.environment
  }
}

# Templates Table
resource "aws_dynamodb_table" "templates" {
  name           = "${var.environment}-notion-templates"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "templateId"

  attribute {
    name = "templateId"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  global_secondary_index {
    name            = "CategoryIndex"
    hash_key        = "category"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Notion Templates"
    Environment = var.environment
  }
}

# ECR Repository for Backend API
resource "aws_ecr_repository" "backend_api" {
  name                 = "${var.environment}-notion-backend-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "Notion Backend API"
    Environment = var.environment
  }
}

# IAM Role for CodeBuild
resource "aws_iam_role" "codebuild_role" {
  name = "${var.environment}-codebuild-backend-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "CodeBuild Backend Role"
    Environment = var.environment
  }
}

# IAM Policy for CodeBuild
resource "aws_iam_role_policy" "codebuild_policy" {
  name = "${var.environment}-codebuild-backend-policy"
  role = aws_iam_role.codebuild_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/codebuild/*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "*"
      }
    ]
  })
}

# CodeBuild Project
resource "aws_codebuild_project" "backend_build" {
  name          = "${var.environment}-notion-backend-build"
  description   = "Build and push backend API Docker image"
  build_timeout = "15"
  service_role  = aws_iam_role.codebuild_role.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:7.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

    environment_variable {
      name  = "AWS_DEFAULT_REGION"
      value = var.aws_region
    }

    environment_variable {
      name  = "AWS_ACCOUNT_ID"
      value = data.aws_caller_identity.current.account_id
    }

    environment_variable {
      name  = "IMAGE_REPO_NAME"
      value = aws_ecr_repository.backend_api.name
    }
  }

  source {
    type      = "NO_SOURCE"
    buildspec = file("${path.module}/../backend/buildspec.yml")
  }

  tags = {
    Name        = "Backend Build Project"
    Environment = var.environment
  }
}

# Data source to get AWS account ID
data "aws_caller_identity" "current" {}

# IAM Role for App Runner
resource "aws_iam_role" "apprunner_service_role" {
  name = "${var.environment}-apprunner-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "tasks.apprunner.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "App Runner Service Role"
    Environment = var.environment
  }
}

# IAM Policy for DynamoDB access
resource "aws_iam_role_policy" "apprunner_dynamodb_policy" {
  name = "${var.environment}-apprunner-dynamodb-policy"
  role = aws_iam_role.apprunner_service_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.workspaces.arn,
          aws_dynamodb_table.pages.arn,
          aws_dynamodb_table.blocks.arn,
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.workspace_members.arn,
          aws_dynamodb_table.page_shares.arn,
          aws_dynamodb_table.comments.arn,
          aws_dynamodb_table.notifications.arn,
          aws_dynamodb_table.favorites.arn,
          aws_dynamodb_table.templates.arn,
          "${aws_dynamodb_table.pages.arn}/index/*",
          "${aws_dynamodb_table.blocks.arn}/index/*",
          "${aws_dynamodb_table.users.arn}/index/*",
          "${aws_dynamodb_table.workspace_members.arn}/index/*",
          "${aws_dynamodb_table.page_shares.arn}/index/*",
          "${aws_dynamodb_table.comments.arn}/index/*",
          "${aws_dynamodb_table.notifications.arn}/index/*",
          "${aws_dynamodb_table.favorites.arn}/index/*",
          "${aws_dynamodb_table.templates.arn}/index/*"
        ]
      }
    ]
  })
}

# IAM Role for App Runner ECR Access
resource "aws_iam_role" "apprunner_ecr_role" {
  name = "${var.environment}-apprunner-ecr-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "App Runner ECR Access Role"
    Environment = var.environment
  }
}

# Attach ECR access policy to the role
resource "aws_iam_role_policy_attachment" "apprunner_ecr_policy" {
  role       = aws_iam_role.apprunner_ecr_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

# App Runner Auto Scaling Configuration
resource "aws_apprunner_auto_scaling_configuration_version" "backend_api" {
  auto_scaling_configuration_name = "${var.environment}-notion-backend-asg"

  max_concurrency = 100
  max_size        = 10
  min_size        = 1

  tags = {
    Name        = "Backend API Auto Scaling"
    Environment = var.environment
  }
}

# App Runner Connection to GitHub (must be created manually via console first)
# You'll need to create this connection in the AWS Console:
# https://console.aws.amazon.com/apprunner/home#/create-connection
# Then use: terraform import aws_apprunner_connection.github <connection-arn>

resource "aws_apprunner_connection" "github" {
  connection_name = "${var.environment}-github-connection"
  provider_type   = "GITHUB"

  tags = {
    Name        = "GitHub Connection"
    Environment = var.environment
  }
}

# App Runner Service
resource "aws_apprunner_service" "backend_api" {
  service_name = "${var.environment}-notion-backend-api"

  source_configuration {
    authentication_configuration {
      connection_arn = aws_apprunner_connection.github.arn
    }

    code_repository {
      repository_url = var.github_repo_url

      code_configuration {
        configuration_source = "API"

        code_configuration_values {
          runtime                       = "NODEJS_20"
          build_command                 = "npm install && npm run build"
          start_command                 = "npm start"
          port                          = "3001"
          runtime_environment_variables = {
            NODE_ENV                     = var.environment
            AWS_REGION                   = var.aws_region
            BLOCKS_TABLE_NAME            = aws_dynamodb_table.blocks.name
            PAGES_TABLE_NAME             = aws_dynamodb_table.pages.name
            WORKSPACES_TABLE_NAME        = aws_dynamodb_table.workspaces.name
            USERS_TABLE_NAME             = aws_dynamodb_table.users.name
            WORKSPACE_MEMBERS_TABLE_NAME = aws_dynamodb_table.workspace_members.name
            PAGE_SHARES_TABLE_NAME       = aws_dynamodb_table.page_shares.name
            COMMENTS_TABLE_NAME          = aws_dynamodb_table.comments.name
            NOTIFICATIONS_TABLE_NAME     = aws_dynamodb_table.notifications.name
            FAVORITES_TABLE_NAME         = aws_dynamodb_table.favorites.name
            TEMPLATES_TABLE_NAME         = aws_dynamodb_table.templates.name
          }
        }
      }

      source_code_version {
        type  = "BRANCH"
        value = var.github_branch
      }

      source_directory = "/backend"
    }

    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu               = "1024"
    memory            = "2048"
    instance_role_arn = aws_iam_role.apprunner_service_role.arn
  }

  health_check_configuration {
    protocol            = "HTTP"
    path                = "/health"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.backend_api.arn

  tags = {
    Name        = "Notion Backend API"
    Environment = var.environment
  }

  depends_on = [
    aws_iam_role_policy.apprunner_dynamodb_policy,
    aws_apprunner_connection.github
  ]
}

# ============= S3 Bucket for Image Storage =============

resource "aws_s3_bucket" "images" {
  bucket = "${var.environment}-notion-images-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "Notion Images"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_public_access_block" "images" {
  bucket = aws_s3_bucket.images.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "images" {
  bucket = aws_s3_bucket.images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "images" {
  bucket = aws_s3_bucket.images.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.images.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.images]
}

# IAM Policy for S3 access
resource "aws_iam_role_policy" "apprunner_s3_policy" {
  name = "${var.environment}-apprunner-s3-policy"
  role = aws_iam_role.apprunner_service_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ]
        Resource = "${aws_s3_bucket.images.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.images.arn
      }
    ]
  })
}
