# 🚀 Email Service - Complete Setup Guide

This guide will walk you through setting up the complete Email Management Service from scratch.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Node.js (v18 or higher)
- ✅ MySQL (v8.0 or higher)
- ✅ Redis (latest version)
- ✅ Git
- ✅ Code editor (VS Code recommended)

---

## 📦 Step 1: Project Structure

Your project should have this structure:

```
tender-project-app/
├── src/
│   ├── pages/
│   │   └── EmailManagement/
│   │       └── EmailManagement.jsx          ✅ Created
│   ├── components/
│   │   └── Layout/
│   │       └── Sidebar.jsx                  ✅ Updated
│   └── App.jsx                              ✅ Updated
├── backend/
│   ├── services/
│   │   └── email/
│   │       └── emailSyncService.js          ✅ Created (template)
│   ├── .env.example                         ✅ Created
│   └── package.json                         ✅ Created
├── database/
│   └── email_management_setup.sql           ✅ Created
├── EMAIL_SERVICE_ARCHITECTURE.md            ✅ Created
├── EMAIL_SERVICE_QUICK_GUIDE.md             ✅ Created
├── EMAIL_SERVICE_README.md                  ✅ Created
└── EMAIL_SYSTEM_DIAGRAM.md                  ✅ Created
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Start MySQL

```bash
# Windows
net start MySQL80

# Mac/Linux
sudo systemctl start mysql
# or
brew services start mysql
```

### 2.2 Create Database

Option A - Using SQL script:
```bash
mysql -u root -p < database/email_management_setup.sql
```

Option B - Manual:
```bash
mysql -u root -p
```

```sql
CREATE DATABASE email_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE email_management_db;
source /path/to/database/email_management_setup.sql
```

### 2.3 Verify Installation

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

### 2.4 Create Database User (Recommended)

```sql
CREATE USER 'email_service_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON email_management_db.* TO 'email_service_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🔴 Step 3: Redis Setup

### 3.1 Install Redis

**Windows:**
```bash
# Download from: https://github.com/microsoftarchive/redis/releases
# Or use WSL
```

**Mac:**
```bash
brew install redis
```

**Linux:**
```bash
sudo apt-get install redis-server
```

### 3.2 Start Redis

```bash
# Windows
redis-server

# Mac
brew services start redis

# Linux
sudo systemctl start redis
```

### 3.3 Test Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

---

## 🔧 Step 4: Backend Setup

### 4.1 Navigate to Backend Directory

```bash
cd backend
```

### 4.2 Install Dependencies

```bash
npm install
```

This will install:
- express (API server)
- mysql2 (Database client)
- node-imap (IMAP client)
- mailparser (Email parser)
- nodemailer (SMTP client)
- bull (Queue management)
- redis (Cache)
- And more...

### 4.3 Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
notepad .env  # Windows
nano .env     # Mac/Linux
```

### 4.4 Generate Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it in `.env` as `ENCRYPTION_KEY`

### 4.5 Update .env File

```env
# Database
EMAIL_DB_HOST=localhost
EMAIL_DB_PORT=3307
EMAIL_DB_NAME=email_management_db
EMAIL_DB_USER=email_service_user
EMAIL_DB_PASSWORD=SecurePassword123!

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
ENCRYPTION_KEY=<paste generated key here>
JWT_SECRET=your_jwt_secret

# Storage
STORAGE_TYPE=local
STORAGE_PATH=./storage/emails
```

---

## 💻 Step 5: Backend Implementation

### 5.1 Create Server File

Create `backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api/email', require('./routes/emailRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Email Management API' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`✅ Email Service API running on port ${PORT}`);
});
```

### 5.2 Create Routes File

Create `backend/routes/emailRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const EmailSyncService = require('../services/email/emailSyncService');
const mysql = require('mysql2/promise');

