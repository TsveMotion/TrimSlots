"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [middlewareInfo, setMiddlewareInfo] = useState<any>(null);

  useEffect(() => {
    // Add a function to test middleware behavior
    const testMiddleware = async () => {
      try {
        const response = await fetch('/api/debug-auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setMiddlewareInfo(data);
        }
      } catch (error) {
        console.error('Error testing middleware:', error);
      }
    };

    if (status === 'authenticated') {
      testMiddleware();
    }
  }, [status]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Status</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {status === 'loading' ? 'Loading...' : JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Role Information</h2>
        <div className="mb-4">
          <p><strong>Session Status:</strong> {status}</p>
          <p><strong>User Role:</strong> {session?.user?.role || 'No role found'}</p>
          <p><strong>Role Type:</strong> {session?.user?.role ? typeof session.user.role : 'N/A'}</p>
        </div>
      </div>

      {middlewareInfo && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Middleware Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(middlewareInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
