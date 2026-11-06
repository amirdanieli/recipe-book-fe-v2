import styles from "./LoadingSpinner.module.css";
import { useLoadingSpinnerLogic } from "./LoadingSpinnerLogic";
import type { LoadingSpinnerProps } from "./LoadingSpinnerTypes";

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const { state } = useLoadingSpinnerLogic(props);

  return (
    <div
      className={`${styles.container} ${state.isFullPage ? styles.fullPage : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.spinner} aria-hidden="true" />
      <span className={styles.visuallyHidden}>{state.label}</span>
    </div>
  );
};

export default LoadingSpinner;
