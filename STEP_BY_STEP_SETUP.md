# 🔥 Firebase Cloud Functions Setup - Step by Step

## Complete Guide from Zero to Deployed

This guide assumes you're starting from scratch. Follow every step carefully.

---

## 📋 Table of Contents

1. [Prerequisites Check](#step-1-prerequisites-check)
2. [Install Node.js](#step-2-install-nodejs)
3. [Install Firebase CLI](#step-3-install-firebase-cli)
4. [Login to Firebase](#step-4-login-to-firebase)
5. [Verify Your Project](#step-5-verify-your-project)
6. [Enable Billing](#step-6-enable-billing)
7. [Extract & Prepare Files](#step-7-extract--prepare-files)
8. [Install Dependencies](#step-8-install-dependencies)
9. [Deploy Firestore Rules](#step-9-deploy-firestore-rules)
10. [Deploy Cloud Functions](#step-10-deploy-cloud-functions)
11. [Verify Deployment](#step-11-verify-deployment)
12. [Test Push Notifications](#step-12-test-push-notifications)
13. [Troubleshooting](#troubleshooting)

---

## Step 1: Prerequisites Check

### What You Need:
- ✅ A computer (Windows, Mac, or Linux)
- ✅ Internet connection
- ✅ Google account
- ✅ 15-20 minutes

### What You'll Install:
- Node.js 18 or higher
- Firebase CLI (Command Line Interface)

---

## Step 2: Install Node.js

### For Windows:

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Click the **LTS** (Long Term Support) button
   - Download will start (approximately 50 MB)

2. **Install Node.js**
   - Run the downloaded `.msi` file
   - Click "Next" through all screens
   - Accept the defaults
   - Click "Install"
   - Wait 2-3 minutes
   - Click "Finish"

3. **Verify Installation**
   - Press `Windows + R`
   - Type `cmd` and press Enter
   - Type: `node --version`
   - Should show: `v18.x.x` or higher
   - Type: `npm --version`
   - Should show: `9.x.x` or higher

### For Mac:

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Click the **LTS** button
   - Download the `.pkg` file

2. **Install Node.js**
   - Open the downloaded `.pkg` file
   - Follow the installer
   - Enter your password when asked
   - Wait for installation to complete

3. **Verify Installation**
   - Open Terminal (Applications → Utilities → Terminal)
   - Type: `node --version`
   - Should show: `v18.x.x` or higher
   - Type: `npm --version`
   - Should show: `9.x.x` or higher

### For Linux (Ubuntu/Debian):

```bash
# Update package list
sudo apt update

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

## Step 3: Install Firebase CLI

### All Platforms:

Open your terminal/command prompt and run:

```bash
npm install -g firebase-tools
```

**What happens:**
- Downloads Firebase CLI (about 100 MB)
- Takes 2-3 minutes
- Installs globally on your system

**Verify installation:**
```bash
firebase --version
```

Should show: `13.x.x` or similar

**Common Issues:**

**Windows - "Cannot find module"**
```bash
# Run as Administrator
npm install -g firebase-tools --force
```

**Mac/Linux - "Permission denied"**
```bash
sudo npm install -g firebase-tools
```

---

## Step 4: Login to Firebase

### Login Process:

```bash
firebase login
```

**What happens:**

1. **Browser opens automatically**
   - Shows Google login page
   
2. **Choose your Google account**
   - Use the account you want for Firebase
   
3. **Grant permissions**
   - Click "Allow" when asked
   
4. **Success message**
   - Browser shows: "Success! You're logged in"
   - Terminal shows: "✔  Success! Logged in as your-email@gmail.com"

**If browser doesn't open:**
```bash
firebase login --no-localhost
```
- Copy the URL shown
- Paste in browser
- Follow steps above
- Copy the code from browser
- Paste in terminal

**Already logged in?**
```bash
firebase login:list
```
Shows your logged-in accounts

---

## Step 5: Verify Your Project

### Check Firebase Project:

```bash
firebase projects:list
```

**You should see:**
```
┌──────────────┬─────────────┬────────────────┬──────────────────────┐
│ Project ID   │ Project Name │ Permission     │ Project Number       │
├──────────────┼─────────────┼────────────────┼──────────────────────┤
│ bet-sharing  │ bet-sharing │ Owner or Editor │ 123456789012         │
└──────────────┴─────────────┴────────────────┴──────────────────────┘
```

**If you don't see bet-sharing:**

1. **Create the project:**
   - Go to: https://console.firebase.google.com
   - Click "Add project"
   - Project name: `bet-sharing`
   - Click Continue
   - Disable Google Analytics (not needed)
   - Click "Create project"
   - Wait 30 seconds
   - Click "Continue"

2. **Verify again:**
   ```bash
   firebase projects:list
   ```

---

## Step 6: Enable Billing

### Why Billing is Required:

- Cloud Functions are NOT available on the free "Spark" plan
- You need the "Blaze" (pay-as-you-go) plan
- **Don't worry:** Free tier is generous (2M calls/month)
- Your betting tracker will likely cost **$0/month**

### Enable Blaze Plan:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your **bet-sharing** project

2. **Click Upgrade**
   - Left sidebar → Click "Upgrade"
   - OR: Click the "Upgrade" button at top

3. **Select Blaze Plan**
   - Click "Select plan" under Blaze
   - Click "Continue"

4. **Set up billing**
   - **If you already have Google Cloud billing:**
     - Select existing billing account
     - Click "Continue"
   
   - **If this is your first time:**
     - Click "Create billing account"
     - Country: Select your country
     - Click "Continue"
     - Enter payment details (credit/debit card)
     - Click "Start my free trial" (if available)
     - OR Click "Submit and enable billing"

5. **Set budget alert (Optional but recommended)**
   - Budget amount: $5
   - Alert threshold: 50%, 90%, 100%
   - Click "Save"

6. **Confirm**
   - You should see "Blaze" plan active
   - Project console should show billing enabled

**Understanding costs:**
```
Free tier per month:
- 2,000,000 function invocations
- 400,000 GB-seconds compute time
- 200,000 CPU-seconds
- 5GB network egress

Your app's typical usage:
- ~1,000 invocations/month (notifications)
- Well within free tier
- Expected cost: $0/month
```

---

## Step 7: Extract & Prepare Files

### Extract the ZIP:

1. **Locate the ZIP file**
   - `betting-tracker-complete.zip`

2. **Extract it**
   - **Windows:** Right-click → Extract All → Choose location
   - **Mac:** Double-click the ZIP file
   - **Linux:** `unzip betting-tracker-complete.zip`

3. **Navigate to folder**
   ```bash
   cd path/to/betting-tracker
   ```
   
   Example:
   ```bash
   # Windows
   cd C:\Users\YourName\Downloads\betting-tracker
   
   # Mac
   cd ~/Downloads/betting-tracker
   
   # Linux
   cd ~/Downloads/betting-tracker
   ```

4. **Verify folder structure**
   ```bash
   ls
   ```
   
   You should see:
   ```
   admin.html
   public.html
   index.html
   functions/
   firebase.json
   .firebaserc
   deploy.sh
   deploy.bat
   README.md
   DEPLOYMENT_GUIDE.md
   ... and more
   ```

---

## Step 8: Install Dependencies

### Install Cloud Functions Dependencies:

```bash
cd functions
npm install
cd ..
```

**What happens:**
1. `cd functions` - Enters the functions folder
2. `npm install` - Reads `package.json` and installs:
   - `firebase-admin` - Firebase Admin SDK
   - `firebase-functions` - Cloud Functions SDK
3. `cd ..` - Goes back to main folder

**This takes 1-2 minutes**

**You'll see:**
```
npm WARN deprecated ...  (ignore these warnings)
added 200 packages in 45s
```

**Verify:**
```bash
ls functions/node_modules
```
Should show many folders (dependencies installed)

---

## Step 9: Deploy Firestore Rules

### What are Firestore Rules?

Security rules that control who can read/write your database.

### Deploy Rules:

```bash
firebase deploy --only firestore --project bet-sharing
```

**What happens:**
1. Uploads `firestore.rules` to Firebase
2. Uploads `firestore.indexes.json` to Firebase
3. Takes 10-30 seconds

**You'll see:**
```
=== Deploying to 'bet-sharing'...

i  deploying firestore
i  firestore: checking firestore.rules for compilation errors...
✔  firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
i  firestore: creating required indexes...
✔  firestore: deployed indexes in firestore.indexes.json successfully

✔  Deploy complete!
```

**What this does:**
- ✅ Bets: Anyone can read, only admin can write
- ✅ Notifications: Anyone can read, only admin can write
- ✅ FCM tokens: Anyone can register, admin can read
- ✅ Push queue: Only admin can write, only functions can read

---

## Step 10: Deploy Cloud Functions

### This is the main deployment!

```bash
firebase deploy --only functions --project bet-sharing
```

**What happens:**
1. Bundles your functions code
2. Uploads to Google Cloud
3. Deploys 5 functions
4. **Takes 3-5 minutes** (be patient!)

**You'll see:**
```
=== Deploying to 'bet-sharing'...

i  deploying functions
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i  functions: ensuring required API cloudbuild.googleapis.com is enabled...
✔  functions: required API cloudfunctions.googleapis.com is enabled
✔  functions: required API cloudbuild.googleapis.com is enabled
i  functions: preparing codebase default for deployment
i  functions: preparing functions directory for uploading...
i  functions: packaged /path/to/functions (size MB)
✔  functions: functions folder uploaded successfully

i  functions: creating Node.js 18 function sendPushNotifications(us-central1)...
i  functions: creating Node.js 18 function notifyOnNewBet(us-central1)...
i  functions: creating Node.js 18 function notifyOnBetUpdate(us-central1)...
i  functions: creating Node.js 18 function cleanupOldNotifications(us-central1)...
i  functions: creating Node.js 18 function cleanupOldBets(us-central1)...

✔  functions[sendPushNotifications(us-central1)] Successful create operation.
✔  functions[notifyOnNewBet(us-central1)] Successful create operation.
✔  functions[notifyOnBetUpdate(us-central1)] Successful create operation.
✔  functions[cleanupOldNotifications(us-central1)] Successful create operation.
✔  functions[cleanupOldBets(us-central1)] Successful create operation.

✔  Deploy complete!
```

**Functions deployed:**
1. ✅ **sendPushNotifications** - Sends push to all users
2. ✅ **notifyOnNewBet** - Auto-notify when bet added
3. ✅ **notifyOnBetUpdate** - Auto-notify when bet outcome changes
4. ✅ **cleanupOldNotifications** - Deletes old notifications (daily)
5. ✅ **cleanupOldBets** - Deletes old bets (daily)

---

## Step 11: Verify Deployment

### Check in Firebase Console:

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select **bet-sharing** project

2. **Click "Functions" in left menu**

3. **You should see all 5 functions listed:**
   ```
   Name                          Trigger              Region        Status
   ─────────────────────────────────────────────────────────────────────
   sendPushNotifications         Cloud Firestore      us-central1   Active
   notifyOnNewBet               Cloud Firestore      us-central1   Active
   notifyOnBetUpdate            Cloud Firestore      us-central1   Active
   cleanupOldNotifications      Cloud Scheduler      us-central1   Active
   cleanupOldBets              Cloud Scheduler      us-central1   Active
   ```

4. **All should show "Active" status**

### Check via Command Line:

```bash
firebase functions:list --project bet-sharing
```

Should show all 5 functions.

### View Logs:

```bash
firebase functions:log --project bet-sharing
```

Should show initialization logs (may be empty if no activity yet).

---

## Step 12: Test Push Notifications

### End-to-End Test:

#### Part 1: Enable Notifications (User Side)

1. **Start local server**
   ```bash
   # In project folder
   python -m http.server 8000
   # OR
   npx http-server -p 8000
   ```

2. **Open public view**
   - Browser: http://localhost:8000/public.html

3. **Enable notifications**
   - Click "Enable" on the notification banner
   - Browser will ask: "Allow notifications?"
   - Click "**Allow**"

4. **Success!**
   - Banner disappears
   - You see a browser notification: "Notifications Enabled! 🎉"

5. **Verify token saved**
   - Firebase Console → Firestore → Data
   - Collection: `fcm_tokens`
   - Should see a document with your token

#### Part 2: Send Notification (Admin Side)

1. **Open admin panel**
   - New browser tab: http://localhost:8000/admin.html

2. **Login**
   - Password: `Hari@1016`
   - Click Login

3. **Go to Notifications tab**
   - Click "Notifications" tab

4. **Send test notification**
   - Click "📢 Send Notification"
   - Fill in:
     * Title: `Test Push`
     * Message: `Testing background notifications!`
     * Type: Info
     * ✅ Keep "Send as Push Notification" CHECKED
   - Click "Send to All Users"

5. **Check what happens:**
   - Notification saved to Firestore → `notifications` collection
   - Push queued in Firestore → `push_queue` collection
   - Cloud Function triggers automatically
   - Function sends push to all registered tokens
   - Queue item deleted

#### Part 3: Verify Notification Received

**Test 1: Foreground (tab open)**
- Keep public.html tab open
- You should see notification immediately
- Shows in Messages section
- Browser notification appears

**Test 2: Background (tab closed) - THE REAL TEST!**
1. **Close the public.html tab completely**
2. **Send another notification from admin**
3. **You should still receive a browser notification!**
   - Even with tab closed
   - Shows in system notification area
   - Clicking it opens public.html

**This proves background push is working!** 🎉

### Check Function Logs:

```bash
firebase functions:log --project bet-sharing --only sendPushNotifications
```

You should see:
```
Processing push notification queue item: [queue-id]
Successfully sent 1 messages
Queue item processed and deleted
```

---

## Troubleshooting

### Issue: "Billing account not configured"

**Error:**
```
Functions deploy requires the pay-as-you-go (Blaze) billing plan
```

**Solution:**
1. Go to https://console.firebase.google.com
2. Select bet-sharing
3. Click "Upgrade" in left sidebar
4. Select Blaze plan
5. Add payment method
6. Try deploy again

---

### Issue: "Permission denied"

**Error:**
```
Error: HTTP Error: 403, Permission denied
```

**Solution:**
```bash
# Re-authenticate
firebase logout
firebase login
firebase deploy --only functions --project bet-sharing
```

---

### Issue: "Failed to create function"

**Error:**
```
Error: Failed to create function sendPushNotifications
```

**Solution:**
```bash
# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com --project=bet-sharing
gcloud services enable cloudbuild.googleapis.com --project=bet-sharing

# If gcloud not installed, enable via console:
# https://console.cloud.google.com/apis/library
# Search and enable: Cloud Functions API, Cloud Build API
```

---

### Issue: "npm install fails"

**Error:**
```
npm ERR! code ENOENT
```

**Solution:**
```bash
# Make sure you're in the functions directory
cd functions
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
cd ..
```

---

### Issue: "Functions not deploying"

**Try this sequence:**
```bash
# 1. Clean install
cd functions
rm -rf node_modules
npm install
cd ..

# 2. Re-login
firebase logout
firebase login

# 3. Deploy with force
firebase deploy --only functions --force --project bet-sharing
```

---

### Issue: "No notifications received"

**Checklist:**

1. **Functions deployed?**
   ```bash
   firebase functions:list --project bet-sharing
   ```
   All should show as Active

2. **Token registered?**
   - Firebase Console → Firestore → fcm_tokens
   - Should have at least 1 document

3. **Notification sent?**
   - Firestore → notifications
   - Should see your test notification

4. **Queue processed?**
   - Firestore → push_queue
   - Should be EMPTY (function deletes after processing)

5. **Check logs:**
   ```bash
   firebase functions:log --project bet-sharing
   ```
   Look for errors

6. **Browser notifications allowed?**
   - Check browser settings
   - Site settings → Notifications → Allowed

---

### Issue: "Function timeout"

**Error in logs:**
```
Function execution took too long
```

**Solution:**
Edit `functions/index.js`, add timeout:
```javascript
exports.sendPushNotifications = functions
  .runWith({ timeoutSeconds: 300 })  // Add this
  .firestore.document('push_queue/{queueId}')
  .onCreate(async (snap, context) => {
    // ... existing code
  });
```

Redeploy:
```bash
firebase deploy --only functions --project bet-sharing
```

---

### Issue: "Invalid token" in logs

**This is NORMAL!** 

The function automatically removes invalid tokens. This happens when:
- User cleared browser data
- User uninstalled app
- Token expired

**No action needed** - the function handles it automatically.

---

## 🎉 Success Checklist

After completing all steps, verify:

- [ ] Node.js installed (`node --version` works)
- [ ] Firebase CLI installed (`firebase --version` works)
- [ ] Logged into Firebase (`firebase projects:list` shows bet-sharing)
- [ ] Billing enabled (Blaze plan active)
- [ ] Dependencies installed (`functions/node_modules` exists)
- [ ] Firestore rules deployed (no errors)
- [ ] Functions deployed (all 5 showing Active in console)
- [ ] Test notification received (even with tab closed!)

---

## 📊 What's Next?

### Monitor Your Functions:

```bash
# View logs
firebase functions:log --project bet-sharing --follow

# View specific function
firebase functions:log --project bet-sharing --only sendPushNotifications
```

### Update Functions:

When you edit `functions/index.js`:
```bash
firebase deploy --only functions --project bet-sharing
```

### Check Usage/Costs:

- Firebase Console → Functions → Usage tab
- Should stay within free tier (2M calls/month)

---

## 🆘 Still Having Issues?

1. **Check the full logs:**
   ```bash
   firebase functions:log --project bet-sharing --limit 50
   ```

2. **Verify project setup:**
   ```bash
   firebase projects:list
   firebase functions:list --project bet-sharing
   ```

3. **Try the automated script:**
   ```bash
   # Linux/Mac
   ./deploy.sh
   
   # Windows
   deploy.bat
   ```

4. **Common commands:**
   ```bash
   # Delete all functions and redeploy
   firebase functions:delete --project bet-sharing
   firebase deploy --only functions --project bet-sharing
   
   # Force deploy
   firebase deploy --only functions --force --project bet-sharing
   ```

---

## 🎊 Congratulations!

You now have:
- ✅ Full background push notifications
- ✅ Auto-notifications on new bets
- ✅ Auto-notifications on bet updates
- ✅ Automatic database cleanup
- ✅ Production-ready cloud infrastructure

**Your betting tracker is now complete!** 🚀

---

**Total time:** 15-20 minutes (if everything goes smoothly)
**Cost:** $0/month (within free tier)
**Complexity:** Medium (but this guide makes it easy!)

Enjoy your fully functional push notification system! 🎉
