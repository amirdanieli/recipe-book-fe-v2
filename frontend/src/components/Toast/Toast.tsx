import { useEffect } from "react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  type?: "error" | "success";
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type = "error",
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return <div className={`${styles.toast} ${styles[type]}`}>{message}</div>;
};

export default Toast;
