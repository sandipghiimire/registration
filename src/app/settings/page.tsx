'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  gender: string;
  dob: string;
  mobile: string;

}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    middleName: '',
    email: '',
    password: '',
    lastName: "",
    mobile: "",
    gender: "",
    dob: '',
    isAdmin: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/register');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.data);

      // console.log("User Data", data)

    } catch (err) {
      setError('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/register/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAdmin }), // Send the isAdmin value in the body
      });

      if (!response.ok) throw new Error('Failed to update role');

      // Update the state with the new role
      setUsers(users.map(user =>
        user._id === userId ? { ...user, isAdmin } : user
      ));
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/register/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error('Failed to create user');

      await fetchUsers();
      setIsModalOpen(false);
      setNewUser({ firstName: '', middleName: '', dob: '', gender: '', lastName: '', mobile: '', email: '', password: '', isAdmin: false });
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 mx-auto bg-slate-200 h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-400">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Joined</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4" /></td>
                  <td className="px-6 py-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-2/3" /></td>
                  <td className="px-6 py-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-1/4" /></td>
                  <td className="px-6 py-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-1/3" /></td>
                  <td className="px-6 py-4 text-right animate-pulse"><div className="h-4 bg-gray-200 rounded w-1/2 inline-block" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800">{user.firstName}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{user.isAdmin ? 'Teacher' : 'Student'}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => updateRole(user._id, !user.isAdmin)} className="text-blue-600 hover:text-blue-800 transition-colors">
                      {user.isAdmin ? 'Make Student' : 'Make Teacher'}
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="text-red-600 hover:text-red-800 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for creating a new user */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[550px]">
            <h2 className="text-xl font-bold mb-4 text-black">Create New User</h2>
            <form onSubmit={createUser}>
              <div className="grid grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-black"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={newUser.middleName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-black"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-black"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-black"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-black"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={newUser.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-black"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={newUser.mobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-black"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={newUser.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-black"
                    required
                  >
                    <option value="" disabled>-- Select Gender --</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>


                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Admin</label>
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={newUser.isAdmin}
                    onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 px-6 py-2 rounded-md text-white hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
