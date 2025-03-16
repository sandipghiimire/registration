"use client";

import { useEffect, useState } from "react";
import { Card } from "../../Components/ui/card";

export default function ClassPage() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [form, setForm] = useState({ name: "", subjects: [], image: "" });
  const [subjectForm, setSubjectForm] = useState({ name: "", code: "", creditHour: 3, classId: "" });

  // Fetch Classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/class");
        const data = await res.json();
        if (data.success) {
          setClasses(data.data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch Subjects for Dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subject");
        const data = await res.json();
        if (data.success) {
          setSubjects(data.subjects);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  // Handle Form Change (Class)
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else if (name === "subjects") {
      const values = Array.from(e.target.selectedOptions, (option) => option.value);
      setForm({ ...form, subjects: values });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle Form Change (Subject)
  const handleSubjectChange = (e: any) => {
    const { name, value } = e.target;
    setSubjectForm({ ...subjectForm, [name]: value });
  };

  // Handle Submit (Class)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    form.subjects.forEach((subj) => formData.append("subjects", subj));
    formData.append("image", form.image);

    try {
      const res = await fetch("/api/class", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Class added successfully!");
        setShowForm(false);
        window.location.reload();
      } else {
        console.error("Error adding class");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };

  // Handle Submit (Subject)
  const handleSubjectSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectForm),
      });

      if (res.ok) {
        alert("Subject added successfully!");
        setShowSubjectForm(false);
        window.location.reload();
      } else {
        console.error("Error adding subject");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Available Classes</h1>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md mr-4" onClick={() => setShowSubjectForm(true)}>
            + Add Subject
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md" onClick={() => setShowForm(true)}>
            + Add Class
          </button>
        </div>
      </div>

      {/* Add Class Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold mb-4 text-black">Add New Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <div>
                <label className="block font-medium">Class Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block font-medium">Subjects</label>
                <select name="subjects" multiple value={form.subjects} onChange={handleChange} className="w-full border rounded p-2" required>
                  {subjects.map((subj: any) => (
                    <option key={subj._id} value={subj._id}>
                      {subj.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                Add Class
              </button>
              <button className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Form */}
      {showSubjectForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-bold mb-4 text-black">Add New Subject</h2>
            <form onSubmit={handleSubjectSubmit} className="space-y-4 text-black">
              <div>
                <label className="block font-medium">Subject Name</label>
                <input type="text" name="name" value={subjectForm.name} onChange={handleSubjectChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block font-medium">Code</label>
                <input type="text" name="code" value={subjectForm.code} onChange={handleSubjectChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block font-medium">Credit Hour</label>
                <input type="number" name="creditHour" value={subjectForm.creditHour} onChange={handleSubjectChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block font-medium">Class</label>
                <select name="classId" value={subjectForm.classId} onChange={handleSubjectChange} className="w-full border rounded p-2" required>
                  <option value="" disabled>Select Class</option>
                  {classes.map((cls: any) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md">
                Add Subject
              </button>
              <button className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md" onClick={() => setShowSubjectForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display Classes */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((cls: any) => (
          <Card key={cls._id} className="shadow-md hover:shadow-lg transition">
            <div className="p-4">
              {cls.image && (
                <img src={cls.image} alt={cls.name} className="w-full h-48 object-cover rounded-t-md mb-4" />
              )}
              <h3 className="text-lg font-bold text-black">{cls.name}</h3>
              <p className="text-gray-600">
                Subjects: {cls.subjects && cls.subjects.length > 0 ? cls.subjects.map((subj: any) => subj.name).join(", ") : "No subjects assigned"}
              </p>
              <p className="text-gray-500">Students: {Math.floor(Math.random() * 30) + 10}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
