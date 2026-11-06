import { useLocation } from "react-router-dom";
import type { NotFoundLogic } from "./NotFoundTypes";

export const useNotFoundLogic = (): NotFoundLogic => {
  const { pathname } = useLocation();
  return { state: { path: pathname }, actions: {} };
};
