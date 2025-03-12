// components/ui/card.tsx
import * as React from 'react';

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
}