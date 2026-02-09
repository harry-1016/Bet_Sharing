# 🚀 Firebase Cloud Functions Deployment Guide

## Complete Setup for Push Notifications

This guide will help you deploy Firebase Cloud Functions to enable **full background push notifications** for your betting tracker.

---

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Firebase CLI** installed
3. **Google account** with access to Firebase project
4. **Billing enabled** on Firebase (required for Cloud Functions)

---

## 🔧 Step-by-Step Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window to authenticate with your Google account.

### Step 3: Navigate to Project Directory

```bash
cd path/to/your/betting-tracker
```

The folder should contain:
- `functions/` directory
- `firebase.json`
- `.firebaserc`

### Step 4: Install Dependencies

```bash
cd functions
npm install
cd ..
```

This installs:
- `firebase-admin` - Firebase Admin SDK
- `firebase-functions` - Cloud Functions SDK

### Step 5: Enable Billing (Required)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **bet-sharing**
3. Click "Upgrade" in the left sidebar
4. Choose **Blaze (Pay as you go)** plan
5. Add a payment method

**Note:** Cloud Functions has a generous free tier:
- 2M invocations/month free
- 400,000 GB-seconds free
- Your usage will likely stay within free tier

### Step 6: Deploy Firestore Rules & Indexes

```bash
firebase deploy --only firestore
```

This sets up:
- ✅ Security rules (who can read/write)
- ✅ Database indexes (for fast queries)

### Step 7: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

This deploys 5 functions:
1. **sendPushNotifications** - Main push notification sender
2. **cleanupOldNotifications** - Auto-cleanup (runs daily)
3. **cleanupOldBets** - Auto-cleanup (runs daily)
4. **notifyOnNewBet** - Auto-notify when bet is added
5. **notifyOnBetUpdate** - Auto-notify when bet outcome changes

**First deployment takes 3-5 minutes**

### Step 8: Verify Deployment

Check the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **bet-sharing** project
3. Click **Functions** in left menu
4. You should see all 5 functions listed as "Active"

---

## 🧪 Testing Push Notifications

### Test 1: Manual Push via Admin Panel

1. Open `public.html` in browser
2. Click "Enable" on notification banner
3. Allow notifications
4. Open `admin.html` in another tab/window
5. Login with password: `Hari@1016`
6. Go to **Notifications** tab
7. Click "📢 Send Notification"
8. Fill in:
   - Title: "Test Push"
   - Message: "Testing background notifications"
   - Type: Info
   - ✅ Keep "Send as Push Notification" checked
9. Click "Send to All Users"

**Expected Result:**
- You should receive a notification even if you close the `public.html` tab!

### Test 2: Auto-notification on New Bet

1. Login to admin panel
2. Add a new bet
3. All users with notifications enabled receive instant push

### Test 3: Auto-notification on Bet Update

1. Update any bet outcome (Won/Lost/Void)
2. All users receive instant update notification

---

## 📊 Cloud Functions Explained

### 1. sendPushNotifications (Main Function)

**Trigger:** New document in `push_queue` collection

**What it does:**
1. Reads the push queue item
2. Gets all FCM tokens
3. Sends multicast notification to all devices
4. Removes invalid/expired tokens
5. Deletes queue item when done

**How admin uses it:**
- Admin sends notification with push enabled
- Notification saved to `notifications` collection
- Push queued in `push_queue` collection
- Function triggers automatically
- Users receive push notification

### 2. cleanupOldNotifications

**Trigger:** Every 24 hours (scheduled)

**What it does:**
- Deletes notifications older than 30 days
- Keeps database clean
- Reduces storage costs

### 3. cleanupOldBets

**Trigger:** Every 24 hours (scheduled)

**What it does:**
- Deletes bets older than 90 days
- Keeps database lean
- Historical data can be exported before deletion

### 4. notifyOnNewBet (Auto-notification)

**Trigger:** New document in `bets` collection

**What it does:**
- Automatically sends push when admin adds new bet
- Title: "🎯 New Bet Added!"
- Body: Shows match, bet details, stake, odds

**Example:**
```
🎯 New Bet Added!
India vs Australia - India to win (₹5,000 @ 1.85)
```

### 5. notifyOnBetUpdate (Auto-notification)

**Trigger:** Document update in `bets` collection

**What it does:**
- Automatically sends push when bet outcome changes
- Only triggers on outcome changes (pending → won/lost/void)
- Shows profit/loss

**Examples:**
```
🎉 Bet Won!
India vs Australia - WON (+₹4,250)

😢 Bet Lost
England vs Pakistan - LOST (-₹3,000)

🔄 Bet Void
Rain-affected match - VOID (₹0)
```

---

## 💰 Cost Estimation

### Free Tier (Spark Plan)
- ❌ Cloud Functions not available

### Blaze Plan (Pay as you go)

