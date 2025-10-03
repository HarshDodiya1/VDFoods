// components/GlobalLoader/GlobalLoader.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "../Loader/Loader";
import { useLoading } from "../../context/LoadingContext";

const GlobalLoaderContent: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading, loadingText } = useLoading();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    // Show loader when route starts changing
    setRouteLoading(true);

    // Hide loader after a short delay to allow page to load
    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Show loader if either route is changing or manual loading is active
  const shouldShowLoader = routeLoading || isLoading;

  return (
    <Loader
      isVisible={shouldShowLoader}
      text={routeLoading ? "Navigating..." : loadingText}
    />
  );
};

const GlobalLoader: React.FC = () => {
  return (
    <Suspense fallback={<Loader isVisible={true} text="Loading..." />}>
      <GlobalLoaderContent />
    </Suspense>
  );
};

export default GlobalLoader;
