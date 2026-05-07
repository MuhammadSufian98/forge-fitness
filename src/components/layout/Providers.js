"use client";

import { SWRConfig } from "swr";
import { fetcher } from "@/utils/userAuth";

export default function Providers({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: true,
        dedupingInterval: 60000, // 1 minute
      }}
    >
      {children}
    </SWRConfig>
  );
}
