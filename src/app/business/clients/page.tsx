"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function ClientsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      fetchClients();
    }
  }, [session, status, router]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to load clients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add client');
      }
      
      await fetchClients();
      setSuccess('Client added successfully!');
      setFormData({ name: "", email: "" });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding client:', error);
      setError(error instanceof Error ? error.message : 'Failed to add client');
    }
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!currentClient) return;
    
    try {
      const response = await fetch(`/api/clients/${currentClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update client');
      }
      
      await fetchClients();
      setSuccess('Client updated successfully!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating client:', error);
      setError(error instanceof Error ? error.message : 'Failed to update client');
    }
  };

  const handleDeleteClient = async () => {
    setError("");
    setSuccess("");
    
    if (!currentClient) return;
    
    try {
      const response = await fetch(`/api/clients/${currentClient.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete client');
      }
      
      await fetchClients();
      setSuccess('Client deleted successfully!');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting client:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete client');
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", email: "" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      email: client.email,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (client: Client) => {
    setCurrentClient(client);
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
          {/* Page Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">Clients Management</h1>
              <p className="mt-1 text-sm text-blue-200">Manage your client database</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={openAddModal}
                className="inline-flex items-center rounded-md bg-blue-800/60 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700/60 transition-all duration-300 border border-blue-500/50"
              >
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Client
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
          
          {/* Clients Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow-lg border border-blue-800/50 md:rounded-lg">
                  <table className="min-w-full divide-y divide-blue-800/30">
                    <thead className="bg-blue-900/70">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-blue-100 sm:pl-6">Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-100">Email</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-100">Joined</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-800/30 bg-blue-900/50 backdrop-blur-sm">
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <tr key={client.id} className="hover:bg-blue-800/30 transition-colors duration-150">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-blue-100 sm:pl-6">{client.name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-200">{client.email}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-200">
                              {new Date(client.createdAt).toLocaleDateString()}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => openEditModal(client)}
                                className="text-blue-300 hover:text-blue-100 mr-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(client)}
                                className="text-red-400 hover:text-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-2 py-1"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-sm text-blue-200">
                            No clients found. Add your first client to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add Client Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-blue-900/90 border border-blue-700/50 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle backdrop-blur-sm">
                  <div className="bg-blue-900/90 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Add New Client</h3>
                        <div className="mt-2">
                          <form onSubmit={handleAddClient}>
                            <div className="mb-4">
                              <label htmlFor="name" className="block text-sm font-medium text-blue-200">Name</label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-blue-700 bg-blue-800/50 text-blue-100 placeholder-blue-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                                className="mt-1 block w-full rounded-md border-blue-700 bg-blue-800/50 text-blue-100 placeholder-blue-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-blue-600 bg-blue-700/80 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Add Client
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
          
          {/* Edit Client Modal */}
          {isEditModalOpen && currentClient && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                <div className="inline-block transform overflow-hidden rounded-lg bg-blue-900/90 border border-blue-700/50 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle backdrop-blur-sm">
                  <div className="bg-blue-900/90 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Edit Client</h3>
                        <div className="mt-2">
                          <form onSubmit={handleEditClient}>
                            <div className="mb-4">
                              <label htmlFor="edit-name" className="block text-sm font-medium text-blue-200">Name</label>
                              <input
                                type="text"
                                name="name"
                                id="edit-name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-blue-700 bg-blue-800/50 text-blue-100 placeholder-blue-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                                className="mt-1 block w-full rounded-md border-blue-700 bg-blue-800/50 text-blue-100 placeholder-blue-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-blue-600 bg-blue-700/80 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Update Client
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
          
          {/* Delete Client Modal */}
          {isDeleteModalOpen && currentClient && (
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
                        <h3 className="text-lg font-medium leading-6 text-blue-100">Delete Client</h3>
                        <div className="mt-2">
                          <p className="text-sm text-blue-200">
                            Are you sure you want to delete {currentClient.name}? This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-950/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      onClick={handleDeleteClient}
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
      </div>
    </div>
  );
}
