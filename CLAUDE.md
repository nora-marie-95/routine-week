# Project rules

The transferable base for this and future apps: tech stack, architecture, code style, React
patterns, state management and workflow. Nothing here is specific to one app — what this
app does, its domain and its features belong in docs/app.md.

## Tech stack

Always the latest stable versions — holding back needs a named reason, and the reason is
reported.

- Expo SDK 58 (Expo Router), React 19, React Native 0.88, TypeScript (strict). Web ships
  first via `expo export --platform web` (static output); iOS/Android follow from the same
  codebase.
- Styling: NativeWind 4 (Tailwind CSS 3.4 utility classes compiled to RN styles on native,
  real CSS on web) — not plain Tailwind, which has no DOM to target in React Native.
- State: zustand 5 (+ immer, `persist`) — storage via `createJSONStorage(() =>
AsyncStorage)`. `@react-native-async-storage/async-storage` backs onto `localStorage` on
  web and native storage on iOS/Android, so persistence code never changes between
  platforms.
- Validation: zod 4 (`zod/v4`). Icons: `lucide-react-native` (`Icon`-suffixed exports).
- Tooling: npm, Node LTS (`.nvmrc`), ESLint (**pinned to 9.x** — `eslint-config-expo@58`'s
  bundled `eslint-plugin-react` crashes on ESLint 10's context API; revisit when expo
  updates it) + typescript-eslint, Prettier, husky + lint-staged (`eslint --fix` + prettier
  on commit), Jest (`jest-expo`) for unit tests.
  - pnpm was the original intent but isn't installed in this environment (a Homebrew
    install stalled compiling a dependency from source); npm is used until that's resolved
    — swap back when convenient, nothing here is npm-specific beyond the lockfile.
- No backend/DB in the MVP — all state lives in AsyncStorage. Revisit this file (tech stack
  and state sections) when a backend is introduced.

```
npm start         # expo start
npm run web       # expo start --web
npm run check     # eslint src/ && tsc --noEmit
npm test          # jest
npm run lint -- --fix && npx prettier --write src/   # format + autofix
```

## Architecture

shared → lib → domains → features → widgets → app

- A layer imports only from layers to its left. No cross-slice imports inside a layer (a
  feature never imports another feature; widgets compose features).
- shared — design-system primitives (ui-kit), generic components, util.
- lib — project-agnostic primitives, written so they can be copied into another app
  unchanged.
- domains — the data model (Zod schemas → types), stores, domain utilities.
- features — user-facing capabilities; widgets — compose features into screen parts; app —
  routes only (Expo Router's `src/app`).
- Barrels: every lib/domain/feature/widget has a root `index.ts` exporting only what's used
  outside. Inside a module, use deep `@/` imports, never the module's own barrel.

## Code style

1. `const` arrow functions, not `function`.
2. Don't destructure props in the signature — destructure on the first line of the body.
3. Don't export anything without a consumer.
4. Absolute imports only (`@/…`).
5. Handlers are named `const`s in the component body — never inline functions in JSX. Every
   `onX={…}` gets a reference, not an arrow function. Name it after the API it is passed to
   (`onChange`, not `handleChange`); with several of a kind, add what it acts on
   (`onNameChange`, `onTagChange`). Inside a `.map`, extract the item into its own component
   that owns its handlers.
   ```tsx
   // ✗
   <Pressable onPress={() => { remove(item.id); }} />
   // ✓
   const onRemovePress = () => {
     remove(item.id);
   };
   …
   <Pressable onPress={onRemovePress} />
   ```
6. Never import React; use `React.ReactNode` etc. as global types.
7. Effects with fewer than 4 component variables are extracted into a hook named by intent.
   One extracted effect stays in the same file; several go to a nearby `hooks/` folder.
8. Order inside a file: types → constants (`CONSTANT_CASE`) → helpers → hooks → components.
   Types always come first, directly after the imports.
9. `Props` for components, `Params` for functions.
10. No type assertions — no `as` (except `as const`), no `!`. Narrow at runtime.
11. No `eslint-disable` comments.
12. Interactive elements get a stable `testID` for testing.
13. No JSX in constants.
14. `type` over `interface`. No abbreviations in identifiers (`id`, `e`, `i`, `db`, `env` are
    fine).
15. `use(Context)`, never `useContext`. `ref` is a prop, never `forwardRef`.
16. Don't reach for `useMemo`/`useCallback` unless profiling shows a need — comment why when
    one is used.
17. Zod from `zod/v4`; derive types with `z.infer`.
18. Icons: `lucide-react-native`, with the `Icon` suffix (`PlusIcon`).
19. Hooks that read a context end in `Context`: `usePageEditorContext`, `useBlockContext` —
    never `usePageEditor`.
20. Always explicit returns. Arrow functions always have a block body; a value comes back
    through `return`, never implicitly. Functions that return nothing don't return a call.
    ```ts
    // ✗
    const total = (items: Item[]) => sum(items);
    // ✓
    const total = (items: Item[]) => {
      return sum(items);
    };
    ```
21. Always braces. Every `if`, `else`, `for`, `while` body sits in `{}`, even a single
    `return`. (Rules 20 and 21 are enforced by ESLint: `arrow-body-style: always`, `curly:
all`.)
22. Positive conditions — don't invert to bail out. Check for the case you want and return
    its value right there; the fallback comes after. A negated guard is fine only when it
    narrows a type (`if (!goal) { return; }`) in front of longer logic that would otherwise
    have to be nested.
23. Name the why. An expression whose purpose isn't obvious from reading it (a regex
    replace, a magic number, a compound condition, an offset calculation) goes into a
    `const` named after its intent, not its mechanics — plus a one-line `/** … */` when the
    name alone can't carry the reason.
