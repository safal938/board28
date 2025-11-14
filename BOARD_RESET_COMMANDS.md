# Board Reset Commands

## Quick Reference

### 1. Reset Board via UI
Click the **X button** (bottom right) in the canvas interface.

**What it does:**
- Deletes all dynamic items (todos, notes, images, agent results)
- Keeps static items (raw EHR data, single encounters)
- Resets EASL conversation history
- **Reloads Redis from static file** (resets all positions to default)
- All connected clients refresh automatically via SSE

### 2. Reset Redis via Command Line

```bash
curl -X POST http://localhost:3001/api/reload-board-items
```
curl -X POST https://board-v26.vercel.app/api/reload-board-items

**What it does:**
- Loads items from `api/data/boardItems.json`
- Overwrites Redis with static data
- Broadcasts `board-reloaded` SSE event
- All connected browser tabs refresh automatically

**Pretty output:**
```bash
curl -X POST http://localhost:3001/api/reload-board-items -s | python3 -c "import sys, json; data = json.load(sys.stdin); print(f\"✅ {data.get('message', 'Done')}\"); print(f\"📊 Loaded {data.get('itemCount', 0)} items\")"
```

### 3. Using the Script

```bash
./reset-board.sh
```

This runs the same command as #2 with formatted output.

## When to Use Each Method

### Use UI Reset Button When:
- You want to clear all dynamic items AND reset positions
- You want a complete board reset to default state
- You're testing and want a fresh start

### Use Command Line When:
- You've manually edited `api/data/boardItems.json`
- You want to reload positions without deleting items
- You're scripting or automating board updates
- Server is running but UI is not accessible

## What Gets Reset

### UI Reset Button (X):
- ✅ Deletes dynamic items (todos, notes, images)
- ✅ Resets EASL chat history
- ✅ Reloads Redis from static file
- ✅ Resets all item positions to default
- ✅ Keeps static items (raw data, encounters)

### Command Line Reset:
- ✅ Reloads Redis from static file
- ✅ Resets all item positions to default
- ❌ Does NOT delete items
- ❌ Does NOT reset EASL history

## Technical Details

### Static File Location
- **Backend reads from:** `api/data/boardItems.json`
- **Frontend imports from:** `src/data/boardItems.json`

### Redis Key
- **Key name:** `boardItems`
- **Format:** JSON string array

### SSE Events
- **board-reloaded:** Triggers automatic page refresh in all clients
- **item-updated:** Real-time position updates when dragging

## Troubleshooting

### Positions not resetting?
1. Check if Redis is connected: Look for `✅ Redis connected` in server logs
2. Verify static file exists: `ls -la api/data/boardItems.json`
3. Check server logs for errors during reload

### Clients not refreshing?
1. Check SSE connection: Look for `📡 SSE client connected` in server logs
2. Verify browser console shows: `🔄 Board reloaded event received`
3. Check if SSE endpoint is accessible: `curl http://localhost:3001/api/events`

### Items still showing old positions?
1. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Check if API is returning updated data: `curl http://localhost:3001/api/board-items | grep '"x"'`
