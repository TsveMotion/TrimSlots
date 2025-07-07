"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Business = {
  id: string;
  name: string;
};

type TestUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  businessId: string | null;
  business: Business | null;
  managedBusiness: Business | null;
  clientBusinesses: Array<{
    id: string;
    business: Business;
  }>;
  _count: {
    bookingsAsClient: number;
    bookingsAsWorker: number;
  };
};

export default function TestUserDisplay() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<TestUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/test/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        // Set the first user as selected by default
        if (data.length > 0) {
          setSelectedUser(data[0].id);
        }
      } catch (error) {
        setError("Error loading users. Admin access required.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-white">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-white">{error}</p>
          <p className="mt-4 text-gray-300">
            This page requires admin privileges to access.
          </p>
          <Link href="/" className="mt-4 inline-block text-blue-400 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900">
        <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">Admin Access Required</h2>
          <p className="text-white">
            This testing page is only accessible to administrators.
          </p>
          <Link href="/" className="mt-4 inline-block text-blue-400 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Display Testing</h1>
          <Link href="/admin" className="text-blue-400 hover:underline">
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Test Users</h2>
              <p className="text-gray-400 mb-4 text-sm">
                Select a user to preview how their homepage info box would appear.
              </p>
              
              <div className="space-y-3 mt-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser === user.id
                        ? "bg-blue-900/50 border border-blue-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                        <span className="text-lg">
                          {user.role === "ADMIN" ? '👑' : 
                           user.role === "BUSINESS_OWNER" ? '💼' : 
                           user.role === "WORKER" ? '✂️' : '👤'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{user.name || "Unnamed User"}</h3>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          {user.role.toLowerCase().replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>
                        Bookings: {user._count.bookingsAsClient} as client, 
                        {user._count.bookingsAsWorker} as worker
                      </p>
                      {user.business && (
                        <p>Associated with: {user.business.name}</p>
                      )}
                      {user.managedBusiness && (
                        <p>Manages: {user.managedBusiness.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Preview</h2>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  {previewMode ? "Show Technical Info" : "Show User View"}
                </button>
              </div>

              {selectedUser && (
                <div>
                  {previewMode ? (
                    <iframe
                      src={`/api/test/preview?userId=${selectedUser}`}
                      className="w-full h-[600px] border border-gray-700 rounded-lg bg-gray-900"
                      title="User Preview"
                    />
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white mb-2">
                        Selected User Data
                      </h3>
                      <pre className="bg-gray-800 p-4 rounded overflow-auto text-xs text-gray-300 max-h-[500px]">
                        {JSON.stringify(
                          users.find((u) => u.id === selectedUser),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Testing Notes</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>
                    This page allows admins to preview how the homepage info box appears for different users
                  </li>
                  <li>
                    The preview mode requires implementing an API endpoint at <code>/api/test/preview</code> that renders the HeroSection with the selected user's session
                  </li>
                  <li>
                    Currently showing raw user data in technical view mode
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
