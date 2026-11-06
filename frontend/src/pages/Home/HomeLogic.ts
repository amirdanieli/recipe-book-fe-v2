import { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { HomeActionCard, HomeLogic } from "./HomeTypes";

const BROWSE_CARD: HomeActionCard = {
  id: "browse",
  icon: "📖",
  title: "Browse Cookbook",
  description:
    "Explore the collection by category. From breakfast to dessert, find exactly what you're craving.",
  to: "/categories",
};

const ADD_CARD: HomeActionCard = {
  id: "add",
  icon: "✍️",
  title: "Add New Recipe",
  description:
    "Found a new favourite? Save it here with ingredients, steps, and your personal story.",
  to: "/add",
};

const FAVORITES_CARD: HomeActionCard = {
  id: "favorites",
  icon: "⭐",
  title: "Favourites",
  description: "Coming soon! Quickly access your most loved meals.",
};

export const useHomeLogic = (): HomeLogic => {
  const { state: auth } = useAuth();

  // "Add New Recipe" is admin-only; visitors would just be bounced to login.
  const actionCards = useMemo(
    () =>
      auth.isAdmin ? [BROWSE_CARD, ADD_CARD, FAVORITES_CARD] : [BROWSE_CARD, FAVORITES_CARD],
    [auth.isAdmin],
  );

  return { state: { actionCards }, actions: {} };
};
