# Custom Icon Detection & Quantity Calculation - Complete Guide

## Overview

The **Calculation and Highlight** feature allows you to upload custom icon templates and automatically detect, highlight, and count them in your technical drawings. This is perfect for:

- **Network Planning**: Count access points, switches, routers
- **CCTV Design**: Inventory cameras and NVRs
- **Electrical Planning**: Count outlets, switches, panels
- **Fire Safety**: Track detectors, extinguishers, exits
- **Any Technical Drawing**: Upload any icon and count it!

## How It Works

### The Technology

The system uses **template matching** to find instances of your uploaded icons within the drawing:

1. **Icon Upload**: You provide reference images of the icons you want to detect
2. **Template Analysis**: The system analyzes the icon's visual features
3. **Drawing Scan**: The AI scans the entire drawing for matching patterns
4. **Detection**: Each match is highlighted with a bounding box
5. **Quantification**: Automatic counting and categorization

### Current Implementation

**Note**: The current version uses a simulated AI detection algorithm for demonstration. In production, this would be replaced with:

- **OpenCV Template Matching**
- **Deep Learning Object Detection** (YOLO, Faster R-CNN)
- **Custom ML Models** trained on technical drawings
- **Cloud Vision APIs** (Google Cloud Vision, AWS Rekognition)

## Step-by-Step Usage Guide

### Phase 1: Icon Library Setup

#### 1.1 Access Icon Library
```
Click "Icon Library (0)" button in top-right corner
```

#### 1.2 Prepare Your Icons
Before uploading, ensure your icon images:
- Are clear and high-contrast
- Match the style used in your drawings
- Are saved as PNG or JPG
- Are reasonably sized (50-200px recommended)

#### 1.3 Upload Icons
```
1. Click "Upload Icon Templates" in the modal
2. Select one or multiple icon image files
3. Wait for them to appear in the grid
4. Each icon gets a random color assignment
```

#### 1.4 Manage Icons
For each uploaded icon, you can:
- **Enable/Disable**: Toggle detection on/off
- **Delete**: Remove from library
- **View**: See the icon preview

### Phase 2: Drawing Upload

#### 2.1 Upload Your Drawing
```
Method 1: Drag and drop the file onto the upload area
Method 2: Click the upload area and browse for the file
```

**Supported Formats:**
- Images: JPG, PNG
- Documents: PDF
- CAD Files: DWG, DXF

#### 2.2 Verify Upload
- Drawing appears in the canvas area
- Toolbar becomes active
- Action buttons are enabled

### Phase 3: Detection & Analysis

#### 3.1 Run Detection
```
Click "Detect & Count Icons" button
```

**Requirements:**
- At least one icon must be uploaded
- At least one icon must be enabled
- A drawing must be uploaded

#### 3.2 Processing
- Progress indicator shows "Detecting..."
- Typical processing time: 2-5 seconds
- Depends on drawing size and number of icons

#### 3.3 Review Results
Results appear in three sections:

**Quantity Summary:**
- Total items detected
- Total items selected

**By Icon Type:**
- Count for each icon type
- Selection progress bar
- Click to select/deselect all of that type

**All Detected Items:**
- Individual list of every detection
- Shows confidence score
- Click to select/deselect individual items

### Phase 4: Refinement & Export

#### 4.1 Refine Selection
- Click individual items to toggle selection
- Click icon type cards to select all of that type
- Use visual feedback (checkmarks) to track selections

#### 4.2 Canvas Controls
Adjust the view as needed:
- **Zoom In/Out**: Better inspection of details
- **Rotate**: Adjust drawing orientation
- **Show/Hide**: Toggle detection overlays

#### 4.3 Export Results

**Option 1: Annotated Image**
```
Click "Download" button
→ Saves PNG with all highlights
→ Use for documentation, presentations
```

**Option 2: Quantity Data**
```
Click "Export" button in sidebar
→ Saves JSON with detailed data
→ Use for BOM generation, analysis
```

## Features In Detail

### Icon Library Management

#### Upload Multiple Icons
- Select multiple files in one upload action
- Each icon is processed independently
- No limit on number of icons (practical limit: ~50 for performance)

#### Enable/Disable Icons
- Temporarily disable icons without deleting
- Speeds up detection when you don't need all types
- Useful for focusing on specific equipment

#### Color Coding
- Each icon automatically gets a unique color
- Colors used for:
  - Bounding boxes
  - Labels
  - Category cards
  - Progress bars

#### Icon Preview
- Thumbnail preview in library
- Full name display
- Visual confirmation of uploaded icon

### Detection Visualization

#### Bounding Boxes
- Rectangle around each detected instance
- Color matches icon type
- Solid line for selected items
- Dashed line for unselected items

