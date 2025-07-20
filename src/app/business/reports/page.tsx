"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import Link from "next/link";

interface ReportData {
  period: string;
  bookings: number;
  revenue: number;
  newClients: number;
  avgServiceTime: number;
}

export default function BusinessReports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("monthly");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  
  // Sample data for demonstration
  const monthlyData: ReportData[] = [
    { period: "Jan 2025", bookings: 45, revenue: 1350, newClients: 12, avgServiceTime: 45 },
    { period: "Feb 2025", bookings: 52, revenue: 1560, newClients: 8, avgServiceTime: 42 },
    { period: "Mar 2025", bookings: 48, revenue: 1440, newClients: 10, avgServiceTime: 40 },
    { period: "Apr 2025", bookings: 60, revenue: 1800, newClients: 15, avgServiceTime: 38 },
    { period: "May 2025", bookings: 65, revenue: 1950, newClients: 18, avgServiceTime: 39 },
    { period: "Jun 2025", bookings: 70, revenue: 2100, newClients: 20, avgServiceTime: 37 },
    { period: "Jul 2025", bookings: 58, revenue: 1740, newClients: 14, avgServiceTime: 41 }
  ];
  
  const weeklyData: ReportData[] = [
    { period: "Week 1 Jul", bookings: 14, revenue: 420, newClients: 4, avgServiceTime: 42 },
    { period: "Week 2 Jul", bookings: 16, revenue: 480, newClients: 3, avgServiceTime: 40 },
    { period: "Week 3 Jul", bookings: 15, revenue: 450, newClients: 5, avgServiceTime: 41 },
    { period: "Week 4 Jul", bookings: 13, revenue: 390, newClients: 2, avgServiceTime: 43 }
  ];
  
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
        // Load report data
        loadReportData();
      }
    }
  }, [session, status, router, reportType]);
  
  const loadReportData = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Set data based on selected report type
        setReportData(reportType === "monthly" ? monthlyData : weeklyData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading report data:", err);
        setError("Failed to load report data. Please try again later.");
        setLoading(false);
      }
    }, 500);
  };
  
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Period", "Bookings", "Revenue ($)", "New Clients", "Avg Service Time (min)"];
    const csvContent = [
      headers.join(","),
      ...reportData.map(row => 
        [row.period, row.bookings, row.revenue, row.newClients, row.avgServiceTime].join(",")
      )
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `trimslots-${reportType}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        <Navigation />
        <div className="pt-24 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        <Navigation />
        <div className="pt-24 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <p className="text-red-200">{error}</p>
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
          {/* Reports Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">Business Reports</h1>
              <p className="mt-1 text-sm text-blue-200">View and analyze your business performance metrics</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link 
                href="/business"
                className="inline-flex items-center rounded-md bg-blue-800/50 backdrop-blur-sm px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 border border-blue-700/50 transition-all duration-300"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
              <button 
                onClick={handleExportCSV}
                className="inline-flex items-center rounded-md bg-green-600/80 backdrop-blur-sm px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-all duration-300"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Report Type Selector */}
          <div className="mb-6">
            <div className="bg-blue-900/50 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-800/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-white mb-3 sm:mb-0">Report Settings</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-200">Report Type:</span>
                  <div className="relative">
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-blue-800/50 text-white shadow-sm ring-1 ring-inset ring-blue-700 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Report Data */}
          <div className="bg-blue-900/50 backdrop-blur-sm rounded-lg shadow-lg border border-blue-800/50 overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-white">
                {reportType === "monthly" ? "Monthly Performance Report" : "Weekly Performance Report"}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-blue-200">
                {reportType === "monthly" ? "Data aggregated by month" : "Data aggregated by week"}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-800">
                <thead className="bg-blue-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Period
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                      New Clients
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Avg. Service Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-blue-900/30 divide-y divide-blue-800">
                  {reportData.map((row, index) => (
                    <tr key={index} className="hover:bg-blue-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {row.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                        {row.bookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                        ${row.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                        {row.newClients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100">
                        {row.avgServiceTime} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary Cards */}
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-white mb-4">Summary</h4>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-blue-800/50 backdrop-blur-sm overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 border border-blue-700/50">
                  <dt className="truncate text-sm font-medium text-blue-200">Total Bookings</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    {reportData.reduce((sum, row) => sum + row.bookings, 0)}
                  </dd>
                </div>
                <div className="bg-blue-800/50 backdrop-blur-sm overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 border border-blue-700/50">
                  <dt className="truncate text-sm font-medium text-blue-200">Total Revenue</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    ${reportData.reduce((sum, row) => sum + row.revenue, 0).toFixed(2)}
                  </dd>
                </div>
                <div className="bg-blue-800/50 backdrop-blur-sm overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 border border-blue-700/50">
                  <dt className="truncate text-sm font-medium text-blue-200">New Clients</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    {reportData.reduce((sum, row) => sum + row.newClients, 0)}
                  </dd>
                </div>
                <div className="bg-blue-800/50 backdrop-blur-sm overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 border border-blue-700/50">
                  <dt className="truncate text-sm font-medium text-blue-200">Avg. Service Time</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    {Math.round(reportData.reduce((sum, row) => sum + row.avgServiceTime, 0) / reportData.length)} min
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
