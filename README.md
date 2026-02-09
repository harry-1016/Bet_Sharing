# 🎯 Betting Tracker - With Push Notifications

## ✨ What's New in This Version

**🔔 Push Notifications Feature Added!**
- ✅ Admin can send notifications to all users
- ✅ Notifications appear in public view as messages
- ✅ Browser push notification support
- ✅ Notification history tracking
- ✅ Multiple notification types (info, bet, win, loss, update, warning)
- ✅ Real-time message display

## 🚀 Quick Start

### Step 1: Download Files

Download all these files to a folder:
- index.html
- public.html
- admin.html
- service-worker.js
- manifest.json
- manifest-admin.json
- icon-192.png
- icon-512.png

### Step 2: Test Locally

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Option 3: PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

### Step 3: Use the App

1. **Public View** (`public.html`):
   - Click "Enable Notifications" button
   - Allow notification permission
   - View today's bets and messages
   - Get real-time updates

2. **Admin Panel** (`admin.html`):
   - Login with password: `Hari@1016`
   - Switch between "Bets" and "Notifications" tabs
   - Send notifications to all users
   - Manage bets as before

## 📢 How Notifications Work

### Sending a Notification (Admin)

1. Login to admin panel
2. Click "Notifications" tab
3. Click "📢 Send Notification"
4. Fill in:
   - **Title**: Short notification title (e.g., "Big Win!")
   - **Message**: Detailed message (e.g., "India vs Australia bet won!")
   - **Type**: Choose from info, bet, win, loss, update, warning
5. Click "Send to All Users"

### Receiving Notifications (Public)

**In-App Messages:**
- Messages automatically appear in the "📬 Messages" section
- Shows recent 10 notifications
- Displays time ago (e.g., "2m ago", "1h ago")
- Color-coded by type

**Browser Notifications:**
- Click "🔔 Enable Notifications" in public view
- Allow browser permission
- Receive push notifications even when page is closed (if browser supports)

## 🎨 Notification Types

| Type | Icon | Use Case |
|------|------|----------|
| Info | 📢 | General announcements |
| Bet | 🎯 | New bet updates |
| Win | 🎉 | Winning bets |
| Loss | 😢 | Lost bets |
| Update | 🔄 | Status updates |
| Warning | ⚠️ | Important alerts |

## 📁 Files Explained

### Updated Files

**service-worker.js**
- Handles push notifications
- Manages notification display
- Caches app files for offline use

**public.html**
- Added notification permission button
- Added messages section
- Firebase messaging support
- Real-time notification listener

**admin.html**
- Added "Notifications" tab
- Send notification form
- Notification history view
- Delete notifications option

**manifest.json**
- Added FCM sender ID for notifications
- Updated for better PWA support

## 🔧 Configuration

### Change Admin Password

Edit `admin.html`, find:
```javascript
const ADMIN_PASSWORD = 'Hari@1016';
```
Change to your password.

### Firebase Setup

The app is already configured with your Firebase project:
- Project ID: `bet-sharing`
- Messaging Sender ID: `21069245479`

**New Collections:**
- `bets` - Stores all bets (existing)
- `notifications` - Stores sent notifications (NEW)

## 🌐 Deploy to Web

