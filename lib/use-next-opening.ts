"use client";

import { useSyncExternalStore } from "react";
import { nextAvailable } from "@/lib/quote-store";

const noop = () => () => {};

/** Next open slot ("Sat, Sep 19 · 8–10 AM"), computed in the browser so a cached page never shows a stale date. */
export function useNextOpening() {
  return useSyncExternalStore(
    noop,
    () => {
      const n = nextAvailable();
      return `${n.label} · ${n.window}`;
    },
    () => "",
  );
}
