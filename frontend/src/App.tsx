import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header/Header";
import headerStyles from "./components/Header/Header.module.css";
import CategoriesList from "./pages/CategoriesList";
import SingleCategoryPage from "./components/Category/SingleCategoryPage";
import AddEditRecipe from "./pages/AddEditRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import AdminLogin from "./pages/AdminLogin";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/Auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <div className={headerStyles["header-spacer"]} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:slug" element={<SingleCategoryPage />} />
          <Route path="/recipes/:slug" element={<RecipeDetail />} />

          <Route element={<RequireAuth />}>
            <Route path="/add" element={<AddEditRecipe />} />
            <Route path="/edit/:slug" element={<AddEditRecipe />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
