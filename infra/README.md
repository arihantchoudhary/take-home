# Notion Clone Infrastructure

This directory contains Terraform configurations for provisioning AWS infrastructure for the Notion clone application.

## Resources

The infrastructure includes the following DynamoDB tables:

1. **Workspaces** - Stores workspace information
2. **Pages** - Stores page documents with hierarchy support
3. **Blocks** - Stores content blocks within pages
4. **Users** - Stores user information
5. **Workspace Members** - Manages workspace memberships
6. **Page Shares** - Manages guest access to individual pages
7. **Comments** - Stores comments and discussions on blocks and pages
8. **Notifications** - Stores user notifications and mentions
9. **Favorites** - Stores user's favorited pages
10. **Templates** - Stores page templates

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (v1.0+)

## Usage

```bash
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply infrastructure
terraform apply

# Destroy infrastructure (when needed)
terraform destroy
```

## Configuration

You can customize the deployment by setting variables:

```bash
terraform apply -var="environment=prod" -var="aws_region=us-west-2"
```

Or create a `terraform.tfvars` file:

```hcl
environment = "prod"
aws_region  = "us-west-2"
```

## Outputs

After applying, Terraform will output all table names for use in your application configuration.
