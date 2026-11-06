import { useCallback, useEffect, useState } from "react";

export interface AsyncData<T> {
  data: T | undefined;
  error: unknown;
  isLoading: boolean;
  /** Runs the fetcher again (e.g. a "Try again" button). */
  reload: () => void;
}

interface Settled<T> {
  source: () => Promise<T>;
  version: number;
  data?: T;
  error?: unknown;
}

/**
 * Runs `fetcher` whenever its identity changes and tracks loading/error state.
 *
 * - Pass a stable function (module-level or wrapped in `useCallback`).
 * - Pass `null` to skip fetching (e.g. while a route param is missing).
 * - Responses that arrive after the fetcher changed or the component
 *   unmounted are ignored, so fast navigation never shows stale data.
 */
export const useAsyncData = <T>(fetcher: (() => Promise<T>) | null): AsyncData<T> => {
  const [version, setVersion] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    if (!fetcher) return;
    let isActive = true;

    fetcher().then(
      (data) => {
        if (isActive) setSettled({ source: fetcher, version, data });
      },
      (error: unknown) => {
        if (isActive) setSettled({ source: fetcher, version, error });
      },
    );

    return () => {
      isActive = false;
    };
  }, [fetcher, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  const isCurrent =
    settled !== null && settled.source === fetcher && settled.version === version;

  return {
    data: isCurrent ? settled.data : undefined,
    error: isCurrent ? settled.error : undefined,
    isLoading: fetcher !== null && !isCurrent,
    reload,
  };
};
