# Renewly — PRD

## Problem statement
Clickable high-fidelity prototype for an Android app "Renewly", a UPI-first subscription tracker for India. Tagline: "Know before it renews." Helps salaried 22–35 year olds see every recurring payment (UPI Autopay, card e-mandates, Play Store billing, shared plans) in one place, get warned before renewals, and cancel fast.

## User choices
- Static clickable prototype with mock data (no backend, no login).
- SMS auto-detect button simulates access and goes Home.
- Ship exactly as specified + haptic feedback on interactions.

## Architecture
- Expo Router (file-based). No backend — mock data in `src/data.ts`.
- Shared theme tokens in `src/theme.ts` (colors, spacing, INR formatting, date helpers, fixed "today" = 16 Sep 2026).
- Reusable UI in `src/components.tsx`: Logo tile, Chip, Primary/Secondary buttons, SubRow, BottomNav, TopBar, Card.
- expo-haptics on all key interactions.

## Design system
- Teal #0F766E primary, Amber #F59E0B (money-at-risk only), bg #F8FAFC, cards #FFFFFF (12px radius, soft shadow), text #1E293B / #64748B, red #DC2626 (cancel only). No blue, no gradients. Indian rupee formatting (₹1,24,000).

## Screens implemented (2026-06)
- Onboarding (index): 3 swipeable frames, dots, CTA + skip → /home.
- Home: hero total ₹3,847 vs ₹3,228, amber chips (unused / price change → alerts), Next up rows, See all → calendar.
- Calendar: Sep 2026 grid, teal dots on 19/21/28, today outline, summary line, tap 19 → bottom sheet (Netflix ₹649).
- Add (pick service): search + 11-tile grid → add-details.
- Add details: service header, fields (amount/cycle/date/method), shared toggle + split reveal, remind, Save → home.
- Detail (Netflix): status strip, charge history w/ amber price-increase chip, shared-with card, reminder, How to cancel sheet (3 steps, Open Netflix / Mark as cancelled).
- Alerts: unused Hotstar, Netflix price hike, Spotify+YouTube overlap, teal insight strip (₹3,588/yr).
- Settings: reminders/quiet hours/SMS toggle/currency/export/Renewly Plus → paywall.
- Paywall: benefits, monthly/yearly segmented toggle, Start 7-day free trial.
- Bottom nav (5 items, raised + button) on all main screens.

## Feature update (2026-06, session 2)
- **Dark mode**: Light/Dark/System segmented control in Settings (default Light, persisted via AsyncStorage key `renewly:mode`). Calm teal-tinted dark palette (`DARK` in src/theme.ts). All screens use `useTheme()` from `src/store.tsx` + `makeStyles(C)` pattern; themed StatusBar in _layout.
- **Swipe actions**: `SwipeableSubRow` (ReanimatedSwipeable) on Home "Next up" and Calendar "Upcoming renewals" — swipe left reveals Snooze (amber, toggles "Snoozed" pill) and Cancelled (red, removes from lists + feeds savings). Haptics on both.
- **Savings tracker**: `AppProvider` in src/store.tsx tracks statuses; seeded cancelled subs (Sony LIV ₹299 since 14 Jun, Gaana ₹99 since 2 Aug = ₹996). Home savings card → /savings screen (hero total, yearly projection, per-sub saved amounts, restore for user-cancelled). Cancelling a Sep sub also reduces Home hero total.
- **Family sharing**: Netflix detail has live "Family split · 3 ways" card — You ₹217, Sristhi ₹216 (seeded paid), Rahul ₹216; per-member Mark paid toggle; settle summary strip ("₹X of ₹432 collected" / "All settled for September").
- Detail screen is now state-aware: cancelled (red strip + Restore button) / snoozed (amber strip) / active.

## Branding & auth flow (2026-06, session 2 cont.)
- New entry flow: `/` landing (BrandMark logo + "Renewly" wordmark + tagline "Know before it renews." + Create account / Sign in) → `/auth` (MOCK email/password + Continue with Google; signup → `/onboarding`, signin → `/home`; mode toggle in-screen). Onboarding frames moved from index to `/onboarding`.
- `BrandMark` component (teal rounded square, white R, amber dot) in src/components.tsx; used on landing, auth, Home header (logo + wordmark), Settings footer, Paywall hero.
- Settings gained a Sign out row → back to landing.
- Auth is intentionally mock: no validation/accounts; buttons just navigate.

## Status
All 4 new features verified by testing agent (iteration 3, 9/9 pass). Branding/auth flow verified in iteration 4 (9/9 pass). Base 8 screens verified in iteration 2.

## Backlog
- P2: Migrate shadow* props to boxShadow (RN web warning, non-blocking).
- P3: Per-sub charge history (currently Netflix figures shown for every sub — prototype).
- Testing note: to swipe ReanimatedSwipeable on web, dispatch PointerEvent with pointerType 'touch' (see iteration_3 script); mouse drag is treated as tap.
