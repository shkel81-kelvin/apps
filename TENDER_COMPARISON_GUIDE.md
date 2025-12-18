# Tender Comparison Feature - User Guide

## Overview
The Tender Comparison feature automatically compares Excel submissions from multiple bidders side-by-side, highlights the best prices, and allows you to export the comparison report.

## How It Works

### 1. **Bidders Submit Excel Files**
Bidders upload their tender responses as Excel files through the Bidder Portal. The Excel file should follow this structure:

| Item | Description | Quantity | Unit Price | Total |
|------|-------------|----------|------------|-------|
| Item 1 | Description text | 100 | 50.00 | 5000.00 |
| Item 2 | Description text | 50 | 75.50 | 3775.00 |

**Excel File Requirements:**
- First row should be headers
- Column A: Item number/name
- Column B: Item description  
- Column C: Quantity
- Column D: Unit Price (in RM)
- Column E: Total Amount (automatically calculated: Quantity × Unit Price)

### 2. **Admin Compares Submissions**
Once at least 2 bidders have submitted Excel files:

1. Navigate to **Tender Dashboard**
2. Click on a tender to view details
3. Check the **Submission Status** column to see who has submitted
4. Click the **"Compare Submissions"** button at the bottom
5. The system will:
   - Parse all Excel submissions
   - Extract pricing data
   - Display a side-by-side comparison

### 3. **Comparison View Features**

#### Summary Cards
- Shows each bidder's total bid amount
- Highlights the lowest bidder with a green border and award icon
- Displays number of items submitted

#### Comparison Table
- **Item-by-item comparison** across all bidders
- **Green highlighting** on the lowest unit price for each item
- **TrendingDown icon** (↓) marks the best price
- **Grand Total** row showing total bid amounts

#### Export Function
- Click **"Export Comparison"** to download an Excel file
- Contains all data in a structured format
- Easy to share with stakeholders

### 4. **Expected Excel Format from Bidders**

**Example:**
```
+--------+------------------+----------+------------+----------+
| Item   | Description      | Quantity | Unit Price | Total    |
+--------+------------------+----------+------------+----------+
| 001    | Steel Beams      | 100      | 250.00     | 25000.00 |
| 002    | Cement Bags      | 500      | 15.50      | 7750.00  |
| 003    | Paint (Liters)   | 200      | 45.00      | 9000.00  |
+--------+------------------+----------+------------+----------+
|        |                  | TOTAL    |            | 41750.00 |
+--------+------------------+----------+------------+----------+
```

## Benefits

1. **Time Saving** - Automatic comparison vs manual review
2. **Error Reduction** - No manual data entry mistakes  
3. **Easy Comparison** - Visual highlighting of best prices
4. **Audit Trail** - Export comparisons for record-keeping
5. **Data-Driven** - Make informed decisions based on clear data

## Important Notes

- **Minimum 2 submissions** required to compare
- Only **Excel files (.xlsx, .xls)** are parsed for comparison
- PDF files will be shown in the files list but not compared
- The system matches items by **row position**, so bidders should follow the same item order
- If bidders use different item orders, items may not align correctly

## Troubleshooting

**"Need at least 2 Excel submissions to compare"**
- Ensure bidders upload Excel files, not PDFs
- Check the Submission Status column - both should show "Submitted"

**Items don't align correctly**
- Ensure all bidders use the same Excel template
- Items should be in the same row position across all submissions

**Empty or missing prices**
- Check that Excel files have data in columns D (Unit Price) and E (Total)
- Ensure numeric values are formatted as numbers, not text

## Future Enhancements (Roadmap)

- ✅ Auto-comparison of Excel submissions
- 🔄 Smart item matching by name (not just row position)
- 📋 Direct tender award from comparison view
- 📧 Email comparison reports to stakeholders
- 📊 Historical comparison analytics
- 🤖 AI-powered price evaluation and recommendations

---

**Created:** November 2025  
**Version:** 1.0  
**Component:** `src/components/TenderComparison.jsx`
