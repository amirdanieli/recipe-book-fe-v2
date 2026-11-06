export interface LoadingSpinnerProps {
  /** Accessible text announced to screen readers. Defaults to "Loading…". */
  label?: string;
  /** Fill the viewport (route-level loading) instead of an inline block. */
  fullPage?: boolean;
}

export interface LoadingSpinnerState {
  label: string;
  isFullPage: boolean;
}

export type LoadingSpinnerActions = Record<string, never>;

export interface LoadingSpinnerLogic {
  state: LoadingSpinnerState;
  actions: LoadingSpinnerActions;
}
