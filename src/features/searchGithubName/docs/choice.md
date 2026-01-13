# CHOICES.md — Architectural & UX Decisions (GitHub Search)

This document explains *why* specific implementation choices were made in the GitHub search feature (context provider, reducer, debouncing strategy, rate-limit UX, and infinite scroll append behavior).

---

## 1 Why a Context + Reducer architecture

### Decision
Use a dedicated `SearchProvider` (`React.Context`) combined with `useReducer(searchReducer, initialSearchState)`.

### Why
- **Single source of truth** for search state (query, loading/error, results, selection, pagination, notifications, API limits).
- **Predictable transitions** through explicit actions (`SEARCH_START`, `SEARCH_SUCCESS`, `SEARCH_ERROR`, etc.).
- **Testability**: reducers are easy to unit test (pure state transitions).
- **Separation of concerns**: UI components read state + call intent-driven actions, rather than managing complex async logic locally.

### What this enables
- Multiple UI components can access the same search state without prop drilling (input, list, bulk actions, pagination controls).
- Easy future extension: swap API provider, add caching, add analytics, add multiple search sources.

---

## 2 Why requests are aborted (AbortController)

### Decision
Before starting a new request, abort the previous one:

- `abortControllerRef.current?.abort()`
- assign a new `AbortController()`
- ignore abort errors in `catch`

### Why
- Prevents **race conditions** where an older request resolves after a newer one and overwrites correct results.
- Reduces **wasted network calls**, improving perceived performance.
- Matches user expectations when typing quickly: “show me the latest query results, not historical ones.”

### UX impact
- Aborts are treated as normal behavior (no error message shown).
- Real failures trigger `SEARCH_ERROR` and can be surfaced to the user.

---

## 3 Why we normalize results (Map / Dictionary + order array)

### Decision
Store results as a key-value store (Map/dictionary semantics) plus an ordered list of ids.

- fast lookups: **O(1)** by id
- stable rendering: `resultsOrder`

### Why
- Pagination merges become simple (merge new items into the map, extend order list).
- Deletion/duplication becomes reliable (operate on ids).
- UI rendering remains stable even when new pages arrive.

> Note: In architecture documents, this is often called a **hash map** or **dictionary**. In the JS implementation, it can be an `object` or a `Map`. The important part is **key-value** semantics.

---

## 4 Why searchUsers lives inside the Provider

### Decision
The async request logic (`searchUsers`) lives in the provider, not inside the input component.

### Why
- Centralizes API logic + dispatch actions in one place.
- Keeps UI components dumb: they call `searchUsers(query, page)` and render state.
- Avoids duplication if multiple components can trigger searches (input, button, pagination, refresh).

---

## 5 API rate-limit UX decisions

### Decision
Read GitHub API headers and store them:

- `x-ratelimit-remaining`
- `x-ratelimit-limit`
- `x-ratelimit-reset` (UNIX seconds)

### Why
- Rate limits are a real UX constraint; users should understand why searches may stop.
- Allows proactive warnings *before* hard failure.

### Implemented UX
- When remaining hits a threshold (example: `2`), show a warning notification.
- When remaining is `0`, block further requests and show an exceeded notification.

### Auto-reset behavior
When remaining drops to a specific value (`9`) and reset time exists, a `setTimeout` schedules a state update after the reset moment.

**Rationale**
- Reduces manual refresh/retry friction.
- Keeps UI aligned with GitHub’s reset window.

> Implementation note: if you rely on `state` inside `setTimeout`, prefer a functional dispatch pattern or read fresh values via ref to avoid stale closure issues.

---

## 6 Why notifications are managed in global state

### Decision
`showNotification(message, duration)` dispatches:
- `SHOW_NOTIFICATION` (message)
- auto-clears after `duration`

### Why
- Notifications can be triggered from multiple places (input, reducer actions like duplicate, API warning).
- Centralized control ensures consistent styling, timing, and accessibility behavior.

### Bonus
`showNotification` returns a cleanup function to cancel/clear the notification if needed.

---

## 7 GitHubSearchInput.tsx — Debounce strategy and separation of concerns

### Decision
Debouncing and typing behavior live inside `GitHubSearchInput.tsx` (UI layer), not in the provider.

### Why
- Debounce is a **UI interaction policy**, not domain logic.
- Different screens might want different debounce behavior (or a Search button).
- Keeps provider reusable: provider exposes `searchUsers`, UI decides *when* to call it.

### Two debounce modes: typing vs deleting
We maintain two debounced functions with different delays:

- Typing debounce: **1500ms**
- Deleting debounce: **3000ms**

**Why**
- Typing: users expect relatively fast responses.
- Deleting/backspacing: users often pause and adjust; longer delay reduces spam requests and flicker.

### Avoiding Re-Requesting Identical Queries

- Prevents re-fetching when the user re-focuses the input or types the same value again.
- Conserves API usage.
- Avoids UI flicker caused by unnecessary state resets.

### Abort on Every Change

On each input change:

- Abort in-flight requests.
- Cancel pending debounced executions.
- Schedule a new debounced search.

**Why:**  
Guarantees that only the latest user intent is executed and reflected in the UI.

---

## 8 Why Keep Debounce in the Input if We Might Add a Search Button?

### Decision

Debounce logic is intentionally contained within the input component.

### Why

This preserves flexibility for multiple interaction models:

- **Auto-search UX** (debounced typing)
- **Explicit search UX** (Search button)
- **Hybrid UX** (typing suggestions + button submit)

### Future Adaptation

If a Search button is introduced later:

- Remove debounced calls.
- Trigger `searchUsers(inputValue, 1)` on button click.
- Keep Provider and reducer unchanged.

This ensures a clean separation of concerns:

- **Provider** = what searching does  
- **Input** = when searching happens  

---

## 9 ListCard — Observer for Appending Content (Infinite Scroll)

### Decision

The list layer uses an observer (e.g., `IntersectionObserver`) to detect when the user reaches the end of the list and loads the next page.

### Why

- Infinite scroll provides a smoother experience than explicit pagination.
- It pairs naturally with append loading mode (existing content remains visible while new data loads).

### UX Rule

- Page 1 = **New search** → replace content with loader  
- Page > 1 = **Pagination** → append results and show loader at bottom  

### Reliability Constraints

- The observer must not trigger multiple fetches while a request is in flight.
- It must stop when `hasNextPage === false`.
- It must respect API rate limits and abort rules.

---

## 10 Summary of Key Tradeoffs

- **Reducer + Context**: More upfront structure, significantly more predictable scalability.
- **AbortController**: Prevents stale data and improves UX under rapid typing.
- **Debounce in UI**: Keeps the provider reusable and future-proof for button-based search.
- **Observer Infinite Scroll**: Optimal for large result sets, requires strict loading guards.
- **Rate-Limit UX**: Proactive warnings improve transparency and user trust.

---

## Future Improvements (Optional)

- Add confirmation dialogs for destructive delete actions.
- Make duplication limits configurable (business rules or role-based).
- Add a “Refresh” trigger to re-run identical queries on demand.
- Persist search state in the URL for shareable results.
- Improve accessibility using ARIA live regions for notifications.
- Destructure the context into multiple context: one for search, one for result, one for pagination