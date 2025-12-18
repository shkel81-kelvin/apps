# Supplier Filtering Fix - Case-Insensitive Matching

## Issue Description
When selecting "ELV Cabling" as a category in Project Progress Tracking, the Supplier/Contractor dropdown showed "-- Select Supplier --" but no actual suppliers were listed, even though suppliers with "ELV Cabling" services existed in the database.

## Root Cause
The supplier filtering logic used **exact string matching** (`===`), which is case-sensitive:

```javascript
// OLD CODE (Case-sensitive - BROKEN)
suppliers.filter(supplier => {
    if (supplier.services && Array.isArray(supplier.services)) {
        return supplier.services.some(service =>
            service.description === task.category  // ❌ Exact match fails!
        );
    }
    return supplier.category === task.category;  // ❌ Exact match fails!
})
```

### Why It Failed:
1. **Category in dropdown**: "ELV Cabling" (from deduplicated list)
2. **Supplier's service**: "elv cabling" or "ELV CABLING" (different casing)
3. **Exact match**: `"ELV Cabling" === "elv cabling"` → `false` ❌
4. **Result**: No suppliers shown!

## Solution Implemented

### 1. **Task Table Supplier Dropdown** (Lines 1132-1147)

Updated the supplier filtering in the task table to use case-insensitive comparison:

```javascript
// NEW CODE (Case-insensitive - FIXED)
{task.category && suppliers
    .filter(supplier => {
        // Normalize the task category for comparison
        const normalizedTaskCategory = task.category.trim().toLowerCase();
        
        // Check if supplier has services array (new format)
        if (supplier.services && Array.isArray(supplier.services)) {
            return supplier.services.some(service =>
                service.description && 
                service.description.trim().toLowerCase() === normalizedTaskCategory
            );
        }
        // Fallback to old single category field
        return supplier.category && 
               supplier.category.trim().toLowerCase() === normalizedTaskCategory;
    })
    .map(supplier => (
        <option key={supplier.id} value={supplier.companyName}>
            {supplier.companyName}
        </option>
    ))
}
```

### 2. **Header Supplier Dropdown** (Lines 725-746)

Updated the header supplier filter to use the same logic:

```javascript
// NEW CODE (Case-insensitive - FIXED)
{suppliers
    .filter(s => {
        if (!filterCategory) return true;
        
        const normalizedFilterCategory = filterCategory.trim().toLowerCase();
        
        // Check if supplier has services array (new format)
        if (s.services && Array.isArray(s.services)) {
            return s.services.some(service =>
                service.description && 
                service.description.trim().toLowerCase() === normalizedFilterCategory
            );
        }
        // Fallback to old single category field
        return s.category && 
               s.category.trim().toLowerCase() === normalizedFilterCategory;
    })
    .map(supplier => (
        <option key={supplier.id} value={supplier.id}>
            {supplier.companyName}
        </option>
    ))
}
```

### 3. **Category Change Validation** (Lines 308-332)

Updated the validation when a category changes to use case-insensitive comparison:

```javascript
// NEW CODE (Case-insensitive - FIXED)
if (field === 'category') {
    const currentSupplier = suppliers.find(s => s.companyName === t.supplier);
    if (currentSupplier) {
        const normalizedNewCategory = value.trim().toLowerCase();
        
        // Check if supplier has services array (new format)
        let hasMatchingCategory = false;
        if (currentSupplier.services && Array.isArray(currentSupplier.services)) {
            hasMatchingCategory = currentSupplier.services.some(service =>
                service.description && 
                service.description.trim().toLowerCase() === normalizedNewCategory
            );
        } else {
            // Fallback to old single category field
            hasMatchingCategory = currentSupplier.category && 
                                 currentSupplier.category.trim().toLowerCase() === normalizedNewCategory;
        }

        // Clear supplier if they don't offer services in the new category
        if (!hasMatchingCategory) {
            updated.supplier = '';
        }
    }
}
```

## How It Works

