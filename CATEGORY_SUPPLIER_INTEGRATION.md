# Category-Supplier Integration Feature

## Overview
The Project Progress Tracking now uses **Supplier/Subcontractor Quick Select Categories** for task categorization. Categories are shared between the Project Progress system and the Supplier/Subcontractor database, providing a unified category management system.

## Key Features

### 1. **Unified Category System**
- Categories are stored in `localStorage` under the key `savedServiceCategories`
- The same categories appear in:
  - **Project Progress Tracking** → Category dropdown for tasks
  - **Supplier/Subcontractor DB** → Quick Select Categories when adding services

### 2. **Auto-Sync Between Systems**
- When you add a category in Project Progress, it automatically appears in Supplier/Subcon Quick Select
- When you add a service category in Supplier/Subcon, it automatically appears in Project Progress
- Deleting a category removes it from both systems

### 3. **Add New Category**
- Click the **"+ Add New Category"** option in the Category dropdown
- Enter the category name (e.g., "Electrical", "Civil", "Plumbing")
- The category is instantly saved and synced across both systems
- A confirmation message shows: *"Category added successfully and synced with Supplier/Subcon database!"*

### 4. **Filtered Supplier Selection**
- After selecting a category, the Supplier/Contractor dropdown shows only suppliers that match that category
- This ensures you only see relevant suppliers for each task

## How It Works

### User Workflow

#### Adding a Task with Category and Supplier:
1. **Add a Task** → Click "+ Task" button
2. **Select Category** → Choose from existing categories or click "+ Add New Category"
3. **Select Supplier** → Dropdown automatically filters to show only suppliers in that category
4. **Save** → Task is saved with category and supplier assignment

#### Adding a New Category:
1. **Open Category Dropdown** → Click on any task's Category field
2. **Click "+ Add New Category"** → Opens the Category Management Modal
3. **Enter Category Name** → Type the new category (e.g., "HVAC")
4. **Click "Add Category"** → Category is saved and synced
5. **Use Immediately** → New category appears in all dropdowns

### Technical Implementation

#### Data Storage
```javascript
// Categories are stored in localStorage as a simple string array
localStorage.setItem('savedServiceCategories', JSON.stringify([
    'Civil',
    'Electrical',
    'Plumbing',
    'HVAC'
]));
```

#### Category Loading
```javascript
// Load categories from localStorage on component mount
const savedServiceCategories = localStorage.getItem('savedServiceCategories');
const categoryList = savedServiceCategories ? JSON.parse(savedServiceCategories) : [];
setCategories(categoryList);
```

#### Adding Categories
```javascript
const handleAddCategory = () => {
    // Add to categories list
    const updatedCategories = [...categories, newCategoryName.trim()].sort();
    setCategories(updatedCategories);

    // Save to localStorage (syncs with Supplier/Subcon)
    localStorage.setItem('savedServiceCategories', JSON.stringify(updatedCategories));
};
```

#### Supplier Filtering
```javascript
{task.category && suppliers
    .filter(supplier => supplier.category === task.category)
    .map(supplier => (
        <option key={supplier.id} value={supplier.companyName}>
            {supplier.companyName}
        </option>
    ))
}
```

## UI Components

### 1. Category Dropdown
- **Location**: Task table, after "Progress/Details" column
- **Features**:
  - Lists all available categories
  - "+ Add New Category" option at the bottom
  - Opens modal when "+ Add New Category" is clicked

### 2. Category Management Modal
- **Title**: "Manage Task Categories"
- **Subtitle**: "Syncs with Supplier/Subcon Quick Select Categories"
- **Features**:
  - Input field to add new categories
  - List of existing categories with delete buttons
  - Shows category count
  - Empty state message when no categories exist

### 3. Supplier/Contractor Dropdown
- **Location**: Task table, after "Category" column
- **States**:
  - **Disabled**: When no category is selected (shows "Select Category First")
  - **Enabled**: When category is selected (shows filtered suppliers)

## Integration Points

### Project Progress Tracking
- **File**: `src/pages/ProjectDashboard.jsx`
- **Uses**: Categories for task organization and supplier filtering

### Supplier/Subcontractor Database
- **File**: `src/pages/SubcontractorDB.jsx`
- **Uses**: Same categories for "Quick Select Categories" when adding services

### Shared Storage
- **Key**: `savedServiceCategories`
- **Type**: `localStorage`
- **Format**: JSON array of strings

## Benefits

1. **Consistency**: Same categories across all systems
2. **Efficiency**: Add once, use everywhere
3. **Data Integrity**: Prevents category mismatches
4. **User Experience**: Simplified category management
5. **Flexibility**: Easy to add/remove categories as needed

## Example Scenario

### Adding a New "HVAC" Category:

**Step 1**: User is in Project Progress Tracking
- Clicks on Category dropdown for a task
- Clicks "+ Add New Category"

**Step 2**: Modal opens
- User types "HVAC"
- Clicks "Add Category"

**Step 3**: System saves
- Category added to localStorage
- Alert shows: "Category 'HVAC' added successfully and synced with Supplier/Subcon database!"

**Step 4**: Immediate availability
- "HVAC" now appears in Project Progress category dropdowns
- "HVAC" now appears in Supplier/Subcon Quick Select Categories
- User can assign HVAC suppliers to HVAC tasks

## Files Modified

- `src/pages/ProjectDashboard.jsx`
  - Updated category loading to use localStorage
  - Added `handleAddCategory` function
  - Modified Category dropdown to include "+ Add New" option
  - Updated Category Management Modal to sync with localStorage
  - Added `newCategoryName` state for modal input

## Migration Notes

- **Previous System**: Used `taskCategoryStorage` (separate category database)
- **New System**: Uses `savedServiceCategories` in localStorage (shared with Supplier/Subcon)
- **Impact**: Existing categories in `taskCategoryStorage` will not automatically migrate
- **Solution**: Users can manually re-add categories using the "+ Add New Category" feature

## Future Enhancements

1. **Category Icons**: Add icons for visual identification
2. **Category Colors**: Color-code categories for better organization
3. **Bulk Import**: Import categories from CSV/Excel
4. **Category Hierarchy**: Support parent-child category relationships
5. **Usage Statistics**: Show which categories are most used
