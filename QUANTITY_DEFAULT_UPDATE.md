# Asset Management - Quantity Default Update

## Summary
Changed the default quantity value from **0 to 1** for all new asset entries.

## Why This Change?

### Previous Behavior:
- New items defaulted to `quantity: 0`
- Even with a unit price set, total value = 0 × price = **$0.00**
- Users had to manually change quantity from 0 to 1 (or another value)
- Dashboard showed $0.00 total value even though assets existed

### New Behavior:
- New items default to `quantity: 1`
- When unit price is set, total value = 1 × price = **actual value**
- Dashboard immediately shows meaningful values
- Users can still adjust quantity up or down as needed

## What Changed

Updated **4 locations** in `ItemManagement.jsx`:

1. **Initial formData state** (line 172)
2. **Add Item button handler** (line 1099)
3. **Form reset after save** (line 472)
4. **Partial form reset** (line 515)

All now initialize with `quantity: 1` instead of `quantity: 0`

## Impact

### For New Assets:
When you add a new item:
1. Select category and brand/model (auto-fills unit price)
2. Quantity is already set to **1**
3. Total value = **1 × unit price** (shown immediately)
4. Adjust quantity if needed (e.g., change to 5, 10, etc.)

### For Existing Assets:
- No change to existing data
- Existing items with quantity = 0 will still show $0.00 value
- Edit them and set quantity to see values

### Dashboard Display:
- **Total Assets**: Shows count (e.g., 79 assets)
- **Total Value**: Auto-calculates from quantity × unit price
- **Category Breakdown**: Shows assets and total value per category

## Example

**Before:**
- Add new laptop
- Unit price: $1,200
- Quantity: 0 (default)
- **Value: $0.00** ❌

**After:**
- Add new laptop
- Unit price: $1,200
- Quantity: 1 (default)
- **Value: $1,200.00** ✅

If you have 5 laptops, just change quantity to 5:
- **Value: $6,000.00** ✅

## Files Modified
- `src/pages/Inventory/ItemManagement.jsx`

## Build Status
✅ Build completed successfully
