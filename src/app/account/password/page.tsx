"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChangePasswordPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!session && !isLoading) {
      router.push("/auth/signin?callbackUrl=/account/password");
    } else {
      setIsLoading(false);
    }
  }, [session, isLoading, router]);

  // Check password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }

    // Simple password strength check
    let strength = 0;
    let feedback = [];

    // Length check
    if (newPassword.length >= 8) {
      strength += 1;
    } else {
      feedback.push("Password should be at least 8 characters long");
    }

    // Contains uppercase
    if (/[A-Z]/.test(newPassword)) {
      strength += 1;
    } else {
      feedback.push("Add uppercase letters");
    }

    // Contains lowercase
    if (/[a-z]/.test(newPassword)) {
      strength += 1;
    } else {
      feedback.push("Add lowercase letters");
    }

    // Contains numbers
    if (/[0-9]/.test(newPassword)) {
      strength += 1;
    } else {
      feedback.push("Add numbers");
    }

    // Contains special characters
    if (/[^A-Za-z0-9]/.test(newPassword)) {
      strength += 1;
    } else {
      feedback.push("Add special characters");
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback.join(" • "));
  }, [newPassword]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords don't match");
      return;
    }

    if (passwordStrength < 3) {
      setErrorMessage("Please create a stronger password");
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Clear success message after a few seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("An error occurred while updating your password");
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
            <span className="ml-3 text-white">Loading...</span>
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
            <h1 className="text-2xl font-semibold text-white">Change Password</h1>
          </div>
          <p className="text-gray-400 mt-1">Update your account password</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                Current Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="block w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full rounded-md bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          passwordStrength === 0 ? 'bg-red-500' : 
                          passwordStrength === 1 ? 'bg-red-500' : 
                          passwordStrength === 2 ? 'bg-yellow-500' : 
                          passwordStrength === 3 ? 'bg-yellow-500' : 
                          passwordStrength === 4 ? 'bg-green-500' : 'bg-green-400'
                        }`}
                        style={{ width: `${passwordStrength * 20}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-400">
                      {passwordStrength === 0 && "Very Weak"}
                      {passwordStrength === 1 && "Weak"}
                      {passwordStrength === 2 && "Fair"}
                      {passwordStrength === 3 && "Good"}
                      {passwordStrength === 4 && "Strong"}
                      {passwordStrength === 5 && "Very Strong"}
                    </span>
                  </div>
                  {passwordFeedback && (
                    <p className="mt-1 text-xs text-gray-500">{passwordFeedback}</p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`block w-full rounded-md bg-gray-800 border ${
                    confirmPassword && newPassword !== confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                  } text-white px-3 py-2 focus:outline-none focus:ring-2`}
                  placeholder="••••••••"
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-400">Passwords don't match</p>
              )}
            </div>

            {/* Password requirements */}
            <div className="rounded-md bg-gray-800/50 p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Password Requirements</h4>
              <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving || (newPassword !== "" && newPassword !== confirmPassword) || passwordStrength < 3}
                className={`w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  isSaving || (newPassword !== "" && newPassword !== confirmPassword) || passwordStrength < 3
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/account/profile"
              className="text-sm text-gray-400 hover:text-white flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Edit Profile
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
