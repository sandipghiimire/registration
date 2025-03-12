// components/ProtectedLayout.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar className={cn(
          "transition-all duration-300",
          isSidebarOpen ? 'ml-60' : 'ml-20'
        )} />
        <div className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          isSidebarOpen ? 'ml-60' : 'ml-20',
          "pt-16"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}