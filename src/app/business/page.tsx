"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BusinessStats {
  totalBookings: number;
  activeClients: number;
  monthlyRevenue: number;
  avgBookingValue: number;
  activeWorkers: number;
  activeServices: number;
  todayBookings: number;
  pendingPayments: number;
}

export default function BusinessDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<BusinessStats>({
    totalBookings: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    avgBookingValue: 0,
    activeWorkers: 0,
    activeServices: 0,
    todayBookings: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Redirect if not authenticated or not a business owner or admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      // Check if user has appropriate role
      const userRole = session?.user?.role;
      
      // Convert role to uppercase string for comparison
      const normalizedRole = userRole ? String(userRole).toUpperCase() : '';
      
      // Check if role is allowed
      const isAllowed = [
        String(Role.BUSINESS_OWNER).toUpperCase(),
        String(Role.ADMIN).toUpperCase(),
        "BUSINESS_OWNER",
        "ADMIN"
      ].some(role => role.toUpperCase() === normalizedRole);
      
      if (!isAllowed) {
        router.push("/unauthorized");
      } else {
        // Fetch business data
        fetchBusinessData();
      }
    }
  }, [session, status, router]);
  
  // Fetch business data
  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch business details
      const businessRes = await fetch('/api/business');
      if (!businessRes.ok) {
        throw new Error("Failed to load business details");
      }
      const businessData = await businessRes.json();
      setBusiness(businessData);
      
      // Fetch business stats
      const statsRes = await fetch('/api/business/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Error fetching business data:", err);
      setError("Failed to load business information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated" || (session?.user?.role !== Role.BUSINESS_OWNER && session?.user?.role !== Role.ADMIN)) {
    return null; // Will be redirected by the useEffect
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      <Navigation />
      <div className="pt-24 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">{business?.name || 'Business Dashboard'}</h1>
              <p className="mt-1 text-sm text-blue-200">{business?.description || 'Manage your barber business operations'}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link 
                href="/barber" 
                className="inline-flex items-center rounded-md bg-blue-700/50 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600/50 transition-all duration-300 border border-blue-500/50"
              >
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                View Barber Profile
              </Link>
              <Link 
                href={`/barbers/${business?.id}`} 
                target="_blank" 
                className="inline-flex items-center rounded-md bg-blue-600/70 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500/70 transition-all duration-300 border border-blue-500/50"
              >
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Preview Business Page
              </Link>
              <Link 
                href="/business/reports" 
                className="inline-flex items-center rounded-md bg-blue-700/50 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600/50 transition-all duration-300 border border-blue-500/50"
              >
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                View Reports
              </Link>
              <Link 
                href="/business/bookings/new" 
                className="inline-flex items-center rounded-md bg-blue-600/80 backdrop-blur-sm px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all duration-300"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Booking
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-blue-900/50 backdrop-blur-sm px-4 py-5 shadow-lg sm:p-6 border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <dt className="truncate text-sm font-medium text-blue-200">Total Bookings</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">{stats.totalBookings}</dd>
              <dd className="mt-2 flex items-center text-sm text-green-400">
                <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">12% increase</span>
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-blue-900/50 backdrop-blur-sm px-4 py-5 shadow-lg sm:p-6 border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <dt className="truncate text-sm font-medium text-blue-200">Active Clients</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">{stats.activeClients}</dd>
              <dd className="mt-2 flex items-center text-sm text-green-400">
                <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">8% increase</span>
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-blue-900/50 backdrop-blur-sm px-4 py-5 shadow-lg sm:p-6 border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <dt className="truncate text-sm font-medium text-blue-200">Monthly Revenue</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">${stats.monthlyRevenue.toFixed(2)}</dd>
              <dd className="mt-2 flex items-center text-sm text-green-400">
                <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">15% increase</span>
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-blue-900/50 backdrop-blur-sm px-4 py-5 shadow-lg sm:p-6 border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <dt className="truncate text-sm font-medium text-blue-200">Avg. Booking Value</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">${stats.avgBookingValue.toFixed(2)}</dd>
              <dd className="mt-2 flex items-center text-sm text-green-400">
                <svg className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">5% increase</span>
              </dd>
            </div>
          </div>
          
          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-blue-900/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <div className="p-5 border-b border-blue-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-white">Workers</h3>
                  <span className="inline-flex items-center rounded-full bg-blue-700/70 px-2.5 py-0.5 text-xs font-medium text-blue-100">{stats.activeWorkers} Active</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-blue-200">Manage your barbers and staff</p>
              </div>
              <div className="bg-blue-800/30 px-5 py-3">
                <Link href="/business/workers" className="text-sm font-medium text-blue-200 hover:text-white transition-all duration-300 flex items-center">
                  Manage Workers 
                  <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-900/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <div className="p-5 border-b border-blue-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-white">Services</h3>
                  <span className="inline-flex items-center rounded-full bg-green-700/70 px-2.5 py-0.5 text-xs font-medium text-green-100">{stats.activeServices} Active</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-blue-200">Manage your service offerings</p>
              </div>
              <div className="bg-blue-800/30 px-5 py-3">
                <Link href="/business/services" className="text-sm font-medium text-blue-200 hover:text-white transition-all duration-300 flex items-center">
                  Manage Services 
                  <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-900/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <div className="p-5 border-b border-blue-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-white">Bookings</h3>
                  <span className="inline-flex items-center rounded-full bg-purple-700/70 px-2.5 py-0.5 text-xs font-medium text-purple-100">{stats.todayBookings} Today</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-blue-200">View and manage all appointments</p>
              </div>
              <div className="bg-blue-800/30 px-5 py-3">
                <Link href="/business/bookings" className="text-sm font-medium text-blue-200 hover:text-white transition-all duration-300 flex items-center">
                  View Bookings 
                  <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-900/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <div className="p-5 border-b border-blue-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-white">Clients</h3>
                  <span className="inline-flex items-center rounded-full bg-yellow-600/70 px-2.5 py-0.5 text-xs font-medium text-yellow-100">{stats.activeClients} Total</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-blue-200">Manage your client database</p>
              </div>
              <div className="bg-blue-800/30 px-5 py-3">
                <Link href="/business/clients" className="text-sm font-medium text-blue-200 hover:text-white transition-all duration-300 flex items-center">
                  View Clients 
                  <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-900/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <div className="p-5 border-b border-blue-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-white">Business Settings</h3>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-blue-200">Update your business information</p>
              </div>
              <div className="bg-blue-800/30 px-5 py-3">
                <Link href="/business/settings" className="text-sm font-medium text-blue-200 hover:text-white transition-all duration-300 flex items-center">
                  Edit Settings 
                  <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-900/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-lg border border-blue-800/50 hover:border-blue-700/50 transition-all duration-300">
              <div className="p-5 border-b border-blue-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-white">Payments</h3>
                  <span className="inline-flex items-center rounded-full bg-red-700/70 px-2.5 py-0.5 text-xs font-medium text-red-100">{stats.pendingPayments} Pending</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-blue-200">Manage invoices and payment processing</p>
              </div>
              <div className="bg-blue-800/30 px-5 py-3">
                <Link href="/business/payments" className="text-sm font-medium text-blue-200 hover:text-white transition-all duration-300 flex items-center">
                  Manage Payments 
                  <svg className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-br from-blue-900/20 to-blue-950/20">
        </div>
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-48 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>
    </div>
  );
}
