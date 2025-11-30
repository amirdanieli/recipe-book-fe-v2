import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header/Header";
import headerStyles from "./components/Header/Header.module.css";
import CategoriesList from "./pages/CategoriesList";
import SingleCategoryPage from "./components/Category/SingleCategoryPage";
// import RecipeDetail from "./pages/RecipeDetail";
import AddEditRecipe from "./pages/AddEditRecipe";
import RecipeDetail from "./pages/RecipeDetail";
// import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <>
      <Header />
      <div className={headerStyles["header-spacer"]} />
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/:name" element={<SingleCategoryPage />} />
            <Route path="/recipes/:slug" element={<RecipeDetail />} />
            <Route path="/add" element={<AddEditRecipe />} />
            {/* <Route path="/edit/:slug" element={<AddEditRecipe />} /> */}
            {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
