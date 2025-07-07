"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Role } from "@prisma/client";
import { format, parseISO, isSameDay } from "date-fns";
import { Calendar } from "@/components/Calendar";
import { toast } from "react-hot-toast";

// Define booking type
type Booking = {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  workerId?: string;
  workerName?: string;
  serviceId: string;
  serviceName: string;
  price: number;
};

export default function WorkerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'calendar'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Redirect if not authenticated or not a worker, business owner, or admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (
      session?.user?.role !== Role.WORKER && 
      session?.user?.role !== Role.BUSINESS_OWNER && 
      session?.user?.role !== Role.ADMIN
    ) {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings?${new URLSearchParams({
        date: format(selectedDate, 'yyyy-MM-dd')
      })}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [session, selectedDate]);

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      // Refresh bookings after update
      fetchBookings();
      toast.success(`Booking ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  // Load bookings when component mounts or date changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchBookings();
    }
  }, [session, fetchBookings]);

  if (status === "loading" || loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (
    status === "unauthenticated" || 
    (session?.user?.role !== Role.WORKER && 
     session?.user?.role !== Role.BUSINESS_OWNER && 
     session?.user?.role !== Role.ADMIN)
  ) {
    return null; // Will be redirected by the useEffect
  }

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED';
    } else if (activeTab === 'completed') {
      return booking.status === 'COMPLETED' || booking.status === 'CANCELLED';
    }
    return true;
  });

  // Get bookings for the selected date
  const bookingsForSelectedDate = bookings.filter(booking => {
    const bookingDate = parseISO(booking.startTime);
    return isSameDay(bookingDate, selectedDate);
  });

  return (
    <div>
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Worker Dashboard</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${activeTab === 'upcoming' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming Bookings
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`${activeTab === 'completed' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Past Bookings
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`${activeTab === 'calendar' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Calendar View
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-4 rounded-lg shadow">
                <Calendar 
                  value={selectedDate}
                  onChange={setSelectedDate}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Bookings for selected date */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">
                  Bookings for {format(selectedDate, 'MMMM d, yyyy')}
                </h2>
                
                {bookingsForSelectedDate.length === 0 ? (
                  <p className="text-gray-500">No bookings for this date.</p>
                ) : (
                  <div className="space-y-4">
                    {bookingsForSelectedDate.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{booking.serviceName}</p>
                            <p className="text-sm text-gray-500">
                              {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
                            </p>
                            <p className="text-sm">Client: {booking.clientName}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">
                  {activeTab === 'upcoming' ? 'No upcoming bookings.' : 'No past bookings.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {format(parseISO(booking.startTime), 'MMM d, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.serviceName}</div>
                          <div className="text-sm text-gray-500">${booking.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.clientName}</div>
                          <div className="text-sm text-gray-500">{booking.clientEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                              <>
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Complete
                                </button>
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => setSelectedBooking(booking)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              View
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

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{selectedBooking.serviceName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {format(parseISO(selectedBooking.startTime), 'MMMM d, yyyy')}<br />
                    {format(parseISO(selectedBooking.startTime), 'h:mm a')} - {format(parseISO(selectedBooking.endTime), 'h:mm a')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{selectedBooking.clientName}</p>
                  <p className="text-sm">{selectedBooking.clientEmail}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedBooking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    selectedBooking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    selectedBooking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    selectedBooking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
                
                {selectedBooking.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p>{selectedBooking.notes}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
                  {selectedBooking.status !== 'COMPLETED' && selectedBooking.status !== 'CANCELLED' && (
                    <>
                      <button 
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, 'COMPLETED');
                          setSelectedBooking(null);
                        }}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                      >
                        Mark as Completed
                      </button>
                      <button 
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, 'CANCELLED');
                          setSelectedBooking(null);
                        }}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setSelectedBooking(null)}
                    className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
