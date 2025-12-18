# Schematic Diagram Design - Feature Documentation

## ✅ Latest Features (v2.6)

### 1. **Advanced Network Switch Configuration**
**Problem:** The previous switch configuration was too basic, requiring manual entry of ports and lacking brand/model context.
**Solution:**
- **Switch Database:** Integrated a database of common switch brands (Cisco, Aruba, Ubiquiti, Ruijie) and their models.
- **Brand & Model Selection:** Users can now select a **Brand**, which filters the available **Models**.
- **Auto-Fill Specs:** Selecting a model automatically fills the **Ports** (8, 16, 24, 48) and **Type** (PoE/Non-PoE).
- **Manual Override:** Users can still manually change the ports or type if needed (e.g., for a custom configuration).
- **Generic Options:** Included a "Generic" brand for standard 8/16/24/48 port switches if a specific brand isn't required.

### 2. **Section-Based Equipment Configuration**
- **Floor Grouping:** Configuration is organized by Floor Sections.
- **Direct Addition:** "Add Equipment to [Floor]" button for precise placement.
- **Floor Exclusion:** "Remove Floor" button to exclude specific floors from the design.

### 3. **Backbone Origin Correction (MDF at Bottom)**
- **Downward Routing:** Backbone lines route DOWN to the MDF.
- **MDF Termination:** Horizontal "Bus" line at the bottom labeled "Main Backbone / MDF".

## 📋 User Workflow

### Step 1: Configure Range
1. Set **Start Floor** and **Total Floors**.

### Step 2: Add Equipment (Enhanced)
1. Go to a floor section (e.g., "Ground").
2. Click **"Add Equipment"**.
3. Select **"Network Switch"**.
4. **New:** Select **Brand** (e.g., Cisco).
5. **New:** Select **Model** (e.g., Catalyst 9200L 48P).
6. **Observe:** Ports (48) and Type (PoE) are auto-filled.

### Step 3: Generate Diagram
1. Click **Generate**.
2. The diagram reflects the specific port counts and equipment types configured.
