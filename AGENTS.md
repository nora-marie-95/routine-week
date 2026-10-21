# Routine Week

## What this is

A small planner built around recurring routines and a week overview. Same look and tech
stack as `three-by-three`, cut down to what matters day to day.

## Screens

1. **Today** — the day's todo list. Open todos from earlier days stay here, marked
   "Overdue", until they're done or moved.
2. **Week** — Monday to Sunday of any week (arrows to browse). Every day has its own list and
   a + to add a todo to that day.
3. **Routines** — recurring things with a rhythm (daily, weekly, every 2 weeks, monthly,
   X× a week). Each routine has seven day chips for the current week: tap a day to put the
   routine on it (it becomes a todo on that day), tap again to take it off. Tapping a routine
   opens its detail page with the rhythm picker and a per-period history.

## Data

```
Routine  { id, title, rhythm, category?, createdAt }
TodoItem { id, title, done, doneAt?, routineId?, dueDate: "YYYY-MM-DD", createdAt }
```

Every todo lives on a day. A routine's progress ("2/3 this week") counts its checked-off
todos. Checked-off todos stay when a day chip is toggled off, so history isn't lost.

## Platforms & scope

Web first, iOS/Android from the same Expo codebase (see CLAUDE.md). No backend: everything
persists locally via AsyncStorage under `routine-week/app-store`.

## Categories

A routine can optionally belong to a category (free text such as "Chores" or "Skin care").
Categories aren't separate records: the list of categories is just the distinct names in use,
matched case-insensitively when typing. The Routines tab groups by category (alphabetical,
"No category" last) once any routine has one.
