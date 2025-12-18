# Data Migration Guide

## Problem
Browser localStorage is **isolated by domain**. This means:
- `localhost:5173` has separate storage from `192.168.1.55:5173`
- Data doesn't automatically sync between different URLs

## Solution: Data Migration Tool

### How to Use:

#### Step 1: Export from Localhost (PC)
1. Access your app at `http://localhost:5173`
2. Go to **Data Migration** (in the sidebar menu)
3. Click **"Export Data"** button
4. Save the JSON file to your Downloads folder

#### Step 2: Import to IP Address
1. Find your PC's IP address:
   ```
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.55`)

2. Access the app using your IP on **any device**:
   ```
   http://192.168.1.55:5173
   ```

3. Go to **Data Migration** page
4. Click **"Import Data"** button
5. Select the JSON file you exported
6. Page will auto-refresh with all your data!

### Important Notes:

✅ **DO:** Always use the same URL (IP address preferred)
✅ **DO:** Export your data before switching networks
✅ **DO:** Use a static IP to avoid losing data when DHCP changes

❌ **DON'T:** Mix localhost and IP address access
❌ **DON'T:** Expect automatic sync (localStorage is per-domain)

### Recommended Setup:

For the best experience, set a **static IP** on your PC:

1. Open Network Settings
2. Set Static IP (e.g., `192.168.1.100`)
3. Always access via: `http://192.168.1.100:5173`
4. Share this URL with all devices

This way:
- ✅ Data stays consistent
- ✅ IP never changes
- ✅ Works on all devices
- ✅ No re-migration needed

## Quick Troubleshooting

**Q: Data disappeared after IP changed?**  
A: Your data is still there! Access the OLD IP address to export it, then import to the new IP.

**Q: Mobile and PC show different data?**  
A: Check if you're using the same URL on both. Use the IP address on BOTH devices.

**Q: Can I automate this?**  
A: Not with localStorage (browser security). Consider migrating to a backend database for true sync.
