# Property Code & Auto-Generated Item Code - Implementation Summary

## Overview
Implemented Property Code/Marcha Code field and automatic Item Code generation across both Project Master and Item Management modules.

## Changes Made

### 1. Project Master (`ProjectMaster.jsx`)

#### Added Fields:
- **Property Code / Marcha Code**: Required field added to project information

#### Updates:
- Added `propertyCode` to `formData` state
- Added input field in the form UI (after Client field)
- Updated all form reset logic to include `propertyCode`
- Field is stored with each project in localStorage

---

### 2. Item Management (`ItemManagement.jsx`)

#### New Features:

##### A. Property Code Auto-Fill
- Added `propertyCode` field to item `formData`
- When a project is selected from the dropdown:
  - **Company Name** is auto-filled from project's `client`
  - **Property Code** is auto-filled from project's `propertyCode`
- Both fields are read-only (gray background, disabled cursor)

##### B. Auto-Generated Item Code
The Item Code is now **automatically generated** using the format:

```
PropertyCode / Category / SerialNumber / Location / Year
```

**Example:** `FPJ/Electronics/SN-2024-001/WH-A1/26`

**Generation Logic:**
- **Property Code**: From selected project (or "PROP" as placeholder)
- **Category**: From category dropdown (or "CAT" as placeholder)
- **Serial Number**: User input (or "SN" as placeholder)
- **Location**: User input (or "LOC" as placeholder)
- **Year**: Last 2 digits of current year (e.g., "26" for 2026)

**Auto-Update Behavior:**
- Item Code updates in real-time as you:
  - Select a project (gets Property Code)
  - Select/add a category
  - Enter serial number
  - Enter location
- Uses a `useEffect` hook that watches these four fields
- Prevents infinite loops by only updating when the code actually changes

#### UI Changes:
- Added **Property Code** field after Company Name (auto-filled, read-only)
- **Item Code** field is now:
  - **Read-only** (cannot be manually edited)
  - Displays "(Auto-generated)" label
  - Uses monospace font for better readability
  - Gray background to indicate it's auto-filled
  - Shows placeholder "Will be auto-generated" when empty

---

## Data Flow

### Creating a New Item:

1. **Select Project** → Auto-fills:
   - Company Name
   - Property Code

2. **Select/Add Category** → Updates Item Code

3. **Enter Serial Number** → Updates Item Code

4. **Enter Location** → Updates Item Code

5. **Final Item Code Format:**
   ```
   PropertyCode/Category/SerialNumber/Location/YY
   ```

### Example Workflow:

```
1. Select Project: "Four Points Johor Bahru"
   → Company Name: "Four Points by Sheraton"
   → Property Code: "FPJ"

2. Select Category: "Electronics"
   → Item Code: "FPJ/Electronics/SN/LOC/26"

3. Enter Serial Number: "SN-2024-001"
   → Item Code: "FPJ/Electronics/SN-2024-001/LOC/26"

4. Enter Location: "WH-A1"
   → Item Code: "FPJ/Electronics/SN-2024-001/WH-A1/26"
```

---

## State Management

### Project Master State:
```javascript
{
    projectName: '',
    mainContractor: '',
    client: '',
    propertyCode: '',        // NEW
    projectAddress: '',
    projectManager: '',
    projectSupervisor: ''
}
```

### Item Management State:
```javascript
{
    itemCode: '',            // AUTO-GENERATED
    propertyCode: '',        // NEW (auto-filled from project)
    category: '',           // Part of item code
    serialNumber: '',       // Part of item code
    location: '',          // Part of item code
    // ... other fields
}
```

---

## Storage

- **Project Master**: Property codes are stored in localStorage under `projectMasterStorage`
- **Item Management**: Items with auto-generated codes are stored in `inventoryItems`

---

## Benefits

1. **Consistency**: All item codes follow the same format
2. **Traceability**: Easy to identify property, category, and location from code
3. **No Duplicates**: Unique combination of property/category/serial/location
4. **Time-Stamped**: Year suffix helps track when items were added
5. **Auto-Fill**: Reduces manual entry and errors
6. **Project Linking**: Clear connection between items and projects

---

## Future Enhancements (Optional)

1. Add counter/sequence number instead of manual serial number
2. Implement barcode generation based on item code
3. Add validation for duplicate serial numbers per property
4. Create item code format customization in settings
5. Add prefix/suffix configuration per category

---

## Testing Checklist

- [ ] Create a new project with Property Code
- [ ] Edit existing project to add Property Code
- [ ] Create new item and select project
- [ ] Verify Property Code auto-fills
- [ ] Verify Item Code auto-generates correctly
- [ ] Test with different categories
- [ ] Test with different serial numbers
- [ ] Verify year updates automatically
- [ ] Check localStorage persistence
- [ ] Edit item and verify code updates

---

## Notes

- Item Code field is **required** but auto-generated, so users don't need to manually enter it
- The format uses forward slashes (`/`) as separators for easy parsing
- Placeholders (PROP, CAT, SN, LOC) ensure code is always valid even with missing data
- Year automatically uses current year's last 2 digits (26 for 2026, 27 for 2027, etc.)
