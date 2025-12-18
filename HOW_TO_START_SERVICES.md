# 🚀 How to Start Backend Service

## ⚡ Quick Start (Easiest!)

I've created **startup scripts** for you! Just double-click:

### Option 1: Start Everything at Once ⭐ RECOMMENDED

**File**: `start-all-services.bat`

**What it does**:
- ✅ Starts backend server (port 5000)
- ✅ Starts frontend dev server (port 5173)
- ✅ Opens browser automatically
- ✅ Two windows for easy monitoring

**How to use**:
1. Double-click `start-all-services.bat`
2. Wait 8 seconds
3. Browser opens automatically!

---

### Option 2: Start Backend Only

**File**: `start-backend.bat`

**What it does**:
- ✅ Checks if packages installed
- ✅ Checks if .env exists
- ✅ Starts backend server
- ✅ Shows helpful warnings

**How to use**:
1. Double-click `start-backend.bat`
2. Backend runs on http://localhost:5000

---

## 📋 Manual Startup (Step by Step)

### Method 1: Start Backend Only

```bash
# Step 1: Navigate to backend folder
cd backend

# Step 2: Start server
npm start
```

**Expected output**:
```
═══════════════════════════════════════════════════════════
  ✅  Email Management API Server (With Real Email Sync!)
═══════════════════════════════════════════════════════════
  🚀  Server running on: http://localhost:5000
  🏥  Health check: http://localhost:5000/health
  📧  API endpoint: http://localhost:5000/api/email
```

**✅ Backend is running!**

Keep this terminal window open. Press `Ctrl+C` to stop.

---

### Method 2: Start Frontend & Backend Separately

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```

**Terminal 2 - Frontend**:
```bash
# From project root
npm run dev
```

**Result**:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

### Method 3: Start in Development Mode (Auto-reload)

For development with auto-restart on file changes:

```bash
cd backend
npm run dev
```

This uses `nodemon` to automatically restart when you edit files.

---

## 🎯 Start Everything at Once (Advanced)

### Using PowerShell:

Create a script to start both services:

```powershell
# In project root
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"
```

Save as `start-all.ps1` and run: `.\start-all.ps1`

---

### Using npm scripts:

Add to root `package.json`:

```json
{
  "scripts": {
    "start": "npm run dev",
    "backend": "cd backend && npm start",
    "dev": "vite",
    "start:all": "concurrently \"npm run backend\" \"npm run dev\""
  }
}
```

Then install concurrently:
```bash
npm install --save-dev concurrently
```

Start both:
```bash
npm run start:all
```

---

## ✅ Pre-Start Checklist

Before starting backend, ensure:

### 1. **Packages Installed**
```bash
cd backend
npm install
```

### 2. **Environment Configured**
```bash
cd backend

# Check if .env exists
ls .env

# If not, create it
cp .env.example .env
```

**Edit `.env`**:
```env
EMAIL_DB_PASSWORD=your_mysql_password
ENCRYPTION_KEY=generate_with_command_below
PORT=5000
```

**Generate encryption key**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. **Database Setup**
```bash
# From project root
mysql -u root -p < database/email_management_setup.sql
```

**Verify**:
```sql
mysql -u root -p
USE email_management_db;
SHOW TABLES;  -- Should show 7 tables
```

---

## 🔄 Auto-Start on Windows Boot (Optional)

To start backend automatically when Windows starts:

### Method 1: Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Name: "Email Backend Service"
4. Trigger: At system startup
5. Action: Start a program
6. Program: `C:\Windows\System32\cmd.exe`
7. Arguments: `/c "cd C:\path\to\project\backend && npm start"`

### Method 2: Startup Folder

1. Press `Win+R`
2. Type: `shell:startup`
3. Create shortcut to `start-backend.bat`
4. Backend starts automatically on login!

---

## 🛑 How to Stop Services

### Stop Backend:
- **If running in terminal**: Press `Ctrl+C`
- **If started with .bat file**: Close the window
- **If running as background**: 
  ```bash
  # Find process
  netstat -ano | findstr :5000
  # Kill process
  taskkill /PID <process_id> /F
  ```

### Stop Frontend:
- Press `Ctrl+C` in terminal
- Or close the terminal window

### Stop All Services:
- Close all terminal windows
- Or run:
  ```bash
  # Windows
  taskkill /F /IM node.exe
  ```

---

## 🧪 Verify Services Running

### Check Backend:
```bash
curl http://localhost:5000/health
```

**Expected**:
```json
{"status":"OK","service":"Email Management API"}
```

### Check Frontend:
Open browser: http://localhost:5173

Should show your Email Management page.

---

## 🎨 Different Ways to Start

### 1. **Double-Click** (Easiest!)
- Use `start-all-services.bat`
- Perfect for daily use

### 2. **Command Line** (Developer)
```bash
cd backend
npm start
```
- More control
- See all logs

### 3. **VS Code Tasks** (Advanced)
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "cd backend && npm start",
      "isBackground": true
    },
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "npm run dev",
      "isBackground": true
    }
  ]
}
```

