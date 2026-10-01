"use client";

import { useEffect } from "react";
import { ensureValidAccessToken } from "@/lib/auth/session";

export function TokenRefreshGate() {
  useEffect(() => {
    void ensureValidAccessToken();
  }, []);

  return null;
}
