import styles from "./Toast.module.css";
import { useToastLogic } from "./ToastLogic";
import type { ToastProps } from "./ToastTypes";

const Toast = (props: ToastProps) => {
  const { state, actions } = useToastLogic(props);

  return (
    <div className={`${styles.toast} ${styles[state.type]}`} role={state.role}>
      <span className={styles.message}>{state.message}</span>
      <button
        type="button"
        className={styles.close}
        onClick={actions.close}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
