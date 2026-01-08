# DevOps Documentation

This document outlines the DevOps practices and workflows implemented for the E-Summit 2026 project.

## Overview

The DevOps setup includes automated CI/CD pipelines, security scanning, performance monitoring, and deployment management using GitHub Actions.

## Workflows

### 1. CI Pipeline (`ci.yml`)
**Purpose**: Comprehensive continuous integration with testing, security scanning, and preview deployments.

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs**:
- **Frontend Tests**: Runs unit tests, builds, and linting
- **Backend Tests**: Runs API tests, database migrations, and backend linting
- **Security Scan**: CodeQL security analysis
- **Preview Deploy**: Deploys to Vercel preview environment

### 2. Staging Deployment (`deploy-staging.yml`)
**Purpose**: Automated deployment to staging environment.

**Triggers**:
- Push to `develop` branch
- Manual trigger

**Features**:
- Parallel frontend/backend deployment
- Health checks
- Rollback on failure

### 3. Production Deployment (`deploy-production.yml`)
**Purpose**: Safe production deployment with manual approval.

**Triggers**:
- Manual trigger only

**Features**:
- Manual approval required
- Database migration validation
- Health checks
- Rollback capability

### 4. Performance Monitoring (`performance.yml`)
**Purpose**: Daily performance monitoring and bundle analysis.

**Triggers**:
- Daily at 2 AM UTC
- Manual trigger

**Jobs**:
- **Lighthouse**: Performance, accessibility, and SEO audits
- **Bundle Analysis**: Bundle size monitoring
- **API Performance**: Load testing with Artillery

### 5. Synthetic Monitoring (`synthetic-monitoring.yml`)
**Purpose**: End-to-end user journey testing.

**Triggers**:
- Every 4 hours
- Manual trigger

**Features**:
- Playwright-based synthetic tests
- API health checks
- Critical user flow validation

### 6. Security Audit (`security-audit.yml`)
**Purpose**: Weekly security vulnerability scanning.

**Triggers**:
- Weekly on Mondays
- Manual trigger

**Jobs**:
- **Dependency Audit**: npm audit for vulnerabilities
- **Trivy Scan**: Container and filesystem vulnerability scanning
- **License Check**: Open source license compliance

### 7. Database Health (`database-health.yml`)
**Purpose**: Database monitoring and backup.

**Triggers**:
- Every 6 hours
- Manual trigger

**Jobs**:
- **Backup**: Automated database backups to Azure Storage
- **Health Check**: Database connectivity and migration status
- **Cleanup**: Remove old backups (keep 7 days)

### 8. Monitoring Dashboard (`monitoring-dashboard.yml`)
**Purpose**: Generate comprehensive monitoring reports.

**Triggers**:
- Daily at 6 AM UTC
- Manual trigger

**Features**:
- Aggregates metrics from all monitoring systems
- Slack notifications for failures

### 9. Rollback (`rollback.yml`)
**Purpose**: Emergency rollback capability.

**Triggers**:
- Manual trigger only

**Features**:
- Rollback to previous deployment
- Environment-specific rollback
- Health verification

## Dependency Management

### Dependabot (`dependabot.yml`)
- Weekly dependency updates
- Separate configurations for frontend and backend
- Automated PR creation with reviewers

## Required Secrets

Configure these in GitHub repository settings:

### Vercel Deployment
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_PROJECT_ID_FRONTEND`: Frontend project ID
- `VERCEL_PROJECT_ID_BACKEND`: Backend project ID

### Database
- `PRODUCTION_DATABASE_URL`: Production database connection
- `STAGING_DATABASE_URL`: Staging database connection

### Azure Storage (for backups)
- `AZURE_STORAGE_ACCOUNT`: Storage account name
- `AZURE_STORAGE_KEY`: Storage account key

### API URLs
- `PRODUCTION_API_URL`: Production API base URL (update for custom domain)
- `STAGING_API_URL`: Staging API base URL (update for custom domain)

## Branch Strategy

- `main`: Production branch
- `develop`: Staging/development branch
- Feature branches: Created from `develop`

## Deployment Flow

1. **Development**: Push to feature branches
2. **Staging**: Merge to `develop` → automatic staging deployment
3. **Production**: Manual production deployment from `main`

## Monitoring

- **Performance**: Lighthouse CI scores tracked daily
- **Synthetic**: User journeys tested every 4 hours
- **Security**: Weekly vulnerability scans
- **Database**: Health checks every 6 hours with automated backups

## Alerts

- Monitor workflow failures in GitHub Actions
- Check performance regressions in Lighthouse reports
- Review security scan results weekly
- Database health monitored via automated checks

## Rollback Procedure

1. Go to Actions → Rollback Deployment
2. Select environment and version (or leave empty for previous)
3. Click "Run workflow"
4. Monitor the rollback progress
5. Verify application health

## Custom Domain Deployment

If deploying to a custom domain instead of Vercel:

1. Update `PRODUCTION_API_URL` and `STAGING_API_URL` secrets with your custom domain URLs
2. Ensure your custom domain points to Vercel or your deployment platform
3. Update CORS settings in your backend if needed
4. Test all workflows after updating the secrets

## Maintenance

- Review Dependabot PRs weekly
- Monitor performance trends
- Update secrets as needed
- Review security scan results
- Clean up old backups manually if needed