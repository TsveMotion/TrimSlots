"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import Link from "next/link";

interface Worker {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Business {
  id: string;
  name: string;
}

export default function WorkersManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Load data when authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status !== "loading") {
      fetchBusinessData();
      fetchWorkers();
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

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/workers');
      if (!response.ok) {
        throw new Error('Failed to fetch workers');
      }
      const data = await response.json();
      setWorkers(data);
    } catch (error) {
      console.error('Error fetching workers:', error);
      setError('Failed to load workers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/workers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: Role.WORKER,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add worker');
      }
      
      await fetchWorkers();
      setSuccess('Worker added successfully!');
      setFormData({ name: "", email: "", password: "" });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding worker:', error);
      setError(error instanceof Error ? error.message : 'Failed to add worker');
    }
  };

  const handleEditWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!currentWorker) return;
    
    try {
      const response = await fetch(`/api/workers/${currentWorker.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update worker');
      }
      
      await fetchWorkers();
      setSuccess('Worker updated successfully!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating worker:', error);
      setError(error instanceof Error ? error.message : 'Failed to update worker');
    }
  };

  const handleDeleteWorker = async () => {
    setError("");
    setSuccess("");
    
    if (!currentWorker) return;
    
    try {
      const response = await fetch(`/api/workers/${currentWorker.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete worker');
      }
      
      await fetchWorkers();
      setSuccess('Worker deleted successfully!');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting worker:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete worker');
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", email: "", password: "" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (worker: Worker) => {
    setCurrentWorker(worker);
    setFormData({ name: worker.name, email: worker.email, password: "" });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (worker: Worker) => {
    setCurrentWorker(worker);
    setIsDeleteModalOpen(true);
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
      <div className="pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">Workers Management</h1>
              <p className="mt-1 text-sm text-blue-200">Manage your barbers and staff</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              {business && (
                <Link 
                  href={`/barbers/${business.id}`} 
                  target="_blank"
                  className="inline-flex items-center rounded-md bg-blue-600/70 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500/70 transition-all duration-300 border border-blue-500/50"
                >
                  <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Preview Business Page
                </Link>
              )}
              <button
                onClick={() => {
                  setFormData({ name: "", email: "", password: "" });
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center rounded-md bg-blue-800/60 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700/60 transition-all duration-300 border border-blue-500/50"
              >
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Worker
              </button>
            </div>
          </div>
          
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 rounded-md bg-red-900/20 border border-red-800/30 p-4 backdrop-blur-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-green-900/20 border border-green-800/30 p-4 backdrop-blur-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-200">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Workers Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow-lg border border-blue-800/50 md:rounded-lg">
                  <table className="min-w-full divide-y divide-blue-800/30">
                    <thead className="bg-blue-900/70">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-blue-100 sm:pl-6">Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-100">Email</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-100">Role</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-100">Joined</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-800/30 bg-blue-900/50 backdrop-blur-sm">
                      {workers.length > 0 ? (
                        workers.map((worker) => (
                          <tr key={worker.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{worker.name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-200">{worker.email}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-200">{worker.role}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-200">
                              {new Date(worker.createdAt).toLocaleDateString()}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => openEditModal(worker)}
                                className="text-blue-300 hover:text-blue-100 mr-3 transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(worker)}
                                className="text-red-300 hover:text-red-100 transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-sm text-blue-200">
                            No workers found. Click "Add Worker" to add your first worker.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add Worker Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-blue-950 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-blue-900/90 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle border border-blue-700/50">
                  <div className="bg-blue-900/90 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Add New Worker</h3>
                        <div className="mt-2">
                          <form onSubmit={handleAddWorker}>
                            <div className="mb-4">
                              <label htmlFor="name" className="block text-sm font-medium text-blue-200">Name</label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md bg-blue-800/50 border-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-blue-300"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="email" className="block text-sm font-medium text-blue-200">Email</label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md bg-blue-800/50 border-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-blue-300"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="password" className="block text-sm font-medium text-blue-200">Password</label>
                              <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md bg-blue-800/50 border-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-blue-300"
                                placeholder="Enter password for worker login"
                              />
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-blue-600 bg-blue-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Add Worker
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
          
          {/* Edit Worker Modal */}
          {isEditModalOpen && currentWorker && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-blue-950 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-blue-900/90 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle border border-blue-700/50">
                  <div className="bg-blue-900/90 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Edit Worker</h3>
                        <div className="mt-2">
                          <form onSubmit={handleEditWorker}>
                            <div className="mb-4">
                              <label htmlFor="edit-name" className="block text-sm font-medium text-blue-200">Name</label>
                              <input
                                type="text"
                                name="name"
                                id="edit-name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md bg-blue-800/50 border-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-blue-300"
                              />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="edit-email" className="block text-sm font-medium text-blue-200">Email</label>
                              <input
                                type="email"
                                name="email"
                                id="edit-email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md bg-blue-800/50 border-blue-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-blue-300"
                              />
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-blue-600 bg-blue-700 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Update Worker
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
          
          {/* Delete Worker Modal */}
          {isDeleteModalOpen && currentWorker && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-blue-950 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-blue-900/90 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle border border-blue-700/50">
                  <div className="bg-blue-900/90 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 sm:mx-0 sm:h-10 sm:w-10 border border-red-400/30">
                        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Delete Worker</h3>
                        <div className="mt-2">
                          <p className="text-sm text-blue-200">
                            Are you sure you want to delete {currentWorker.name}? This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-950/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      onClick={handleDeleteWorker}
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
