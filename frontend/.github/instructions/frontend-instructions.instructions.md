---
applyTo: "**"
---

# GitHub Copilot Custom Instructions: Recipe Book Frontend

These instructions guide Copilot for frontend development in the Recipe Book project. They mirror backend conventions while specifying frontend patterns, tools, and best practices for a TypeScript React codebase.

## Tech Stack & Architecture

- **Framework**: React with TypeScript. Prefer Next.js for SSR/SEO-friendly pages and route-based slugs.
- **Routing**: Use Next.js routing (recommended) or `react-router` for SPA navigation. Use slug-based pages for recipes (e.g., `/recipes/[slug]`).
- **Styling**: Prefer CSS Modules or Tailwind CSSß. Keep styles colocated with components in `src/components`.
- **Forms / Validation**: Use `react-hook-form` + `zod` for typed validation.
- **Server State**: Use SWR or React Query for data fetching and caching.

## Security & Authentication

- **Auth Storage**: Backend stores JWT in an `httpOnly` cookie named `token`. Frontend must not read this cookie from JavaScript.
- **Requests**: Always send requests with `credentials: 'include'` so the `httpOnly` cookie is forwarded to the server.
- **useAuth Hook**: Implement a `useAuth()` hook that calls `/auth/me` (or equivalent) to obtain the current user and roles; do not read token directly.
- **RBAC**: Use role checks (e.g., `isAdmin`) to show/hide admin UI, but rely on backend enforcement for security.

## API & Types

- **Central API Client**: Create `src/services/apiClient.ts` to centralize fetch/axios configuration (set `credentials: 'include'`, JSON handling, and error normalization).
- **Shared Types**: Keep shared types in `src/utils/types.ts` (e.g., `JwtPayload`, `User`, `Recipe`). Prefer generated types when available to maintain parity with backend.
- **Slugs**: Use `slug` fields for routes and API operations instead of numeric IDs.

## Image Uploads

- **Uploads**: Prefer server-assisted uploads. Either use a backend pre-signed upload endpoint or the Cloudinary widget according to backend capabilities (`ImagesService`).
- **UX**: Provide previews, progress indicators, and basic client-side resizing/cropping when appropriate.

## Component & Project Structure

- **Layout**: Pages in `src/pages` or `src/app`, components in `src/components`, hooks in `src/hooks`, services in `src/services`, and types in `src/utils`.
- **Components**: Keep components small and focused. Export typed props interfaces for each component.
- **Hooks**: Encapsulate business logic into reusable hooks (`useRecipes`, `useAuth`, `useUpload`).

## Development Patterns

- **Type Safety**: Zero `any` policy. Use explicit interfaces and typed API responses.
- **Validation**: Use `zod` schemas paired with `react-hook-form` to validate frontend input and keep DTO parity with backend DTOs.
- **Error Handling**: Surface HTTP errors to users with consistent UI patterns. Handle 401/403/404 gracefully.

## Testing & Tooling

- **Unit Tests**: Use Jest + React Testing Library for components and hooks.
- **E2E Tests**: Use Playwright or Cypress for critical flows (auth, recipe create/edit, image uploads).
- **Linting/Formatting**: Use ESLint, Prettier, and strict TypeScript settings. Run checks in CI.

## Guidance for Copilot

- Always generate TypeScript code with explicit types; avoid `any`.
- When creating auth-related snippets, include `credentials: 'include'` and comment that the cookie is `httpOnly` and not accessible to JS.
- Prefer `zod` schemas for forms and wire them into `react-hook-form` examples.
- For recipe pages and API calls, prefer slug-based routes and include error handling for 404 and 403 cases.
- When generating admin UI, include clear role checks via `useAuth()` and mark those sections as admin-only.

## Example Patterns

- `useAuth()` hook: fetch `/auth/me`, manage user state, provide `isAuthenticated` and `isAdmin` helpers.
- `apiClient.ts`: fetch wrapper that sets `credentials: 'include'`, parses JSON, and throws normalized errors.

Follow these instructions consistently. Prioritize explicitness, type-safety, and parity with the backend DTOs and authorization model.
