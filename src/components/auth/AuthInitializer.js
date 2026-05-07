"use client";

import { useEffect } from "react";
import useAuthStore from "@/stores/auth/useAuthStore";

export default function AuthInitializer({ children }) {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return children;
}
