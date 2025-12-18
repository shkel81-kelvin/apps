# Quick Fix for Storage Quota Error

## Problem
Your browser's localStorage is full (usually 5-10MB limit). This prevents:
- Saving notes with attachments
- Uploading new files
- Saving project schedules

## Immediate Solution (Quick Fix)

Open your browser console (F12) and run this command to clear old data:

```javascript
// Clear project schedules from localStorage (they'll be recreated)
localStorage.removeItem('kaps_project_schedules');

// Optional: Clear old documents from localStorage (if you migrated to IndexedDB)
localStorage.removeItem('myDocuments');

console.log('Storage cleared! Refresh the page.');
```

Then **refresh the page** (F5).

## What This Does
- Removes project schedules from localStorage (you can recreate them)
- Frees up space for file attachments
- Documents in IndexedDB are NOT affected

## Long-term Solution
We've created `scheduleIndexedDB.js` to move project schedules to IndexedDB (unlimited storage).
This needs to be integrated into `projectScheduleStorage.js` to permanently fix the issue.

## After Running the Fix
1. Refresh the page
2. Try uploading a file again
3. The file content should now save properly
4. You can view files in the document viewer

## Note
If you have important project schedules, export them first before clearing localStorage.
