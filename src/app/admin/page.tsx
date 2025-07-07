"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import Link from "next/link";

// Define activity type
interface Activity {
  id: string;
  type: 'new_business' | 'new_user' | 'booking' | 'payment';
  name: string;
  time: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Stats for the dashboard - moved before conditional returns
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: "$0.00"
  });
  
  // Recent activities for the activity feed - moved before conditional returns
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  
  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== Role.ADMIN) {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated" || session?.user?.role !== Role.ADMIN) {
    return null; // Will be redirected by the useEffect
  }
  
  // Loading state for dashboard data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/stats', {
          // Add cache: 'no-store' to prevent caching issues
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        // Check if data has the expected structure
        if (data && data.stats) {
          setStats(data.stats);
          setRecentActivities(data.recentActivities || []);
          setError(null);
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
        // Set default values to prevent blank UI
        setStats({
          totalBusinesses: 0,
          totalUsers: 0,
          totalBookings: 0,
          revenue: "$0.00"
        });
        setRecentActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.role === Role.ADMIN) {
      fetchDashboardData();
    }
  }, [session]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
              Admin Dashboard
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Manage all aspects of the TrimSlots platform from one central location.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>
      
      {/* Stats Section */}
      <section className="relative py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Businesses */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Businesses</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{stats.totalBusinesses}</h3>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/businesses" className="text-sm text-blue-300 hover:text-blue-200 flex items-center">
                  View all businesses
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Total Users */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Users</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</h3>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/users" className="text-sm text-blue-300 hover:text-blue-200 flex items-center">
                  View all users
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Total Bookings */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Bookings</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{stats.totalBookings}</h3>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/bookings" className="text-sm text-blue-300 hover:text-blue-200 flex items-center">
                  View all bookings
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Total Revenue */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{stats.revenue}</h3>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/reports" className="text-sm text-blue-300 hover:text-blue-200 flex items-center">
                  View financial reports
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Activity Feed Section */}
      <section className="relative py-8 px-4 mb-12">
        <div className="container mx-auto max-w-7xl">
          <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-100 mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 rounded-lg bg-blue-900/30 border border-blue-500/10">
                  <div className="flex-shrink-0 mr-4">
                    {activity.type === 'new_business' && (
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    )}
                    {activity.type === 'new_user' && (
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                      </div>
                    )}
                    {activity.type === 'booking' && (
                      <div className="bg-purple-500/20 p-2 rounded-full">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                    {activity.type === 'payment' && (
                      <div className="bg-yellow-500/20 p-2 rounded-full">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-100">{activity.name}</p>
                    <p className="text-blue-300 text-sm">{activity.time}</p>
                  </div>
                  <Link href="#" className="text-blue-400 hover:text-blue-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/admin/activity" 
                className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-500 transition-all duration-300 hover:shadow-blue-500/25"
              >
                View All Activity
                <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Actions Section */}
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg p-8 shadow-xl max-w-md w-full">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Success!</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Your action has been completed successfully.</p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative py-8 px-4 mb-12">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-100">Quick Actions</h2>
            <Link 
              href="/admin/businesses/new"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Business
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/businesses" className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium text-blue-100">Manage Businesses</span>
              </div>
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
            
            <Link href="/admin/users" className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium text-blue-100">Manage Users</span>
              </div>
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
            
            <Link href="/admin/reports" className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium text-blue-100">View Reports</span>
              </div>
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Card: Add Booking */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-blue-100">New Booking</h3>
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-sm text-blue-200 mb-4">Create a new booking for any business</p>
              <Link 
                href="/admin/bookings/new" 
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
              >
                Create Booking
              </Link>
            </div>

            {/* New Card: System Settings */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-blue-100">System Settings</h3>
                <div className="bg-gray-500/20 p-2 rounded-full">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-sm text-blue-200 mb-4">Configure platform settings</p>
              <Link 
                href="/admin/settings" 
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
              >
                Manage Settings
              </Link>
            </div>

            {/* New Card: Help & Support */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-blue-100">Help & Support</h3>
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-sm text-blue-200 mb-4">Get help or contact support</p>
              <Link 
                href="/admin/support" 
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
