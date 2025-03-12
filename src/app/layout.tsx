'use client';

import "./globals.css";
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '../Components/Sidebar';
import Navbar from "@/Components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const isAuthPage = ['/login', '/register'].includes(pathname);

  useEffect(() => {
    if (!isAuthPage) { // Only handle resize for non-auth pages
      const handleResize = () => {
        if (window.innerWidth < 960) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isAuthPage]); // Add isAuthPage to dependency array

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          {/* Conditional Sidebar */}
          {!isAuthPage && (
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Conditional Navbar */}
            {!isAuthPage && (
              <Navbar
                className={cn(
                  "transition-all duration-300",
                  isSidebarOpen ? 'ml-60' : 'ml-20'
                )}
              />
            )}

            {/* Content Container with conditional margin */}
            <div className={cn(
              "flex-1 overflow-auto transition-all duration-300",
              !isAuthPage && (isSidebarOpen ? 'ml-60' : 'ml-20'),
              !isAuthPage ? "pt-16" : "pt-0" // Changed this line
            )}>
              {children}
          </div>
        </div>
      </div>
    </body>
    </html >
  );
}