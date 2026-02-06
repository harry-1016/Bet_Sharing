# Betting Tracker PWA

A Progressive Web App for tracking cricket and tennis bets with creator-only posting and public viewing.

## Features

- 📱 **PWA** - Works offline, installable on mobile and desktop
- 🔒 **Creator Access** - Password-protected posting (default: `admin123`)
- 👁️ **Public Viewing** - Anyone can view bets without password
- 📊 **Statistics Dashboard** - Weekly, monthly, and all-time stats (creator only)
- 🏏 **Cricket & Tennis** - Support for both sports
- ₹ **Rupee Currency** - All amounts in Indian Rupees
- 📅 **Daily View** - Shows only today's bets to all users

## Installation

### Option 1: Deploy to a Web Server

1. Extract all files from the zip
2. Upload all files to your web server
3. Access via HTTPS (required for PWA features)
4. Users can install the app from their browser

### Option 2: Local Testing

1. Extract all files from the zip
2. Install a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # OR using Node.js
   npx http-server -p 8000
   ```
3. Open browser and go to `http://localhost:8000`

## Changing the Creator Password

1. Open `app.jsx` in a text editor
2. Find line 18: `const DEFAULT_PASSWORD = 'admin123';`
3. Change `'admin123'` to your desired password
4. Save the file
5. Re-upload to your server (or refresh if testing locally)

## File Structure

```
betting-tracker-pwa/
├── index.html          - Main HTML file
├── app.jsx            - React application (change password here)
├── manifest.json      - PWA manifest
├── service-worker.js  - Offline functionality
├── icon-192.png       - App icon (192x192)
├── icon-512.png       - App icon (512x512)
└── README.md          - This file
```

## How to Use

### For Viewers (Everyone)
1. Open the app URL
2. View today's bets and statistics
3. No password needed

### For Creator (Add/Edit Bets)
1. Enter the creator password (default: `admin123`)
2. Click "Add New Bet" to add bets
3. Click "View Stats" to see detailed statistics
4. Update bet outcomes (Pending/Won/Lost) by changing the dropdown

## Installing as PWA

### On Mobile (Android/iOS)
1. Open the app in Chrome/Safari
2. Tap the menu button (⋮ or share icon)
3. Select "Add to Home Screen"
4. The app will appear as an icon on your home screen

### On Desktop (Chrome/Edge)
1. Open the app in browser
2. Click the install icon (➕) in the address bar
3. Click "Install"
4. The app opens as a standalone window

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
- Historical bets are preserved but not displayed
- Creator can still view all stats

## Support

Default password: `admin123`  
Change password in: `app.jsx` line 18

## Technical Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- HTTPS connection for full PWA features
- JavaScript enabled
- No backend required - uses browser storage

## Data Storage

All data is stored in the browser's storage API:
- **Shared Storage**: All bets visible to all users
- **Persistent**: Data survives browser restarts
- **Local**: No external database required

Enjoy tracking your bets! 🎯