### Comparison Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User selects category                               │
│ task.category = "ELV Cabling"                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Normalize for comparison                            │
│ normalizedTaskCategory = "elv cabling"                      │
│ (trim + toLowerCase)                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Check each supplier                                 │
│                                                              │
│ Supplier A:                                                  │
│   services = [{ description: "ELV Cabling" }]               │
│   normalized = "elv cabling"                                │
│   Match: "elv cabling" === "elv cabling" ✓                 │
│                                                              │
│ Supplier B:                                                  │
│   services = [{ description: "elv cabling" }]               │
│   normalized = "elv cabling"                                │
│   Match: "elv cabling" === "elv cabling" ✓                 │
│                                                              │
│ Supplier C:                                                  │
│   services = [{ description: "Network Equipment" }]         │
│   normalized = "network equipment"                          │
│   Match: "network equipment" === "elv cabling" ✗           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Display matching suppliers                          │
│ Dropdown shows:                                              │
│ - Supplier A                                                 │
│ - Supplier B                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Benefits

### 1. **Case-Insensitive Matching**
- "ELV Cabling" matches "elv cabling", "ELV CABLING", "Elv Cabling"
- Works regardless of how the category was entered in the supplier database

### 2. **Whitespace Tolerance**
- " ELV Cabling " matches "ELV Cabling"
- Extra spaces are trimmed before comparison

### 3. **Consistent Behavior**
- All three filtering locations use the same normalization logic
- Matches the deduplication logic used in `loadCategories()`

### 4. **Backward Compatible**
- Works with old suppliers (single `category` field)
- Works with new suppliers (`services` array)
- Handles suppliers with no services gracefully

## Example Scenarios

### Scenario 1: Different Casing
**Supplier Database**:
- Supplier A: service = "ELV Cabling"
- Supplier B: service = "elv cabling"
- Supplier C: service = "ELV CABLING"

**User Action**: Select "ELV Cabling" category

**Before Fix**: No suppliers shown ❌

**After Fix**: All 3 suppliers shown ✓

### Scenario 2: Whitespace Variations
**Supplier Database**:
- Supplier A: service = "ELV Cabling"
- Supplier B: service = " ELV Cabling "
- Supplier C: service = "ELV Cabling  "

**User Action**: Select "ELV Cabling" category

**Before Fix**: Only Supplier A shown ❌

**After Fix**: All 3 suppliers shown ✓

### Scenario 3: Mixed Format
**Supplier Database**:
- Supplier A: `category = "Civil"` (old format)
- Supplier B: `services = [{ description: "civil" }]` (new format)
- Supplier C: `services = [{ description: "CIVIL" }]` (new format)

**User Action**: Select "Civil" category

**Before Fix**: Only Supplier A shown ❌

**After Fix**: All 3 suppliers shown ✓

## Testing Checklist

- [x] Suppliers with exact category match are shown
- [x] Suppliers with different casing are shown
- [x] Suppliers with extra whitespace are shown
- [x] Old format suppliers (single category) are shown
- [x] New format suppliers (services array) are shown
- [x] Mixed format suppliers work correctly
- [x] Header supplier dropdown filters correctly
- [x] Task table supplier dropdown filters correctly
- [x] Category change validation works correctly
- [x] Supplier field is cleared when category changes to non-matching

## Files Modified

**`src/pages/ProjectDashboard.jsx`**

1. **Task Table Supplier Filter** (lines 1132-1147)
   - Added case-insensitive comparison
   - Added null checks for service.description
   - Normalized both category and service description

2. **Header Supplier Filter** (lines 725-746)
   - Added case-insensitive comparison
   - Added null checks for service.description
   - Normalized both filterCategory and service description

3. **Category Change Validation** (lines 308-332)
   - Added case-insensitive comparison
   - Added null checks for service.description
   - Normalized category value for comparison

## Related Issues Fixed

This fix also resolves:
- Empty supplier dropdown when category has different casing
- Supplier not appearing even though they offer the service
- Inconsistent filtering between header and task table
- Supplier field incorrectly cleared when category changes

## Future Enhancements

1. **Fuzzy Matching**: Support partial matches (e.g., "ELV" matches "ELV Cabling")
2. **Multi-Category Suppliers**: Show suppliers that offer multiple services
3. **Supplier Count**: Display number of matching suppliers in category dropdown
4. **Service Suggestions**: Auto-suggest services based on supplier database
5. **Validation Warnings**: Warn if no suppliers exist for a selected category
