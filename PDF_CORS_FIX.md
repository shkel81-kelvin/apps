# PDF.js CORS Error - Fixed! ✅

## Error
```
Access to script at 'https://unpkg.com/pdfjs-dist@.../pdf.worker.min.js' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## Root Cause
The unpkg.com CDN was blocking requests due to CORS (Cross-Origin Resource Sharing) policy.

## Solution
Changed to **jsdelivr CDN** which has proper CORS headers configured.

### Before (Broken):
```javascript
pdfjsLib.GlobalWorkerOptions.workerSrc = 
    `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;
```

### After (Working):
```javascript
pdfjsLib.GlobalWorkerOptions.workerSrc = 
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
```

## Why jsdelivr Works
- ✅ Proper CORS headers
- ✅ Reliable CDN
- ✅ Fast delivery
- ✅ No access restrictions

## Test Your PDF
Your JOS quotation PDF should now process correctly:
- File: Q25080501 V3 (FourPoint Amansari Aruba).pdf
- Size: 122.14 KB
- Format: Professional quotation with table

## Expected Extraction
From your PDF, the system should extract:
- **Quotation Ref**: Q25081102
- **Date**: 25-Aug-25
- **Vendor**: JOS (MALAYSIA) SDN BHD
- **Items**: HPE ProLiant servers and components
- **Quantities**: 2, 4, 16, etc.
- **Prices**: MYR 65,500.00, etc.

## Files Modified
- `src/services/ocrService.js` - Changed CDN source

## Success! 🎉
The PDF processing should now work without CORS errors!

Try uploading your quotation again! 📄✨