// Database config
const dbConfig = {
  host: process.env.EMAIL_DB_HOST,
  port: process.env.EMAIL_DB_PORT,
  user: process.env.EMAIL_DB_USER,
  password: process.env.EMAIL_DB_PASSWORD,
  database: process.env.EMAIL_DB_NAME
};

// Initialize sync service
const syncService = new EmailSyncService(dbConfig, process.env.ENCRYPTION_KEY);

// Add email account
router.post('/accounts', async (req, res) => {
  try {
    const { accountName, emailAddress, provider, imapServer, imapPort, 
            smtpServer, smtpPort, username, password } = req.body;
    
    // Encrypt password
    const crypto = require('crypto');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', 
      Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const encryptedPassword = iv.toString('hex') + ':' + encrypted.toString('hex');
    
    // Save to database
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      `INSERT INTO email_accounts 
       (user_id, account_name, email_address, provider, imap_server, imap_port,
        smtp_server, smtp_port, username, password_encrypted)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user?.id || 1, accountName, emailAddress, provider, imapServer, imapPort,
       smtpServer, smtpPort, username, encryptedPassword]
    );
    await connection.end();
    
    res.json({ success: true, accountId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get email accounts
router.get('/accounts', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [accounts] = await connection.execute(
      `SELECT id, account_name, email_address, provider, last_sync_at, is_active 
       FROM email_accounts WHERE user_id = ?`,
      [req.user?.id || 1]
    );
    await connection.end();
    
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sync account
router.post('/accounts/:id/sync', async (req, res) => {
  try {
    const count = await syncService.syncAccount(req.params.id);
    res.json({ success: true, emailsSynced: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get emails
router.get('/:accountId/emails', async (req, res) => {
  try {
    const { folder = 'inbox', limit = 50, offset = 0 } = req.query;
    
    const connection = await mysql.createConnection(dbConfig);
    const [emails] = await connection.execute(
      `SELECT id, from_email, from_name, to_emails, subject, 
              body_text, has_attachments, is_read, is_starred, email_date
       FROM emails 
       WHERE account_id = ? AND folder = ?
       ORDER BY email_date DESC
       LIMIT ? OFFSET ?`,
      [req.params.accountId, folder, parseInt(limit), parseInt(offset)]
    );
    await connection.end();
    
    res.json({ success: true, emails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### 5.3 Start Backend Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
✅ Email Service API running on port 5000
```

---

## 🎨 Step 6: Frontend Setup

The frontend is already set up! Just make sure your React dev server is running:

```bash
# From project root
npm run dev
```

Visit: `http://localhost:5173`

---

## 📧 Step 7: Configure Email Accounts

### 7.1 Gmail Setup

1. **Enable IMAP in Gmail**:
   - Go to Gmail Settings → See all settings
   - Go to "Forwarding and POP/IMAP"
   - Enable IMAP
   - Save changes

2. **Generate App Password**:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification (if not already)
   - Go to App Passwords
   - Generate new app password for "Mail"
   - Copy the 16-character password

3. **Add Account in App**:
   - Provider: Gmail
   - Email: your-email@gmail.com
   - Password: <paste app password>
   - (IMAP/SMTP auto-configured)

### 7.2 Outlook Setup

1. **Enable IMAP in Outlook**:
   - Go to Outlook settings
   - Sync email → POP and IMAP
   - Enable IMAP

2. **Generate App Password**:
   - Go to https://account.microsoft.com/security
   - Advanced security options
   - Create new app password

3. **Add Account in App**:
   - Provider: Outlook
   - Email: your-email@outlook.com
   - Password: <paste app password>

### 7.3 Custom Domain Setup

1. **Get IMAP/SMTP Settings** from your email provider

2. **Add Account in App**:
   - Provider: Custom Domain
   - IMAP Server: mail.yourdomain.com
   - IMAP Port: 993
   - SMTP Server: mail.yourdomain.com
   - SMTP Port: 587
   - Username & Password

---

## 🧪 Step 8: Testing

### 8.1 Test Database Connection

```bash
mysql -u email_service_user -p email_management_db
```

```sql
SELECT COUNT(*) FROM email_accounts;
```

### 8.2 Test Redis

```bash
redis-cli
> SET test "hello"
> GET test
> DEL test
```

### 8.3 Test API

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","service":"Email Management API"}
```

### 8.4 Test Email Sync

1. Add an email account through the UI
2. Click "Refresh" button
3. Check backend logs for sync activity
4. Verify emails appear in inbox

---

## 🔄 Step 9: Setup Background Workers (Optional)

### 9.1 Create Sync Worker

Create `backend/workers/emailSyncWorker.js`:

```javascript
const EmailSyncService = require('../services/email/emailSyncService');
require('dotenv').config();

const dbConfig = {
  host: process.env.EMAIL_DB_HOST,
  port: process.env.EMAIL_DB_PORT,
  user: process.env.EMAIL_DB_USER,
  password: process.env.EMAIL_DB_PASSWORD,
  database: process.env.EMAIL_DB_NAME
};

const syncService = new EmailSyncService(dbConfig, process.env.ENCRYPTION_KEY);

// Run sync every 5 minutes
setInterval(async () => {
  console.log('🔄 Starting periodic email sync...');
  try {
    const results = await syncService.syncAllAccounts();
    console.log('✅ Sync completed:', results);
  } catch (error) {
    console.error('❌ Sync error:', error);
  }
}, parseInt(process.env.EMAIL_SYNC_INTERVAL || 300000));

console.log('✅ Email Sync Worker started');
```

### 9.2 Run Worker

```bash
npm run worker:sync
```

---

## 🐳 Step 10: Docker Deployment (Optional)

### 10.1 Create docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: email_management_db
      MYSQL_USER: email_service_user
      MYSQL_PASSWORD: SecurePassword123!
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
    env_file:
      - ./backend/.env
    depends_on:
      - mysql
      - redis
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - email_storage:/app/storage

volumes:
  mysql_data:
  email_storage:
```

### 10.2 Run Docker

```bash
docker-compose up -d
```

---

## ✅ Step 11: Verification Checklist

- [ ] MySQL database created with 7 tables
- [ ] Redis is running and accessible
- [ ] Backend dependencies installed
- [ ] .env file configured with encryption key
- [ ] Backend server starts without errors
- [ ] Frontend dev server running
- [ ] Can access Email Management page
- [ ] Can add email account
- [ ] Can sync emails (manual trigger works)
- [ ] Emails display in inbox
- [ ] Can compose and send email (if implemented)

---

## 🆘 Troubleshooting

### Problem: Database connection error

**Solution:**
```bash
# Check if MySQL is running
mysql -u root -p

# Verify credentials in .env match database user
```

### Problem: Redis connection error

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

### Problem: IMAP authentication failed

**Solution:**
- For Gmail: Use App Password, not regular password
- For Outlook: Enable IMAP and use App Password
- Check IMAP server address and port

### Problem: "Module not found" errors

**Solution**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 You're Done!

Your Email Management Service is now fully set up and ready to use!

### Next Steps:

1. **Add email accounts** through the UI
2. **Test email sync** from different providers
3. **Implement email sending** (use nodemailer)
4. **Setup background workers** for automatic sync
5. **Deploy to production** when ready

---

## 📚 Additional Resources

- **Full Architecture**: `EMAIL_SERVICE_ARCHITECTURE.md`
- **Quick Guide**: `EMAIL_SERVICE_QUICK_GUIDE.md`
- **System Diagram**: `EMAIL_SYSTEM_DIAGRAM.md`
- **README**: `EMAIL_SERVICE_README.md`
- **Database Schema**: `database/email_management_setup.sql`

---

**Need Help?**
- Review documentation files
- Check troubleshooting section
- Verify all prerequisites are met
- Check backend logs for errors

---

*Last Updated: December 1, 2025*
