# Email Management Service - Quick Reference Guide

## 🎯 Overview
The Email Management Service is a comprehensive email client integrated into your Tender Project Application that supports multiple email providers (Gmail, Outlook, and Custom Domains) with a dedicated database infrastructure.

---

## 📁 Files Created

### 1. **Frontend Component**
- **File**: `src/pages/EmailManagement/EmailManagement.jsx`
- **Description**: Complete email client interface with:
  - Multi-account management
  - Inbox, Sent, Starred, Archive, Trash folders
  - Email composition with attachments
  - Search functionality
  - Real-time updates

### 2. **Architecture Documentation**
- **File**: `EMAIL_SERVICE_ARCHITECTURE.md`
- **Description**: Comprehensive system architecture including:
  - Database schema (7 tables)
  - API endpoints documentation
  - Deployment architecture
  - Security considerations
  - Cloud deployment guide

### 3. **System Diagram**
- **File**: Generated architecture diagram (see artifacts)
- **Description**: Visual representation of the complete system architecture

### 4. **Updated Files**
- **Sidebar**: `src/components/Layout/Sidebar.jsx` - Added "Email Management" menu item
- **Routing**: `src/App.jsx` - Added `/email` route

---

## 🗄️ Database Schema Summary

### Dedicated Database: `email_management_db`

#### Tables:

1. **`email_accounts`** - Stores email account configurations
   - Supports Gmail, Outlook, custom domains
   - Encrypted credentials storage
   - OAuth token management

2. **`emails`** - Main email storage
   - Full email content (text & HTML)
   - Metadata (from, to, cc, bcc, subject)
   - Folder organization
   - Read/starred/draft status
   - Full-text search index

3. **`email_attachments`** - Attachment metadata
   - File information and storage paths
   - Checksum for integrity
   - Size tracking

4. **`email_folders`** - Folder management
   - System folders (inbox, sent, etc.)
   - Custom user folders
   - Unread/total counts

5. **`email_sync_log`** - Sync tracking
   - Sync history and status
   - Error logging
   - Performance monitoring

6. **`email_send_queue`** - Outgoing emails
   - Queue management
   - Retry logic
   - Delivery tracking

7. **`email_rules`** - Email automation
   - Conditional rules
   - Automated actions
   - Priority settings

---

## 🚀 Deployment Options

### Option 1: Development (Local)
```
Frontend (React) → Backend API → Local MySQL + File Storage
```

### Option 2: Docker (Recommended)
```yaml
Services:
- web-frontend (React)
- backend-api (Node.js)
- email-sync-worker (Background sync)
- email-send-worker (Send queue processor)
- mysql (email_management_db)
- redis (Queue management)
- minio (File storage)
```

### Option 3: Cloud (AWS)
```
CloudFront → ALB →  [ECS Frontend | ECS Backend]
                         ↓              ↓
                    [RDS MySQL] [ElastiCache] [S3]
```

---

## 🔧 Backend Implementation Required

### Directory Structure:
```
backend/
└── services/
    └── email/
        ├── emailSyncService.js      # IMAP sync
        ├── emailSendService.js      # SMTP sending
        ├── emailAccountService.js   # Account management
        └── emailStorageService.js   # File handling
```

### Key Technologies:
- **IMAP Client**: `node-imap` or `imap-simple`
- **SMTP Client**: `nodemailer`
- **Queue**: `bull` (Redis-based)  
- **Database**: `mysql2` or `sequelize`
- **Storage**: `aws-sdk` (S3) or local filesystem

---

## 🔐 Email Provider Configuration

### Gmail
```javascript
{
  imapServer: 'imap.gmail.com',
  imapPort: 993,
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  // Requires App Password from Google Account
}
```

### Outlook/Office 365
```javascript
{
  imapServer: 'outlook.office365.com',
  imapPort: 993,
  smtpServer: 'smtp.office365.com',
  smtpPort: 587,
  // Requires App Password or OAuth
}
```

### Custom Domain
```javascript
{
  imapServer: 'mail.yourdomain.com',
  imapPort: 993,
  smtpServer: 'mail.yourdomain.com',
  smtpPort: 587,
  // Standard credentials
}
```

---

## 📡 API Endpoints

### Account Management
- `POST /api/email/accounts` - Add new account
- `GET /api/email/accounts` - List all accounts
- `DELETE /api/email/accounts/:id` - Remove account