24. Props form a staircase. In JSX, order props by line length — the shorter the line, the
    higher it goes, so the block widens downwards. Where order changes behavior (a spread
    like `{...rest}`), what must win goes after it, what may be replaced goes before; the
    staircase then runs separately within each group between spreads.
25. Stores are composed from slices, actions grouped by domain. The store file is a table of
    contents — it only composes slices and middleware; each slice lives in its own file and
    returns its actions under one key.
    ```ts
    // store/use-app-store.ts
    export const useAppStore = create<AppState>()(
      persist(
        immer((...store) => {
          return {
            ...createGoalActions(...store), // → { goal: { create, update, … } }
            ...createTodoActions(...store), // → { todo: { create, toggle, … } }
          };
        }),
        PERSIST_OPTIONS,
      ),
    );
    ```

## React patterns

- The exported component reads like a table of contents. It only composes the layout and
  the component tree; the work happens in small subcomponents _in the same file_, each
  owning its own state, data and handlers.
- When several parts share data or a command, give them a context instead of drilling
  props. A context is split into small hooks _in the same file_, each owning one concern,
  and the context value groups their results by key.
  ```ts
  type ContextValue = ReturnType<typeof useGoalScreenValue>; // types at the top of the file

  const useGoalScreenValue = (goalId: string) => {
    const goal = useGoal(goalId);
    const todos = useGoalTodos(goalId);
    return { goal, todos };
  };
  ```
- Compound components where they fit (headless where possible): e.g. `GoalCard.Provider`,
  `GoalCard.Header`, `GoalCard.Todos`, with `useGoalCardContext()` throwing outside the
  provider. Don't force the pattern where a plain component is clearer.

## State and storage

- Never touch `AsyncStorage` (or `localStorage` on web) directly. Persisted client state is
  a zustand store with `persist`; the storage is named only in `createJSONStorage(() =>
AsyncStorage)`.

## Deployment

- Web: Vercel, static export (`vercel.json`: `buildCommand: expo export --platform web`,
  `outputDirectory: dist`). There's no server — `app.json`'s `web.output` is `"static"`,
  matching the no-backend MVP.
- Expo Router's static export makes one literal file per **dynamic** route pattern (e.g.
  `category/[id].html`), not one per possible id — the app itself resolves the real id
  client-side from the URL via `useLocalSearchParams`. `vercel.json` copies that file to a
  bracket-free alias and rewrites `/category/:id` to it (Vercel's destination-path parser
  doesn't like literal `[...]` in a filename); the same trick covers the `+not-found` page.
  Any new dynamic route needs the same two lines added to `buildCommand`/`rewrites`.
- Before pushing: `npm run check`, `npm test`.

## Workflow

- Features go through a branch and a PR; one commit per finished step. Push straight to
  main only when asked.
- Verify UI changes on web and in the iOS/Android simulator (whichever applies) before
  reporting them done — including long content and narrow widths.
- CLAUDE.md holds only transferable rules. Change it only when asked; app-specific notes
  belong in docs/app.md.
