output "workspaces_table_name" {
  description = "Name of the Workspaces DynamoDB table"
  value       = aws_dynamodb_table.workspaces.name
}

output "pages_table_name" {
  description = "Name of the Pages DynamoDB table"
  value       = aws_dynamodb_table.pages.name
}

output "blocks_table_name" {
  description = "Name of the Blocks DynamoDB table"
  value       = aws_dynamodb_table.blocks.name
}

output "users_table_name" {
  description = "Name of the Users DynamoDB table"
  value       = aws_dynamodb_table.users.name
}

output "workspace_members_table_name" {
  description = "Name of the Workspace Members DynamoDB table"
  value       = aws_dynamodb_table.workspace_members.name
}

output "page_shares_table_name" {
  description = "Name of the Page Shares DynamoDB table"
  value       = aws_dynamodb_table.page_shares.name
}

output "comments_table_name" {
  description = "Name of the Comments DynamoDB table"
  value       = aws_dynamodb_table.comments.name
}

output "notifications_table_name" {
  description = "Name of the Notifications DynamoDB table"
  value       = aws_dynamodb_table.notifications.name
}

output "favorites_table_name" {
  description = "Name of the Favorites DynamoDB table"
  value       = aws_dynamodb_table.favorites.name
}

output "templates_table_name" {
  description = "Name of the Templates DynamoDB table"
  value       = aws_dynamodb_table.templates.name
}

output "ecr_repository_url" {
  description = "URL of the ECR repository for backend API"
  value       = aws_ecr_repository.backend_api.repository_url
}

output "apprunner_service_url" {
  description = "URL of the App Runner service"
  value       = aws_apprunner_service.backend_api.service_url
}

output "apprunner_service_id" {
  description = "ID of the App Runner service"
  value       = aws_apprunner_service.backend_api.service_id
}

output "apprunner_service_status" {
  description = "Status of the App Runner service"
  value       = aws_apprunner_service.backend_api.status
}

output "s3_images_bucket_name" {
  description = "Name of the S3 bucket for images"
  value       = aws_s3_bucket.images.id
}

output "s3_images_bucket_url" {
  description = "URL of the S3 bucket for images"
  value       = "https://${aws_s3_bucket.images.bucket}.s3.${var.aws_region}.amazonaws.com"
}
