# ✅ VOID OPTION ADDED

## What Changed

Added **"Void"** option for bets that are cancelled or voided.

### Updates:

1. **Admin Panel (admin.html)**
   - New "Void" button alongside Won/Lost/Pending
   - When a bet is marked as Void:
     - Outcome: `void`
     - Profit/Loss: `₹0` (stake is returned)
   - Gray badge color for voided bets

2. **Public View (public.html)**
   - Voided bets show with gray badge
   - Displays "void" status clearly

### When to Use "Void"

Use the Void option when:
- ❌ Match is cancelled
- ❌ Bet is refunded by bookmaker
- ❌ Technical issues void the bet
- ❌ Incorrect odds were offered
- ❌ Player didn't participate

### How It Works

**Before:**
```
Won  → Profit = (Stake × Odds) - Stake
Lost → Profit = -Stake
```

**Now:**
```
Won     → Profit = (Stake × Odds) - Stake
Lost    → Profit = -Stake
Void    → Profit = ₹0 (stake returned)
Pending → No profit/loss yet
```

### Example

**Bet Details:**
- Stake: ₹1,000
- Odds: 2.50
- Potential Return: ₹2,500

**If Voided:**
- Outcome: Void
- Profit/Loss: ₹0
- Stake returned: ₹1,000

### Button Order in Admin

```
[Won] [Lost] [Void] [Pending] [Delete]
```

### Visual Changes

**Admin & Public View:**
- Won → Green badge (🟢)
- Lost → Red badge (🔴)
- **Void → Gray badge (⚪) NEW!**
- Pending → Yellow badge (🟡)

### Statistics Impact

- Voided bets don't count toward win/loss record
- Profit/loss is ₹0
- Shows in bet history with "void" status
- Doesn't affect win rate calculation (since it's neither won nor lost)

---

**All files updated and ready to use!**
