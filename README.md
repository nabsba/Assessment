# GitHub User Search – React + TypeScript Assessment

This project implements a GitHub user search experience with debounced input, pagination, selection, and bulk actions, focusing on performance, UX clarity, and predictable state management.

---

## Features

- 🔍 Debounced search with typing / deleting strategies
- ⛔ Request cancellation using `AbortController` to prevent race conditions
- 📄 Pagination with infinite scroll (IntersectionObserver, append mode)
- 📌 Normalized state management with `useReducer` + Context
- ✅ Bulk selection (select all, toggle, delete, duplicate)
- 🚨 GitHub API rate-limit awareness with proactive notifications
- 💬 Centralized notification system
- 🧪 Reducer and UI logic designed for testability

---

## Architecture Overview

- **State Management:** Context + Reducer (predictable transitions, testable logic)
- **Async Control:** Centralized API layer with abort handling
- **UI Interaction:** Debounced input logic isolated in the search component
- **Data Structure:** Hash map (Map / dictionary semantics) + ordered ID list
- **Scrolling:** IntersectionObserver for append pagination
- **UX Strategy:** Progressive disclosure, clear loading states, and error feedback

Detailed design and UX decisions are documented in:  
👉 `DESIGN_DECISION.md`
👉 `SchemaComponents.png`
👉 `choice.md`

---

## Getting Started

### Install

```bash
npm install
npm run dev
npm run test


> **Note on AI Usage**  
> AI tools were utilised to support test creation, documentation preparation, and the development of selected functions and components.  
> All architectural decisions, state management design, data structure, and UI/UX patterns were designed and implemented by me.
