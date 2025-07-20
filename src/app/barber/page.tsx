"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BarberRedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToBarberPage = async () => {
      if (status === "loading") return;
      
      if (status === "unauthenticated") {
        console.log("User not authenticated, redirecting to login");
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching business ID for user:", session?.user?.email);
        
        // Fetch the business ID for the current user
        const response = await fetch("/api/business/id");
        console.log("Business ID API response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch business ID:", errorData);
          throw new Error(errorData.error || "Failed to fetch business ID");
        }
        
        const data = await response.json();
        console.log("Business ID API response data:", data);
        
        if (data.businessId) {
          console.log("Redirecting to barber page with ID:", data.businessId);
          // Verify the business exists before redirecting
          const verifyResponse = await fetch(`/api/public/businesses/${data.businessId}`);
          
          if (verifyResponse.ok) {
            // Redirect to the barber page with the correct ID
            router.push(`/barbers/${data.businessId}`);
          } else {
            console.error("Business ID exists but business not found in public API");
            setError("Your business profile could not be found. Please contact support.");
          }
        } else {
          setError("No business found for your account");
        }
      } catch (err: any) {
        console.error("Error redirecting to barber page:", err);
        setError(err.message || "Error finding your business profile");
      } finally {
        setLoading(false);
      }
    };

    redirectToBarberPage();
  }, [router, status, session?.user?.email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
              >
                Return to Home
              </Link>
              <Link
                href="/business"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-center"
              >
                Go to Business Dashboard
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Loading Your Profile</h2>
            <p className="text-gray-700">Please wait while we prepare your barber profile.</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Redirecting...</h2>
            <p className="text-gray-700">Please wait while we redirect you to your barber profile.</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
