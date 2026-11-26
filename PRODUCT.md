# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Two roles share one app.

- **Shop owner (admin).** Runs any kind of small shop: cafe, bakery, barber, salon, grocery, car wash. Stands at the counter with a customer waiting and a phone in one hand. Needs to find the customer and add points, add a purchase, or give a reward in a few seconds. Sets up rewards, promotions and the prize wheel in calmer moments.
- **Customer.** Holds loyalty cards from one or more shops. Opens the app in the queue or at the counter to show a QR code, check points, and see what reward is closest. Only reads; never changes points.

## Product Purpose

A loyalty points app for small shops. The owner scans a customer's QR code, adds points or purchases, and gives rewards. The customer sees their cards, progress and rewards. Success for the owner: the counter action takes seconds and mistakes are easy to undo. Success for the customer: they always know how close the next reward is.

## Positioning

The owner does every action. Customers cannot change anything, so the shop keeps full control and the customer side stays simple and safe.

## Operating Context

- Counter use: one hand, bright shop light, time pressure, a person waiting.
- The customer shows a QR code from their profile; the owner scans it with the phone camera.
- Setup work (rewards, promotions, wheel) happens away from the rush.
- Times are saved in UTC and shown in the shop's time zone.

## Capabilities and Constraints

- One Expo React Native codebase ships to iOS and Android. No web build. Styled with NativeWind.
- Supabase backend. Points, purchases and given rewards change only through database functions.
- Roles: `admin` owns one store; `user` is a customer. Roles are set in the database.
- Reward types: Free item, Discount percentage, Fixed discount (cost points); Buy N get 1 (purchase card); Free item with purchase (no points). Rewards can be paused and can be one time per customer.
- Promotions: double or triple points for a time window, no overlap per store.
- Prize wheel: the owner sets slices and customers spin.
- Undo: the owner can undo the last change on a customer.
- The redesign may change looks, layouts, navigation and flows. Every feature stays.
- Language: English, left to right.

## Brand Commitments

None are fixed. The teal color and the name "fidelityPoints" are placeholders and may change. No logo yet.

## Evidence on Hand

- Local seed data in `supabase/seed.sql` (Test Cafe, test accounts).
- No real customers, testimonials, numbers or store photos. Future work must not invent them as facts. Mockup data must be labeled as sample data.

## Product Principles

1. The counter action comes first: scan, act, done.
2. Every mistake can be undone.
3. The customer always sees the distance to the next reward.
4. It must fit any shop, not only cafes.
5. Plain words, no jargon.
