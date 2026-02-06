# Betting Tracker PWA - Updated Version

A Progressive Web App for tracking cricket and tennis bets with creator-only posting and public viewing.

## 🎉 FIXES IMPLEMENTED

### ✅ Issue 1: Password Persists After Refresh
**Problem:** Password was required every time the page refreshed.
**Solution:** Authentication state is now saved to localStorage and persists across sessions. Once logged in as creator, you'll stay logged in until you manually logout.

### ✅ Issue 2: PWA Works When Installed
**Problem:** App wasn't working when installed on home screen.
**Solution:** Created proper PWA files (manifest.json, service-worker.js, and app icons). The app now works perfectly when installed on your home screen.

### ✅ Issue 3: Public Viewing Experience
**Problem:** Everyone saw the creator password prompt.
**Solution:** Completely redesigned the interface:
- **Public viewers** see only today's bets (no password prompt at all!)
- **Creators** can access a small "🔒 Creator Login" button in the bottom-right corner
- Clean, distraction-free experience for public viewers

## Features

- 📱 **PWA** - Works offline, installable on mobile and desktop
- 🔒 **Creator Access** - Password-protected posting (default: `admin123`)
- 👁️ **Public Viewing** - Anyone can view bets without seeing any login prompts
- 📊 **Statistics Dashboard** - Weekly, monthly, and all-time stats (creator only)
- 🏏 **Cricket & Tennis** - Support for both sports
- ₹ **Rupee Currency** - All amounts in Indian Rupees
- 📅 **Daily View** - Shows only today's bets to all users
- 💾 **Persistent Login** - Stay logged in across page refreshes

## Installation

### Option 1: Deploy to a Web Server

1. Upload ALL 5 files to your web server:
   - `index.html`
   - `manifest.json`
   - `service-worker.js`
   - `icon-192.png`
   - `icon-512.png`

2. Access via HTTPS (required for PWA features)
3. Users can install the app from their browser

### Option 2: Local Testing

1. Install a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # OR using Python 2
   python -m SimpleHTTPServer 8000
   
   # OR using Node.js
   npx http-server -p 8000
   
   # OR using PHP
   php -S localhost:8000
   ```

2. Place all 5 files in the same folder
3. Open browser and go to `http://localhost:8000`

## How to Use

### For Public Viewers (Everyone)
1. Open the app URL
2. View today's bets immediately (no login required!)
3. See live updates when the creator adds new bets
4. Install on home screen for quick access

### For Creator (Add/Edit Bets)
1. Click the "🔒 Creator Login" button in the bottom-right corner
2. Enter password (default: `admin123`)
3. Click "Add New Bet" to add bets
4. Click "View Stats" to see detailed statistics
5. Update bet outcomes (Pending/Won/Lost)
6. Delete bets as needed
7. You'll stay logged in even after refreshing!

## Installing as PWA

### On Mobile (Android)
1. Open the app in Chrome
2. Tap the menu button (⋮)
3. Select "Add to Home Screen" or "Install App"
4. The app will appear as an icon on your home screen
5. Open it like any other app!

### On Mobile (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"
5. The app appears on your home screen

### On Desktop (Chrome/Edge)
1. Open the app in browser
2. Click the install icon (➕) in the address bar
3. Click "Install"
4. The app opens as a standalone window

## Changing the Creator Password

1. Open `index.html` in a text editor
2. Find line 61: `const DEFAULT_PASSWORD = 'admin123';`
3. Change `'admin123'` to your desired password
4. Save the file
5. Re-upload to your server

**Note:** Existing logged-in creators will remain logged in. If you want to force re-login, they should click the Logout button first.

## File Structure

```
betting-tracker-pwa/
├── index.html          - Main HTML file (contains all code)
├── manifest.json       - PWA manifest
├── service-worker.js   - Offline functionality
├── icon-192.png        - App icon (192x192)
├── icon-512.png        - App icon (512x512)
└── README.md           - This file
```

## Features Detail

### Statistics Dashboard (Creator Only)
- **Last 7 Days**: Weekly performance metrics
- **Last 30 Days**: Monthly performance metrics
- **All Time**: Complete historical data
- **Sport Breakdown**: Separate stats for Cricket and Tennis
- **Metrics**: Win Rate %, ROI %, Profit/Loss in ₹

### Daily Bets View
- Only shows bets placed today
- Refreshes automatically each day
- Historical bets are preserved but not displayed to regular users
- Creator can still view all stats in the statistics dashboard

### Creator Controls
- Stays logged in across page refreshes and app restarts
- Discrete login button doesn't interfere with public viewing
- Full control over all bets and statistics

## Data Storage

All data is stored in the browser's localStorage:
- **Shared Storage**: All bets visible to all users on the same device/browser
- **Persistent**: Data survives browser restarts
- **Local**: No external database required
- **Per-Device**: Each device/browser has its own data
- **Authentication Persists**: Login state saved locally

## Troubleshooting

### Icons not showing
- Make sure `icon-192.png` and `icon-512.png` are in the same folder as `index.html`
- Clear browser cache and refresh

### Service Worker not registering
- PWA features require HTTPS (except on localhost)
- Check browser console for errors
- Make sure `service-worker.js` is in the same folder

### Password not working
- Default password is `admin123`
- Check if you modified the password correctly in `index.html` line 61
- Password is case-sensitive

### Logged out after refresh (OLD ISSUE - NOW FIXED!)
- ✅ This issue is now fixed! You'll stay logged in.
- If you still experience this, clear browser cache and try again

### Data not persisting
- Make sure JavaScript is enabled
- Check if localStorage is enabled in browser
- Try a different browser
- Some private/incognito modes may not save data

### App not installing
- Requires HTTPS connection (except localhost)
- Make sure all 5 files are uploaded
- All files must be in the same directory
- Try refreshing the page
- Check if manifest.json is accessible

### Public viewers see login prompt (OLD ISSUE - NOW FIXED!)
- ✅ This issue is now fixed! Public viewers won't see any login prompt.
- The creator login button is in the bottom-right corner

## Security Notes

- Password is stored in the HTML file (simple but not ultra-secure)
- For better security, consider implementing server-side authentication
- This is designed for small, trusted user groups
- Don't use for handling sensitive financial data

## Technical Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- HTTPS connection for full PWA features (not required for local testing)
- JavaScript enabled
- No backend required - uses browser localStorage

Enjoy tracking your bets! 🎯
