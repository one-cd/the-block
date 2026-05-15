# The Block: Buyer Auction MVP

## How to Run

```bash
npm install
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

To verify the app:

```bash
npm run build
npm run test
npm run test:e2e
```

If Playwright has not been used on the machine before:

```bash
npx playwright install chromium
```

## Time Spent

Roughly 6-8 hours across 2-3 sessions. 

I started by exploring the dataset and challenge requirements, then on paper, I planned out how I would implement the minimal slice, considering the guidance given in the original readme. 

Then, I decided to do some research and figure out OPENLANE's buyer auction UI and found a video on the website. I played around with the URL and got to the Vimeo where I had video controls and took some screenshots. 

Then as a test, I got some screenshots from the video that encapsulated the minimal slice I wanted to implement and sent these to Anthropic's new design product (claude.ai/design). I told it to create a high fidelity prototype, and it successfully created a polished copy of OpenLane's real UI. This is included in `/Claude Design.` I kept in mind that I'd have to delete much of the chrome in this, since the data we're given is minimal, and I only wanted to keep data-backed elements in the app.

I then had another model scaffold a React/vite/typescript app. Then I had it use the design folder as the source of truth in recreating only the UI and wiring in the obvious navigation, for example clicking on vehicle detial opens the vehicle detail page.

After this, I referred to the vehicles.json as the source of truth in creating any features and displaying any data. I also considered what I could realistically derive from the data and still fit OpenLane's production UI. I removed all the UI and chrome I couldn't reliably create using the data. I first iteratively built the core buyer flow as per the requirements. I created tests for these core flows. Then, I added watchlist, persistence, filters, responsive polish, and automated tests.

## Assumptions and Scope

This is a frontend-only prototype. `data/vehicles.json` is the source of truth, and buyer state is stored locally in `localStorage`.

I intentionally included the buyer-side experience: browsing inventory, searching, filtering, inspecting vehicle details, placing bids, and saving vehicles to a watchlist.

I intentionally skipped authentication, backend APIs, seller workflows, checkout, payments, dealer admin tooling, bid history, a more complex bidding system and cross-device persistence.

Auction timestamps are normalized relative to the current time so countdowns stay useful despite the synthetic dataset.

## Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** None
- **Database:** Static JSON dataset plus browser `localStorage`
- **Testing:** Vitest, React Testing Library, Playwright

## What I Built

I built a responsive buyer-side auction prototype for OPENLANE inventory.

Buyers can browse all 200 vehicles, search by identifying and vehicle fields, refine inventory with filters, switch between grid/list views, open vehicle detail pages, inspect condition and seller information, view vehicle photos, place validated bids, and return later with bids/watchlist state preserved locally.

## Notable Decisions

I kept the app frontend-only because the core product judgment is in the buyer flow, and I wanted to avoid scope creep by introducing a backend.

I adapted the raw dataset into typed view models instead of letting UI components read raw JSON. That kept the formatting, search text, auction time normalization, and bid merging all in one place.

I used `localStorage` for placed bids and watchlist state so bid feedback survives reloads without adding backend complexity.

I added filters beyond the minimum requirement because inventory refinement is central to a buyer auction workflow and greatly improves the UX.

I used Claude Deign to create a high fidelity prototype of OpenLane's actual UI.

I preserved the `Claude Design/` reference as source material but rebuilt the production app under `src/` with typed React components and tests.

I made sure not to make any derivations like price ranges for certain makes/models or create arbitrary scores from the data since it's only a sample size of 200.

## Testing

I added unit and component coverage for data adaptation, search, formatting, auction time handling, bid validation, inventory filtering, app navigation, and local persistence.

I also added Playwright E2E tests covering the main buyer journey: search inventory, open a detail page, place a bid, reload and see persisted state, mobile usability, watchlist persistence, the all-filters drawer, and image gallery behavior.

Current verification:

```bash
npm run test
npm run build
npm run test:e2e
```

All pass locally, on my machine.

## What I'd Do With More Time

I would add URL routing for shareable vehicle detail pages, a backend-backed bid service, user profiles, authenticated buyer sessions, bid history, saved searches, and more realistic image assets.

I would also separate prototype-only UI polish from production auction logic, add analytics around buyer actions, and make the filtering tests less dependent on exact generated dataset counts.
