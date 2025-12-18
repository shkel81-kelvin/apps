# Email Service System Diagram

## System Architecture Overview

Below is the complete system architecture for the Email Management Service integrated into your Tender Project Application.

---

## 📐 Architecture Diagram

![Email System Architecture](../brain/b59208b7-ba34-4902-a203-a18140c962c6/email_system_architecture_1764550743851.png)

---

## 🏗️ Component Breakdown

### **Layer 1: User Interface**
```
┌─────────────────────────────────┐
│         User Browser            │
│   (React Frontend - Port 5173)  │
└─────────────────────────────────┘
```
- **Component**: EmailManagement.jsx
- **Features**: Multi-account inbox, compose, folders, search
- **Tech**: React, Lucide Icons, TailwindCSS

---

### **Layer 2: Backend API Services**
```
┌────────────────────────────────────────────┐
│         Backend API (Node.js/Express)      │
│              Port: 5000                    │
├────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐ │
│  │  • Email Sync Service (IMAP)         │ │
│  │  • Email Send Service (SMTP)         │ │
│  │  • Email Account Service             │ │
│  │  • Email Storage Service             │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

#### Service Details:

**1. Email Sync Service**
- IMAP connection management
- Email fetching and parsing
- Database storage
- Background sync workers

**2. Email Send Service**
- SMTP connection management
- Email sending
- Queue management
- Retry logic

**3. Email Account Service**
- Account CRUD operations
- Credential encryption/decryption
- OAuth token management
- Connection testing

**4. Email Storage Service**
- Attachment file management
- Storage path organization
- File upload/download
- Cleanup operations

---

### **Layer 3: Data Layer**

```
┌──────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│  Email Providers │    │  Email Database      │    │  File Storage   │
│                  │    │  (MySQL)             │    │  (S3/Local)     │
├──────────────────┤    ├──────────────────────┤    ├─────────────────┤
│  • Gmail         │    │  Tables:             │    │  /storage/      │
│    imap: 993     │    │  • email_accounts    │    │    emails/      │
│    smtp: 587     │    │  • emails            │    │      [account]/ │
│                  │    │  • email_attachments │    │        [year]/  │
│  • Outlook       │    │  • email_folders     │    │          [mon]/ │
│    imap: 993     │    │  • email_sync_log    │    │             ... │
│    smtp: 587     │    │  • email_send_queue  │    │                 │
│                  │    │  • email_rules       │    │                 │
│  • Custom Domain │    │                      │    │                 │
│    Config: User  │    │  Port: 3307          │    │                 │
└──────────────────┘    └──────────────────────┘    └─────────────────┘
```

---

### **Layer 4: Queue Management**

```
┌─────────────────────────────────┐
│   Redis (Queue & Cache)         │
│   Port: 6379                    │
├─────────────────────────────────┤
│  • Email Sync Queue             │
│  • Email Send Queue             │
│  • Cache (Frequently Accessed)  │
└─────────────────────────────────┘
```

---

## 🔄 Data Flow

### **Receiving Emails (IMAP Sync)**
```
Email Provider (IMAP)
          ↓
   Email Sync Service
          ↓
   Parse & Process
          ↓
   Save to Database (emails table)
          ↓
   Save Attachments (file storage + email_attachments table)
          ↓
   Update Sync Log
          ↓
   Frontend Displays Email
```

### **Sending Emails (SMTP Send)**
```
User Composes Email (Frontend)
          ↓
   API Request to Backend
          ↓
   Add to Send Queue (email_send_queue)
          ↓
   Email Send Worker Processes
          ↓
   Connect to SMTP Server
          ↓
   Send Email
          ↓
   Update Queue Status
          ↓
   Move to Sent Folder
```

---

## 🗄️ Database Schema Visualization

```
email_accounts (Account Configuration)
    ├── id (PK)
    ├── user_id (FK → main app users)
    ├── email_address
    ├── provider (gmail/outlook/custom)
    ├── imap_server, imap_port
    ├── smtp_server, smtp_port
    ├── password_encrypted (AES-256)
    └── oauth_token (for Gmail/Outlook)
         │
         │ 1:N
         ↓
    emails (Email Messages)
         ├── id (PK)
         ├── account_id (FK)
         ├── message_id (Unique)
         ├── from_email, from_name
         ├── to_emails, cc_emails
         ├── subject, body_text, body_html
         ├── folder (inbox/sent/starred/etc)
         ├── is_read, is_starred
         └── email_date
              │
              │ 1:N
              ↓
         email_attachments (Files)
              ├── id (PK)
              ├── email_id (FK)
              ├── filename
              ├── content_type
              ├── size_bytes
              ├── storage_path
              └── checksum
```

---

## 🚀 Deployment Configurations

### **Development Setup**
```
Localhost:5173 (React Dev Server)
      ↓
Localhost:5000 (Backend API)
      ↓
