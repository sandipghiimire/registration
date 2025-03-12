'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center px-6",
      "transition-all duration-300",
      className
    )}>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center flex-1 min-w-0 overflow-x-auto scrollbar-hide">
        <Link href="/" className="text-gray-500 hover:text-gray-700 shrink-0">
          <Home className="h-6 w-6" />
        </Link>
        
        <div className="flex items-center flex-1 min-w-0">
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = '/' + segments.slice(0, index + 1).join('/');
            const formattedSegment = segment.replace(/-/g, ' ');

            return (
              <div key={index} className="flex items-center shrink-0">
                <ChevronRight className="h-5 w-5 mx-2 text-gray-400 shrink-0" />
                {!isLast ? (
                  <Link
                    href={href}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 capitalize shrink-0"
                  >
                    {formattedSegment}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-gray-900 capitalize shrink-0">
                    {formattedSegment}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side Actions - Fixed Width */}
      <div className="ml-4 flex items-center gap-4 shrink-0 min-w-max">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">JD</span>
          </div>
        </div>
      </div>
    </nav>
  );
}