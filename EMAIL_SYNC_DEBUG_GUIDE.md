# 🔍 Email Sync Troubleshooting Guide

## Issue: Email Cannot Fetch and Sync Despite Successful Credential Test

You've added an email account, the credentials were verified successfully ✅, but clicking "Refresh" doesn't sync emails ❌.

## Root Cause Analysis

The issue occurs because:

1. **Connection test works** ✅ - Tests credentials directly without saving to DB
2. **Account save succeeds** ✅ - Saves encrypted credentials to database  
3. **Email sync fails** ❌ - Cannot retrieve and decrypt credentials from DB to connect to IMAP

## Step-by-Step Diagnostic

### Step 1: Verify Backend is Running

```bash
# Check if backend is running
curl http://localhost:5000/health
```

**Expected Output:**
```json
{"status":"OK","service":"Email Management API","timestamp":"2025-12-01..."}
```

**If this fails:** Start the backend server
```bash
cd backend
npm start
```

---

### Step 2: Check Database Connection

```bash
# Connect to MySQL
mysql -u root -p
```

```sql
-- Check if database exists
SHOW DATABASES LIKE 'email_management_db';

-- Use the database
USE email_management_db;

-- Check if tables exist
SHOW TABLES;

-- Verify your account was saved
SELECT id, account_name, email_address, provider, imap_server, imap_port, is_active, last_sync_at 
FROM email_accounts;
```

**Expected:** You should see your account listed with `is_active = 1`

---

### Step 3: Check Environment Configuration

```bash
# View backend environment
cat backend/.env
```

**Critical checks:**
- ✅ `ENCRYPTION_KEY` exists and is 64 characters (hex)
- ✅ `EMAIL_DB_HOST=localhost`
- ✅ `EMAIL_DB_PORT=3307` (or your MySQL port)
- ✅ `EMAIL_DB_PASSWORD` is correct

**If ENCRYPTION_KEY is missing:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output to `backend/.env` as `ENCRYPTION_KEY=...`

---

### Step 4: Test Direct Sync via API

```bash
# Replace {accountId} with your account ID (check database)
curl -X POST http://localhost:5000/api/email/accounts/1/sync
```

**Check backend console for detailed error messages!**

Look for:
- `🔄 Starting email sync for account 1...`
- `✅ Sync completed! Synced X emails` OR
- `❌ Error syncing emails: [error message]`

---

## Common Issues & Fixes

### Issue 1: "Authentication Failed" Error

**Cause:** Password decryption fails or credentials are incorrect

**Fix:**

1. **Verify encryption key in backend:**
```javascript
// backend/server.js should log this on startup
console.log('ENCRYPTION_KEY present:', !!process.env.ENCRYPTION_KEY);
```

2. **Re-save account with fresh credentials:**
   - Delete the existing account from frontend
   - Generate a NEW App Password from Gmail
   - Add account again with the new App Password

### Issue 2: "IMAP Connection Timeout"

**Cause:** Firewall or network blocking IMAP connection

**Fix:**

1. **Test IMAP connectivity:**
```bash
# For Gmail
telnet imap.gmail.com 993

# For Outlook
telnet outlook.office365.com 993
```

2. **Check firewall settings** - Allow outbound connections on port 993

3. **Verify IMAP server address:**
   - Gmail: `imap.gmail.com:993`
   - Outlook: `outlook.office365.com:993`

### Issue 3: "Database Connection Error"

**Cause:** Backend cannot connect to MySQL

**Fix:**

1. **Verify MySQL is running:**
```bash
# Windows
sc query MySQL
# Or check Task Manager for mysqld.exe

# Test connection
mysql -u root -p -e "SELECT 1"
```

2. **Check port in .env matches MySQL:**
```bash
# Find MySQL port
mysql -u root -p -e "SHOW VARIABLES LIKE 'port'"
```

Update `backend/.env`:
```env
EMAIL_DB_PORT=3307  # or whatever port MySQL is using
```

### Issue 4: Password Decryption Error

**Cause:** ENCRYPTION_KEY changed or corrupted after account was saved

**Fix:**

**DO NOT change ENCRYPTION_KEY after saving accounts!**

If you must change it:
1. Delete all existing accounts from database:
```sql
DELETE FROM email_accounts;
```
2. Update `.env` with new ENCRYPTION_KEY
3. Restart backend
4. Re-add all accounts

### Issue 5: No Emails in Inbox

**Possible causes:**
- Inbox is actually empty (unlikely)
- Synced but not showing in frontend
- Wrong folder being queried

**Fix:**

1. **Check database for synced emails:**
```sql
USE email_management_db;
SELECT COUNT(*) FROM emails WHERE account_id = 1;
SELECT id, from_email, subject, email_date FROM emails WHERE account_id = 1 ORDER BY email_date DESC LIMIT 10;
```

