# Category-Filtered Supplier/Contractor Selection

## Overview
Added a new feature to the Project Progress Tracking that allows tasks to be assigned to suppliers/contractors based on their category.

## Features Implemented

### 1. Category Selection
- Each task now has a **Category** dropdown field
- Categories are fetched from the Task Category database (`taskCategoryStorage`)
- Users can select a category for each task in the schedule

### 2. Filtered Supplier/Contractor Selection
- Each task has a **Supplier/Contractor** dropdown field
- The supplier dropdown is **disabled** until a category is selected
- Once a category is selected, the dropdown shows **only suppliers/contractors** that belong to that category
- This ensures that only relevant suppliers are shown for each task

### 3. Automatic Data Validation
- When a task's category is changed, the system automatically checks if the currently selected supplier still belongs to the new category
- If the supplier doesn't match the new category, the supplier field is **automatically cleared**
- This prevents invalid supplier-category combinations

## How It Works

### User Workflow
1. **Select a Category**: Choose a category from the dropdown (e.g., "Civil", "Electrical")
2. **Select a Supplier/Contractor**: The supplier dropdown activates and shows only suppliers matching the selected category
3. **Change Category (Optional)**: If you change the category, the supplier field clears if the current supplier doesn't belong to the new category

### Technical Implementation

#### Data Structure
Each task now includes:
```javascript
{
    id: ...,
    name: ...,
    category: 'Civil',        // NEW: Category name
    supplier: 'GlassCo Ltd.'  // NEW: Supplier company name
}
```

#### Filtering Logic
```javascript
suppliers
    .filter(supplier => supplier.category === task.category)
    .map(supplier => (
        <option key={supplier.id} value={supplier.companyName}>
            {supplier.companyName}
        </option>
    ))
```

#### Validation Logic
When category changes:
- Find the current supplier in the database
- Check if supplier's category matches the new task category
- If not, clear the supplier field

## UI Changes

### Table Columns
Added two new columns to the Project Progress table:
1. **Category** (width: 160px) - Dropdown to select task category
2. **Supplier/Contractor** (width: 192px) - Filtered dropdown for supplier selection

### Visual Feedback
- Disabled state: Supplier dropdown shows "Select Category First" when no category is selected
- Enabled state: Shows "Select Supplier/Contractor" with filtered options

## Benefits

1. **Data Integrity**: Prevents assigning suppliers to incompatible task categories
2. **Improved UX**: Users only see relevant suppliers, reducing confusion
3. **Efficiency**: Faster supplier selection with filtered lists
4. **Automatic Validation**: System prevents invalid data entry

## Example Usage

### Scenario: Assigning a Civil Contractor
1. Create a new task
2. Select Category: "Civil"
3. Supplier dropdown now shows:
   - GlassCo Ltd.
   - DemoPros
   (Both are Civil contractors)

### Scenario: Changing Category
1. Task has Category: "Civil", Supplier: "GlassCo Ltd."
2. Change Category to: "Electrical"
3. System automatically clears "GlassCo Ltd." (because it's a Civil contractor)
4. Supplier dropdown now shows only Electrical contractors:
   - Sparky Inc.

## Files Modified

- `src/pages/ProjectDashboard.jsx`
  - Added `category` and `supplier` fields to task object
  - Added category validation logic in `updateTask` function
  - Added two new table columns with dropdown selects
  - Implemented filtering logic for supplier dropdown

## Dependencies

- `taskCategoryStorage` - Provides category data
- `subconStorage` - Provides supplier/contractor data with category field

## Future Enhancements

Potential improvements:
1. Add supplier contact information tooltip on hover
2. Show supplier count per category
3. Add "Add New Supplier" quick action
4. Export report showing task-supplier assignments
5. Filter entire schedule by category or supplier
