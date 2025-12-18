# Email Service System Architecture

## Overview
This document outlines the complete system architecture for the Email Management Service integrated into the Tender Project Application. The service supports multiple email providers (Gmail, Outlook, and custom domains) with a dedicated database infrastructure.

---

## System Components

### 1. **Frontend Layer** (React Application)
- **Email Management UI** (`EmailManagement.jsx`)
  - Inbox, Sent, Starred, Archive, Trash folders
  - Email composition with attachments
  - Multi-account management
  - Real-time email sync
  - Search functionality
  
### 2. **Backend API Layer** (Node.js/Express - To be implemented)
Location: `backend/services/email/`

#### Key Services:
- **Email Sync Service** (`emailSyncService.js`)
  - IMAP integration for receiving emails
  - Real-time email synchronization
  - Auto-categorization and filtering
  - Email polling/push notifications

- **Email Send Service** (`emailSendService.js`)
  - SMTP integration for sending emails
  - Email queue management
  - Retry logic for failed sends
  - Delivery status tracking

- **Email Account Service** (`emailAccountService.js`)
  - Account credentials management (encrypted)
  - Multi-provider configuration
  - OAuth 2.0 integration for Gmail/Outlook
  - Connection testing and validation

- **Email Storage Service** (`emailStorageService.js`)
  - Email content storage
  - Attachment management
  - Search indexing
  - Archive and cleanup

### 3. **Email Providers Integration**
- **Gmail Integration**
  - IMAP: `imap.gmail.com:993` (SSL/TLS)
  - SMTP: `smtp.gmail.com:587` (STARTTLS)
  - OAuth 2.0 authentication support
  - App Password support

- **Outlook/Office 365 Integration**
  - IMAP: `outlook.office365.com:993` (SSL/TLS)
  - SMTP: `smtp.office365.com:587` (STARTTLS)
  - Modern authentication support
  - Graph API integration (optional)

- **Custom Domain Integration**
  - Configurable IMAP/SMTP servers
  - Standard authentication
  - Custom port configuration

### 4. **Database Layer** (Dedicated Email Database)

#### Database: `email_management_db`

##### Tables:

**Table: `email_accounts`**
```sql
CREATE TABLE email_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    provider ENUM('gmail', 'outlook', 'custom') NOT NULL,
    imap_server VARCHAR(255),
    imap_port INT,
    smtp_server VARCHAR(255),
    smtp_port INT,
    username VARCHAR(255) NOT NULL,
    password_encrypted TEXT NOT NULL,
    oauth_token TEXT,
    oauth_refresh_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (user_id, email_address),
    INDEX idx_user_id (user_id),
    INDEX idx_email_address (email_address)
);
```

**Table: `emails`**
```sql
CREATE TABLE emails (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    message_id VARCHAR(500) UNIQUE NOT NULL,
    thread_id VARCHAR(500),
    folder VARCHAR(50) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),
    to_emails TEXT NOT NULL,
    cc_emails TEXT,
    bcc_emails TEXT,
    subject VARCHAR(1000),
    body_text LONGTEXT,
    body_html LONGTEXT,
    has_attachments BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    is_draft BOOLEAN DEFAULT FALSE,
    email_date TIMESTAMP NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    size_bytes BIGINT,
    labels JSON,
    headers JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES email_accounts(id) ON DELETE CASCADE,
    INDEX idx_account_folder (account_id, folder),
    INDEX idx_message_id (message_id),
    INDEX idx_thread_id (thread_id),
    INDEX idx_email_date (email_date),
    INDEX idx_is_read (is_read),
    INDEX idx_subject (subject(255)),
    FULLTEXT INDEX ft_search (subject, body_text, from_email, from_name)
);
```

**Table: `email_attachments`**
```sql
CREATE TABLE email_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email_id BIGINT NOT NULL,
    filename VARCHAR(500) NOT NULL,
    content_type VARCHAR(255),
    size_bytes BIGINT,
    storage_path VARCHAR(1000) NOT NULL,
    checksum VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE,
    INDEX idx_email_id (email_id),
    INDEX idx_filename (filename(255))
);
```

**Table: `email_folders`**
```sql
CREATE TABLE email_folders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    folder_name VARCHAR(255) NOT NULL,
    folder_type ENUM('inbox', 'sent', 'drafts', 'trash', 'spam', 'archive', 'custom') NOT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    unread_count INT DEFAULT 0,
    total_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES email_accounts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_folder (account_id, folder_name),
    INDEX idx_account_id (account_id)
);
```

**Table: `email_sync_log`**
```sql
CREATE TABLE email_sync_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    sync_started_at TIMESTAMP NOT NULL,
    sync_completed_at TIMESTAMP,
    emails_synced INT DEFAULT 0,
    status ENUM('in_progress', 'completed', 'failed') NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES email_accounts(id) ON DELETE CASCADE,
    INDEX idx_account_id (account_id),
    INDEX idx_sync_started (sync_started_at)
);
```

