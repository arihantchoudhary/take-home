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

# App Runner Service
resource "aws_apprunner_service" "backend_api" {
  service_name = "${var.environment}-notion-backend-api"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_ecr_role.arn
    }

    image_repository {
      image_configuration {
        port = "3001"
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
      image_identifier      = "${aws_ecr_repository.backend_api.repository_url}:latest"
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = false
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

  tags = {
    Name        = "Notion Backend API"
    Environment = var.environment
  }

  depends_on = [
    aws_iam_role_policy_attachment.apprunner_ecr_policy,
    aws_iam_role_policy.apprunner_dynamodb_policy
  ]
}
