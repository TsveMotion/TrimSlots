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
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  workers: {
    id: string;
    name: string | null;
    email: string | null;
  }[];
}

export default function AdminBusinessesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);
  const [businessToEdit, setBusinessToEdit] = useState<Business | null>(null);
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    description: '',
  });
  const [editedBusiness, setEditedBusiness] = useState({
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== Role.ADMIN) {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  // Fetch businesses data
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/businesses', {
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
        if (Array.isArray(data)) {
          setBusinesses(data);
          setError(null);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        setError('Failed to fetch businesses. Please try again.');
        console.error('Error fetching businesses:', err);
        // Set empty array to prevent UI issues
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === Role.ADMIN) {
      fetchBusinesses();
    }
  }, [session]);

  // Handle adding a new business
  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBusiness.name.trim()) {
      setError('Business name is required');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBusiness),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setBusinesses([...businesses, data]);
      setNewBusiness({ name: '', description: '' });
      setShowAddModal(false);
      setSuccessMessage('Business added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to add business. Please try again.');
      console.error('Error adding business:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle opening edit modal
  const handleOpenEditModal = (business: Business) => {
    setBusinessToEdit(business);
    setEditedBusiness({
      name: business.name,
      description: business.description || '',
    });
    setShowEditModal(true);
  };
  
  // Handle editing a business
  const handleEditBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessToEdit) return;
    
    if (!editedBusiness.name.trim()) {
      setError('Business name is required');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await fetch(`/api/admin/businesses/${businessToEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedBusiness),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const updatedBusiness = await response.json();
      
      // Update the business in the state
      setBusinesses(businesses.map(b => 
        b.id === businessToEdit.id ? { ...b, ...updatedBusiness } : b
      ));
      
      setShowEditModal(false);
      setBusinessToEdit(null);
      setSuccessMessage(`${updatedBusiness.name} updated successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update business. Please try again.');
      console.error('Error updating business:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle opening delete confirmation modal
  const handleOpenDeleteModal = (business: Business) => {
    setBusinessToDelete(business);
    setShowDeleteModal(true);
  };
  
  // Handle deleting a business
  const handleDeleteBusiness = async () => {
    if (!businessToDelete) return;
    
    try {
      setSubmitting(true);
      const response = await fetch(`/api/admin/businesses/${businessToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Remove the deleted business from the state
      setBusinesses(businesses.filter(b => b.id !== businessToDelete.id));
      setShowDeleteModal(false);
      setBusinessToDelete(null);
      setSuccessMessage(`${businessToDelete.name} deleted successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to delete business. Please try again.');
      console.error('Error deleting business:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated" || session?.user?.role !== Role.ADMIN) {
    return null; // Will be redirected by the useEffect
  }

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
              Manage Businesses
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              View, add, edit, and manage all businesses on the TrimSlots platform.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-blue-500 transition-all duration-300 hover:shadow-blue-500/25"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Business
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>
      
      {/* Businesses List Section */}
      <section className="relative py-8 px-4 mb-12">
        <div className="container mx-auto max-w-7xl">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {successMessage}
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-green-200 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {error}
              </div>
              <button onClick={() => setError(null)} className="text-red-200 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {loading ? (
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-8 border border-blue-300/20 shadow-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
              <span className="ml-3 text-blue-200">Loading businesses...</span>
            </div>
          ) : (
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-blue-300/20 shadow-lg">
              <h2 className="text-2xl font-bold text-blue-100 mb-6">All Businesses</h2>
              
              {businesses.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-blue-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <p className="mt-4 text-blue-200">No businesses found. Add your first business!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-500/20">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Workers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-500/10">
                      {businesses.map((business) => (
                        <tr key={business.id} className="hover:bg-blue-800/30">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-100">{business.name}</div>
                            {business.description && (
                              <div className="text-xs text-blue-300 truncate max-w-xs">{business.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {business.owner ? (
                              <div>
                                <div className="text-sm text-blue-100">{business.owner.name}</div>
                                <div className="text-xs text-blue-300">{business.owner.email}</div>
                              </div>
                            ) : (
                              <span className="text-sm text-blue-400">No owner</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-100">{business.workers?.length || 0} workers</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-300">
                              {new Date(business.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleOpenEditModal(business)}
                                className="text-blue-400 hover:text-blue-200"
                                title="Edit business"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleOpenDeleteModal(business)}
                                className="text-red-400 hover:text-red-200"
                                title="Delete business"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Add Business Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-blue-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom backdrop-blur-lg bg-blue-900/80 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-blue-300/20">
              <form onSubmit={handleAddBusiness}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-blue-100 mb-4">
                        Add New Business
                      </h3>
                      
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-1">
                          Business Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={newBusiness.name}
                          onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
                          className="w-full px-3 py-2 bg-blue-800/50 border border-blue-500/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-100"
                          placeholder="Enter business name"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-blue-200 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={newBusiness.description}
                          onChange={(e) => setNewBusiness({...newBusiness, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 bg-blue-800/50 border border-blue-500/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-100"
                          placeholder="Enter business description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : 'Add Business'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-blue-500/30 shadow-sm px-4 py-2 bg-blue-800/30 text-base font-medium text-blue-200 hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Business Modal */}
      {showEditModal && businessToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-blue-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom backdrop-blur-lg bg-blue-900/80 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-blue-300/20">
              <form onSubmit={handleEditBusiness}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-blue-100 mb-4">
                        Edit Business
                      </h3>
                      
                      <div className="mb-4">
                        <label htmlFor="edit-name" className="block text-sm font-medium text-blue-200 mb-1">
                          Business Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="edit-name"
                          value={editedBusiness.name}
                          onChange={(e) => setEditedBusiness({...editedBusiness, name: e.target.value})}
                          className="w-full px-3 py-2 bg-blue-800/50 border border-blue-500/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-100"
                          placeholder="Enter business name"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="edit-description" className="block text-sm font-medium text-blue-200 mb-1">
                          Description
                        </label>
                        <textarea
                          id="edit-description"
                          value={editedBusiness.description}
                          onChange={(e) => setEditedBusiness({...editedBusiness, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 bg-blue-800/50 border border-blue-500/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-100"
                          placeholder="Enter business description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : 'Update Business'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setBusinessToEdit(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-blue-500/30 shadow-sm px-4 py-2 bg-blue-800/30 text-base font-medium text-blue-200 hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Business Confirmation Modal */}
      {showDeleteModal && businessToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-blue-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom backdrop-blur-lg bg-blue-900/80 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-red-300/20">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-blue-100">
                      Delete Business
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-blue-200">
                        Are you sure you want to delete <span className="font-semibold text-blue-100">{businessToDelete.name}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteBusiness}
                  disabled={submitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBusinessToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-blue-500/30 shadow-sm px-4 py-2 bg-blue-800/30 text-base font-medium text-blue-200 hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Back to Dashboard Link */}
      <div className="container mx-auto px-4 pb-12">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-blue-300 hover:text-blue-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
