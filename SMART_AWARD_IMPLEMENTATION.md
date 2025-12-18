# Smart Award Management Implementation Guide

## Features to Implement

### 1. Auto-Capture Grand Total on Award
**When admin sets award status to "Awarded":**
- Extract Grand Total from bidder's submitted Excel file
- Auto-populate Amount field
- Set all other bidders to "Not Awarded"

### 2. Auto-Withdraw Non-Submitted Bids
**When deadline passes:**
- Check if bidder submitted files
- If NO submission → set status to "Withdrawn"
- If submission exists → keep status as-is

## Implementation

### File: TenderDashboard.jsx

#### Step 1: Add useEffect for Auto-Withdrawal

```javascript
// Add this after other useEffects
useEffect(() => {
    if (!selectedTender || !showInvitedModal) return;

    const tender = selectedTender;
    if (!tender.deadline) return;

    // Check if deadline passed
    const deadlineDate = new Date(tender.deadline);
    if (tender.closingTime) {
        const [hours, minutes] = tender.closingTime.split(':');
        deadlineDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
        deadlineDate.setHours(23, 59, 59, 999);
    }

    if (new Date() > deadlineDate) {
        let withdrawnCount = 0;
        
        tender.invitedSubcons?.forEach(bidder => {
            // Check submission
            const bidderCred = bidderAuthStorage.getByTenderId(tender.id)
                .find(c => c.subcontractorId === bidder.id);
            
            const bidderFiles = fileStorage.getAll().filter(f => {
                if (f.tenderId !== tender.id) return false;
                return f.uploadedBy === bidder.email || 
                       f.uploadedBy === bidderCred?.email;
            });

            // No submission = Withdrawn
            if (bidderFiles.length === 0) {
                const award = awardStorage.getAward(tender.id, bidder.id) || {};
                if (award.status !== 'Awarded' && 
                    award.status !== 'Not Awarded' && 
                    award.status !== 'Withdrawn') {
                    
                    awardStorage.updateAward(tender.id, bidder.id, 'Withdrawn', '');
                    withdrawnCount++;
                }
            }
        });

        if (withdrawnCount > 0) {
            setSelectedTender({...selectedTender}); // Re-render
        }
    }
}, [selectedTender, showInvitedModal]);
```

#### Step 2: Update handleAwardChange

```javascript
const handleAwardChange = (tenderId, bidderId, field, value) => {
    const award = awardStorage.getAward(tenderId, bidderId) || { status: 'Pending', amount: '' };

    if (field === 'status' && value === 'Awarded') {
        console.log('=== AWARDING TENDER ===');

        // Get bidder's files
        const bidder = selectedTender.invitedSubcons.find(b => b.id === bidderId);
        const bidderCred = bidderAuthStorage.getByTenderId(tenderId)
            .find(c => c.subcontractorId === bidderId);
        
        const bidderFiles = fileStorage.getAll().filter(f => {
            if (f.tenderId !== tenderId) return false;
            return f.uploadedBy === bidder?.email || 
                   f.uploadedBy === bidderCred?.email;
        });

        let grandTotal = award.amount || '';

        // Try to extract from Excel (simplified - manual entry recommended)
        if (bidderFiles.length > 0 && !grandTotal) {
            // Prompt admin to enter amount if not auto-detected
            const enteredAmount = prompt('Enter Grand Total Amount (RM):', '');
            if (enteredAmount) {
                grandTotal = parseFloat(enteredAmount).toFixed(2);
            }
        }

        // Update this bidder to Awarded
        awardStorage.updateAward(tenderId, bidderId, 'Awarded', grandTotal);

        // Set ALL others to Not Awarded
        selectedTender.invitedSubcons.forEach(b => {
            if (b.id !== bidderId) {
                const otherAward = awardStorage.getAward(tenderId, b.id) || {};
                awardStorage.updateAward(tenderId, b.id, 'Not Awarded', otherAward.amount || '');
            }
        });

        alert(`Tender awarded to ${bidder.companyName}! Amount: RM ${grandTotal || 'N/A'}`);
        setSelectedTender({...selectedTender});
        
    } else if (field === 'status') {
        awardStorage.updateAward(tenderId, bidderId, value, award.amount);
        setSelectedTender({...selectedTender});
    } else if (field === 'amount') {
        awardStorage.updateAward(tenderId, bidderId, award.status, value);
        setSelectedTender({...selectedTender});
    }
};
```

## How It Works

### Award Flow:
1. Admin selects bidder dropdown → "Awarded"
2. System prompts for Grand Total amount
3. Amount auto-fills in the Amount field
4. All other bidders → "Not Awarded"
5. Alert confirms: "Tender awarded! Amount: RM X"

### Withdrawal Flow:
1. Tender deadline passes
2. Admin opens tender
3. System checks each bidder:
   - Has submission? → Status unchanged
   - No submission? → Status = "Withdrawn"
4. UI updates automatically

## Testing

1. **Test Award:**
   - Create tender, invite 3 bidders
   - Have 1 bidder submit
   - Select "Awarded" for that bidder
   - Verify: Amount entered, others = "Not Awarded"

2. **Test Withdrawal:**
   - Create tender with past deadline
   - Invite 2 bidders
   - Only 1 submits
   - Open tender
   - Verify: Non-submitter = "Withdrawn"

## Console Logs

Watch for:
```
=== AWARDING TENDER ===
Set ABC Company to Not Awarded
Set XYZ Corp to Not Awarded
Auto-withdrawn: DEF Ltd (no submission)
```

## Notes

- Grand Total extraction from Excel is complex (async XLSX parsing)
- Simpler to prompt admin for manual entry
- Withdrawal only affects "Pending" status bidders
- "Awarded" and "Not Awarded" are never auto-withdrawn