**Free quota every month:**
- 2,000,000 function invocations
- 400,000 GB-seconds of compute time
- 200,000 CPU-seconds
- 5GB outbound networking

**Estimated usage for betting tracker:**
- ~100 notifications/month = 100 invocations
- Each notification to 10 users = 10 multicast sends
- Total: ~1,000 invocations/month

**Cost: $0/month** (well within free tier)

**When you might get charged:**
- If you send 100+ notifications per day
- Each notification goes to 100+ users
- Even then: ~$0.10-$0.50/month

---

## 🔧 Configuration Options

### Disable Auto-notifications

If you don't want automatic notifications on bet add/update, edit `functions/index.js`:

**Comment out these exports:**
```javascript
// exports.notifyOnNewBet = functions.firestore...
// exports.notifyOnBetUpdate = functions.firestore...
```

Then redeploy:
```bash
firebase deploy --only functions
```

### Adjust Cleanup Schedules

Edit `functions/index.js`:

**Change from 24 hours to weekly:**
```javascript
exports.cleanupOldNotifications = functions.pubsub
  .schedule('every sunday 00:00')  // Weekly on Sunday midnight
  .onRun(async (context) => {
```

**Change retention period:**
```javascript
// Keep for 60 days instead of 30
const sixtyDaysAgo = new Date();
sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
```

### Add Custom Functions

You can add more functions to `functions/index.js`:

**Example: Daily summary notification**
```javascript
exports.sendDailySummary = functions.pubsub
  .schedule('every day 20:00')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    // Get today's bets
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const bets = await admin.firestore()
      .collection('bets')
      .where('timestamp', '>=', today)
      .get();
    
    const stats = {
      total: bets.size,
      won: 0,
      lost: 0,
      profit: 0
    };
    
    bets.forEach(doc => {
      const bet = doc.data();
      if (bet.outcome === 'won') stats.won++;
      if (bet.outcome === 'lost') stats.lost++;
      stats.profit += bet.profit || 0;
    });
    
    // Send notification
    const tokensSnapshot = await admin.firestore()
      .collection('fcm_tokens')
      .get();
    
    if (tokensSnapshot.empty) return null;
    
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
    
    const message = {
      notification: {
        title: '📊 Daily Summary',
        body: `${stats.total} bets | ${stats.won}W ${stats.lost}L | ${stats.profit >= 0 ? '+' : ''}₹${stats.profit}`
      },
      tokens: tokens
    };
    
    return admin.messaging().sendMulticast(message);
  });
```

---

## 🐛 Troubleshooting

### "Billing account not configured"

**Solution:**
1. Go to Firebase Console
2. Upgrade to Blaze plan
3. Add payment method

### "Permission denied"

**Solution:**
```bash
firebase login --reauth
```

### "Functions not deploying"

**Solution:**
```bash
cd functions
rm -rf node_modules
npm install
cd ..
firebase deploy --only functions
```

### "Push notifications not sending"

**Check:**
1. Functions deployed? Check Firebase Console → Functions
2. Tokens registered? Check Firestore → fcm_tokens collection
3. Function logs: `firebase functions:log`

**View logs:**
```bash
firebase functions:log --only sendPushNotifications
```

### "Invalid token" errors in logs

This is normal! The function automatically removes invalid tokens. Users may have:
- Uninstalled the app
- Cleared browser data
- Changed devices

---

## 📈 Monitoring

### View Function Logs

```bash
# All functions
firebase functions:log

# Specific function
firebase functions:log --only sendPushNotifications

# Live tail
firebase functions:log --follow
```

### Firebase Console

Go to: [Firebase Console → Functions](https://console.firebase.google.com)

View:
- Invocation count
- Execution time
- Error rate
- Resource usage

---

## 🔄 Updating Functions

When you modify `functions/index.js`:

```bash
firebase deploy --only functions
```

To update specific function:
```bash
firebase deploy --only functions:sendPushNotifications
```

---

## 🗑️ Deleting Functions

Remove a function from code, then:

```bash
firebase deploy --only functions
firebase functions:delete functionName
```

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed
- [ ] Logged into Firebase
- [ ] Blaze plan enabled
- [ ] `functions/package.json` exists
- [ ] `functions/index.js` exists
- [ ] `firebase.json` configured

Deploy:
```bash
cd your-project-directory
firebase deploy --only firestore  # Deploy rules & indexes
firebase deploy --only functions  # Deploy cloud functions
```

Verify:
- [ ] Functions show as "Active" in console
- [ ] Test notification works
- [ ] Check logs for errors

---

## 🎉 You're Done!

Your betting tracker now has:
- ✅ Real background push notifications
- ✅ Auto-notifications on new bets
- ✅ Auto-notifications on bet updates
- ✅ Automatic cleanup
- ✅ Invalid token management

Users will receive notifications even when:
- App is closed
- Browser is minimized
- Phone is locked

**Test it now and enjoy full push notifications!** 🚀
