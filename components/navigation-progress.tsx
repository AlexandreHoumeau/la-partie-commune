"use client";

import NProgress from "nprogress";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

NProgress.configure({ showSpinner: false, speed: 350, minimum: 0.08 });

export function NavigationProgress() {
  const pathname = usePathname();

  // Start NProgress on any internal link click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // Only trigger for internal navigation links (not anchors, not external)
      if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !anchor.hasAttribute("download") &&
        anchor.target !== "_blank"
      ) {
        NProgress.start();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Stop NProgress when route change completes
  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  return null;
}
