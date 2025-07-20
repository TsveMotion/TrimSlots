"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!session && !isLoading) {
      router.push("/auth/signin?callbackUrl=/account/profile");
    }
  }, [session, isLoading, router]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/user/account");
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
            setName(data.name || "");
            setImage(data.image || "");
          } else {
            setErrorMessage("Failed to load profile data");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setErrorMessage("An error occurred while loading your profile");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Profile updated successfully");
        // Update session data if needed
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-white">Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800 p-6">
          <div className="flex items-center">
            <Link href="/" className="text-blue-400 hover:text-blue-300 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold text-white">Edit Profile</h1>
          </div>
          <p className="text-gray-400 mt-1">Update your personal information</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {successMessage && (
            <div className="mb-6 bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded-lg">
              <p>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl border-2 border-gray-600 shadow overflow-hidden">
                    {image ? (
                      <img src={image} alt={name || "User"} className="h-full w-full object-cover" />
                    ) : (
                      <span>{name?.charAt(0)?.toUpperCase() || "👤"}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={userProfile?.email || ""}
                      readOnly
                      className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-700 text-gray-400 px-3 py-2 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Note about additional fields */}
              <div className="rounded-md bg-blue-900/30 border border-blue-800 p-4 text-sm text-blue-300">
                <p>We'll be adding more profile fields like phone and address in a future update!</p>
              </div>

              {/* Profile Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/your-image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">Enter a URL to an image (we'll add image upload in a future update)</p>
              </div>

              {/* Role (read-only) */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                  Account Type
                </label>
                <input
                  type="text"
                  id="role"
                  value={userProfile?.role?.replace("_", " ").toLowerCase() || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-700 text-gray-400 px-3 py-2 cursor-not-allowed capitalize"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    isSaving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Links */}
          <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/account/password"
              className="text-sm text-gray-400 hover:text-white flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Change Password
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
