"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  workerId: string;
  workerName: string;
  serviceId: string;
  serviceName: string;
  price: number;
}

export default function BookingsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [workers, setWorkers] = useState<{id: string, name: string}[]>([]);
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  const [services, setServices] = useState<{id: string, name: string, duration: number, price: number}[]>([]);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    clientId: "",
    workerId: "",
    serviceId: "",
    status: "SCHEDULED",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  
  // Debug logging outside useEffect to capture initial render state
  console.log('INITIAL RENDER - Bookings page - Component rendering');
  console.log('INITIAL RENDER - Bookings page - Session status:', status);
  console.log('INITIAL RENDER - Bookings page - Session data:', session);
  console.log('INITIAL RENDER - Bookings page - User role:', session?.user?.role);
  console.log('INITIAL RENDER - Bookings page - Role type:', session?.user?.role ? typeof session.user.role : 'undefined');
  
  // Redirect if not authenticated or not a business owner or admin
  useEffect(() => {
    // Debug logging for session and role during useEffect execution
    console.log('EFFECT TRIGGERED - Bookings page - Session status:', status);
    console.log('EFFECT TRIGGERED - Bookings page - Session data:', JSON.stringify(session));
    console.log('EFFECT TRIGGERED - Bookings page - User role:', session?.user?.role);
    console.log('EFFECT TRIGGERED - Bookings page - Role type:', session?.user?.role ? typeof session.user.role : 'undefined');
    console.log('EFFECT TRIGGERED - Bookings page - Role enum values:', Object.values(Role));
    
    if (status === "loading") {
      console.log('EFFECT TRIGGERED - Bookings page - Session is loading');
      return;
    }
    
    if (status === "unauthenticated") {
      console.log('EFFECT TRIGGERED - Bookings page - User is unauthenticated, redirecting to signin');
      router.push("/auth/signin");
      return;
    }
    
    if (status === "authenticated") {
      // Normalize role comparison to handle both string and enum formats
      const userRole = session?.user?.role ? String(session.user.role).toUpperCase() : '';
      
      // Direct string comparison with Role enum values
      const businessOwnerEnum = String(Role.BUSINESS_OWNER).toUpperCase();
      const adminEnum = String(Role.ADMIN).toUpperCase();
      
      const isBusinessOwner = userRole === businessOwnerEnum;
      const isAdmin = userRole === adminEnum;
      
      console.log('EFFECT TRIGGERED - Bookings page - Normalized user role:', userRole);
      console.log('EFFECT TRIGGERED - Bookings page - Business owner enum value:', businessOwnerEnum);
      console.log('EFFECT TRIGGERED - Bookings page - Admin enum value:', adminEnum);
      console.log('EFFECT TRIGGERED - Bookings page - Is business owner:', isBusinessOwner);
      console.log('EFFECT TRIGGERED - Bookings page - Is admin:', isAdmin);
      
      if (!isBusinessOwner && !isAdmin) {
        console.log('EFFECT TRIGGERED - Bookings page - Unauthorized, redirecting to /unauthorized');
        router.push("/unauthorized");
      } else {
        console.log('EFFECT TRIGGERED - Bookings page - Authorized, fetching data');
        fetchBookings();
        fetchWorkers();
        fetchClients();
        fetchServices();
      }
    }
  }, [session, status, router]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      let url = '/api/bookings';
      const queryParams = [];
      
      if (filterStatus && filterStatus !== "all") {
        queryParams.push(`status=${filterStatus}`);
      }
      
      if (filterDate) {
        queryParams.push(`date=${filterDate}`);
      }
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await fetch('/api/workers');
      if (!response.ok) {
        throw new Error('Failed to fetch workers');
      }
      const data = await response.json();
      setWorkers(data.map((worker: any) => ({ id: worker.id, name: worker.name })));
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data.map((client: any) => ({ id: client.id, name: client.name })));
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.map((service: any) => ({ 
        id: service.id, 
        name: service.name,
        duration: service.duration,
        price: service.price
      })));
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startTime: formData.startTime,
          serviceId: formData.serviceId,
          workerId: formData.workerId,
          clientId: formData.clientId,
          status: formData.status,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add booking');
      }
      
      await fetchBookings();
      setSuccess('Booking added successfully!');
      setFormData({
        date: "",
        startTime: "",
        clientId: "",
        workerId: "",
        serviceId: "",
        status: "SCHEDULED",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to add booking');
    }
  };

  const handleEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!currentBooking) return;
    
    try {
      const response = await fetch(`/api/bookings/${currentBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking');
      }
      
      await fetchBookings();
      setSuccess('Booking updated successfully!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to update booking');
    }
  };

  const handleDeleteBooking = async () => {
    setError("");
    setSuccess("");
    
    if (!currentBooking) return;
    
    try {
      const response = await fetch(`/api/bookings/${currentBooking.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }
      
      await fetchBookings();
      setSuccess('Booking deleted successfully!');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete booking');
    }
  };

  const handleMarkAsPaid = async () => {
    setError("");
    setSuccess("");
    
    if (!currentBooking) return;
    
    try {
      const response = await fetch(`/api/bookings/${currentBooking.id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPaid: true }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark booking as paid');
      }
      
      await fetchBookings();
      setSuccess('Booking marked as paid successfully!');
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Error marking booking as paid:', error);
      setError(error instanceof Error ? error.message : 'Failed to mark booking as paid');
    }
  };

  const openAddModal = () => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    
    setFormData({
      date: today,
      startTime: "09:00",
      clientId: "",
      workerId: "",
      serviceId: "",
      status: "SCHEDULED",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (booking: Booking) => {
    setCurrentBooking(booking);
    
    // Extract date from booking startTime
    const date = new Date(booking.startTime).toISOString().split('T')[0];
    
    setFormData({
      date: date,
      startTime: new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      clientId: booking.clientId,
      workerId: booking.workerId,
      serviceId: booking.serviceId,
      status: booking.status,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const openPaymentModal = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const formatDate = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterChange = () => {
    fetchBookings();
  };

  if (status === "loading" || isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // Additional debug logging for render conditions
  console.log('RENDER CHECK - Bookings page - Session status for render:', status);
  console.log('RENDER CHECK - Bookings page - User role for render:', session?.user?.role);
  
  if (status === "unauthenticated") {
    console.log('RENDER CHECK - Bookings page - Unauthenticated, will redirect');
    return null; // Will be redirected by the useEffect
  }
  
  // Normalize role comparison to handle both string and enum formats
  const userRole = session?.user?.role ? String(session.user.role).toUpperCase() : '';
  const businessOwnerEnum = String(Role.BUSINESS_OWNER).toUpperCase();
  const adminEnum = String(Role.ADMIN).toUpperCase();
  
  const isBusinessOwner = userRole === businessOwnerEnum;
  const isAdmin = userRole === adminEnum;
  
  console.log('RENDER CHECK - Bookings page - Normalized user role for render:', userRole);
  console.log('RENDER CHECK - Bookings page - Business owner enum value for render:', businessOwnerEnum);
  console.log('RENDER CHECK - Bookings page - Is business owner for render:', isBusinessOwner);
  console.log('RENDER CHECK - Bookings page - Is admin for render:', isAdmin);
  
  if (!isBusinessOwner && !isAdmin) {
    console.log('RENDER CHECK - Bookings page - Not authorized, will redirect');
    return null; // Will be redirected by the useEffect
  }
  
  console.log('RENDER CHECK - Bookings page - Authorized, rendering page');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your appointments and scheduling</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={openAddModal}
                className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
              >
                <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Booking
              </button>
            </div>
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
          
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="filterStatus"
                name="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="filterDate"
                name="filterDate"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilterChange}
                className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Bookings Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date & Time</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Worker</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Service</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {bookings.length > 0 ? (
                        bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(booking.startTime)}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.clientName}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.workerName}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.serviceName}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(booking.price)}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {booking.price > 0 ? `$${booking.price.toFixed(2)}` : 'Free'}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => openEditModal(booking)}
                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentBooking(booking);
                                  setIsPaymentModalOpen(true);
                                }}
                                className="text-green-600 hover:text-green-900 mr-2"
                              >
                                Payment
                              </button>
                              <button
                                onClick={() => openDeleteModal(booking)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-4 text-center text-sm text-gray-500">
                            No bookings found. Add your first booking to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal components would go here, but I'll create them in a separate file to keep this file manageable */}
    </div>
  );
}
