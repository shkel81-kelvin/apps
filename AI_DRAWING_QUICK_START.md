# AI Icon Detection & Calculation - Quick Guide

## 🎯 What's New: Custom Icon Upload!

Upload your own icon templates and the AI will automatically detect and count them in your drawings!

## 🚀 How It Works (3 Simple Steps)

### Step 1: Upload Your Icon Templates
1. Click **"Icon Library"** button in the top-right
2. Click **"Upload Icon Templates"** 
3. Select one or more icon images (PNG, JPG) from your computer
4. Your icons will appear in the library
5. Click **"Done"** to close the library

**Tip**: Use clear, high-contrast icon images for best detection results.

### Step 2: Upload Your Drawing
1. Drag and drop your drawing file onto the upload area
2. Or click to browse and select your file
3. Supported formats: JPG, PNG, PDF, DWG, DXF

### Step 3: Detect & Count
1. Click the **"Detect & Count Icons"** button
2. Wait 2-3 seconds for AI processing
3. View results in the sidebar:
   - Total quantity detected
   - Breakdown by icon type
   - Individual item list

## ✨ Key Features

### 📚 Icon Library Management
- **Upload Multiple Icons**: Select multiple files at once
- **Enable/Disable**: Toggle which icons to detect
- **Color Coding**: Each icon type gets a unique color
- **Delete Icons**: Remove icons you no longer need

### 🎨 Visual Detection
- **Bounding Boxes**: Each detected icon is highlighted
- **Confidence Scores**: See how confident the AI is (0-100%)
- **Color-Coded Labels**: Easy to identify different icon types
- **Selection Indicators**: Checkmarks show selected items

### 📊 Automatic Quantity Calculation
The system automatically counts:
- **Total detections** for each icon type
- **Selected items** you've chosen
- **Percentage breakdown** by icon type

### 🔍 Canvas Controls
| Button | Function |
|--------|----------|
| 🔍+ | Zoom In (up to 300%) |
| 🔍- | Zoom Out (down to 50%) |
| 🔄 | Rotate 90° |
| 👁️ | Show/Hide Detection Overlays |

### ✅ Selection Tools
- **Click Individual Items**: Select/deselect one at a time
- **Click Icon Cards**: Select all items of that type
- **Visual Feedback**: Selected items show checkmarks

### 💾 Export Options

#### 1. Download Annotated Image
- Saves your drawing with all detection highlights
- Format: PNG
- Perfect for documentation and presentations

#### 2. Export Quantity Data (JSON)
Get detailed data including:
```json
{
  "totalDetections": 45,
  "selectedItems": 38,
  "quantityByIcon": {
    "Access Point": {
      "total": 15,
      "selected": 12
    },
    "Camera": {
      "total": 20,
      "selected": 18
    }
  }
}
```

## 💡 Best Practices

### Icon Template Preparation
✅ **DO:**
- Use clear, simple icon images
- Ensure good contrast with background
- Use consistent icon sizes (50-200px recommended)
- Save as PNG with transparent background

❌ **DON'T:**
- Use blurry or low-resolution images
- Include complex backgrounds
- Use extremely small icons (<30px)

### Drawing Preparation
✅ **DO:**
- Use high-resolution scans (300 DPI minimum)
- Ensure icons are clearly visible
- Use consistent icon sizes in your drawing

❌ **DON'T:**
- Use heavily compressed images
- Upload drawings with poor contrast
- Mix drastically different icon sizes

## 🎯 Common Use Cases

### 1. Network Equipment Counting
**Icons to Upload:**
- Access Point icon
- Network Switch icon
- Router icon

**Result:** Automatic count of all network equipment in your diagram

### 2. CCTV Camera Planning
**Icons to Upload:**
- Dome Camera icon
- Bullet Camera icon
- PTZ Camera icon

**Result:** Total camera count by type for NVR planning

### 3. Electrical Outlet Mapping
**Icons to Upload:**
- Power Outlet icon
- Data Port icon
- Phone Jack icon

**Result:** Complete outlet inventory for electrical planning

### 4. Fire Safety Equipment
**Icons to Upload:**
- Smoke Detector icon
- Fire Extinguisher icon
- Emergency Exit icon

**Result:** Compliance checklist with exact quantities

## 🔧 Troubleshooting

### "No items detected"
**Solutions:**
- Ensure icons are uploaded and enabled in Icon Library
- Check that drawing contains the uploaded icons
- Try uploading clearer icon templates
- Verify drawing image quality

### "Too many false detections"
**Solutions:**
- Use more specific icon templates
- Ensure icon templates match drawing style
- Disable unused icons in the library
- Manually deselect incorrect detections

### "Icon Library button shows (0)"
**Solution:**
- You haven't uploaded any icons yet
- Click "Icon Library" and upload icon templates

### "Detect button is disabled"
**Solutions:**
- Upload at least one icon template
- Enable at least one icon in the library
- Upload a drawing file first

## 📈 Workflow Example

**Scenario**: Count access points in a network diagram

1. **Prepare Icon**
   - Find or create an access point icon (PNG)
   - Ensure it matches the style in your drawing

2. **Upload Icon**
   - Click "Icon Library"
   - Upload the access point icon
   - Verify it appears in the library
   - Click "Done"

3. **Upload Drawing**
   - Drag your network diagram onto the upload area
   - Wait for it to load

4. **Detect**
   - Click "Detect & Count Icons"
   - Wait for processing

5. **Review Results**
   - Check the "Access Point" card in sidebar
   - See total quantity detected
   - Review individual detections on the drawing

6. **Export**
   - Click "Export" to get JSON data
   - Or click "Download" to save annotated image
   - Use data for BOM generation or documentation

## 🎨 Advanced Tips

### Multiple Icon Types
- Upload all your icon types at once
- The system will detect all enabled icons in one scan
- Each type gets a unique color for easy identification

### Selective Detection
- Disable icons you don't need for a specific drawing
- Speeds up processing
- Reduces false positives

### Quality Control
- Review confidence scores (aim for >70%)
- Manually deselect low-confidence detections
- Re-run detection with adjusted settings if needed

## 📱 Integration with Other Modules

After detection, you can:

1. **BOM Calculation**
   - Export quantity data
   - Import into Network and CCTV Planning
   - Generate material lists

2. **Rack Management**
   - Use switch counts for rack planning
   - Calculate required rack units

3. **Power Planning**
   - Export UPS and switch counts
   - Calculate power requirements

## 🆘 Need Help?

**Common Questions:**

**Q: Can I upload multiple drawings?**
A: Currently one drawing at a time. Clear and upload a new one for each drawing.

**Q: How accurate is the detection?**
A: Accuracy depends on icon template quality and drawing clarity. Typically 85-95% with good inputs.

**Q: Can I edit the icon library?**
A: Yes! Enable/disable or delete icons anytime from the Icon Library.

**Q: What's the maximum file size?**
A: Recommended under 10MB for optimal performance.

**Q: Can I save my icon library?**
A: Icon library is stored in your browser session. Re-upload icons if you clear browser data.

---

**Ready to start?** Navigate to: **Project Planning → Calculation and Highlight**

**Pro Tip**: Save your commonly used icon templates in a folder for quick re-upload!
