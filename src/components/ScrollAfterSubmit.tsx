"use client";

import { useEffect } from "react";

const SUBMITTED_KEY = "rsvp-submitted";

export function markSubmitted() {
  try {
    sessionStorage.setItem(SUBMITTED_KEY, "1");
  } catch {}
}

export function ScrollAfterSubmit({ id }: { id: string }) {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SUBMITTED_KEY)) return;
      sessionStorage.removeItem(SUBMITTED_KEY);
    } catch {
      return;
    }
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [id]);
  return null;
}
