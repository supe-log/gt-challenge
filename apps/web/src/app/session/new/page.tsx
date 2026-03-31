"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SessionStarter() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("child");

  if (!childId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No child selected. Go back to the dashboard.</p>
      </div>
    );
  }

  // Render the actual session page with child param
  // The [sessionId] page handles session creation via the store
  return (
    <meta httpEquiv="refresh" content={`0;url=/session/active?child=${childId}`} />
  );
}

export default function NewSessionPage() {
  return (
    <Suspense>
      <SessionStarter />
    </Suspense>
  );
}
