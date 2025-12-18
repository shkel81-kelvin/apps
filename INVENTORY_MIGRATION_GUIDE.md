# Inventory Data Migration Guide

## 🎯 Purpose
This migration tool updates all existing inventory items that have `quantity: 0` (or no quantity) to `quantity: 1`, so your dashboard will show correct total values.

## 📍 How to Access

### Option 1: Direct URL
Navigate to: **`/inventory/migrate-data`**

Full URL example: `http://localhost:5173/inventory/migrate-data`

### Option 2: Add to Navigation (Optional)
You can add a link in your sidebar or inventory dashboard if needed.

## 🚀 How to Use

1. **Open the Migration Page**
   - Go to `/inventory/migrate-data`
   - The page will automatically analyze your data

2. **Review the Analysis**
   - **Total Items**: Total number of inventory items
   - **Needs Update**: Items with quantity = 0 (shown in orange)
   - **Already OK**: Items with quantity > 0 (shown in green)

3. **Run the Migration**
   - Click the **"Run Migration"** button
   - The tool will update all items with quantity 0 to quantity 1
   - You'll see a success message when complete

4. **Verify Results**
   - Go back to **Asset Management** (`/inventory/items`)
   - Refresh the page
   - Your **Total Value** should now show the correct amount!

## ✅ What Gets Updated

### Before Migration:
```javascript
{
  itemName: "Dell Laptop",
  unitPrice: 1200,
  quantity: 0,  // ❌ This causes $0 value
  // ... other fields
}
```

### After Migration:
```javascript
{
  itemName: "Dell Laptop",
  unitPrice: 1200,
  quantity: 1,  // ✅ Now shows $1,200 value
  // ... other fields
}
```

## 🔒 Safety Features

- ✅ **Non-destructive**: Only updates the `quantity` field
- ✅ **Preserves data**: All other fields remain unchanged
- ✅ **Smart update**: Only updates items with quantity 0 or undefined
- ✅ **Leaves existing**: Items with quantity > 0 are not touched
- ✅ **One-time**: Can only run once (button disables after success)

## 📊 Example Impact

If you have:
- 23 Monitors @ $300 each (quantity was 0)
- 15 Laptops @ $1,200 each (quantity was 0)
- 5 Servers @ $5,000 each (quantity was 0)

**Before Migration:**
- Total Value: **$0.00** ❌

**After Migration:**
- 23 Monitors × $300 = $6,900
- 15 Laptops × $1,200 = $18,000
- 5 Servers × $5,000 = $25,000
- **Total Value: $49,900** ✅

## 🔄 After Migration

1. **Refresh Asset Management page**
2. **Check Total Value** - should now show correct amount
3. **Review Category Breakdown** - each category shows its value
4. **Adjust quantities** - Edit items to set correct quantities (e.g., change 1 to 5 if you have 5 units)

## ⚠️ Important Notes

- This migration is **safe** and can be run at any time
- It only affects items in **localStorage** (your browser's local storage)
- If you have items that should have quantity 0 (e.g., disposed items), you can manually edit them back after migration
- For items you actually have multiple of, edit them after migration to set the correct quantity

## 🎉 Result

After running this migration, your Asset Management dashboard will:
- Show correct **Total Value** (sum of all quantity × unit price)
- Display accurate **Category Values**
- Provide meaningful **analytics and charts**
- Give you a clear view of your asset inventory value

## Files Created
- `src/pages/Inventory/InventoryDataMigration.jsx` - Migration utility page
- Route added: `/inventory/migrate-data`
