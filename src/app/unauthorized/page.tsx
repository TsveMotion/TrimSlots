"use client";

import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>
        
        <div className="mt-6">
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
