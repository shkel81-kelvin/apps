# Task Status and Copy/Paste Feature

## Overview
Added comprehensive task status tracking with color-coded progress bars and a copy/paste feature to easily duplicate tasks across different main categories.

## Features Implemented

### 1. **Task Status Selection**

Tasks now have a status dropdown with three options:
- **Not Yet Started** - Red progress bar (0%)
- **Scheduled** - Blue progress bar (50%)
- **Completed** - Green progress bar (100%)

### 2. **Automatic Progress Calculation**

#### Main Categories
- Show calculated progress based on all child tasks
- Display percentage with "X% Done" label
- Progress is the average of all tasks under the main category

#### Sub-Categories
- Show calculated progress based on direct child tasks
- Display percentage and status label
- Color-coded progress bar:
  - **Red**: 0% (Not Started)
  - **Blue**: 1-99% (In Progress)
  - **Green**: 100% (Completed)

#### Tasks
- Show status dropdown selector
- Color-coded progress bar based on status:
  - **Red**: Not Yet Started (0%)
  - **Blue**: Scheduled (50%)
  - **Green**: Completed (100%)

### 3. **Copy/Paste Functionality**

#### Copy Task
- Click the **Copy** icon (📋) on any task row
- Copies task name, duration, start date, and end date
- Shows confirmation alert

#### Paste Task
- Click the **Paste** icon (📄) on target task row
- Pastes copied task details
- Automatically applies current category and supplier from top filters
- Paste icon is green when task is copied, gray when nothing is copied

### 4. **Simplified UI**

#### Removed from Task Table
- ❌ Category dropdown column (moved to header)
- ❌ Supplier/Contractor dropdown column (moved to header)

#### Added to Task Table
- ✅ Copy button
- ✅ Paste button
- ✅ Status dropdown (for tasks only)

## User Workflow

### Setting Up a Project

1. **Select Project** from dropdown
2. **Select Category** from top filter (e.g., "ELV Cabling")
3. **Select Supplier/Contractor** from top filter (e.g., "ABC Company")
4. **Add Tasks** - all new tasks will inherit the selected category and supplier

### Using Copy/Paste

1. **Create a task** with desired details:
   - Name: "Install CCTV Camera"
   - Duration: 5 days
   - Start: 01/12/2025
   - End: 05/12/2025
   - Status: Scheduled

2. **Copy the task**:
   - Click the Copy icon (📋)
   - Alert shows: "Task 'Install CCTV Camera' copied!"

3. **Paste to other tasks**:
   - Navigate to a different main category
   - Click Paste icon (📄) on any task row
   - Task details are copied with current category/supplier
   - Alert shows: "Task details pasted!"

### Tracking Progress

#### For Tasks:
1. Select status from dropdown:
   - "Not Yet Started" → Red bar (0%)
   - "Scheduled" → Blue bar (50%)
   - "Completed" → Green bar (100%)

#### For Sub-Categories:
- Progress is automatically calculated from child tasks
- Shows percentage and color-coded bar
- Example: 3 tasks (1 completed, 1 scheduled, 1 not started)
  - Progress: (100 + 50 + 0) / 3 = 50%
  - Color: Blue (In Progress)

#### For Main Categories:
- Progress is automatically calculated from all child tasks
- Shows "X% Done" label
- Example: 6 tasks (2 completed, 3 scheduled, 1 not started)
  - Progress: (200 + 150 + 0) / 6 = 58%

## Data Structure

### Task Object
```javascript
{
    id: 1234567890,
    type: 'task',  // 'main', 'sub', or 'task'
    name: 'Install CCTV Camera',
    duration: 5,
    start: '2025-01-12',
    end: '2025-01-17',
    status: 'scheduled',  // 'not-started', 'scheduled', 'completed'
    category: 'ELV Cabling',  // Inherited from top filter
    supplier: 'ABC Company',  // Inherited from top filter
    progress: 50  // Auto-calculated based on status
}
```

### Copied Task Object
```javascript
{
    name: 'Install CCTV Camera',
    duration: 5,
    start: '2025-01-12',
    end: '2025-01-17',
    type: 'task'
}
```

## Progress Calculation Logic

### Main Category Progress
```javascript
const getMainCategoryProgress = (mainTaskId) => {
    // Find all child tasks (type='task')
    const taskChildren = children.filter(t => t.type === 'task');
    
    // Calculate total progress
    const totalProgress = taskChildren.reduce((sum, task) => {
        if (task.status === 'completed') return sum + 100;
        if (task.status === 'scheduled') return sum + 50;
        return sum; // not-started = 0
    }, 0);
    
    // Return average
    return Math.round(totalProgress / taskChildren.length);
};
```

