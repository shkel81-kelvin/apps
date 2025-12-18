# DO Check Feature - Delivery Order Verification

## Overview
The DO (Delivery Order) Check feature allows you to verify deliveries against work orders, track delivery status, and upload supporting documents (DOs and invoices) for each work order.

## Features Implemented

### 1. **Supplier Selection**
- Select a supplier/contractor from a dropdown
- Automatically loads all work orders for that supplier in the current project
- Filters work orders by both project and supplier

### 2. **Work Order Listing**
- Displays all saved work orders for the selected supplier
- Shows work order details:
  - Document number
  - Supplier name
  - Creation date
  - Total amount
  - Delivery status (X / Y items verified)

### 3. **Item Verification Checkboxes**
- Each work order item has a checkbox to verify delivery
- Click checkbox to mark item as delivered
- Automatically records verification date and time
- Visual feedback:
  - Checked items show green background
  - Verification date displayed under item description
  - Work order header turns green when all items verified
  - "Fully Delivered" badge appears when complete

### 4. **Document Upload**
- **Upload DO (Delivery Order)**
  - Click "Upload DO" button
  - Accepts: PDF, JPG, JPEG, PNG files
  - Stores document in localStorage
  - Shows file name after upload
  - Download and remove options available

- **Upload Invoice**
  - Click "Upload Invoice" button
  - Accepts: PDF, JPG, JPEG, PNG files
  - Stores document in localStorage
  - Shows file name after upload
  - Download and remove options available

### 5. **Visual Status Indicators**
- **Delivery Progress**: Shows "X / Y items verified" count
- **Fully Delivered Badge**: Green checkmark icon when all items verified
- **Color Coding**:
  - Green background: Verified items and fully delivered work orders
  - White background: Pending verification
  - Green border: Uploaded documents

## How to Use

### Step 1: Navigate to DO Check
1. Open Project Checker
2. Select a project
3. Click on the "DO Check" tab

### Step 2: Select Supplier
1. Use the dropdown to select a supplier/contractor
2. Their work orders will automatically load

### Step 3: Verify Deliveries
1. Review each work order and its items
2. Check the checkbox next to each item as it's delivered
3. The verification date is automatically recorded
4. Monitor the delivery status counter

### Step 4: Upload Documents
1. Click "Upload DO" to upload the delivery order document
2. Click "Upload Invoice" to upload the invoice
3. Documents are saved and can be downloaded later
4. Remove documents if needed using the X button

### Step 5: Track Progress
- View delivery status at a glance
- See which items are verified (green background)
- Check which work orders are fully delivered (green header with badge)
- Download uploaded documents for reference

## Data Storage

All data is stored in localStorage:
- **Delivery Checks**: `deliveryChecks_{projectId}_{supplierId}`
- **Documents**: `doDocuments_{projectId}_{supplierId}`

Each delivery check stores:
```javascript
{
  "workOrderId_itemId": {
    "checked": true/false,
    "checkedDate": "2025-12-12T10:00:00.000Z"
  }
}
```

Each document stores:
```javascript
{
  "workOrderId_type": {
    "fileName": "DO-12345.pdf",
    "fileType": "application/pdf",
    "fileData": "data:application/pdf;base64,...",
    "uploadDate": "2025-12-12T10:00:00.000Z",
    "type": "do" or "invoice"
  }
}
```

## Benefits

1. **Accountability**: Track exactly when items were verified
2. **Documentation**: Store proof of delivery and invoices
3. **Progress Tracking**: See delivery status at a glance
4. **Organization**: All delivery information in one place
5. **Audit Trail**: Verification dates recorded automatically

## Files Modified
- `src/pages/ProjectChecker.jsx`

## Key Functions

- `toggleDeliveryCheck(workOrderId, itemId)` - Mark item as delivered/undelivered
- `uploadDocument(workOrderId, type, event)` - Upload DO or invoice
- `downloadDocument(workOrderId, type)` - Download uploaded document
- `removeDocument(workOrderId, type)` - Remove uploaded document