Press `Ctrl+Shift+B` to run tasks.

### 4. **Docker** (Production)
```bash
docker-compose up
```
(Requires docker-compose.yml)

---

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend Dev | 5173 | http://localhost:5173 |
| MySQL | 3307 | localhost:3307 |
| Redis | 6379 | localhost:6379 (optional) |

---

## 🐛 Troubleshooting

### Error: "Port 5000 already in use"

**Solution 1**: Kill process using port
```bash
# Find process
netstat -ano | findstr :5000

# Kill it
taskkill /PID <pid> /F
```

**Solution 2**: Change port in .env
```env
PORT=5001
```

### Error: "Cannot find module"

**Solution**: Install packages
```bash
cd backend
npm install
```

### Error: "Cannot connect to database"

**Solution**: Start MySQL
```bash
# Windows
net start MySQL80

# Or check if running
mysql -u root -p -e "STATUS"
```

### Error: ".env file not found"

**Solution**: Create it
```bash
cd backend
cp .env.example .env
# Then edit .env with your settings
```

---

## 📝 Startup Scripts Summary

### `start-all-services.bat` ⭐
- Starts backend
- Starts frontend
- Opens browser
- **Use this daily!**

### `start-backend.bat`
- Starts backend only
- Checks dependencies
- Shows warnings
- **Use when frontend already running**

### Manual Commands
```bash
# Backend only
cd backend && npm start

# Frontend only (from root)
npm run dev

# Both (using concurrently)
npm run start:all
```

---

## ⚡ Quick Commands Reference

```bash
# Start backend (from project root)
cd backend && npm start

# Start backend (from backend folder)
npm start

# Start backend (dev mode with auto-reload)
npm run dev

# Start frontend (from project root)
npm run dev

# Check if backend running
curl http://localhost:5000/health

# Stop all node processes (CAREFUL!)
taskkill /F /IM node.exe

# Restart backend
# 1. Press Ctrl+C
# 2. npm start
```

---

## ✅ Recommended Workflow

### For Daily Use:
1. Double-click `start-all-services.bat`
2. Wait 8 seconds
3. Start working!

### For Development:
```bash
# Terminal 1
cd backend
npm run dev  # Auto-reload on changes

# Terminal 2
npm run dev  # Frontend with HMR
```

### For Production:
```bash
cd backend
npm start  # Stable, no auto-reload
```

---

## 🎯 What Happens When You Start

```
start-all-services.bat
    ↓
[Step 1] Start Backend
    ├── Navigates to backend/
    ├── Runs: npm start
    ├── Starts Express server
    ├── Listens on port 5000
    └── ✅ Backend Ready
    ↓
[Step 2] Start Frontend
    ├── Runs: npm run dev
    ├── Starts Vite dev server 
    ├── Listens on port 5173
    └── ✅ Frontend Ready
    ↓
[Step 3] Open Browser
    └── Opens http://localhost:5173
    ↓
✅ All Services Running!
```

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ **Backend console shows**:
```
✅  Email Management API Server
🚀  Server running on: http://localhost:5000
```

✅ **Frontend console shows**:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

✅ **Browser shows**: Email Management interface

✅ **Health check works**:
```bash
curl http://localhost:5000/health
# Returns: {"status":"OK"...}
```

---

## 💡 Pro Tips

1. **Keep terminals organized**
   - Name terminal windows
   - Use split terminals in VS Code

2. **Monitor logs**
   - Watch backend logs for email sync
   - Watch frontend logs for errors

3. **Use development mode**
   - `npm run dev` for auto-reload
   - Faster development cycle

4. **Create shortcuts**
   - Pin `start-all-services.bat` to taskbar
   - Or desktop shortcut

5. **Auto-start on login**
   - Add to Windows Startup folder
   - Services start when you log in

---

## 📞 Need Help?

If services won't start, check:

1. **Node.js installed?**
   ```bash
   node --version  # Should be v18+
   ```

2. **Packages installed?**
   ```bash
   cd backend
   ls node_modules  # Should exist
   ```

3. **MySQL running?**
   ```bash
   mysql -u root -p -e "STATUS"
   ```

4. **Ports available?**
   ```bash
   netstat -ano | findstr "5000 5173"
   # Should be empty
   ```

---

## 🚀 Ready to Start!

### Simplest Way:
1. Double-click `start-all-services.bat`
2. Done! 🎉

### Manual Way:
```bash
# Terminal 1
cd backend
npm start

# Terminal 2  
npm run dev

# Browser
# http://localhost:5173
```

**Both services running** = Real email functionality! ✅

---

*Last Updated: December 1, 2025 at 9:43 AM*
