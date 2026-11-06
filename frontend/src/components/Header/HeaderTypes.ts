export interface NavItem {
  to: string;
  label: string;
}

export interface HeaderState {
  isMenuOpen: boolean;
  navItems: NavItem[];
  /** Show the logout button (admin session active). */
  canLogout: boolean;
}

export interface HeaderActions {
  toggleMenu: () => void;
  closeMenu: () => void;
  logout: () => Promise<void>;
}

export interface HeaderLogic {
  state: HeaderState;
  actions: HeaderActions;
}