**Table: `email_send_queue`**
```sql
CREATE TABLE email_send_queue (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    to_emails TEXT NOT NULL,
    cc_emails TEXT,
    bcc_emails TEXT,
    subject VARCHAR(1000),
    body_html LONGTEXT,
    body_text LONGTEXT,
    attachments JSON,
    priority INT DEFAULT 5,
    status ENUM('pending', 'sending', 'sent', 'failed') DEFAULT 'pending',
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    error_message TEXT,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES email_accounts(id) ON DELETE CASCADE,
    INDEX idx_account_status (account_id, status),
    INDEX idx_scheduled_at (scheduled_at)
);
```

**Table: `email_rules`**
```sql
CREATE TABLE email_rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    conditions JSON NOT NULL,
    actions JSON NOT NULL,
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES email_accounts(id) ON DELETE CASCADE,
    INDEX idx_account_active (account_id, is_active)
);
```

### 5. **File Storage Service**
Location: `storage/emails/`

Structure:
```
storage/
  └── emails/
      └── [account_id]/
          └── [year]/
              └── [month]/
                  └── [email_id]/
                      └── attachments/
                          ├── file1.pdf
                          ├── file2.xlsx
                          └── ...
```

**Features:**
- Dedicated file storage for email attachments
- Organized by account, year, month, and email
- Automatic cleanup for deleted emails
- Compression for large attachments
- Virus scanning integration point

### 6. **Security Layer**

#### Authentication & Authorization:
- User authentication required (existing system)
- Email account credentials encrypted (AES-256)
- OAuth 2.0 tokens stored securely
- API rate limiting

#### Data Protection:
- TLS/SSL for all email communications
- Database encryption at rest
- Encrypted backups
- GDPR compliance ready

---

## Deployment Architecture

### Development Environment
```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTPS
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Web Frontend (React)                            │
│              Port: 5173 (Dev) / 3000 (Prod)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ REST API
                      │
┌─────────────────────▼───────────────────────────────────────┐
│            Backend API Server (Node.js/Express)              │
│                     Port: 5000                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Email Services Layer                                 │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Email Sync Service                                 │  │
│  │  • Email Send Service                                 │  │
│  │  • Email Account Service                              │  │
│  │  • Email Storage Service                              │  │
│  └──────────────────────────────────────────────────────┘  │
└───────┬─────────────────────────┬──────────────────────┬───┘
        │                         │                      │
        │                         │                      │
        ▼                         ▼                      ▼
┌───────────────┐    ┌────────────────────┐    ┌──────────────┐
│ Email         │    │ Email Management   │    │ File Storage │
│ Providers     │    │ Database (MySQL)   │    │ (Local/S3)   │
│               │    │                    │    │              │
│ • Gmail       │    │ • email_accounts   │    │ /storage/    │
│ • Outlook     │    │ • emails           │    │   emails/    │
│ • Custom      │    │ • attachments      │    │              │
└───────────────┘    │ • folders          │    └──────────────┘
                     │ • sync_log         │
                     │ • send_queue       │
                     └────────────────────┘
```

### Production Environment (Docker Deployment)

```yaml
# docker-compose.yml structure
services:
  # Frontend
  web-frontend:
    ports: 80:80, 443:443
    
  # Backend API
  backend-api:
    ports: 5000:5000
    environment:
      - DB_HOST=email_database
      
  # Email Sync Worker
  email-sync-worker:
    replicas: 2
    
  # Email Send Worker  
  email-send-worker:
    replicas: 2
    
  # Dedicated Email Database
  email_database:
    image: mysql:8.0
    volumes:
      - email_db_data:/var/lib/mysql
    ports: 3307:3306
    
  # Redis Cache (for queue management)
  redis:
    image: redis:alpine
    ports: 6379:6379
    
  # File Storage
  minio:
    image: minio/minio
    ports: 9000:9000, 9001:9001
```

### Cloud Deployment (AWS Example)

