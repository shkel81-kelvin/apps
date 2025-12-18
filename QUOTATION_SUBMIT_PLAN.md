# Quotation Submit Feature - Implementation Plan 📋

## Overview
Add a "Quotation Submit" feature to the Tenders section that allows vendors to upload quotations with automatic OCR + AI data extraction and form generation.

## Feature Requirements

### 1. **Upload Quotation**
- Upload vendor quotation (PDF/Image)
- Support multiple file formats (PDF, JPG, PNG)
- File preview before processing

### 2. **OCR + AI Screening**
- Extract data from uploaded quotation using OCR
- AI analysis to identify:
  - Company name
  - Quotation number
  - Date
  - Items/services
  - Quantities
  - Unit prices
  - Total amount
  - Terms and conditions

### 3. **Auto-Generate Form**
- Similar to tender creation
- Pre-fill form with extracted data
- Allow manual editing/correction
- Save to database

## User Workflow

```
1. Navigate to Tenders → Quotation Submit
   ↓
2. Upload quotation file (PDF/Image)
   ↓
3. AI/OCR processes file
   ↓
4. Extracted data displayed in form
   ↓
5. Review and edit data
   ↓
6. Submit quotation
   ↓
7. Quotation saved and listed
```

## Technical Architecture

### Components Needed

1. **QuotationSubmit.jsx** (New Page)
   - File upload interface
   - OCR processing trigger
   - Form display with extracted data
   - Submit functionality

2. **quotationStorage.js** (New Utility)
   - Save quotations
   - Retrieve quotations
   - Update quotations
   - Delete quotations

3. **ocrService.js** (New Service)
   - OCR API integration
   - Data extraction logic
   - AI analysis

### Data Structure

```javascript
{
    id: 1,
    quotationNumber: "QT-2025-001",
    vendorName: "ABC Company",
    date: "2025-12-12",
    uploadedFile: {
        name: "quotation.pdf",
        data: "base64...",
        type: "application/pdf"
    },
    items: [
        {
            id: 1,
            description: "Item 1",
            quantity: 10,
            unit: "pcs",
            unitPrice: 100,
            amount: 1000
        }
    ],
    totalAmount: 1000,
    terms: "Net 30 days",
    status: "Pending", // Pending, Approved, Rejected
    createdDate: "2025-12-12T10:00:00",
    extractedData: {
        // Raw OCR data
    }
}
```

## OCR Integration Options

### Option 1: Tesseract.js (Free, Client-Side)
```javascript
import Tesseract from 'tesseract.js';

const extractText = async (imageFile) => {
    const { data: { text } } = await Tesseract.recognize(
        imageFile,
        'eng',
        {
            logger: m => console.log(m)
        }
    );
    return text;
};
```

### Option 2: Google Cloud Vision API (Paid, More Accurate)
```javascript
const extractText = async (imageFile) => {
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            requests: [{
                image: { content: base64Image },
                features: [{ type: 'TEXT_DETECTION' }]
            }]
        })
    });
    return response.json();
};
```

### Option 3: Azure Computer Vision (Paid, Enterprise)
- More robust for complex documents
- Better table extraction
- Multi-language support

## AI Data Parsing

After OCR, use AI/regex to parse structured data:

```javascript
const parseQuotationData = (ocrText) => {
    // Extract quotation number
    const quotationNumber = ocrText.match(/(?:Quotation|Quote|QT)[\s#:]*([A-Z0-9-]+)/i)?.[1];
    
    // Extract date
    const date = ocrText.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/)?.[0];
    
    // Extract company name (usually at top)
    const companyName = ocrText.split('\n')[0];
    
    // Extract items (table detection)
    const items = extractTableData(ocrText);
    
    // Extract total
    const total = ocrText.match(/Total[\s:]*RM?[\s]*([\d,]+\.?\d*)/i)?.[1];
    
    return {
        quotationNumber,
        date,
        companyName,
        items,
        totalAmount: parseFloat(total?.replace(/,/g, ''))
    };
};
```