### Email Operations
- `GET /api/email/:accountId/emails` - List emails
- `POST /api/email/:accountId/emails/send` - Send email
- `GET /api/email/:accountId/emails/:id` - Get email detail
- `PUT /api/email/:accountId/emails/:id/read` - Mark read
- `PUT /api/email/:accountId/emails/:id/star` - Star/Unstar

### Attachments
- `GET /api/email/attachments/:id/download` - Download
- `POST /api/email/attachments/upload` - Upload

---

## 🔒 Security Features

1. **Password Encryption**: AES-256 encryption for credentials
2. **OAuth 2.0**: Preferred authentication for Gmail/Outlook
3. **TLS/SSL**: All email communications encrypted
4. **Access Control**: User-scoped email access
5. **Rate Limiting**: API protection
6. **Audit Logging**: All operations logged

---

## 📊 Storage Organization

```
storage/
└── emails/
    └── [account_id]/
        └── [year]/
            └── [month]/
                └── [email_id]/
                    └── attachments/
                        ├── document1.pdf
                        ├── image1.jpg
                        └── spreadsheet1.xlsx
```

---

## ⚡ Performance Optimizations

1. **Database Indexing**: Optimized queries
2. **Redis Caching**: Frequently accessed data
3. **Pagination**: Efficient list loading
4. **Lazy Loading**: On-demand email body loading
5. **Connection Pooling**: IMAP/SMTP/Database

---

## 🎨 Features Implemented (Frontend)

✅ Multi-account email management
✅ Email inbox with folder navigation
✅ Email composition with attachments
✅ Email reading with attachment view
✅ Starred emails
✅ Search functionality
✅ Account switching
✅ Refresh/sync button
✅ Responsive design
✅ Provider auto-configuration

---

## 🚧 Next Steps (Backend Implementation)

1. **Setup Database**
   ```sql
   CREATE DATABASE email_management_db;
   -- Run schema from EMAIL_SERVICE_ARCHITECTURE.md
   ```

2. **Install Dependencies**
   ```bash
   npm install node-imap nodemailer bull mysql2 redis
   ```

3. **Implement Services**
   - Email sync service (IMAP)
   - Email send service (SMTP)
   - Account management
   - File storage handler

4. **Setup Workers**
   - Background sync worker
   - Send queue worker

5. **Configure Environment**
   - Setup `.env` with database credentials
   - Configure OAuth credentials
   - Setup Redis connection

6. **Testing**
   - Test Gmail connection
   - Test Outlook connection
   - Test custom domain
   - Verify end-to-end flow

---

## 📱 Access the Email Service

1. **Login** to your application as Admin
2. Navigate to **"Email Management"** in the sidebar
3. Click **"Add Account"** to configure your first email
4. Select provider (Gmail/Outlook/Custom)
5. Enter credentials
6. Start managing emails!

---

## 🆘 Troubleshooting

### Gmail Not Working?
- Enable IMAP in Gmail settings
- Generate App Password (Account → Security → 2-Step Verification → App Passwords)
- Use App Password instead of regular password

### Outlook Not Working?
- Enable IMAP in Outlook settings
- May need to enable "Less secure app access" or use OAuth
- Check if account has 2FA enabled

### Custom Domain Issues?
- Verify IMAP/SMTP server addresses are correct
- Check port numbers (993 for IMAP, 587 for SMTP)
- Ensure TLS/SSL is supported

---

## 📈 Monitoring Recommendations

### Key Metrics:
- Email sync success rate
- Average sync time per account
- Email send success rate
- API response times
- Database query performance

### Alerts:
- 3+ consecutive sync failures
- Send queue buildup (>100 emails)
- Database connection issues
- Storage capacity warnings

---

## 🌟 Future Enhancements

- [ ] AI-powered email categorization
- [ ] Priority inbox
- [ ] Email templates
- [ ] Scheduled sending
- [ ] Email tracking (open rates)
- [ ] Conversation threading
- [ ] Calendar integration
- [ ] Mobile PWA support
- [ ] Push notifications

---

## 📚 Documentation References

- **Full Architecture**: `EMAIL_SERVICE_ARCHITECTURE.md`
- **Database Scripts**: See architecture document
- **API Documentation**: See architecture document, section "API Endpoints"
- **Security Guide**: See architecture document, section "Security Considerations"

---

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review `EMAIL_SERVICE_ARCHITECTURE.md` for detailed information
3. Verify email provider settings
4. Check backend service logs

---

*Last Updated: December 1, 2025*
*Version: 1.0*
