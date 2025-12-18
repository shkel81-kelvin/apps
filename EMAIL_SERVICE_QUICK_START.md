# 🚀 Email Service - Quick Start Guide

## New! Automated Startup Scripts Created ✨

I've created automated scripts to make email service setup and startup **super easy**!

---

## 📝 **What You Need to Do** (3 Simple Steps)

### **Step 1: Setup Database (ONE TIME ONLY)** ⚙️

Run this script **once** to create the email database:

```batch
setup-email-database.bat
```

**What it does:**
- ✅ Finds your MySQL installation automatically
- ✅ Creates `email_management_db` database
- ✅ Creates 7 required tables
- ✅ Verifies everything is working

**Expected Output:**
```
[OK] Database created successfully!
The following tables were created:
  - email_accounts
  - emails
  - email_attachments
  - email_folders
  - email_sync_log
  - email_send_queue
  - email_rules
```

---

### **Step 2: Start Email Service** 🚀

**Every time you want to use email features**, run:

```batch
start-email-service.bat
```

**What it does:**
- ✅ Checks if MySQL is running
- ✅ Starts MySQL automatically (if possible)
- ✅ Verifies database exists
- ✅ Starts backend server on port 5000

**Expected Output:**
```
[1/5] Checking MySQL status...
    [OK] MySQL is running

[2/5] Checking Database...
    [OK] Database exists

[3/5] Starting Backend Server...
    ✅ Email Management API Server
    🚀 Server running on: http://localhost:5000
```

**Keep this window open!** The backend runs here.

---

### **Step 3: Configure Email Account** 📧

1. **Open your app**: http://localhost:5173
2. **Go to**: Email Management
3. **Click**: "Add Account"
4. **Fill in:**
   - **Provider**: Gmail (or Outlook)
   - **Email**: your-email@gmail.com
   - **Username**: your-email@gmail.com
   - **Password**: **YOUR APP PASSWORD** ⚠️

> **Important:** Use Gmail App Password, NOT your regular password!
> 
> Generate it here: https://myaccount.google.com/apppasswords

5. **Click**: "Test Connection" - Should see ✅ Success!
6. **Click**: "Add Account"
7. **Click**: "Refresh" button to sync emails

**Expected:** Your real emails appear! 🎉

---

## 🔧 **Troubleshooting Script**

If something doesn't work, run the diagnostic:

```batch
check-email-service.bat
```

**What it does:**
- ✅ Checks if MySQL is running
- ✅ Checks if backend is running
- ✅ Checks if database exists
- ✅ Checks if accounts are configured
- ✅ Shows which step is failing

**Example Output:**
```
[CHECK 1/6] MySQL Service Status
    [PASS] MySQL is running

[CHECK 2/6] Backend Server Status
    [FAIL] Backend is not running
    [INFO] Run: start-email-service.bat

[CHECK 3/6] Database Exists
    [PASS] Database exists
```

---

## 📂 **Script Reference**

| Script | Purpose | When to Run |
|--------|---------|-------------|
| `setup-email-database.bat` | Creates database | **Once** (initial setup) |
| `start-email-service.bat` | Starts MySQL + Backend | **Every session** |
| `check-email-service.bat` | Diagnoses issues | **When troubleshooting** |

---

## 🎯 **Complete Workflow**

### **First Time Setup:**
```
1. Run: setup-email-database.bat
2. Run: start-email-service.bat
3. Add Gmail account in app
4. Click "Refresh" → See emails!
```

### **Daily Usage:**
```
1. Run: start-email-service.bat
2. Open app: http://localhost:5173
3. Use Email Management normally
```

---

## ⚠️ **Common Issues**

### **Issue: "MySQL is not running"**

**Solutions:**
1. **Using XAMPP?**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Wait for green "Running" status
   - Run `start-email-service.bat` again

2. **Using MySQL Service?**
   - Open PowerShell as Administrator
   - Run: `net start MySQL80` (or `MySQL`)
   - Run `start-email-service.bat` again

---

### **Issue: "Database creation failed"**

**Possible causes:**
- MySQL requires a password (script assumes blank)
- Wrong MySQL path

**Fix:**
1. Open `setup-email-database.bat` in notepad
2. Find the line with `"%MYSQL_PATH%" -u root`
3. Change to: `"%MYSQL_PATH%" -u root -p`
4. Save and run again (it will ask for password)

---

### **Issue: "Backend won't start"**

**Check:**
```batch
cd backend
npm install
```

Then run `start-email-service.bat` again.

---

### **Issue: "Sync fails - Authentication error"**

**You're using regular password instead of App Password!**

**Fix:**
1. Go to: https://myaccount.google.com/apppasswords
2. Generate new App Password
3. Delete old account from app
4. Add account again with App Password (16 characters, no spaces)
5. Click "Refresh"

---

## ✅ **Verification Steps**

After setup, verify everything works:

1. **Run diagnostic:**
   ```batch
   check-email-service.bat
   ```
   
   All checks should show `[PASS]`

2. **Test backend:**
   ```batch
   curl http://localhost:5000/health
   ```
   
   Should return: `{"status":"OK"...}`

3. **Test sync:**
   - Open app → Email Management
   - Select your account
   - Click "Refresh"
   - Backend console shows: `✅ Synced X emails`
   - Emails appear in inbox

---

## 🎓 **Understanding the Flow**

```
┌─────────────────────────────────────┐
│  setup-email-database.bat           │
│  (Run once)                          │
└──────────────┬──────────────────────┘
               │
               ▼
      Creates Database
               │
               ▼
┌─────────────────────────────────────┐
│  start-email-service.bat            │
│  (Run every session)                 │
└──────────────┬──────────────────────┘
               │
               ├─→ Starts MySQL
               │
               ├─→ Starts Backend
               │
               ▼
┌─────────────────────────────────────┐
│  Your App (localhost:5173)          │
│  Add Account → Sync → See Emails    │
└─────────────────────────────────────┘
```

---

## 💡 **Pro Tips**

1. **Create Desktop Shortcuts:**
   - Right-click `start-email-service.bat`
   - Send to → Desktop (create shortcut)
   - Double-click to start email service anytime!

2. **Auto-start with Windows:**
   - Press `Win + R`
   - Type: `shell:startup`
   - Copy `start-email-service.bat` shortcut here
   - Email service starts when Windows boots!

3. **Keep Backend Running:**
   - Minimize the backend window (don't close!)
   - It needs to stay open for email sync to work

---

## 🆘 **Need Help?**

1. **Run diagnostics first:**
   ```batch
   check-email-service.bat
   ```

2. **Check which step fails**

3. **Common fixes:**
   - MySQL not running → Start XAMPP
   - Database missing → Run setup script
   - Backend errors → Check `.env` file
   - Sync fails → Use App Password

---

## 📞 **Quick Command Reference**

```batch
# Setup (run once)
setup-email-database.bat

# Start service (daily)
start-email-service.bat

# Check status
check-email-service.bat

# Start frontend
npm run dev

# Restart everything
1. Close all terminals
2. Run: start-email-service.bat
3. In new terminal: npm run dev
```

---

**You're all set!** 🎉

The scripts handle all the complex setup automatically. Just run and enjoy!

---

*Created: December 1, 2025*
*Scripts: `setup-email-database.bat`, `start-email-service.bat`, `check-email-service.bat`*