## UI Design

### Upload Screen
```
┌─────────────────────────────────────────────┐
│  Quotation Submit                           │
│  Upload vendor quotation for processing     │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │     📄 Drag & Drop File Here         │ │
│  │        or Click to Browse            │ │
│  │                                       │ │
│  │  Supported: PDF, JPG, PNG            │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  [Upload & Process with AI]                │
│                                             │
└─────────────────────────────────────────────┘
```

### Processing Screen
```
┌─────────────────────────────────────────────┐
│  Processing Quotation...                    │
├─────────────────────────────────────────────┤
│                                             │
│  ⏳ Extracting text from document...       │
│  ✓ OCR completed                           │
│  🤖 AI analyzing data...                   │
│  ✓ Data extracted successfully             │
│                                             │
└─────────────────────────────────────────────┘
```

### Form Screen (After Extraction)
```
┌─────────────────────────────────────────────┐
│  Review Extracted Data                      │
│  Please verify and edit if needed           │
├─────────────────────────────────────────────┤
│                                             │
│  Quotation Number: [QT-2025-001]           │
│  Vendor Name: [ABC Company]                │
│  Date: [2025-12-12]                        │
│                                             │
│  Items:                                     │
│  ┌─────────────────────────────────────┐   │
│  │ Desc │ Qty │ Unit │ Price │ Amount │   │
│  ├──────┼─────┼──────┼───────┼────────┤   │
│  │ [  ] │ [ ] │ [  ] │ [   ] │ [    ] │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Total: RM [1,000.00]                      │
│                                             │
│  [Save Quotation] [Cancel]                 │
│                                             │
└─────────────────────────────────────────────┘
```

## Implementation Steps

### Phase 1: Basic Structure
1. Create QuotationSubmit.jsx page
2. Add route in App.jsx
3. Create quotationStorage.js utility
4. Basic file upload UI

### Phase 2: OCR Integration
1. Install Tesseract.js
2. Implement OCR text extraction
3. Display extracted text
4. Test with sample quotations

### Phase 3: AI Parsing
1. Create parsing logic
2. Extract structured data
3. Map to form fields
4. Handle edge cases

### Phase 4: Form & Save
1. Build editable form
2. Validation
3. Save to localStorage
4. List view of saved quotations

### Phase 5: Polish
1. Loading states
2. Error handling
3. File preview
4. Export functionality

## Navigation Integration

Add to Tenders menu:
```javascript
// In Sidebar.jsx or TenderDashboard.jsx
<Link to="/tenders/quotation-submit">
    <FileText />
    Quotation Submit
</Link>
```

## Dependencies

```json
{
    "tesseract.js": "^4.1.1",  // OCR
    "pdf-lib": "^1.17.1",       // PDF handling
    "react-dropzone": "^14.2.3" // File upload
}
```

## Benefits

1. **Time Saving**: Auto-extract data instead of manual entry
2. **Accuracy**: OCR reduces typos
3. **Efficiency**: Process multiple quotations quickly
4. **Audit Trail**: Keep original files
5. **AI-Powered**: Smart data extraction

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Poor quality scans | Pre-process images (contrast, rotation) |
| Complex layouts | Train custom OCR model |
| Multiple languages | Use multi-language OCR |
| Table extraction | Use specialized table detection |
| Handwritten text | Use specialized handwriting OCR |

## Success Metrics

- ✅ 80%+ accuracy in data extraction
- ✅ < 5 seconds processing time
- ✅ Support PDF and images
- ✅ Editable extracted data
- ✅ Save and retrieve quotations

## Next Steps

1. **Approve this plan**
2. **Install dependencies**
3. **Create basic page structure**
4. **Implement OCR**
5. **Add AI parsing**
6. **Test with real quotations**

Would you like me to proceed with implementation?