#### Labels
- Icon name + confidence percentage
- Colored background matching icon type
- White text for readability
- Positioned above bounding box

#### Selection Indicators
- Checkmark circle in top-right of box
- Colored to match icon type
- Only visible on selected items

### Quantity Calculation

#### Automatic Counting
The system automatically calculates:
- **Total per icon type**: All detections of each icon
- **Selected per icon type**: Only selected detections
- **Overall total**: All detections across all types
- **Overall selected**: All selected items

#### Real-Time Updates
Counts update instantly when you:
- Select/deselect individual items
- Select/deselect entire icon types
- Run new detection

#### Export Format
JSON export includes:
```json
{
  "fileName": "network-diagram.png",
  "uploadDate": "2025-12-07T00:00:00.000Z",
  "totalDetections": 45,
  "selectedItems": 38,
  "detectionsByIcon": {
    "Access Point": 15,
    "Network Switch": 8,
    "Camera": 20,
    "UPS": 2
  },
  "selectedByIcon": {
    "Access Point": 12,
    "Network Switch": 8,
    "Camera": 16,
    "UPS": 2
  },
  "quantityByIcon": {
    "Access Point": {
      "total": 15,
      "selected": 12,
      "iconFile": "access-point.png"
    }
  },
  "items": [
    {
      "id": "detection-1",
      "iconName": "Access Point",
      "confidence": 0.92,
      "x": 150,
      "y": 200,
      "width": 80,
      "height": 80,
      "selected": true
    }
  ]
}
```

## Use Case Examples

### Example 1: WiFi Network Planning

**Objective**: Count access points in a floor plan

**Steps:**
1. Upload access point icon (e.g., `wifi-icon.png`)
2. Upload floor plan drawing
3. Run detection
4. Review 15 access points detected
5. Deselect 2 false positives
6. Export: 13 access points confirmed
7. Use for equipment procurement

**Result**: Accurate AP count for ordering and installation

### Example 2: CCTV System Design

**Objective**: Inventory different camera types

**Steps:**
1. Upload 3 icons:
   - Dome camera icon
   - Bullet camera icon  
   - PTZ camera icon
2. Upload security layout drawing
3. Run detection
4. Results:
   - 12 dome cameras
   - 8 bullet cameras
   - 3 PTZ cameras
5. Export data for NVR sizing

**Result**: Complete camera inventory by type

### Example 3: Electrical Outlet Audit

**Objective**: Count power and data outlets

**Steps:**
1. Upload 2 icons:
   - Power outlet icon
   - Data port icon
2. Upload electrical plan
3. Run detection
4. Results:
   - 45 power outlets
   - 38 data ports
5. Export for compliance documentation

**Result**: Verified outlet counts for inspection

### Example 4: Fire Safety Compliance

**Objective**: Verify fire safety equipment placement

**Steps:**
1. Upload 3 icons:
   - Smoke detector icon
   - Fire extinguisher icon
   - Emergency exit icon
2. Upload building layout
3. Run detection
4. Compare against requirements:
   - Required: 20 smoke detectors → Detected: 22 ✓
   - Required: 8 extinguishers → Detected: 8 ✓
   - Required: 6 exits → Detected: 6 ✓
5. Export annotated plan for approval

**Result**: Compliance verification with visual proof

## Advanced Techniques

### Multi-Icon Detection Strategy

When detecting multiple icon types:

1. **Upload All Icons First**
   - Prepare all icon templates before starting
   - Upload them all in one session
   - Verify each one appears correctly

2. **Run Single Detection**
   - One detection scan finds all icon types
   - More efficient than multiple scans
   - Easier to manage results

3. **Selective Review**
   - Disable icons you want to ignore
   - Focus on specific equipment types
   - Re-enable when needed

### Confidence Score Interpretation

Understanding confidence scores:

- **90-100%**: Excellent match, very likely correct
- **80-89%**: Good match, probably correct
- **70-79%**: Acceptable match, review recommended
- **60-69%**: Moderate match, likely needs review
- **Below 60%**: Low confidence, probably false positive

**Best Practice**: Review all detections below 75% confidence

### Handling False Positives

Strategies to reduce false detections:

1. **Better Icon Templates**
   - Use clearer, more distinctive icons
   - Match the exact style in your drawing
   - Avoid generic or ambiguous icons

2. **Manual Review**
   - Check each detection visually
   - Deselect obvious false positives
   - Focus on low-confidence items

3. **Selective Detection**
   - Disable similar-looking icons
   - Run detection for one type at a time
   - Combine results manually

### Handling False Negatives

If icons are missed:

1. **Check Icon Template**
   - Ensure it matches drawing style
   - Verify icon is clear and distinctive
   - Try uploading a different version

