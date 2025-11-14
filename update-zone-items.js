const fs = require('fs');

// Read the board items
const boardItems = JSON.parse(fs.readFileSync('api/data/boardItems.json', 'utf8'));

// Zone configurations (old and new X positions)
const zoneUpdates = {
  'adv-event-zone': { oldX: 0, newX: -1250, yMin: 3500, yMax: 5800 },
  'dili-analysis-zone': { oldX: 0, newX: -1250, yMin: 6000, yMax: 12000 },
  'data-zone': { oldX: -500, newX: -1500, yMin: 500, yMax: 2000 }
};

// Update items in each zone
boardItems.forEach(item => {
  for (const [zoneName, config] of Object.entries(zoneUpdates)) {
    if (item.y >= config.yMin && item.y < config.yMax) {
      // Calculate offset
      const offset = config.newX - config.oldX;
      
      // Update X position
      const oldX = item.x;
      item.x = item.x + offset;
      
      console.log(`Updated ${item.id} in ${zoneName}: x ${oldX} → ${item.x} (offset: ${offset})`);
      break;
    }
  }
});

// Write back
fs.writeFileSync('api/data/boardItems.json', JSON.stringify(boardItems, null, 2));
console.log('\n✅ Updated api/data/boardItems.json');
