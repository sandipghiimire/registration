// app/classes/page.tsx
import ClassCard from "../../Components/ClassCard";

const classes = [
  {
    id: "1",
    studentCount: 24,
    className: "Mathematics 101",
    subject: "math"
  },
  {
    id: "2",
    studentCount: 18,
    className: "Physics Laboratory",
    subject: "physics"
  },
  {
    id: "3",
    studentCount: 32,
    className: "Chemistry Advanced",
    subject: "chemistry"
  },
  {
    id: "4",
    studentCount: 22,
    className: "Literature Class",
    subject: "books"
  },
  {
    id: "5",
    studentCount: 28,
    className: "Computer Science",
    subject: "programming"
  },
  {
    id: "6",
    studentCount: 19,
    className: "Art Workshop",
    subject: "art"
  },
];

export default function ClassPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <h1 className="mb-8 text-3xl font-bold text-gray-800 dark:text-gray-100">
        Available Classes
      </h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((cls) => (
          <ClassCard
            key={cls.id}
            id={cls.id}
            studentCount={cls.studentCount}
            className={cls.className}
            subject={cls.subject}
          />
        ))}
      </div>
    </div>
  );
}