2. **Drawing Quality**
   - Use higher resolution scans
   - Ensure icons are clearly visible
   - Avoid heavily compressed images

3. **Manual Addition**
   - Note missed items
   - Add to count manually
   - Document in export notes

## Integration Workflows

### BOM Generation Workflow

```
1. Detect & Count Icons
   ↓
2. Export Quantity Data (JSON)
   ↓
3. Import to Network and CCTV Planning
   ↓
4. Generate Bill of Materials
   ↓
5. Export to Procurement
```

### Documentation Workflow

```
1. Upload Drawing
   ↓
2. Detect Icons
   ↓
3. Review & Select
   ↓
4. Download Annotated Image
   ↓
5. Include in Project Documentation
   ↓
6. Submit for Approval
```

### Compliance Workflow

```
1. Upload Compliance Icons
   ↓
2. Upload Building Plan
   ↓
3. Detect & Count
   ↓
4. Compare vs. Requirements
   ↓
5. Export Report
   ↓
6. Submit to Authorities
```

## Performance Optimization

### For Large Drawings

When working with large files:

1. **Reduce Resolution**
   - Resize to 4096x4096 max before upload
   - Maintains quality while improving speed
   - Use image editing software

2. **Selective Detection**
   - Enable only needed icons
   - Reduces processing time
   - Run multiple targeted scans

3. **Browser Performance**
   - Close other tabs
   - Use modern browser (Chrome, Edge)
   - Ensure adequate RAM available

### For Many Icons

When detecting many icon types:

1. **Batch by Category**
   - Group similar icons together
   - Run detection in batches
   - Combine results

2. **Prioritize**
   - Detect critical equipment first
   - Add optional items later
   - Focus on high-value counts

## Troubleshooting Guide

### Issue: Detection Button Disabled

**Possible Causes:**
- No icons uploaded
- All icons disabled
- No drawing uploaded

**Solutions:**
1. Check Icon Library has at least one icon
2. Ensure at least one icon is enabled (green button)
3. Verify drawing is uploaded and visible

### Issue: No Detections Found

**Possible Causes:**
- Icon template doesn't match drawing
- Drawing quality too low
- Icons too small or unclear

**Solutions:**
1. Upload better quality icon template
2. Use higher resolution drawing
3. Check that icons actually exist in drawing
4. Try different icon template

### Issue: Too Many False Positives

**Possible Causes:**
- Icon template too generic
- Similar shapes in drawing
- Low confidence threshold

**Solutions:**
1. Use more specific icon template
2. Manually deselect false positives
3. Disable similar icon types
4. Review confidence scores

### Issue: Slow Performance

**Possible Causes:**
- Very large drawing file
- Too many icons enabled
- Browser resource constraints

**Solutions:**
1. Reduce drawing file size
2. Enable fewer icons at once
3. Close other browser tabs
4. Use a faster computer/browser

### Issue: Export Not Working

**Possible Causes:**
- Browser blocking downloads
- No detections to export
- Browser compatibility

**Solutions:**
1. Check browser download settings
2. Ensure detections exist
3. Try different browser
4. Check popup blockers

## Best Practices Summary

### ✅ DO

- **Use clear, high-quality icon templates**
- **Match icon style to your drawings**
- **Upload high-resolution drawings (300 DPI+)**
- **Review all detections before exporting**
- **Save commonly used icons for reuse**
- **Export both image and data**
- **Document your process**

### ❌ DON'T

- **Use blurry or low-quality icons**
- **Upload extremely large files (>10MB)**
- **Trust 100% without review**
- **Mix drastically different icon styles**
- **Forget to enable icons before detection**
- **Skip confidence score review**
- **Rely solely on automated counts**

## Future Enhancements

Planned features for future versions:

1. **Real AI Integration**
   - Actual computer vision algorithms
   - Machine learning models
   - Cloud API integration

2. **Batch Processing**
   - Multiple drawings at once
   - Automated report generation
   - Bulk export

3. **Icon Library Persistence**
   - Save icon libraries
   - Share between users
   - Pre-built icon sets

4. **Advanced Editing**
   - Manual annotation tools
   - Edit detection boxes
   - Add custom notes

5. **Direct Integration**
   - Auto-populate BOM calculations
   - Link to procurement systems
   - Export to CAD software

## Support & Feedback

For assistance with the Calculation and Highlight feature:

- **Documentation**: Review this guide and Quick Start guide
- **Troubleshooting**: Check the troubleshooting section above
- **Feature Requests**: Submit through the application
- **Bug Reports**: Contact development team

---

**Version**: 2.0.0 (Custom Icon Upload)  
**Last Updated**: December 7, 2025  
**Feature**: Calculation and Highlight  
**Location**: Project Planning → Calculation and Highlight
