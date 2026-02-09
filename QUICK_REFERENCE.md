# 📋 Quick Reference Card

## 🚀 Local Testing (No Setup Required)

```bash
# Start local server
python -m http.server 8000
# OR
npx http-server -p 8000

# Open browser
http://localhost:8000
```

**What works locally:**
- ✅ View bets
- ✅ Add/update bets (admin)
- ✅ In-app messages
- ✅ Foreground notifications

---

## ☁️ Deploy Cloud Functions (Full Push)

### Prerequisites
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Verify
firebase projects:list
```

### Quick Deploy
```bash
# Linux/Mac
./deploy.sh

# Windows  
deploy.bat

# Manual
cd functions && npm install && cd ..
firebase deploy --only firestore,functions
```

### What Cloud Functions Add
- ✅ Background push (app closed)
- ✅ Auto-notify on new bet
- ✅ Auto-notify on bet update
- ✅ Auto cleanup (30/90 days)

---

## 🔧 Common Commands

### View Logs
```bash
firebase functions:log
firebase functions:log --only sendPushNotifications
firebase functions:log --follow
```

### Update Functions
```bash
# After editing functions/index.js
firebase deploy --only functions

# Specific function
firebase deploy --only functions:sendPushNotifications
```

### Delete Function
```bash
firebase functions:delete functionName
```

---

## 🧪 Testing Push

1. **Enable in public.html**
   - Open public.html
   - Click "Enable" on banner
   - Allow notifications

2. **Send from admin.html**
   - Login (password: Hari@1016)
   - Notifications tab
   - Send with "Push" checked

3. **Verify**
   - Close public.html tab
   - Should still receive notification!

---

## 📊 Monitor Usage

**Firebase Console:**
- https://console.firebase.google.com
- Project: bet-sharing
- Functions → View metrics
- Firestore → View data

**Check costs:**
- Functions → Usage
- Free tier: 2M invocations/month
- Typical usage: ~1,000/month = $0

---

## 🐛 Troubleshooting

### "Billing not enabled"
→ Upgrade to Blaze plan in Firebase Console

### "Permission denied"  
→ `firebase login --reauth`

### "Functions not deploying"
→ `cd functions && rm -rf node_modules && npm install`

### "No notifications"
→ Check: Firebase Console → Functions (all Active?)
→ Check: Firestore → fcm_tokens (any tokens?)
→ Check: `firebase functions:log` (errors?)

### "VAPID key error"
→ Already handled! Works without VAPID
→ In-app notifications still work

---

## 📁 File Structure

```
betting-tracker/
├── index.html              # Landing page
├── public.html             # User view (with push)
├── admin.html              # Admin panel
├── firebase-messaging-sw.js # Push worker
├── service-worker.js       # PWA worker
├── manifest.json           # App manifest
├── firebase.json           # Firebase config
├── .firebaserc             # Project config
├── firestore.rules         # Security rules
├── firestore.indexes.json  # DB indexes
├── deploy.sh / .bat        # Deploy scripts
├── README.md               # Full docs
├── DEPLOYMENT_GUIDE.md     # Detailed guide
└── functions/
    ├── package.json        # Dependencies
    └── index.js            # Cloud Functions
```

---

## 🎯 Quick Tips

1. **Test locally first** before deploying
2. **Use deployment scripts** (deploy.sh/bat)
3. **Monitor function logs** regularly
4. **Check Firebase Console** for errors
5. **Enable billing** before deploying functions
6. **Read DEPLOYMENT_GUIDE.md** for details

---

## 🔗 Useful Links

- Firebase Console: https://console.firebase.google.com
- Project: bet-sharing
- Functions: https://console.firebase.google.com/project/bet-sharing/functions
- Firestore: https://console.firebase.google.com/project/bet-sharing/firestore
- Firebase Docs: https://firebase.google.com/docs

---

## 💡 Remember

- **Local testing** = Free, works immediately
- **Cloud Functions** = Optional, for full push
- **Blaze plan** = Required for functions, but likely $0/month
- **In-app messages** = Always work without Cloud Functions

---

**Need help?** Check DEPLOYMENT_GUIDE.md for detailed instructions!
