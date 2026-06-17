import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div
          className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline/[0.08] bg-surface-overlay/60"
          aria-hidden="true"
        >
          <Compass className="h-8 w-8 text-text-tertiary" strokeWidth={1.5} />
        </div>
        <p className="text-caption uppercase text-text-tertiary">Error 404</p>
        <h1 className="mt-2 text-h1 text-text-primary">This page wandered off</h1>
        <p className="mt-3 text-balance text-body text-text-secondary">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <Button asChild variant="primary" size="md" className="mt-8">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