2. **If emails exist in DB but not showing:**
   - Check browser console for errors (F12)
   - Verify frontend is calling correct API endpoint
   - Check that `loadEmails()` function is properly calling backend

3. **If no emails in DB:**
   - Sync hasn't run successfully
   - Check backend logs during sync
   - Verify IMAP folder name (should be 'INBOX' for most providers)

---

## Debug Mode: Enable Verbose Logging

### Backend Logging

Add to `backend/server.js` in the sync endpoint (line 312):

```javascript
app.post('/api/email/accounts/:id/sync', async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🔄 Starting email sync for account ${id}...`);
        console.log('Database Config:', {
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
            user: dbConfig.user
        });
        console.log('Encryption Key Present:', !!process.env.ENCRYPTION_KEY);

        // ... rest of code
    }
});
```

### Frontend Logging

Add to `src/pages/EmailManagement/EmailManagement.jsx` in `handleSyncEmails` (line 151):

```javascript
const handleSyncEmails = async () => {
    if (!currentAccount) {
        alert('Please select an email account first');
        return;
    }

    console.log('=== SYNC DEBUG ===');
    console.log('Current Account:', currentAccount);
    console.log('Account ID:', currentAccount.id);
    console.log('Has password in state:', !!currentAccount.password);
    
    setIsLoading(true);
    // ... rest of code
}
```

---

## Verification Checklist

Before emails will sync, ensure:

- [ ] ✅ Backend server running (`npm start` in backend folder)
- [ ] ✅ Backend responds to health check: `curl http://localhost:5000/health`
- [ ] ✅ MySQL database `email_management_db` exists with 7 tables
- [ ] ✅ `.env` file has valid `ENCRYPTION_KEY` (64 hex characters)
- [ ] ✅ `.env` file has correct MySQL password
- [ ] ✅ Account exists in database: `SELECT * FROM email_accounts;`
- [ ] ✅ Account has `is_active = 1`
- [ ] ✅ Gmail/Outlook IMAP is enabled
- [ ] ✅ Using App Password (not regular password)
- [ ] ✅ IMAP server is reachable (test with telnet)

---

## Quick Fix Script

Run this to diagnose all common issues:

```bash
#!/bin/bash

echo "=== Email Sync Diagnostic ==="

# 1. Check backend
echo "1. Checking backend..."
curl -s http://localhost:5000/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is NOT running - Start with: cd backend && npm start"
fi

# 2. Check MySQL
echo "2. Checking MySQL..."
mysql -u root -p -e "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ MySQL is accessible"
else
    echo "   ❌ MySQL connection failed - Check credentials"
fi

# 3. Check database exists
echo "3. Checking email database..."
mysql -u root -p -e "USE email_management_db; SELECT COUNT(*) FROM email_accounts;" 2>&1 | grep -q "COUNT"
if [ $? -eq 0 ]; then
    echo "   ✅ Database and tables exist"
else
    echo "   ❌ Database not setup - Run: mysql -u root -p < database/email_management_setup.sql"
fi

# 4. Check .env
echo "4. Checking .env configuration..."
if [ -f "backend/.env" ]; then
    if grep -q "ENCRYPTION_KEY" backend/.env; then
        echo "   ✅ .env exists with ENCRYPTION_KEY"
    else
        echo "   ❌ .env missing ENCRYPTION_KEY"
    fi
else
    echo "   ❌ .env file missing - Copy from .env.example"
fi

echo ""
echo "=== Diagnostic Complete ==="
```

---

## Still Not Working?

If you've checked everything above and sync still fails, **check the actual error message from the backend!**

1. **Stop the backend** (Ctrl+C)

2. **Restart with full logging:**
```bash
cd backend
npm start
```

3. **Watch the console**

4. **Click Refresh in the app**

5. **Copy the exact error message** and look for:
   - `Authentication failed` → App Password issue
   - `Connection timeout` → Network/firewall issue  
   - `Password decryption failed` → ENCRYPTION_KEY mismatch
   - `Database error` → MySQL connection issue
   - `IMAP error` → IMAP server unreachable

---

## Success Indicators

When everything works correctly, you'll see:

**Backend Console:**
```
🔄 Starting email sync for account 1...
✅ Sync completed! Synced 15 emails
```

**Frontend:**
- Alert: "Success! Synced 15 emails"
- Real emails appear in inbox (no [DEMO] prefix)
- Email count updates in sidebar

**Database:**
```sql
SELECT COUNT(*) FROM emails WHERE account_id = 1;
-- Returns: 15 (or however many emails synced)
```

---

*Last Updated: December 1, 2025*
