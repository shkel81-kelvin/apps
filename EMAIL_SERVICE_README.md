# 📧 Email Management Service

A comprehensive email client integrated into the Tender Project Application supporting Gmail, Outlook, and custom domain emails with dedicated database infrastructure.

![Email Service Status](https://img.shields.io/badge/status-ready%20for%20deployment-green)
![Frontend](https://img.shields.io/badge/frontend-complete-success)
![Backend](https://img.shields.io/badge/backend-template%20provided-yellow)
![Database](https://img.shields.io/badge/database-schema%20ready-success)

---

## 📋 Table of Contents

- [Features](#features)
- [Files Overview](#files-overview)
- [Quick Start](#quick-start)
- [Database Setup](#database-setup)
- [Backend Implementation](#backend-implementation)
- [Deployment](#deployment)
- [Usage](#usage)
- [Security](#security)

---

## ✨ Features

### Frontend (✅ Complete)
- ✅ **Multi-Account Management** - Manage multiple email accounts simultaneously
- ✅ **Universal Provider Support** - Gmail, Outlook, and custom domains
- ✅ **Full Email Client** - Inbox, Sent, Starred, Archive, Trash
- ✅ **Compose & Send** - Rich email composition with attachments
- ✅ **Search Functionality** - Quick email search
- ✅ **Responsive Design** - Works on all devices
- ✅ **Auto-Configuration** - Automatic IMAP/SMTP settings for major providers

### Backend (📝 Template Provided)
- 📝 **Email Sync Service** - IMAP integration template
- 📝 **Email Send Service** - SMTP sending (to be implemented)
- 📝 **Account Management** - Secure credential storage
- 📝 **File Storage** - Attachment handling
- 📝 **Queue Management** - Background job processing

### Database (✅ Complete)
- ✅ **Dedicated Database** - `email_management_db`
- ✅ **7 Optimized Tables** - Accounts, Emails, Attachments, Folders, Sync Log, Send Queue, Rules
- ✅ **Full-Text Search** - Indexed email search
- ✅ **Encryption Ready** - AES-256 password encryption

---

## 📁 Files Overview

### Frontend Component
```
src/pages/EmailManagement/
└── EmailManagement.jsx          ✅ Complete React component
```

### Documentation
```
EMAIL_SERVICE_ARCHITECTURE.md    ✅ Comprehensive system architecture
EMAIL_SERVICE_QUICK_GUIDE.md     ✅ Quick reference guide
EMAIL_SERVICE_README.md          ✅ This file
```

### Database
```
database/
└── email_management_setup.sql   ✅ Complete database schema
```

### Backend (Templates)
```
backend/services/email/
└── emailSyncService.js          ✅ Email sync service template
```

### System Configuration
```
src/
├── components/Layout/
│   └── Sidebar.jsx              ✅ Updated with Email menu
└── App.jsx                      ✅ Updated with /email route
```

---

## 🚀 Quick Start

### 1. Access the Email Service

1. Login to the application as **Admin**
2. Navigate to **"Email Management"** in the sidebar
3. Click **"Add Account"** to add your first email account

### 2. Add an Email Account

#### For Gmail:
1. Select "Gmail" as provider
2. Enter your email address
3. Enable IMAP in Gmail settings
4. Generate an App Password from Google Account
5. Use the App Password (not your regular password)

#### For Outlook:
1. Select "Outlook / Office 365" as provider
2. Enter your email address
3. Enable IMAP in Outlook settings
4. Generate an App Password if 2FA is enabled
5. Enter credentials

#### For Custom Domain:
1. Select "Custom Domain" as provider
2. Enter IMAP server details (e.g., `mail.yourdomain.com`)
3. Enter SMTP server details
4. Configure ports (usually 993 for IMAP, 587 for SMTP)
5. Enter username and password

---

## 🗄️ Database Setup

### Step 1: Create Database

Run the SQL setup script:

```bash
mysql -u root -p < database/email_management_setup.sql
```

Or manually:

```sql
mysql -u root -p
source /path/to/database/email_management_setup.sql
```

### Step 2: Verify Installation

```sql
USE email_management_db;
SHOW TABLES;
```

You should see 7 tables:
- `email_accounts`
- `emails`
- `email_attachments`
- `email_folders`
- `email_sync_log`
- `email_send_queue`
- `email_rules`

### Step 3: Create Database User (Optional)

```sql
CREATE USER 'email_service_user'@'localhost' 
IDENTIFIED BY 'your_secure_password';

GRANT SELECT, INSERT, UPDATE, DELETE ON email_management_db.* 
TO 'email_service_user'@'localhost';

FLUSH PRIVILEGES;
```

---

## 🔧 Backend Implementation

### Prerequisites

Install required packages:

```bash
cd backend
npm install node-imap mailparser nodemailer bull mysql2 redis crypto
```

### Environment Configuration

Create `.env` file:

```env
# Database
EMAIL_DB_HOST=localhost
EMAIL_DB_PORT=3307
EMAIL_DB_USER=email_service_user
EMAIL_DB_PASSWORD=your_password
EMAIL_DB_NAME=email_management_db

# Redis (for queue management)
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
ENCRYPTION_KEY=your_32_byte_hex_encryption_key_here

# Email Sync
EMAIL_SYNC_INTERVAL=300000  # 5 minutes

# Storage
STORAGE_PATH=/app/storage/emails
```

### Generate Encryption Key

```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

### Implement Services

1. **Email Sync Service** (Template provided in `backend/services/email/emailSyncService.js`)
2. **Email Send Service** (To be implemented)
3. **API Endpoints** (To be implemented)

### Sample API Routes

```javascript
// backend/routes/emailRoutes.js

const express = require('express');
const router = express.Router();
const EmailSyncService = require('../services/email/emailSyncService');

// Initialize service
const syncService = new EmailSyncService(dbConfig, process.env.ENCRYPTION_KEY);

// Add email account
router.post('/accounts', async (req, res) => {
  // Add account to database with encrypted password
});

// Trigger sync
router.post('/accounts/:id/sync', async (req, res) => {
  try {
    const count = await syncService.syncAccount(req.params.id);
    res.json({ success: true, emailsSynced: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get emails
router.get('/accounts/:id/emails', async (req, res) => {
  // Query emails from database
});

module.exports = router;
```

---

## 🚢 Deployment

### Option 1: Local Development

1. Setup database (see Database Setup)
2. Configure `.env` file
3. Run backend server
4. Access frontend at `http://localhost:5173`

### Option 2: Docker

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: email_management_db
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/email_management_setup.sql:/docker-entrypoint-initdb.d/setup.sql

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      - EMAIL_DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    ports:
      - "5000:5000"

  frontend:
    build: .
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

Run:
```bash
docker-compose up -d
```

### Option 3: Cloud (AWS)

See `EMAIL_SERVICE_ARCHITECTURE.md` for detailed AWS deployment guide.

---

## 💻 Usage

### Basic Workflow

1. **Add Account** → Configure email credentials
2. **Sync Emails** → Backend syncs emails via IMAP
3. **Read Emails** → View emails in inbox
4. **Compose** → Write and send new emails
5. **Manage** → Organize with folders and labels

### API Integration

Frontend communicates with backend via REST API:

```javascript
// Example: Fetch emails
const response = await fetch(`/api/email/${accountId}/emails?folder=inbox`);
const emails = await response.json();

// Example: Send email
await fetch(`/api/email/${accountId}/emails/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Test Email',
    body: 'Hello World'
  })
});
```

---

## 🔒 Security

### Password Encryption

All email account passwords are encrypted using AES-256:

```javascript
const crypto = require('crypto');

function encryptPassword(password, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}
```

### OAuth 2.0 (Recommended)

For Gmail and Outlook, use OAuth instead of passwords:

1. Register app with Google/Microsoft
2. Implement OAuth flow
3. Store access/refresh tokens
4. Auto-refresh expired tokens

### Best Practices

- ✅ Use HTTPS for all communications
- ✅ Encrypt passwords before database storage
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Sanitize HTML email content
- ✅ Scan attachments for viruses

---

## 📊 Database Schema

### Core Tables

| Table | Purpose | Records |
|-------|---------|---------|
| `email_accounts` | Account credentials | Per user |
| `emails` | Email messages | Thousands+ |
| `email_attachments` | File metadata | Per attachment |
| `email_folders` | Folder structure | Per account |
| `email_sync_log` | Sync audit trail | Per sync |
| `email_send_queue` | Outgoing emails | Temporary |
| `email_rules` | Automation rules | Per user |

### Relationships

```
email_accounts (1) ─── (N) emails
                 └─── (N) email_folders
                 └─── (N) email_sync_log
                 └─── (N) email_send_queue
                 └─── (N) email_rules

emails (1) ─── (N) email_attachments
```

---

## 🧪 Testing

### Test Gmail Connection

```javascript
const account = {
  imap_server: 'imap.gmail.com',
  imap_port: 993,
  username: 'your-email@gmail.com',
  password_encrypted: encryptedAppPassword
};

syncService.syncAccount(accountId)
  .then(count => console.log(`✅ Synced ${count} emails`))
  .catch(err => console.error('❌ Error:', err));
```

### Test Email Send

```javascript
// To be implemented in emailSendService.js
sendService.sendEmail(accountId, {
  to: 'recipient@example.com',
  subject: 'Test Email',
  body: 'This is a test email'
});
```

---

## 📈 Monitoring

### Key Metrics

- Email sync success rate
- Average sync time per account
- Email send success rate
- Database query performance
- Storage usage

### Logging

All operations are logged to:
- `email_sync_log` table (sync operations)
- Application logs (errors and debugging)

---

## 🆘 Troubleshooting

### Gmail: "Authentication Failed"
- ✅ Enable IMAP in Gmail settings
- ✅ Generate App Password (requires 2FA)
- ✅ Use App Password, not regular password

### Outlook: "Connection Refused"
- ✅ Enable IMAP in Outlook settings
- ✅ Check if account has 2FA enabled
- ✅ Generate App Password if needed

### Database: "Connection Error"
- ✅ Verify MySQL is running
- ✅ Check port (default: 3307)
- ✅ Verify credentials in `.env`

### Sync: "No Emails Found"
- ✅ Check IMAP folder name (INBOX vs Inbox)
- ✅ Verify account has emails
- ✅ Check sync log for errors

---

## 📚 Additional Resources

- **Architecture Documentation**: `EMAIL_SERVICE_ARCHITECTURE.md`
- **Quick Guide**: `EMAIL_SERVICE_QUICK_GUIDE.md`
- **Database Schema**: `database/email_management_setup.sql`
- **Sync Service Template**: `backend/services/email/emailSyncService.js`

---

## 🔮 Future Enhancements

- [ ] AI-powered email categorization
- [ ] Priority inbox
- [ ] Email templates library
- [ ] Scheduled sending
- [ ] Email tracking (read receipts)
- [ ] Conversation threading
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Dark mode

---

## 📄 License

This email service is part of the Tender Project Application.

---

## 👥 Support

For questions or issues:
1. Check troubleshooting section
2. Review documentation files
3. Check email provider settings
4. Review backend logs

---

**Status**: Frontend ✅ | Database ✅ | Backend ⚠️ (template provided)

*Last Updated: December 1, 2025*
