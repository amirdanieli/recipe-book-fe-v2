import type { LoadingSpinnerLogic, LoadingSpinnerProps } from "./LoadingSpinnerTypes";

export const useLoadingSpinnerLogic = ({
  label = "Loading…",
  fullPage = false,
}: LoadingSpinnerProps): LoadingSpinnerLogic => ({
  state: { label, isFullPage: fullPage },
  actions: {},
});