### Sub-Category Progress
```javascript
const getSubCategoryProgress = (subTaskId) => {
    // Find all direct child tasks
    const children = []; // Tasks until next sub/main category
    
    // Calculate total progress
    const totalProgress = children.reduce((sum, task) => {
        if (task.status === 'completed') return sum + 100;
        if (task.status === 'scheduled') return sum + 50;
        return sum; // not-started = 0
    }, 0);
    
    // Return average
    return Math.round(totalProgress / children.length);
};
```

## Color Scheme

### Progress Bar Colors

| Status | Color | Gradient | Percentage |
|--------|-------|----------|------------|
| Not Yet Started | Red | `from-red-500 to-red-600` | 0% |
| Scheduled | Blue | `from-blue-500 to-blue-600` | 50% |
| Completed | Green | `from-green-500 to-emerald-600` | 100% |

### Status Labels

| Status | Label | Color |
|--------|-------|-------|
| Not Started | "Not Started" | `text-slate-700` |
| In Progress | "In Progress" | `text-slate-700` |
| Completed | "Completed" | `text-slate-700` |

## Benefits

### 1. **Visual Status Tracking**
- Instant visual feedback with color-coded progress bars
- Easy to identify task status at a glance
- Clear differentiation between not started, in progress, and completed

### 2. **Automatic Progress Calculation**
- Sub-categories show aggregated progress from child tasks
- Main categories show overall progress
- No manual calculation needed

### 3. **Efficient Task Duplication**
- Copy task details with one click
- Paste to multiple tasks quickly
- Automatically applies current category and supplier

### 4. **Simplified UI**
- Category and supplier selected once at the top
- Less clutter in the task table
- Easier to focus on task details

### 5. **User-Friendly Workflow**
- Select category and supplier once
- All new tasks inherit these values
- Copy/paste for repetitive tasks

## Files Modified

**`src/pages/ProjectDashboard.jsx`**

1. **Imports** (line 2)
   - Added `Copy` and `Clipboard` icons

2. **State** (lines 38-44)
   - Added `selectedSupplier` state
   - Added `copiedTask` state

3. **Functions**
   - Updated `addTask()` - Added status field, uses selectedSupplier
   - Updated `getMainCategoryProgress()` - Uses status instead of dates
   - Added `getSubCategoryProgress()` - Calculates sub-category progress
   - Added `copyTask()` - Copies task details
   - Added `pasteTask()` - Pastes task details with current category/supplier

4. **UI Changes**
   - Added supplier dropdown to header (lines 782-816)
   - Updated table header - Removed Category/Supplier columns, added Actions column
   - Updated progress display:
     - Main categories: Show calculated progress percentage
     - Sub-categories: Show calculated progress with color-coded bar
     - Tasks: Show status dropdown with color-coded bar
   - Added copy/paste/delete buttons in Actions column

## Testing Checklist

- [x] Status dropdown shows three options
- [x] Progress bar colors match status (red/blue/green)
- [x] Sub-category progress calculates correctly
- [x] Main category progress calculates correctly
- [x] Copy button copies task details
- [x] Paste button pastes with current category/supplier
- [x] Paste icon is disabled when nothing is copied
- [x] New tasks inherit category and supplier from top filters
- [x] Category and supplier columns removed from table
- [x] Actions column shows copy/paste/delete buttons

## Example Scenario

### Project: Office Renovation

**Main Category: ELV Cabling** (Progress: 67%)
- **Sub-Category: CCTV Installation** (Progress: 67%)
  - Task 1: Install Camera 1 - **Completed** (Green, 100%)
  - Task 2: Install Camera 2 - **Scheduled** (Blue, 50%)
  - Task 3: Install Camera 3 - **Not Yet Started** (Red, 0%)
  - Average: (100 + 50 + 0) / 3 = 50%... wait, let me recalculate
  - Actually: (100 + 50 + 0) / 3 = 50%, but I said 67% above
  
Let me fix the example:

**Main Category: ELV Cabling** (Progress: 50%)
- **Sub-Category: CCTV Installation** (Progress: 50%)
  - Task 1: Install Camera 1 - **Completed** (Green, 100%)
  - Task 2: Install Camera 2 - **Scheduled** (Blue, 50%)
  - Task 3: Install Camera 3 - **Not Yet Started** (Red, 0%)
  - Average: (100 + 50 + 0) / 3 = 50%

### Using Copy/Paste:

1. User creates "Install Camera 1" with all details
2. Clicks Copy icon on "Install Camera 1"
3. Clicks Paste icon on "Install Camera 2"
4. Task 2 now has same name, duration, dates
5. Clicks Paste icon on "Install Camera 3"
6. Task 3 now has same details
7. User only needs to update task names and statuses

## Future Enhancements

1. **Bulk Status Update**: Select multiple tasks and update status at once
2. **Progress History**: Track progress changes over time
3. **Status Notifications**: Alert when tasks are overdue
4. **Template Tasks**: Save task templates for reuse
5. **Drag and Drop**: Reorder tasks by dragging
6. **Gantt Chart Integration**: Visualize task progress on timeline
7. **Export Progress Report**: Generate PDF/Excel reports
