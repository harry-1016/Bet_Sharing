#!/bin/bash

# Firebase Cloud Functions Deployment Script
# This script automates the deployment process

echo "🚀 Betting Tracker - Firebase Deployment"
echo "=========================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found"
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
    echo ""
fi

# Check if logged in
echo "🔐 Checking Firebase authentication..."
if firebase projects:list &> /dev/null; then
    echo "✅ Already logged in to Firebase"
else
    echo "🔑 Please login to Firebase..."
    firebase login
fi
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js 18+ recommended (you have: $(node -v))"
    echo "   Cloud Functions may not work correctly"
    echo ""
fi

# Install dependencies
echo "📦 Installing Cloud Functions dependencies..."
cd functions
npm install
cd ..
echo "✅ Dependencies installed"
echo ""

# Deploy Firestore rules and indexes
echo "🔧 Deploying Firestore rules and indexes..."
firebase deploy --only firestore --project bet-sharing
if [ $? -eq 0 ]; then
    echo "✅ Firestore rules and indexes deployed"
else
    echo "❌ Firestore deployment failed"
    exit 1
fi
echo ""

# Deploy Cloud Functions
echo "☁️  Deploying Cloud Functions (this may take 3-5 minutes)..."
firebase deploy --only functions --project bet-sharing
if [ $? -eq 0 ]; then
    echo "✅ Cloud Functions deployed successfully!"
else
    echo "❌ Functions deployment failed"
    echo "💡 Common issues:"
    echo "   - Billing not enabled (need Blaze plan)"
    echo "   - Network issues"
    echo "   - Permission issues"
    exit 1
fi
echo ""

# Success message
echo "🎉 Deployment Complete!"
echo ""
echo "Your Cloud Functions are now active:"
echo "  ✅ sendPushNotifications - Sends push to all users"
echo "  ✅ notifyOnNewBet - Auto-notify on new bet"
echo "  ✅ notifyOnBetUpdate - Auto-notify on bet update"
echo "  ✅ cleanupOldNotifications - Daily cleanup (30 days)"
echo "  ✅ cleanupOldBets - Daily cleanup (90 days)"
echo ""
echo "🧪 Test your setup:"
echo "  1. Open public.html and enable notifications"
echo "  2. Open admin.html and send a test notification"
echo "  3. You should receive push even with app closed!"
echo ""
echo "📊 Monitor your functions:"
echo "  firebase functions:log"
echo ""
echo "🌐 View in console:"
echo "  https://console.firebase.google.com/project/bet-sharing/functions"
echo ""
