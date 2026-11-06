export type ToastType = "error" | "success";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  /** Auto-dismiss delay in ms. */
  duration?: number;
}

export interface ToastState {
  message: string;
  type: ToastType;
  /** "alert" interrupts screen readers for errors; "status" is polite. */
  role: "alert" | "status";
}

export interface ToastActions {
  close: () => void;
}

export interface ToastLogic {
  state: ToastState;
  actions: ToastActions;
}
