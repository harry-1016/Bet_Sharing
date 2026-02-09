@echo off
REM Firebase Cloud Functions Deployment Script for Windows
REM This script automates the deployment process

echo ========================================
echo Firebase Deployment for Betting Tracker
echo ========================================
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI not found
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
    echo Firebase CLI installed
    echo.
)

REM Check if logged in
echo Checking Firebase authentication...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo Please login to Firebase...
    call firebase login
) else (
    echo Already logged in to Firebase
)
echo.

REM Install dependencies
echo Installing Cloud Functions dependencies...
cd functions
call npm install
cd ..
echo Dependencies installed
echo.

REM Deploy Firestore rules and indexes
echo Deploying Firestore rules and indexes...
call firebase deploy --only firestore --project bet-sharing
if errorlevel 1 (
    echo Firestore deployment failed
    pause
    exit /b 1
)
echo Firestore rules and indexes deployed
echo.

REM Deploy Cloud Functions
echo Deploying Cloud Functions (this may take 3-5 minutes)...
call firebase deploy --only functions --project bet-sharing
if errorlevel 1 (
    echo Functions deployment failed
    echo.
    echo Common issues:
    echo   - Billing not enabled (need Blaze plan)
    echo   - Network issues
    echo   - Permission issues
    echo.
    pause
    exit /b 1
)
echo.

REM Success message
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your Cloud Functions are now active:
echo   * sendPushNotifications - Sends push to all users
echo   * notifyOnNewBet - Auto-notify on new bet
echo   * notifyOnBetUpdate - Auto-notify on bet update
echo   * cleanupOldNotifications - Daily cleanup (30 days)
echo   * cleanupOldBets - Daily cleanup (90 days)
echo.
echo Test your setup:
echo   1. Open public.html and enable notifications
echo   2. Open admin.html and send a test notification
echo   3. You should receive push even with app closed!
echo.
echo Monitor your functions:
echo   firebase functions:log
echo.
echo View in console:
echo   https://console.firebase.google.com/project/bet-sharing/functions
echo.
pause
