// components/ClassCard.tsx
import Image from "next/image";

interface ClassCardProps {
  id: string;
  imageUrl: string;
  studentCount: number;
  className: string;
}

export default function ClassCard({ id, imageUrl, studentCount, className }: ClassCardProps) {
  return (
    <div className="bg-slate-300 group relative h-64 w-full cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Image Section (85% height) */}
      <div className="relative h-[85%] w-full">
        <Image
          src={imageUrl}
          alt={className}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Student Count Section (15% height) */}
      <div className="flex h-[15%] items-center justify-between bg-white px-4 dark:bg-gray-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {className}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {studentCount}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Students
          </span>
        </div>
      </div>
    </div>
  );
}