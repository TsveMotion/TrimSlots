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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{business?.name || 'Business Dashboard'}</h1>
              <p className="mt-1 text-sm text-gray-500">{business?.description || 'Manage your barber business operations'}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link 
                href={`/barbers/${business?.id}`} 
                target="_blank"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Preview Business Page
              </Link>
              <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <svg className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M2.5 3A1.5 1.5 0 001 4.5v4A1.5 1.5 0 002.5 10h6A1.5 1.5 0 0010 8.5v-4A1.5 1.5 0 008.5 3h-6zm11 0A1.5 1.5 0 0012 4.5v4A1.5 1.5 0 0013.5 10h4A1.5 1.5 0 0019 8.5v-4A1.5 1.5 0 0017.5 3h-4zm-10 7A1.5 1.5 0 002.5 11.5v4A1.5 1.5 0 004 17h6a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0010 10h-6zm11 0a1.5 1.5 0 00-1.5 1.5v4a1.5 1.5 0 001.5 1.5h4a1.5 1.5 0 001.5-1.5v-4a1.5 1.5 0 00-1.5-1.5h-4z" />
                </svg>
                View Reports
              </button>
              <Link href="/business/bookings/new" className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700">
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Booking
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Total Bookings</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.totalBookings}</dd>
              <dd className="mt-2 flex items-center text-sm text-green-600">
                <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">12% increase</span>
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Active Clients</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.activeClients}</dd>
              <dd className="mt-2 flex items-center text-sm text-green-600">
                <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">8% increase</span>
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Monthly Revenue</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">${stats.monthlyRevenue.toFixed(2)}</dd>
              <dd className="mt-2 flex items-center text-sm text-green-600">
                <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">15% increase</span>
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Avg. Booking Value</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">${stats.avgBookingValue.toFixed(2)}</dd>
              <dd className="mt-2 flex items-center text-sm text-green-600">
                <svg className="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">5% increase</span>
              </dd>
            </div>
          </div>
          
          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Workers</h3>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">{stats.activeWorkers} Active</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-500">Manage your barbers and staff</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="/business/workers" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Manage Workers <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Services</h3>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">{stats.activeServices} Active</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-500">Manage your service offerings</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="/business/services" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Manage Services <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Bookings</h3>
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">{stats.todayBookings} Today</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-500">View and manage all appointments</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="/business/bookings" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  View Bookings <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Clients</h3>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">{stats.activeClients} Total</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-500">Manage your client database</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="/business/clients" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  View Clients <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Business Settings</h3>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-500">Update your business information</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="/business/settings" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Edit Settings <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Payments</h3>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">{stats.pendingPayments} Pending</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-500">Manage invoices and payment processing</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="/business/payments" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Manage Payments <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
