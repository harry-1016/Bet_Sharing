# 📊 Firebase Cloud Functions - Visual Setup Flow

## Quick Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│                    SETUP PREREQUISITES                       │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  1. Install Node.js (v18+)            │
         │     nodejs.org → Download LTS         │
         │     Verify: node --version            │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  2. Install Firebase CLI              │
         │     npm install -g firebase-tools     │
         │     Verify: firebase --version        │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  3. Login to Firebase                 │
         │     firebase login                    │
         │     Browser opens → Allow access      │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  4. Verify Project                    │
         │     firebase projects:list            │
         │     Should see: bet-sharing           │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  5. Enable Billing (REQUIRED!)        │
         │     console.firebase.google.com       │
         │     Upgrade to Blaze Plan             │
         │     Add payment method                │
         └───────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│                                                          │
│              DEPLOYMENT PHASE                            │
│                                                          │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  6. Extract Files                     │
         │     unzip betting-tracker.zip         │
         │     cd betting-tracker                │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  7. Install Dependencies              │
         │     cd functions                      │
         │     npm install                       │
         │     cd ..                             │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  8. Deploy Firestore Rules            │
         │     firebase deploy --only firestore  │
         │     ⏱ Takes: 10-30 seconds            │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  9. Deploy Cloud Functions            │
         │     firebase deploy --only functions  │
         │     ⏱ Takes: 3-5 minutes              │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  10. Verify Deployment                │
         │      console.firebase.google.com      │
         │      → Functions → All Active ✓       │
         └───────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────┐
│                                                          │
│                 TESTING PHASE                            │
│                                                          │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  11. Start Local Server               │
         │      python -m http.server 8000       │
         │      Open: localhost:8000             │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  12. Enable Notifications             │
         │      public.html → Click Enable       │
         │      Allow notifications in browser   │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  13. Send Test Notification           │
         │      admin.html → Login               │
         │      Notifications tab → Send         │
         │      ✓ Send as Push Notification      │
         └───────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  14. Verify Reception                 │
         │      Close public.html tab            │
         │      Should still receive push! 🎉    │
         └───────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   SUCCESS! ✓   │
                    └────────────────┘
```

---

## What Happens Under the Hood

### When Admin Sends Notification:

```
┌──────────────┐
│ Admin Panel  │
│ Sends Notif  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Saved to Firestore   │
│ ├─ notifications/    │ ← In-app messages
│ └─ push_queue/       │ ← Triggers Cloud Function
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Cloud Function Triggers     │
│ sendPushNotifications()     │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Function Logic:             │
│ 1. Read queue item          │
│ 2. Get all FCM tokens       │
│ 3. Send to Firebase Cloud   │
│ 4. Remove invalid tokens    │
│ 5. Delete queue item        │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Firebase Cloud Messaging    │
│ Sends to all devices        │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ User Receives:              │
│ ✓ Browser notification      │
│ ✓ Even if app closed        │
│ ✓ Even if tab closed        │
└─────────────────────────────┘
```

---

## Function Triggers Explained

### sendPushNotifications
```
Trigger: Document created in push_queue/
When:    Admin sends notification with "Send as Push" checked
Does:    Sends multicast push to all registered devices
Time:    Instant (< 1 second)
```

### notifyOnNewBet
```
Trigger: Document created in bets/
When:    Admin adds a new bet
Does:    Auto-sends "🎯 New Bet Added!" to all users
Time:    Instant (< 1 second)
```

### notifyOnBetUpdate
```
Trigger: Document updated in bets/
When:    Admin changes bet outcome (Won/Lost/Void)
Does:    Auto-sends result notification to all users
Time:    Instant (< 1 second)
```

### cleanupOldNotifications
```
Trigger: Scheduled (every 24 hours)
When:    Daily at midnight UTC
Does:    Deletes notifications older than 30 days
Time:    Runs in background
```

### cleanupOldBets
```
Trigger: Scheduled (every 24 hours)
When:    Daily at midnight UTC
Does:    Deletes bets older than 90 days
Time:    Runs in background
```

---

## Time Estimates

| Step | Time | Can Skip? |
|------|------|-----------|
| Install Node.js | 5 min | No |
| Install Firebase CLI | 2 min | No |
| Login to Firebase | 1 min | No |
| Enable Billing | 3 min | No |
| Extract & Navigate | 1 min | No |
| Install Dependencies | 2 min | No |
| Deploy Firestore | 30 sec | No |
| Deploy Functions | 4 min | No |
| Test Notifications | 2 min | Yes (but recommended) |
| **TOTAL** | **~20 min** | |

---

## Cost Breakdown

### Firebase Blaze Plan - Free Tier

```
Monthly Free Allowance:
├─ 2,000,000 function invocations
├─ 400,000 GB-seconds compute
├─ 200,000 CPU-seconds
├─ 5 GB network egress
└─ 200,000 Firestore reads