Localhost:3307 (MySQL)
Localhost:6379 (Redis)
```

### **Docker Setup**
```yaml
docker-compose up:
  - web (frontend)
  - api (backend)
  - mysql (database)
  - redis (cache/queue)
  - minio (file storage)
```

### **Production (AWS)**
```
CloudFront (CDN)
      ↓
Application Load Balancer
      ↓
┌──────────────┬──────────────┐
│  ECS/EKS     │  ECS/EKS     │
│  Frontend    │  Backend     │
└──────────────┴──────────────┘
      ↓              ↓
  ┌──────────────────────────┐
  │   RDS MySQL (Multi-AZ)   │
  │   ElastiCache (Redis)    │
  │   S3 (File Storage)      │
  └──────────────────────────┘
```

---

## 🔐 Security Architecture

```
User Input
    ↓
Input Validation
    ↓
HTTPS/TLS Encryption
    ↓
API Authentication (JWT)
    ↓
Rate Limiting
    ↓
Business Logic
    ↓
Password Encryption (AES-256)
    ↓
Database (Encrypted at Rest)
    ↓
IMAP/SMTP (TLS/SSL)
    ↓
Email Providers
```

---

## 📊 Performance Optimization

### **Caching Strategy**
```
Request → Check Redis Cache
              ↓
         Cache Hit? 
         ↙      ↘
       Yes      No
        ↓        ↓
    Return   Query DB
              ↓
          Store in Cache
              ↓
            Return
```

### **Database Indexing**
- Primary Keys: All `id` columns
- Foreign Keys: All `*_id` references
- Search: Full-text index on subject, body, from_email
- Performance: Composite indexes on frequently queried combinations

---

## 🔍 Monitoring & Logging

```
Application Layer
    ↓
Logging Service
    ├── Email Sync Logs → email_sync_log table
    ├── API Access Logs → Application logs
    ├── Error Logs → Error tracking system
    └── Performance Metrics → Monitoring dashboard

Alerts:
    • Sync failures (>3 consecutive)
    • High queue depth (>100 emails)
    • Database connection issues
    • Slow query warnings
```

---

## 📱 API Endpoints Map

```
/api/email/
    ├── /accounts
    │   ├── POST   → Add new account
    │   ├── GET    → List accounts
    │   ├── PUT    /:id → Update account
    │   └── DELETE /:id → Remove account
    │
    ├── /accounts/:id/sync
    │   └── POST   → Trigger manual sync
    │
    ├── /accounts/:accountId/emails
    │   ├── GET    → List emails
    │   ├── POST   /send → Send email
    │   └── GET    /:id → Get email details
    │
    ├── /accounts/:accountId/emails/:id
    │   ├── PUT    /read → Mark as read
    │   ├── PUT    /star → Star/unstar
    │   ├── PUT    /move → Move to folder
    │   └── DELETE → Delete email
    │
    └── /attachments
        ├── GET    /:id/download → Download file
        └── DELETE /:id → Delete attachment
```

---

## ⚡ Queue Processing

```
Background Workers:

1. Email Sync Worker (Continuous)
   ┌─────────────────────┐
   │  Every 5 minutes    │
   │  For each account:  │
   │  • Connect IMAP     │
   │  • Fetch new emails │
   │  • Parse & Save     │
   │  • Update sync log  │
   └─────────────────────┘

2. Email Send Worker (Event-driven)
   ┌─────────────────────┐
   │  On queue trigger   │
   │  • Get next email   │
   │  • Connect SMTP     │
   │  • Send email       │
   │  • Update status    │
   │  • Retry on failure │
   └─────────────────────┘
```

---

## 🎯 Integration Points

### **With Main Application**
```
Tender Project App
    ├── User Authentication (Shared)
    ├── User Management (user_id reference)
    ├── Project Emails (link emails to projects)
    ├── Tender Communications (track tender emails)
    └── Document Attachments (store in same system)
```

### **With External Services**
```
Email Service
    ├── Gmail API (OAuth 2.0)
    ├── Microsoft Graph API (OAuth 2.0)
    ├── Custom IMAP/SMTP Servers
    ├── Cloud Storage (S3/Azure Blob)
    └── Monitoring (CloudWatch/DataDog)
```

---

## 📈 Scalability

### **Horizontal Scaling**
```
Load Balancer
    ├── Backend Instance 1
    ├── Backend Instance 2
    ├── Backend Instance 3
    └── ...
         ↓
    Shared Database
    Shared Redis
    Shared File Storage
```

### **Vertical Scaling**
- Increase database resources (CPU, RAM, Storage)
- Increase worker count for sync/send operations
- Add read replicas for database
- Implement database sharding for large datasets

---

*This diagram represents the complete architecture for the Email Management Service. All components are designed to work together seamlessly to provide a robust, scalable, and secure email solution.*

**Last Updated**: December 1, 2025
