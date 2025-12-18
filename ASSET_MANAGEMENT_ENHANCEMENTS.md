# Asset Management Enhancements

## Summary
Added two major enhancements to the Asset Management module:

1. **MAC Address Field** for network equipment
2. **Dynamic Category Specifications Section** that auto-displays based on category templates

---

## 1. MAC Address Field

### Feature Description
- A dedicated MAC Address input field that appears **only** for network equipment categories
- Automatically shows when category is set to:
  - **Wifi Access Point**
  - **Network Switch**

### Implementation Details
- **Location**: In the "Identification & Tracking" section, after the Part Number field
- **Required Field**: Yes, when the category is Wifi Access Point or Network Switch
- **Format**: Standard MAC address format (e.g., 00:1A:2B:3C:4D:5E)
- **Conditional Display**: Uses React conditional rendering to show/hide based on category

### Code Changes
- Added `macAddress` field to formData state
- Added conditional input field in the form
- Updated all form reset locations to include macAddress

---

## 2. Dynamic Category Specifications Section

### Feature Description
- A new section that **automatically appears** between "Identification & Tracking" and "Basic Information"
- Displays specification fields based on the selected category's template
- Each category can have its own custom specification fields

### How It Works
1. User selects a category (e.g., "Desktop", "Laptop", "Server")
2. System checks if the category has specification fields defined in its template
3. If specifications exist, a new purple-gradient section appears
4. The section displays all specification fields for that category
5. Fields can be marked as required or optional based on the template

### Example Categories with Specifications

#### Desktop
- Brand (required)
- Model (required)
- Processor
- RAM
- Storage
- Graphics Card
- Operating System

#### Network Switch
- Brand (required)
- Model (required)
- Port Count
- Port Speed
- PoE Support
- Management Type

#### Wifi Access Point
- Brand (required)
- Model (required)
- WiFi Standard
- Frequency Band
- Max Speed
- PoE Support

### Implementation Details
- **Location**: Between "Identification & Tracking" and "Basic Information" sections
- **Styling**: Purple-to-pink gradient background with purple border
- **Layout**: Responsive grid (1 column on mobile, 2 on tablet, 3 on desktop)
- **Data Storage**: Specifications stored as an object in `formData.specifications`
- **Auto-Reset**: Specifications automatically reset when category changes

### Code Changes
- Changed `specifications` from array to object for better key-value storage
- Added conditional rendering section in the form
- Updated `handleCategoryChange` to reset specifications on category change
- Integrated with existing category template system

---

## User Experience

### Before
- Users had to manually enter all specifications in the description field
- No structured way to capture category-specific details
- MAC address had to be entered in a generic field

### After
- **Network Equipment**: MAC address field appears automatically
- **All Categories**: Specification fields appear based on category selection
- **Structured Data**: Each specification has its own labeled field
- **Validation**: Required fields are marked with asterisks
- **Clean Interface**: Sections only appear when relevant

---

## Technical Benefits

1. **Type Safety**: Structured specification data instead of free-text
2. **Validation**: Required fields can be enforced
3. **Searchability**: Specifications stored in structured format
4. **Extensibility**: Easy to add new categories with custom specifications
5. **User Guidance**: Clear labels and placeholders for each field

---

## How to Use

### Adding MAC Address
1. Navigate to Asset Management
2. Click "Add Item"
3. Select category: "Wifi Access Point" or "Network Switch"
4. MAC Address field appears automatically
5. Enter MAC address (required field)

### Using Category Specifications
1. Navigate to Asset Management
2. Click "Add Item"
3. Select any category (e.g., "Desktop")
4. New "Category Specifications" section appears
5. Fill in the specification fields
6. Required fields are marked with *
7. Submit the form

### Editing Category Specifications
1. Hover over a category card in the breakdown section
2. Click the edit icon that appears
3. Modify specification fields in the template
4. Changes apply to all future items in that category

---

## Files Modified

- `src/pages/Inventory/ItemManagement.jsx`
  - Added `macAddress` field to formData
  - Added conditional MAC Address input
  - Added dynamic Category Specifications section
  - Updated handleCategoryChange to reset specifications
  - Changed specifications from array to object

---

## Future Enhancements

Potential improvements for future iterations:

1. **MAC Address Validation**: Add format validation for MAC addresses
2. **Specification Templates**: Pre-populate common values
3. **Bulk Import**: Import specifications from CSV
4. **Search by Specs**: Filter items by specification values
5. **Specification History**: Track changes to specifications over time
