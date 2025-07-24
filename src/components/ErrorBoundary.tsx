import React, { useState, useEffect } from 'react';

export function ErrorBoundary({ children, onError }: { children: React.ReactNode, onError: (err: any) => void }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(false); }, [children]);
  return hasError ? null : (
    <React.Suspense fallback={null}>
      <ErrorCatcher onError={err => { setHasError(true); onError(err); }}>
        {children}
      </ErrorCatcher>
    </React.Suspense>
  );
}

export function ErrorCatcher({ children, onError }: { children: React.ReactNode, onError: (err: any) => void }) {
  try { return <>{children}</>; } catch (err) { onError(err); return null; }
} 