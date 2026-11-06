import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Header from "./components/Header/Header";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import AuthProvider from "./context/Auth/AuthProvider";
import Home from "./pages/Home/Home";

// Route-level code splitting: visitors never download the admin form code.
const CategoriesList = lazy(() => import("./pages/CategoriesList/CategoriesList"));
const SingleCategoryPage = lazy(() => import("./pages/SingleCategoryPage/SingleCategoryPage"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail/RecipeDetail"));
const AddEditRecipe = lazy(() => import("./pages/AddEditRecipe/AddEditRecipe"));
const AdminLogin = lazy(() => import("./pages/AdminLogin/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Header />
      <main>
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/:slug" element={<SingleCategoryPage />} />
            <Route path="/recipes/:slug" element={<RecipeDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<RequireAuth />}>
              <Route path="/add" element={<AddEditRecipe />} />
              <Route path="/edit/:slug" element={<AddEditRecipe />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <SpeedInsights />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
