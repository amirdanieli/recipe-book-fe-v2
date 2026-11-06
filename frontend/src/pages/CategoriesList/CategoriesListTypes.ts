export interface CategoryItem {
  id: string;
  name: string;
  href: string;
  /** Null when the API doesn't send a recipe count. */
  countLabel: string | null;
}

export interface CategoriesListState {
  categories: CategoryItem[];
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
}

export interface CategoriesListActions {
  retry: () => void;
}

export interface CategoriesListLogic {
  state: CategoriesListState;
  actions: CategoriesListActions;
}