```
┌─────────────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│          CloudFront (CDN) + WAF                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│        Application Load Balancer (ALB)                       │
└──────┬──────────────────────────────────────────────────┬───┘
       │                                                   │
┌──────▼──────────┐                            ┌──────────▼─────┐
│ ECS/EKS         │                            │ ECS/EKS        │
│ Web Frontend    │                            │ Backend API    │
│ (Auto Scaling)  │                            │ (Auto Scaling) │
└─────────────────┘                            └────────┬───────┘
                                                        │
                        ┌───────────────────────────────┼────────┐
                        │                               │        │
                ┌───────▼────────┐          ┌──────────▼─────┐  │
                │ RDS MySQL      │          │ ElastiCache    │  │
                │ (Multi-AZ)     │          │ (Redis)        │  │
                │                │          │                │  │
                │ Email Database │          │ Queue/Cache    │  │
                └────────────────┘          └────────────────┘  │
                                                                │
                                                    ┌───────────▼──────┐
                                                    │ S3 Bucket        │
                                                    │ Email Attachments│
                                                    └──────────────────┘
┌─────────────────────────────────────────────────────────────┐
│              SES (Simple Email Service)                      │
│              - For sending transactional emails              │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Email Account Management
```
POST   /api/email/accounts              - Add new email account
GET    /api/email/accounts              - List all accounts
GET    /api/email/accounts/:id          - Get account details
PUT    /api/email/accounts/:id          - Update account
DELETE /api/email/accounts/:id          - Remove account
POST   /api/email/accounts/:id/test     - Test connection
POST   /api/email/accounts/:id/sync     - Trigger manual sync
```

### Email Operations
```
GET    /api/email/:accountId/emails               - List emails
GET    /api/email/:accountId/emails/:id           - Get email detail
POST   /api/email/:accountId/emails/send          - Send new email
PUT    /api/email/:accountId/emails/:id/read      - Mark as read
PUT    /api/email/:accountId/emails/:id/star      - Star/unstar
PUT    /api/email/:accountId/emails/:id/move      - Move to folder
DELETE /api/email/:accountId/emails/:id           - Delete email
GET    /api/email/:accountId/search               - Search emails
```

### Attachments
```
GET    /api/email/attachments/:id/download   - Download attachment
POST   /api/email/attachments/upload         - Upload attachment
DELETE /api/email/attachments/:id            - Delete attachment
```

### Folders
```
GET    /api/email/:accountId/folders         - List folders
POST   /api/email/:accountId/folders         - Create folder
PUT    /api/email/:accountId/folders/:id     - Update folder
DELETE /api/email/:accountId/folders/:id     - Delete folder
```

---

## Environment Variables

```env
# Database Configuration
EMAIL_DB_HOST=localhost
EMAIL_DB_PORT=3307
EMAIL_DB_NAME=email_management_db
EMAIL_DB_USER=email_service_user
EMAIL_DB_PASSWORD=secure_password_here

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_here

# File Storage
STORAGE_TYPE=local # or s3
STORAGE_PATH=/app/storage/emails
AWS_S3_BUCKET=email-attachments-bucket
AWS_REGION=us-east-1

# Email Service
EMAIL_SYNC_INTERVAL=300000 # 5 minutes in ms
EMAIL_MAX_SYNC_LIMIT=100
EMAIL_ATTACHMENT_MAX_SIZE=26214400 # 25MB in bytes

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# OAuth (Gmail)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth (Outlook)
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

---

## Security Considerations

1. **Password Encryption**: All email account passwords are encrypted using AES-256 before storage
2. **OAuth Preferred**: Use OAuth 2.0 for Gmail and Outlook instead of passwords when possible
3. **API Rate Limiting**: Implement rate limiting to prevent abuse
4. **Email Validation**: Validate all email addresses and sanitize inputs
5. **Attachment Scanning**: Integrate virus scanning for all attachments
6. **Access Control**: Users can only access their own email accounts
7. **Audit Logging**: Log all email send/receive operations
8. **Data Retention**: Implement automatic cleanup policies for old emails

---

## Monitoring & Logging

### Metrics to Track:
- Email sync success/failure rate
- Email send success/failure rate
- Average sync time per account
- Database query performance
- Storage usage
- API response times

### Logging:
- Email sync errors
- Send failures with retry information
- Authentication failures
- API access logs
- Database connection issues

### Alerts:
- Failed sync operations (> 3 consecutive failures)
- Email send queue buildup
- Database connection failures
- Storage capacity warnings (> 80% full)

---

## Backup Strategy

1. **Database Backups**:
   - Daily full backups
   - Hourly incremental backups
   - 30-day retention policy

2. **Attachment Storage**:
   - Daily backups to S3 Glacier (for cloud)
   - Weekly backups to external storage (for on-premise)
   - 90-day retention policy

3. **Disaster Recovery**:
   - RPO (Recovery Point Objective): 1 hour
   - RTO (Recovery Time Objective): 4 hours

---

## Performance Optimization

1. **Database Indexing**: All tables have appropriate indexes for fast queries
2. **Caching**: Use Redis for frequently accessed data
3. **Pagination**: Implement pagination for email lists
4. **Lazy Loading**: Load email bodies and attachments on demand
5. **Connection Pooling**: Use connection pools for database and IMAP/SMTP
6. **Queue Management**: Use Bull Queue for background job processing
7. **CDN**: Serve static assets through CDN

---

## Future Enhancements

1. **AI-Powered Features**:
   - Smart categorization
   - Priority inbox
   - Email templates suggestions
   - Sentiment analysis

2. **Advanced Features**:
   - Email templates library
   - Scheduled sending
   - Email tracking (open/click rates)
   - Conversation threading
   - Unified search across accounts

3. **Integrations**:
   - Calendar integration
   - Task/project integration
   - CRM integration
   - Document management integration

4. **Mobile Support**:
   - Progressive Web App (PWA)
   - Native mobile apps (React Native)
   - Push notifications

---

## Compliance

- **GDPR**: Right to access, delete, and export email data
- **SOC 2**: Security and availability controls
- **HIPAA**: If handling sensitive healthcare communications
- **Data Residency**: Support for region-specific data storage

---

## Support & Maintenance

- **Regular Updates**: Monthly security patches
- **Provider Changes**: Monitor email provider API changes
- **User Support**: Email service troubleshooting guide
- **Documentation**: Keep API documentation up-to-date

---

*Last Updated: December 1, 2025*
*Version: 1.0*
