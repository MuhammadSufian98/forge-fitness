"use client";

import { useCallback, useEffect } from "react";
import useAuthStore from "@/stores/auth/useAuthStore";

export default function AuthInitializer({ children }) {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  const verifyAuth = useCallback(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return children;
}
