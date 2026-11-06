# Recipe Book Frontend

A modern React-based frontend for the Recipe Book application. Built with Vite, TypeScript, and React Router, it provides a seamless interface for managing recipes, categories, and administrative tasks.

---

## 🚀 Tech Stack

- **Frontend Tech**: React + Vite
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management**: React Context (Auth)
- **Styling**: CSS Modules
- **Data Fetching**: custom `apiClient` using `fetch` API

---

## 🛠 Project Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the `frontend` root:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 🧱 Component Structure

Every component lives in its own folder with three files (plus an optional CSS module):

```
src/pages/SingleCategoryPage/
├── SingleCategoryPage.tsx        # View: rendering only
├── SingleCategoryPageLogic.ts    # useSingleCategoryPageLogic(params) -> { state, actions }
├── SingleCategoryPageTypes.ts    # SingleCategoryPageState / Actions / Logic (+ Props)
└── SingleCategoryPage.module.css
```

- **View (`X.tsx`)**: calls `useXLogic(...)` and renders from `state`, wiring events to `actions`. No `useState`, `useEffect` or service calls.
- **Logic (`XLogic.ts`)**: the custom hook. It owns all state, effects, data fetching and handlers, and returns `{ state, actions }`.
- **Types (`XTypes.ts`)**: `XState` (everything the view reads), `XActions` (every function the view calls) and `XLogic = { state: XState; actions: XActions }`.

Route params are read in the view with `useParams()` and passed to the hook (`useSingleCategoryPageLogic(slug)`).

Shared building blocks:

- `hooks/useAsyncData.ts`: loading/error/reload for a fetcher. It ignores stale responses.
- `hooks/useAuth.ts`: `{ state: { user, isAdmin, isLoading }, actions: { login, logout } }`.
- `services/apiClient.ts`: `fetch` wrapper that throws `ApiError` (with `status`) on non-2xx responses.
- `utils/recipeFormat.ts`: difficulty labels and time formatting.
- `index.css`: theme tokens (`--color-*`, `--radius-*`, `--shadow-*`) and global helpers (`.content-container`, `.page-title`, `.button`, `.status-message`, `.card-grid`).

---

## 🔗 Backend Connection (Critical Info for B.E)

This section outlines what the backend team needs to know and configure for successful integration.

### 🔌 API URL Configuration
The frontend uses `VITE_API_URL` to connect to the backend. In development, the default is `http://localhost:3000`.

### 🛡 Authentication Strategy
The application uses **JWT-based authentication stored in `httpOnly` cookies**.
- **Cookie Name**: `token`
- **Frontend Action**: All requests are sent with `{ credentials: 'include' }`.
- **Backend Requirement**: Ensure the `Set-Cookie` header is sent with `httpOnly: true`, `sameSite: 'lax'`, and `path: '/'`.

### 📶 CORS Configuration
The backend **must** enable CORS to allow the frontend to communicate with it.
- **Allowed Origins**: `http://localhost:5173` (default Vite port)
- **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Credentials Support**: `true` (Mandatory for cookie-based auth)

### 📂 Common API Endpoints

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/admin/login` | POST | Admin login. Returns user & sets cookie. |
| **Auth** | `/auth/admin/logout` | POST | Clears the `token` cookie. |
| **Auth** | `/auth/admin/verify` | GET | Validates existing session. |
| **Recipes** | `/recipes` | GET | List recipes (optional `?category=slug`). |
| **Recipes** | `/recipes/:slug` | GET | Get a specific recipe. |
| **Recipes** | `/recipes` | POST | (Admin) Create a new recipe. |
| **Categories** | `/categories` | GET | List all categories. |
| **Categories** | `/categories/:idOrSlug` | GET | Get a specific category. |
| **Images** | `/images/upload` | POST | Upload image (via `multipart/form-data`). |

---

## 🏗 Project Structure

- `src/assets/`: Static assets like images and icons.
- `src/components/`: Reusable UI components (Header, RecipeCard, etc.)
- `src/context/`: Auth state management.
- `src/hooks/`: Custom hooks like `useAuth`.
- `src/models/`: TypeScript interfaces and types.
- `src/pages/`: Main application views (Home, RecipeDetail, etc.)
- `src/services/`: API communication layer (`apiClient.ts` and domain services).
- `src/styles/`: Global styles and CSS variables.
- `src/utils/`: Utility functions and shared types.

---

## 📝 Available Scripts

- `npm run dev`: Starts the dev server.
- `npm run build`: Builds for production.
- `npm run lint`: Runs ESLint.
- `npm run preview`: Locally preview production build.
