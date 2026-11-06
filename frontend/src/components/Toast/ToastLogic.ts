import { useEffect } from "react";
import type { ToastLogic, ToastProps } from "./ToastTypes";

export const useToastLogic = ({
  message,
  type = "error",
  onClose,
  duration = 4000,
}: ToastProps): ToastLogic => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
    // Restart the timer when a new message comes in.
  }, [message, onClose, duration]);

  return {
    state: { message, type, role: type === "error" ? "alert" : "status" },
    actions: { close: onClose },
  };
};
