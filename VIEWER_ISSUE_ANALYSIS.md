# Document Viewer Issue - Root Cause Analysis

## Problem Summary
Files uploaded in Notes page cannot be viewed - the viewer shows empty content.

## Root Cause Identified
From console logs, we discovered:
1. **Files ARE being saved to IndexedDB successfully** ✅
2. **Files ARE being retrieved from IndexedDB** ✅  
3. **Files DO have the `content` property** ✅
4. **Content DOES start with correct DataURL** ✅ (`data:application/pdf;base64,JVBERi0x...`)

## The Real Issue
The `DocumentViewerModal` component is receiving the document with content, but something in the rendering is failing. The console shows:
- `Document has content property? true`
- `Content preview (first 100 chars): data:application/pdf;base64,JVBERi0x...`
- `Opening viewer with full document`

But the viewer still shows empty.

## Next Steps to Fix

### Option 1: Check DocumentViewerModal Rendering
The issue might be in how the PDF iframe is rendering. Check if:
- The `src` attribute of the iframe is being set correctly
- There's a CSP (Content Security Policy) blocking data URLs
- The PDF DataURL is too large for the iframe

### Option 2: Use Blob URLs Instead of DataURLs
Convert the DataURL to a Blob URL before passing to the iframe:
```javascript
const blob = await fetch(document.content).then(r => r.blob());
const blobUrl = URL.createObjectURL(blob);
// Use blobUrl in iframe src
```

### Option 3: Test with Smaller Files
Try uploading a small image (< 1MB) instead of a 10MB PDF to see if:
- Images work (they use `<img>` tag instead of `<iframe>`)
- The issue is specific to large PDFs
- The issue is with PDF rendering

## File Corruption Issue
The `ProjectNotes.jsx` file has been corrupted multiple times during edits. Before making any more changes:
1. Restore from a working backup
2. Make smaller, targeted edits
3. Test each change individually

## Recommendation
1. **First**: Restore `ProjectNotes.jsx` from git history or backup
2. **Then**: Test if images work in the viewer (upload a small PNG)
3. **If images work**: The issue is PDF-specific, implement Blob URL solution
4. **If images don't work**: The issue is in DocumentViewerModal rendering logic

## Console Evidence
```
[documentStorage] Retrieved documents: 1 [...]
Found document with content: {id: "...", content: "data:application/pdf;base64,JVBERi0x...", ...}
Document has content property? true
Content preview (first 100 chars): data:application/pdf;base64,JVBERi0x...
Opening viewer with full document
```

This proves the data is there - the issue is purely in the viewer component.
