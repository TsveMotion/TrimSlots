"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  createdAt: string;
}

interface Business {
  id: string;
  name: string;
}

export default function ServicesManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Load data when authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status !== "loading") {
      fetchBusinessData();
      fetchServices();
    }
  }, [session, status, router]);
  
  const fetchBusinessData = async () => {
    try {
      const response = await fetch('/api/business');
      if (!response.ok) {
        throw new Error('Failed to fetch business data');
      }
      const data = await response.json();
      setBusiness(data);
    } catch (error) {
      console.error('Error fetching business data:', error);
      setError('Failed to load business data. Please try again.');
    }
  };

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'duration' || name === 'price' ? parseFloat(value) : value 
    }));
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add service');
      }
      
      await fetchServices();
      setSuccess('Service added successfully!');
      setFormData({ name: "", description: "", duration: 30, price: 0 });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding service:', error);
      setError(error instanceof Error ? error.message : 'Failed to add service');
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!currentService) return;
    
    try {
      const response = await fetch(`/api/services/${currentService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service');
      }
      
      await fetchServices();
      setSuccess('Service updated successfully!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating service:', error);
      setError(error instanceof Error ? error.message : 'Failed to update service');
    }
  };

  const handleDeleteService = async () => {
    setError("");
    setSuccess("");
    
    if (!currentService) return;
    
    try {
      const response = await fetch(`/api/services/${currentService.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete service');
      }
      
      await fetchServices();
      setSuccess('Service deleted successfully!');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting service:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete service');
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", description: "", duration: 30, price: 0 });
    setIsAddModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      duration: service.duration,
      price: service.price,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (service: Service) => {
    setCurrentService(service);
    setIsDeleteModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  };

  if (status === "loading" || isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated" || (session?.user?.role !== Role.BUSINESS_OWNER && session?.user?.role !== Role.ADMIN)) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      <Navigation />
      <div className="pt-24 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">Services Management</h1>
              <p className="mt-1 text-sm text-blue-300">Manage your service offerings</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              {business && (
                <Link 
                  href={`/barbers/${business.id}`} 
                  target="_blank"
                  className="inline-flex items-center rounded-md bg-blue-600/70 backdrop-blur-sm border border-blue-500/50 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500/70 transition-colors duration-200"
                >
                  <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Preview Business Page
                </Link>
              )}
              <button
                onClick={() => {
                  setFormData({ name: "", description: "", duration: 30, price: 0 });
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center rounded-md bg-blue-800/70 backdrop-blur-sm border border-blue-700/50 px-3 py-2 text-sm font-semibold text-blue-100 shadow-sm hover:bg-blue-700/70 transition-colors duration-200"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Service
              </button>
            </div>
          </div>
          
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 rounded-md bg-red-900/20 border border-red-500/50 backdrop-blur-sm p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-blue-900/20 border border-blue-500/50 backdrop-blur-sm p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-300">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Services Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow-lg border border-blue-700/50 md:rounded-lg bg-blue-900/30 backdrop-blur-sm">
                  <table className="min-w-full divide-y divide-blue-700/30">
                    <thead className="bg-blue-950/50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-blue-200 sm:pl-6">Service</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-200">Duration</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-200">Price</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-200">Description</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-700/30 bg-blue-900/20">
                      {services.length > 0 ? (
                        services.map((service) => (
                          <tr key={service.id} className="hover:bg-blue-800/30 transition-colors duration-150">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-blue-100 sm:pl-6">{service.name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-200">{formatDuration(service.duration)}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-200">{formatPrice(service.price)}</td>
                            <td className="px-3 py-4 text-sm text-blue-200 max-w-xs truncate">
                              {service.description || "No description"}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => openEditModal(service)}
                                className="text-blue-300 hover:text-blue-100 transition-colors duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900 rounded-md px-2 py-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(service)}
                                className="text-red-400 hover:text-red-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-blue-900 rounded-md px-2 py-1"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-sm text-blue-300">
                            No services found. Add your first service to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add Service Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-blue-900/90 border border-blue-700/50 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle backdrop-blur-sm">
                  <div className="bg-blue-900/90 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Add New Service</h3>
                        <div className="mt-2">
                          <form onSubmit={handleAddService}>
                            <div className="mb-4">
                              <label htmlFor="name" className="block text-sm font-medium text-blue-200">Service Name</label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-blue-700/50 bg-blue-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-blue-100 placeholder-blue-300/50"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="description" className="block text-sm font-medium text-blue-200">Description</label>
                              <textarea
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-blue-700/50 bg-blue-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-blue-100 placeholder-blue-300/50"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="duration" className="block text-sm font-medium text-blue-200">Duration (minutes)</label>
                              <input
                                type="number"
                                name="duration"
                                id="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min={5}
                                step={5}
                                required
                                className="mt-1 block w-full rounded-md border-blue-700/50 bg-blue-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-blue-100"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="price" className="block text-sm font-medium text-blue-200">Price ($)</label>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                min={0}
                                step={0.01}
                                required
                                className="mt-1 block w-full rounded-md border-blue-700/50 bg-blue-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-blue-100"
                              />
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-blue-600/50 bg-blue-700/80 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Add Service
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-blue-700 bg-blue-800/40 px-4 py-2 text-base font-medium text-blue-100 shadow-sm hover:bg-blue-800/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Edit Service Modal */}
          {isEditModalOpen && currentService && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-blue-900/90 border border-blue-700/50 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle backdrop-blur-sm">
                  <div className="bg-blue-900/90 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Edit Service</h3>
                        <div className="mt-2">
                          <form onSubmit={handleEditService}>
                            <div className="mb-4">
                              <label htmlFor="edit-name" className="block text-sm font-medium text-blue-200">Service Name</label>
                              <input
                                type="text"
                                name="name"
                                id="edit-name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-blue-700/50 bg-blue-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-blue-100 placeholder-blue-300/50"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="edit-description" className="block text-sm font-medium text-blue-200">Description</label>
                              <textarea
                                name="description"
                                id="edit-description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-blue-700/50 bg-blue-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-blue-100 placeholder-blue-300/50"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="edit-duration" className="block text-sm font-medium text-blue-200">Duration (minutes)</label>
                              <input
                                type="number"
                                name="duration"
                                id="edit-duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min={5}
                                step={5}
                                required
                                className="mt-1 block w-full rounded-md border-blue-700/50 bg-blue-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-blue-100"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="edit-price" className="block text-sm font-medium text-blue-200">Price ($)</label>
                              <input
                                type="number"
                                name="price"
                                id="edit-price"
                                value={formData.price}
                                onChange={handleInputChange}
                                min={0}
                                step={0.01}
                                required
                                className="mt-1 block w-full rounded-md border-blue-700/50 bg-blue-950/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-blue-100"
                              />
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-blue-600/50 bg-blue-700/80 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Update Service
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-blue-700 bg-blue-800/40 px-4 py-2 text-base font-medium text-blue-100 shadow-sm hover:bg-blue-800/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Delete Service Modal */}
          {isDeleteModalOpen && currentService && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-blue-900/90 border border-blue-700/50 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle backdrop-blur-sm">
                  <div className="bg-blue-900/90 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-900/30 border border-red-700/50 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Delete Service</h3>
                        <div className="mt-2">
                          <p className="text-sm text-blue-200">
                            Are you sure you want to delete the service "{currentService.name}"? This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-950/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      onClick={handleDeleteService}
                      className="inline-flex w-full justify-center rounded-md border border-red-500 bg-red-600/80 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-500/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-blue-700 bg-blue-800/40 px-4 py-2 text-base font-medium text-blue-100 shadow-sm hover:bg-blue-800/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
