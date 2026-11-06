import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { HeaderLogic, NavItem } from "./HeaderTypes";

export const useHeaderLogic = (): HeaderLogic => {
  const { state: auth, actions: authActions } = useAuth();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);

  // Close the mobile menu whenever the route changes (incl. back/forward).
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
  }

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const logout = useCallback(async () => {
    setIsMenuOpen(false);
    await authActions.logout();
  }, [authActions]);

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { to: "/", label: "Home" },
      { to: "/categories", label: "Categories" },
    ];
    // Hide auth-dependent links until the session check finishes, so the
    // header never flashes "Admin Login" for a logged-in admin.
    if (auth.isLoading) return items;
    items.push(
      auth.isAdmin
        ? { to: "/add", label: "Add Recipe" }
        : { to: "/admin/login", label: "Admin Login" },
    );
    return items;
  }, [auth.isAdmin, auth.isLoading]);

  return {
    state: { isMenuOpen, navItems, canLogout: auth.isAdmin },
    actions: { toggleMenu, closeMenu, logout },
  };
};
