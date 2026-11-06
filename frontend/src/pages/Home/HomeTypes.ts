export interface HomeActionCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  /** Omitted for "coming soon" cards, which render as non-interactive. */
  to?: string;
}

export interface HomeState {
  actionCards: HomeActionCard[];
}

export type HomeActions = Record<string, never>;

export interface HomeLogic {
  state: HomeState;
  actions: HomeActions;
}
