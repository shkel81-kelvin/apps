// INVENTORY QUANTITY MIGRATION SCRIPT
// Run this in your browser console to update all items with quantity 0 to quantity 1

(function () {
    console.log('🚀 Starting Inventory Quantity Migration...');

    try {
        // Get items from localStorage
        const savedItems = localStorage.getItem('inventoryItems');

        if (!savedItems) {
            console.log('❌ No inventory items found in localStorage');
            return;
        }

        const items = JSON.parse(savedItems);
        console.log(`📦 Found ${items.length} total items`);

        let updatedCount = 0;

        // Update items with quantity 0 or undefined to quantity 1
        const updatedItems = items.map(item => {
            if (!item.quantity || item.quantity === 0) {
                updatedCount++;
                console.log(`✏️  Updating: ${item.itemName || item.itemCode} (${item.quantity || 0} → 1)`);
                return {
                    ...item,
                    quantity: 1
                };
            }
            return item;
        });

        // Save back to localStorage
        localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));

        console.log('✅ Migration Complete!');
        console.log(`📊 Updated ${updatedCount} items to quantity = 1`);
        console.log(`✓ ${items.length - updatedCount} items already had quantity > 0`);
        console.log('');
        console.log('🔄 Please refresh the Asset Management page to see the updated values!');

        // Show alert
        alert(`✅ Migration Complete!\n\nUpdated ${updatedCount} items to quantity = 1\n\nPlease refresh the page to see the updated total values.`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        alert('❌ Migration failed. Check console for details.');
    }
})();
