variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "github_repo_url" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/arihantchoudhary/take-home"
}

variable "github_branch" {
  description = "GitHub branch to deploy from"
  type        = string
  default     = "main"
}
