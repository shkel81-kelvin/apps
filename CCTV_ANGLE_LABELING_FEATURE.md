# CCTV Camera Angle & Labeling Feature

## Overview
The Drawing Planner now includes comprehensive CCTV camera coverage visualization and labeling capabilities. This feature allows you to plan camera placements with visual coverage areas when uploading PDF floor plans.

## Features Added

### 1. **Camera Configuration Panel**
When you select "CCTV Camera" from the Fittings category, a dedicated configuration panel appears with:

#### Camera Label
- **Purpose**: Identify each camera with a custom label
- **Example**: "CAM-01", "Entrance", "Lobby Camera"
- **Display**: Label appears above the camera in the 3D view

#### Viewing Angle
- **Range**: 30° to 180°
- **Default**: 90° (Standard)
- **Options**:
  - 30° - Narrow angle (focused coverage)
  - 90° - Standard angle (typical CCTV)
  - 180° - Wide angle (panoramic coverage)
- **Control**: Slider with real-time preview

#### Coverage Range
- **Range**: 2m to 30m (2,000mm to 30,000mm)
- **Default**: 10m (10,000mm)
- **Purpose**: Define how far the camera can effectively monitor
- **Control**: Slider with distance markers

#### Camera Rotation
- **Range**: 0° to 360°
- **Default**: 0° (North)
- **Purpose**: Orient the camera's viewing direction
- **Markers**:
  - 0° - North
  - 90° - East
  - 180° - South
  - 270° - West
- **Control**: Slider with directional indicators

#### Show Coverage Area
- **Type**: Checkbox toggle
- **Purpose**: Show/hide the visual coverage cone
- **Default**: Enabled

### 2. **Visual Coverage Display**

#### Coverage Cone
- **Shape**: Wedge/cone emanating from camera position
- **Color**: Semi-transparent red (#ef4444 at 20% opacity)
- **Wireframe Border**: Red outline for better visibility
- **Dynamic**: Updates in real-time as you adjust angle, range, or rotation

#### Camera Model
- **Body**: Cylindrical shape representing the camera housing
- **Lens**: Darker cylinder representing the camera lens
- **Color**: Red (#ef4444) to match CCTV standard

### 3. **Label Display**
- **Position**: Floats above the camera
- **Style**: Red badge with white text
- **Visibility**: Always visible when label is set
- **Purpose**: Quick identification in complex layouts

## How to Use

### Step 1: Select CCTV Camera
1. Open Drawing Planner
2. Click on the "Fittings" tab in the left sidebar
3. Select "CCTV Camera" from the fitting types

### Step 2: Configure Camera Settings
1. **Set Label**: Enter a unique identifier (e.g., "CAM-01")
2. **Adjust Viewing Angle**: Use the slider to set the camera's field of view
3. **Set Coverage Range**: Define how far the camera can see
4. **Rotate Camera**: Orient the camera to face the desired direction
5. **Toggle Coverage**: Check/uncheck "Show Coverage Area" as needed

### Step 3: Place Camera
1. Click on the floor plan where you want to place the camera
2. The camera will appear with its coverage area visualized
3. The label will display above the camera

### Step 4: Adjust After Placement
1. Click "Select Mode" button
2. Click on the camera you want to edit
3. Use the Transform Controls to move or rotate
4. Or adjust properties in the right-side panel

## Use Cases

### Security Planning
- **Entrance Monitoring**: Place cameras at entry points with appropriate angles
- **Perimeter Coverage**: Ensure complete coverage around building perimeter
- **Blind Spot Detection**: Identify areas not covered by any camera
- **Overlap Analysis**: See where multiple cameras cover the same area

### Compliance Documentation
- **Coverage Reports**: Visual proof of monitored areas
- **Camera Specifications**: Document each camera's range and angle
- **Installation Planning**: Guide installers with precise placement

### Client Presentations
- **Visual Proposals**: Show clients exactly what will be monitored
- **Coverage Justification**: Explain why specific cameras are needed
- **Budget Planning**: Optimize camera count based on coverage needs

## Technical Details

### Properties Stored
Each CCTV camera element stores:
```javascript
{
  cameraAngle: 90,           // Viewing angle in degrees
  cameraRange: 10000,        // Coverage range in mm
  cameraRotation: 0,         // Rotation in degrees
  cameraLabel: "CAM-01",     // Custom label
  showCoverageArea: true     // Coverage visibility toggle
}
```

### Coverage Calculation
- Coverage area is rendered as a 2D cone shape
- Angle determines the width of the cone
- Range determines the length of the cone
- Rotation orients the cone direction
- Rendered at ground level (Y=1) for floor plan overlay

### 3D Visualization
- Camera body: Cylinder (red)
- Camera lens: Cylinder (dark gray)
- Coverage area: Semi-transparent red wedge
- Coverage border: Red wireframe
- Label: HTML overlay with red background

## Tips & Best Practices

1. **Standard Angles**:
   - Indoor corridors: 60-90°
   - Open spaces: 90-120°
   - Entrance points: 90°
   - Parking lots: 120-180°

2. **Typical Ranges**:
   - Indoor small rooms: 5-8m
   - Indoor large spaces: 10-15m
   - Outdoor areas: 15-30m

3. **Labeling Convention**:
   - Use sequential numbers: CAM-01, CAM-02, etc.
   - Include location: "Entrance-CAM-01"
   - Add floor level: "L1-CAM-01"

4. **Coverage Planning**:
   - Overlap coverage areas by 10-20% for redundancy
   - Consider camera height when setting range
   - Account for obstacles that may block view
   - Use rotation to avoid pointing at walls

## Future Enhancements
- Camera height adjustment
- Different camera types (dome, bullet, PTZ)
- Night vision range indicator
- Motion detection zones
- Integration with BOM calculation
- Export coverage report

## Related Features
- **Drawing Planner**: Main 3D planning tool
- **BOM Calculation**: Automatic camera counting
- **Project Dashboard**: Camera inventory tracking
- **Asset Management**: Camera specifications database
