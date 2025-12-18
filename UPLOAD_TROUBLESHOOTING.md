# Bidder File Upload Troubleshooting Guide

## Problem
After bidder uploads files, the submission status doesn't update and files don't appear.

## Added Debugging Features

### Console Logging
I've added comprehensive console logging to help identify the issue:

1. **When page loads:**
   - `=== LOADING TENDER DATA ===`
   - Shows bidder info, tender ID, all files

2. **When uploading files:**
   - `=== UPLOAD COMPLETE ===`
   - Shows each file being saved
   - Shows final storage state

## How to Debug

### Step 1: Open Browser Console
1. Press `F12` in your browser
2. Go to **Console** tab
3. Keep it open while testing

### Step 2: Test Upload
1. Login as bidder
2. Click "Upload Tender Response"
3. Select a file (e.g., Excel file)
4. Click "Upload"
5. **Watch the console**

### Step 3: Check Console Output

Look for these log messages:

```
=== UPLOAD COMPLETE ===
Bidder session: {email: "bidder@test.com", tenderId: 123, ...}
Uploaded files: [{name: "tender.xlsx", uploadedBy: "bidder@test.com", ...}]
Saving file: tender.xlsx for tender: 123 by: bidder@test.com
File saved: {id: 987654321, tenderId: 123, uploadedBy: "bidder@test.com", ...}
Checking storage: [...] // Should show ALL files including the new one
=== LOADING TENDER DATA ===
My submitted files: [...] // Should show your uploaded file
```

## Common Issues & Solutions

### Issue 1: `uploadedBy` is undefined
**Symptom:** Files save but `uploadedBy` field is missing
**Solution:** Check BidderFileUpload component - ensure `uploadedBy` is set in the file object

### Issue 2: Tender ID mismatch
**Symptom:** Files save but don't appear for the tender
**Check:** Verify `bidderSession.tenderId` matches the actual tender ID

### Issue 3: Email mismatch
**Symptom:** Files save but status stays "Pending"
**Check:** Verify `bidderSession.email` matches the bidder's email in subcontractor database

### Issue 4: LocalStorage full
**Symptom:** Upload fails silently
**Solution:** Clear localStorage:
```javascript
localStorage.clear()
```

## Manual Verification

### Check Files in LocalStorage:
Open Console and run:
```javascript
// View all files
JSON.parse(localStorage.getItem('tender_app_files'))

// Check for specific tender
const files = JSON.parse(localStorage.getItem('tender_app_files'));
console.log('Files for tender 123:', files.filter(f => f.tenderId === 123));

// Check for specific bidder
console.log('Files from bidder:', files.filter(f => f.uploadedBy === 'bidder@test.com'));
```

### Force Reload Data:
In Console:
```javascript
// Refresh the page
location.reload()
```

## Expected File Structure

A correctly uploaded file should look like:
```javascript
{
  id: 1732594800000,
  tenderId: 1,  // Must match tender ID
  name: "tender_response.xlsx",
  size: 52428,
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  data: "data:application/...",
  uploadedBy: "bidder@company.com",  // CRITICAL: Must match bidder email
  uploadedAt: "2025-11-26T01:40:00.000Z"
}
```

## Admin Portal Check

After bidder uploads, check admin portal:

1. Go to Tender Dashboard
2. Click on the tender
3. Find the bidder in the table
4. **Submission Status** should show **"Submitted"** (green)
5. Status detection logic:
   ```javascript
   const bidderFiles = fileStorage.getAll()
     .filter(f => f.tenderId === tender.id && f.uploadedBy === bidder.email);
   const hasSubmitted = bidderFiles.length > 0;
   ```

## Quick Fix Checklist

- [ ] Browser console shows no errors
- [ ] `uploadedBy` field is set correctly
- [ ] Tender ID matches
- [ ] Bidder email matches exactly
- [ ] localStorage has space
- [ ] Page refreshed after upload
- [ ] Admin portal refreshed

## If Issue Persists

1. **Clear all data and start fresh:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Check the exact console output** and share it for debugging

3. **Verify bidder credentials:**
   - Email in session matches email in subcontractor database
   - Tender ID is correct

## Test with Sample Data

Create a test upload with minimal code:
```javascript
// In browser console (logged in as bidder)
const bidder = JSON.parse(sessionStorage.getItem('bidder_session'));
console.log('Bidder:', bidder);

// Manually add a test file
import { fileStorage } from './utils/fileStorage';
fileStorage.addFile(bidder.tenderId, {
  name: 'test.txt',
  size: 100,
  type: 'text/plain',
  data: 'data:text/plain;base64,SGVsbG8=',
  uploadedBy: bidder.email
});

// Verify
console.log('After adding:', fileStorage.getAll());
```

---

**Next Steps:**
1. Open browser console
2. Try uploading a file
3. Share the console output with the specific error/issue
