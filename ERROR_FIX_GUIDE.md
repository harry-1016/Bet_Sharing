# 🔧 ERROR FIX - "functions.firestore.document is not a function"

## What Happened

You got this error:
```
TypeError: functions.firestore.document is not a function
```

This is because the original code used **Firebase Functions v1 syntax**, but the newer Firebase SDK requires **v2 syntax**.

---

## ✅ FIXED! Here's What to Do:

### Option 1: Quick Fix (Recommended)

1. **Delete the functions folder**
   ```bash
   cd c:\betting-tracker-complete
   rmdir /s functions
   ```

2. **Extract the NEW fixed files from the ZIP again**
   - The new ZIP I'm providing has the corrected code

3. **Reinstall dependencies**
   ```bash
   cd functions
   npm install
   cd ..
   ```

4. **Deploy again**
   ```bash
   firebase deploy --only functions
   ```

---

### Option 2: Manual Fix (If You Want to Update Yourself)

Replace your `functions/index.js` with the corrected version.

**Key Changes Made:**

**OLD (v1 syntax):**
```javascript
const functions = require('firebase-functions');

exports.sendPushNotifications = functions.firestore
  .document('push_queue/{queueId}')
  .onCreate(async (snap, context) => {
    // ...
  });
```

**NEW (v2 syntax):**
```javascript
const {onDocumentCreated} = require('firebase-functions/v2/firestore');

exports.sendPushNotifications = onDocumentCreated('push_queue/{queueId}', async (event) => {
    const snap = event.data;
    // ...
});
```

**Also update `functions/package.json`:**
```json
{
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0"
  }
}
```

---

## 🚀 Quick Steps to Fix NOW:

```bash
# 1. Navigate to your project
cd c:\betting-tracker-complete

# 2. Go to functions folder
cd functions

# 3. Clean install
rmdir /s node_modules
del package-lock.json

# 4. Install correct versions
npm install firebase-admin@12.0.0 firebase-functions@5.0.0

# 5. Go back
cd ..

# 6. Deploy
firebase deploy --only functions
```

---

## ✅ Verification

After deploying, you should see:

```
✔  functions[sendPushNotifications(us-central1)] Successful create operation.
✔  functions[notifyOnNewBet(us-central1)] Successful create operation.
✔  functions[notifyOnBetUpdate(us-central1)] Successful create operation.
✔  functions[cleanupOldNotifications(us-central1)] Successful create operation.
✔  functions[cleanupOldBets(us-central1)] Successful create operation.

✔  Deploy complete!
```

---

## 🎯 What Changed in the Fixed Version

1. **Import statements** - Now using v2 syntax
2. **Function triggers** - Updated to `onDocumentCreated`, `onDocumentUpdated`, `onSchedule`
3. **Event handling** - Changed from `(snap, context)` to `(event)` with `event.data` and `event.params`
4. **Package versions** - Updated to latest compatible versions

---

## ❓ Why This Error Happened

Firebase released Cloud Functions v2 which has a different API. The old syntax (`functions.firestore.document`) was deprecated. The new syntax is cleaner and more modern.

---

## 🎉 Success Checklist

After the fix:
- [ ] No more "is not a function" error
- [ ] All 5 functions deploy successfully
- [ ] Functions show as "Active" in Firebase Console
- [ ] Test notification works

---

## 🆘 Still Having Issues?

If you still get errors:

1. **Completely delete functions folder**
2. **Re-extract from the NEW ZIP file I'm providing**
3. **Run deployment script:**
   ```bash
   deploy.bat
   ```

---

**The new ZIP file has all the fixes. Just extract and deploy!** 🚀
