"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";

interface BusinessSettings {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  openingHours: string | null;
}

export default function BusinessSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    openingHours: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Redirect if not authenticated or not a business owner or admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== Role.BUSINESS_OWNER && session?.user?.role !== Role.ADMIN) {
      router.push("/unauthorized");
    } else {
      fetchSettings();
    }
  }, [session, status, router]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch business settings');
      }
      const data = await response.json();
      setSettings(data);
      setFormData({
        name: data.name || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        description: data.description || "",
        openingHours: data.openingHours || "",
      });
    } catch (error) {
      console.error('Error fetching business settings:', error);
      setError('Failed to load business settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/business/settings', {
        method: settings ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update business settings');
      }
      
      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccess('Business settings updated successfully!');
    } catch (error) {
      console.error('Error updating business settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to update business settings');
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated" || (session?.user?.role !== Role.BUSINESS_OWNER && session?.user?.role !== Role.ADMIN)) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Business Settings</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your business information</p>
          </div>
          
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Form */}
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow sm:rounded-md">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">Opening Hours</label>
                <textarea
                  name="openingHours"
                  id="openingHours"
                  rows={3}
                  value={formData.openingHours}
                  onChange={handleInputChange}
                  placeholder="e.g. Mon-Fri: 9am-5pm, Sat: 10am-4pm, Sun: Closed"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