Your Expected Usage:
├─ 1,000 function invocations (notifications)
├─ 2,000 GB-seconds compute
├─ 1,000 CPU-seconds
├─ 0.5 GB network egress
└─ 5,000 Firestore reads

Cost: $0.00 / month ✓
```

### When You'd Get Charged:

- If you send 100+ notifications per day
- If each notification goes to 100+ users
- If you have 1000+ active daily users

Even then: ~$0.50-$2.00 per month

---

## Troubleshooting Decision Tree

```
Deployment Failed?
       │
       ├─ "Billing not configured"
       │  └─ → Enable Blaze plan in console
       │
       ├─ "Permission denied"
       │  └─ → firebase logout → firebase login
       │
       ├─ "npm install failed"
       │  └─ → cd functions → rm -rf node_modules → npm install
       │
       ├─ "Function creation failed"
       │  └─ → Enable Cloud Functions API in console
       │
       └─ "Timeout"
          └─ → Try again, or check internet connection

Notifications Not Working?
       │
       ├─ Functions not deployed?
       │  └─ → firebase functions:list (check all Active)
       │
       ├─ No FCM tokens?
       │  └─ → Check Firestore → fcm_tokens collection
       │
       ├─ Queue not processing?
       │  └─ → firebase functions:log (check for errors)
       │
       └─ Browser blocking?
          └─ → Check site settings → Allow notifications
```

---

## Quick Commands Cheat Sheet

```bash
# Login
firebase login

# List projects
firebase projects:list

# Deploy everything
firebase deploy --project bet-sharing

# Deploy only functions
firebase deploy --only functions --project bet-sharing

# Deploy only firestore
firebase deploy --only firestore --project bet-sharing

# View logs (all)
firebase functions:log --project bet-sharing

# View logs (specific function)
firebase functions:log --only sendPushNotifications --project bet-sharing

# View logs (live tail)
firebase functions:log --follow --project bet-sharing

# List functions
firebase functions:list --project bet-sharing

# Delete a function
firebase functions:delete functionName --project bet-sharing

# Logout
firebase logout
```

---

## Success Indicators

### ✅ Everything Working When:

1. **Firebase Console Shows:**
   - All 5 functions: Active status
   - Functions tab shows recent invocations
   - Logs show successful sends

2. **Firestore Shows:**
   - `fcm_tokens/` has documents
   - `notifications/` has your test messages
   - `push_queue/` is empty (processed)

3. **User Experience:**
   - Notifications appear even with tab closed
   - Messages show in public view
   - No errors in browser console

4. **Logs Show:**
   ```
   ✓ Successfully sent N messages
   ✓ Queue item processed and deleted
   ```

---

## Visual: Data Flow

```
User Device          Firestore          Cloud Function       Firebase Cloud
    │                    │                    │                  Messaging
    │                    │                    │                      │
    │─── Register ──────▶│                    │                      │
    │     FCM Token      │ fcm_tokens/        │                      │
    │                    │                    │                      │
                         │                    │                      │
Admin sends notification │                    │                      │
    │                    │                    │                      │
    │─── Create ────────▶│                    │                      │
    │   Notification     │ notifications/     │                      │
    │                    │ push_queue/        │                      │
    │                    │                    │                      │
    │                    │─── onCreate ──────▶│                      │
    │                    │    Trigger         │                      │
    │                    │                    │                      │
    │                    │◀── Get Tokens ─────│                      │
    │                    │    fcm_tokens/     │                      │
    │                    │                    │                      │
    │                    │                    │─── Send Push ───────▶│
    │                    │                    │   Multicast          │
    │                    │                    │                      │
    │◀────────────────────────────────────────────── Deliver ────────│
    │  Browser Notification                                          │
    │  (even if tab closed!)                                         │
    │                    │                    │                      │
    │                    │◀── Delete Queue ───│                      │
    │                    │    push_queue/     │                      │
```

---

This visual guide should help you understand the entire process! Follow the step-by-step guide and refer to these diagrams whenever you need clarity.
