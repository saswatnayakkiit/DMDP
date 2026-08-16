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

## Status
All 8 screens + 2 bottom sheets verified by testing agent (iteration 2). Onboarding advance bug and unicode-escape rendering bug fixed.

## Backlog
- P2: Optional dark mode.
- P2: Migrate shadow* props to boxShadow (RN web warning, non-blocking).
- P2: Real swipe-to-dismiss / cancel gestures on alert cards.
