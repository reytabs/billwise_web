# BillWise Web — AI Guidance

This file provides essential context for Copilot/AI agents working on the BillWise web frontend. It focuses on the project’s architecture, conventions, developer workflows, and common patterns.

## Project Overview

- **Framework**: Next.js 13+ using the `app/` directory. Nearly every route lives under `app/`.
- **Language**: TypeScript with strict linting (`eslint-config-next`).
- **Styling**: Tailwind CSS (v4) and `shadcn` components; `cn` util in `lib/utils.ts` merges classes.
- **UI Library**: Custom components in `components/ui` wrap Radix primitives & shadcn patterns. Each component file begins with `"use client"` and is purely a client component. See `components/ui/button.tsx`, `dialog.tsx`, etc.

## Folder Structure & Feature Boundaries

- `app/` is organized by feature: `bills`, `transactions`, `budget`, `goals`, `accounts`, `auth`, etc.
  - Each feature folder often contains:
    - `page.tsx` (root or layout component)
    - optional subcomponents (`create.tsx`, `list.tsx`, `tabs.tsx`)
    - Context provider (e.g. `BillsContext.tsx`)
- Client-only files use `"use client"`. Server components omit it.
- Shared layout component `components/dashboard-layout.tsx` wraps pages with `<Sidebar />`.

## State Management

- Feature-specific React contexts provide state and helper methods.
- Example: `BillsContext.tsx` exports `BillsProvider` and `useBills()`.
- Providers are wrapped around page UI in `app/bills/page.tsx`.

## API Layer

- HTTP client is in `lib/api.ts` (axios instance).
  - Base URL from `NEXT_PUBLIC_API_URL`.
  - Request interceptor reads tokens from localStorage (`accessToken`, `token`, or `userData` JSON) and adds `Authorization: Bearer`.
- Use `api.get`, `api.post`, etc. across client components.
- Error handling pattern:
  ```ts
  try {
    const res = await api.post("/endpoint", data);
  } catch (err) {
    if (axios.isAxiosError(err)) { ... }
  }
  ```
- Authentication: `/login` request returns `token`/`accessToken`; login page stores token & basic user info in localStorage.

## Form Validation

- Uses `zod` schemas in client components for form validation.
- Pattern:
  - Define schema (`billSchema` in `app/bills/create.tsx`).
  - `billSchema.parse(formData)` inside `try`; catch `ZodError` and map `issue.path` -> error message.
- Errors stored in component state and displayed below fields.

## Navigation & Refresh

- Client navigation via `useRouter` from `next/navigation`.
- Use `router.refresh()` after mutating data when context not available.
- `router.push("/path")` to redirect.

## UI & Components

- All UI components accept Tailwind classes; use `cn()` util to merge.
- Radix UI is used extensively (Dialog, Popover, Select, etc.).
- To add new UI element, follow existing patterns under `components/ui/`.
- Styling conventions: descriptive utility classes, `data-` attributes for state.

## Utility Functions

- `lib/utils.ts` exports `cn` helper.
- `lib/phpFormatter.ts` formats numbers as Philippine peso currency.

## Hooks

- Custom hook `use-mobile.ts` returns boolean for small screens.
- Feature hooks are stored under `hooks/`.

## Conventions & Naming

- Client pages/components start with uppercase and descriptive suffix: `BillCreatePage`, `TransactionListPage`.
- Feature folders may export multiple sub-components; import with relative paths from within folder.
- Keep component props strongly typed with TypeScript interfaces.
- Prefer function components over classes.

## Developer Workflows

- **Run dev server**: `npm run dev` (also `yarn dev`, `pnpm dev`, `bun dev`).
- **Build**: `npm run build`.
- **Start production**: `npm run start`.
- **Lint**: `npm run lint` (uses eslint).
- Environment: set `NEXT_PUBLIC_API_URL` in `.env.local`.
- No tests present; no test script.

## Project-specific Notes

- Authentication is simple; there is no token refresh logic. Tokens are read on every request from localStorage.
- Not all features are wired to backend; some are static UI (e.g., `transactions/list.tsx`).
- Local state updates often involve formatting (see `BillsContext.addBill`).
- Date handling uses `date-fns` (formatting + component calendar).

## How to Extend

1. Add new route: create folder under `app/`, add `page.tsx`.
2. For interactive page, add `"use client"` at top.
3. Use context providers if you need shared state; pattern is in `app/bills/BillsContext.tsx`.
4. Validate with zod on forms; import `z` from "zod".
5. Use `api` from `lib/api.ts` for backend calls.
6. Use `toast` from `sonner` for notifications.

## External Dependencies

- API runs separately; this repo just a frontend pointing to `NEXT_PUBLIC_API_URL`.
- UI libs: `@tabler/icons-react`, `lucide-react`, `radix-ui`, `sonner`.

> **Note**: All file paths listed relative to repository root.

---

Please review and let me know if any section is unclear or missing important details. I'd be happy to refine the instructions.