### Option 1: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Select your project: bet-sharing
# Public directory: . (current directory)
# Single-page app: No
# Deploy
firebase deploy
```

### Option 2: Netlify

1. Drag & drop all files to netlify.com/drop
2. Get instant URL
3. Share with users

### Option 3: Vercel / GitHub Pages

Upload all files to your hosting provider.

## 📱 How Users Enable Notifications

### Desktop (Chrome, Edge, Firefox)

1. Visit public view page
2. Click "🔔 Enable Notifications"
3. Click "Allow" in browser popup
4. Done! Will receive notifications

### Mobile (Android)

1. Visit public view page
2. Click "🔔 Enable Notifications"
3. Allow notification permission
4. Add to Home Screen for best experience

### Mobile (iOS Safari)

**Note:** iOS Safari has limited notification support
- Messages will still appear in the app
- Browser push notifications may not work
- Best to use the in-app messages feature

## 🎯 Usage Examples

### Example 1: New Bet Alert

**Admin sends:**
- Title: "New Bet Placed"
- Message: "India vs Australia - India to win at 2.50 odds"
- Type: Bet

**Public users see:**
- In-app message with 🎯 icon
- Browser notification (if enabled)

### Example 2: Bet Result

**Admin sends:**
- Title: "Bet Won! 🎉"
- Message: "India vs Australia bet successful! Profit: ₹5,000"
- Type: Win

**Public users see:**
- In-app message with 🎉 icon
- Celebratory browser notification

### Example 3: General Update

**Admin sends:**
- Title: "Today's Summary"
- Message: "3 bets placed today. Total stake: ₹10,000"
- Type: Info

**Public users see:**
- In-app message with 📢 icon
- Information notification

## 🐛 Troubleshooting

### Notifications Not Appearing

**Check:**
1. Browser notification permission granted?
2. Service worker registered? (Check console)
3. Firebase connection working?
4. In incognito/private mode? (May block notifications)

**Solutions:**
- Refresh the page
- Clear browser cache
- Check browser notification settings
- Try different browser

### In-App Messages Not Showing

**Check:**
1. Internet connection active?
2. Firebase initialized? (Check console for ✅)
3. Notifications collection has data?

**Solutions:**
- Check browser console for errors
- Verify Firebase credentials
- Check Firestore rules

### Can't Send Notifications (Admin)

**Check:**
1. Logged in as admin?
2. Form filled completely?
3. Internet connection active?

**Solutions:**
- Re-login
- Check all required fields
- Check Firebase connection

## 🔐 Security Notes

1. **Admin password** is stored in client-side code
   - For production, use proper authentication
   - Consider Firebase Auth for better security

2. **Firestore Rules** - Make sure you set:
```javascript
// Allow read for everyone
// Allow write only for authenticated admins
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bets/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /notifications/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📊 Statistics

**Admin Dashboard Shows:**
- Total Bets
- Won Bets
- Lost Bets
- Win Rate %
- Total Profit/Loss
- **Notifications Sent (NEW)**

## 🎨 Customization

### Change Notification Colors

Edit CSS in `public.html`:
```css
.notification-card {
    background: /* your gradient */;
    border: /* your color */;
}
```

### Change Notification Icons

Edit `public.html`, find `getNotificationIcon()`:
```javascript
const icons = {
    'info': '📢',  // Change these
    'bet': '🎯',
    'win': '🎉',
    // ... etc
};
```

### Add Custom Notification Types

1. Add option in admin.html select
2. Add icon in public.html getNotificationIcon()
3. Add styling if needed

## 💡 Tips

1. **Test notifications** before sharing with users
2. **Keep messages short** - they display better
3. **Use types meaningfully** - helps users understand context
4. **Don't spam** - too many notifications annoy users
5. **Check history** - see what was sent and when

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify all files are uploaded
3. Check Firebase connection
4. Try different browser

## 🎉 Features Summary

### Public View Features
- ✅ View today's bets
- ✅ Real-time updates
- ✅ Enable push notifications
- ✅ See in-app messages
- ✅ Filter notifications by type
- ✅ Time-stamped messages

### Admin Panel Features
- ✅ Add/edit/delete bets
- ✅ Update bet outcomes
- ✅ Send notifications to all users
- ✅ View notification history
- ✅ Delete sent notifications
- ✅ Statistics dashboard
- ✅ Two-tab interface

## 🚀 Next Steps

1. Test locally ✓
2. Enable notifications ✓
3. Send test notification ✓
4. Deploy to web hosting
5. Share public URL with users
6. Start tracking bets!

---

**Made with ❤️ - Now with Real-Time Notifications! 📢**

Version 2.0 - Notification Update
