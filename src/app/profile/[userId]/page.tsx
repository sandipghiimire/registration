'use client';

import { useState, useEffect } from "react";
import { Edit, Key } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import mongoose from "mongoose";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {

  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  // Individual state variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  // Password and UI states
  const [password, setPassword] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [activeTab, setActiveTab] = useState("editProfile");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Tab change handler
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setError("");
    setSuccessMessage("");
  };

  // Add this useEffect hook
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error("Invalid user ID");
        }

        const response = await fetch(`/api/register/${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          const result = data.data;
          const formattedDob = result.dob
            ? new Date(result.dob).toISOString().split('T')[0]
            : "";

          setFirstName(result.firstName);
          setMiddleName(result.middleName || "");
          setLastName(result.lastName);
          setEmail(result.email);
          setMobile(result.mobile.toString());
          setDob(formattedDob);
          setGender(result.gender);

          console.log("Gender:", data.data.gender)
        }
      } catch (error:any) {
        console.error("Fetch error:", error);
        setError(error.message);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, router]);



  // Update profile handler
  const updateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/register/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          middleName,
          lastName,
          email,
          mobile,
          dob,
          gender
        })
      });

      const result = await response.json();
      console.log("result", result)

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      setSuccessMessage("Profile updated successfully!");
    } catch (error:any) {
      setError(error.message || "Error updating profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.newPassword !== password.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsChangingPassword(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/register/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: true, // Flag for password update
          currentPassword: password.currentPassword,
          newPassword: password.newPassword
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Password update failed');
      }

      setSuccessMessage("Password updated successfully!");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error:any) {
      setError(error.message || "Error changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Uncomment loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-200 p-6 flex items-center justify-center">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-200 p-6">
      <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${activeTab === "editProfile"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => handleTabChange("editProfile")}
          >
            <Edit size={18} />
            Edit Profile
          </button>
          <button
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${activeTab === "changePassword"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => handleTabChange("changePassword")}
          >
            <Key size={18} />
            Change Password
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Edit Profile Form */}
        {activeTab === "editProfile" && (
          <form onSubmit={updateStudent} className="space-y-6 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {/* Add this to your form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Add this to your form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
              >
                {isUpdatingProfile ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Change Password Form */}
        {activeTab === "changePassword" && (
          <form onSubmit={handlePasswordChange} className="space-y-6 text-black">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={password.currentPassword}
                  onChange={(e) => setPassword(p => ({ ...p, currentPassword: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password.newPassword}
                  onChange={(e) => setPassword(p => ({ ...p, newPassword: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={password.confirmPassword}
                  onChange={(e) => setPassword(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}