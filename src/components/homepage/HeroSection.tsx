"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Role } from "@prisma/client";
import { format, isPast } from "date-fns";

// Define types
type Appointment = {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    name: string;
    duration: number;
    price: number;
  };
  business?: {
    name: string;
  };
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  businessId: string;
};

type Business = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
};

type UserAccount = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  businessId: string | null;
  business: Business | null;
  managedBusiness: Business | null;
  clientBusinesses: Array<{
    id: string;
    businessId: string;
    clientId: string;
    createdAt: string;
    business: Business;
  }>;
};

export default function HeroSection() {
  const { data: session } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);
  
  // Fetch user data when session is available
  useEffect(() => {
    const fetchAppointments = async () => {
      if (session?.user?.id) {
        setIsLoadingAppointments(true);
        try {
          const response = await fetch('/api/user/appointments');
          if (response.ok) {
            const data = await response.json();
            setAppointments(data);
          }
        } catch (error) {
          console.error('Error fetching appointments:', error);
        } finally {
          setIsLoadingAppointments(false);
        }
      }
    };
    
    const fetchServices = async () => {
      if (session?.user?.id) {
        setIsLoadingServices(true);
        try {
          const response = await fetch('/api/user/services');
          if (response.ok) {
            const data = await response.json();
            setServices(data);
          }
        } catch (error) {
          console.error('Error fetching services:', error);
        } finally {
          setIsLoadingServices(false);
        }
      }
    };
    
    const fetchUserAccount = async () => {
      if (session?.user?.id) {
        setIsLoadingAccount(true);
        try {
          const response = await fetch('/api/user/account');
          if (response.ok) {
            const data = await response.json();
            setUserAccount(data);
          }
        } catch (error) {
          console.error('Error fetching user account:', error);
        } finally {
          setIsLoadingAccount(false);
        }
      }
    };
    
    fetchAppointments();
    fetchServices();
    fetchUserAccount();
  }, [session]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className={`mx-auto max-w-7xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 bg-opacity-30 text-blue-200 mb-6">
                #1 Barber Booking Platform
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight">
                <span className="block mb-2">Modern Haircuts,</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Modern Booking.</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl">
                TrimSlots streamlines your barbershop experience with easy online booking, real-time availability, and personalized service recommendations.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/barbers" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-lg hover:shadow-blue-500/20 flex items-center">
                  Find a Barber
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/services" className="px-6 py-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors border border-gray-700 flex items-center">
                  Browse Services
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start text-sm text-gray-400">
                <div className="flex -space-x-2 mr-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">JD</div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-medium">KT</div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-xs font-medium">MR</div>
                </div>
                <span>Join 10,000+ users who trust TrimSlots</span>
              </div>
            </div>
            
            {/* Right Column - App Preview */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-10 blur-2xl"></div>
              <div className="relative bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
                {/* App Header */}
                <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold">Hello, {session?.user?.name || "there"}!</h2>
                      <p className="text-gray-400 mt-1">{format(new Date(), 'EEEE, MMMM d')}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                      {session ? (
                        session.user.role === "ADMIN" ? '👑' : 
                        session.user.role === "BUSINESS_OWNER" ? '💼' : 
                        session.user.role === "WORKER" ? '✂️' : '👤'
                      ) : '👤'}
                    </div>
                  </div>
                </div>
                
                {/* Main Content Area with Tabs */}
                <div className="p-6 bg-gray-900 text-white">
                  {session ? (
                    <>
                      {/* Tab Navigation */}
                      <div className="flex border-b border-gray-800 mb-6">
                        <button
                          onClick={() => setActiveTab('appointments')}
                          className={`px-4 py-2 font-medium text-sm ${activeTab === 'appointments' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                        >
                          My Appointments
                        </button>
                        <button
                          onClick={() => setActiveTab('services')}
                          className={`px-4 py-2 font-medium text-sm ${activeTab === 'services' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                        >
                          Services
                        </button>
                        <button
                          onClick={() => setActiveTab('account')}
                          className={`px-4 py-2 font-medium text-sm ${activeTab === 'account' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                        >
                          My Account
                        </button>
                      </div>
                      
                      {/* Appointments Tab */}
                      {activeTab === 'appointments' && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">Upcoming Appointments</h3>
                            <Link href="/barbers" className="text-sm font-medium text-gray-400 hover:text-white">
                              Book New +
                            </Link>
                          </div>
                                                    {/* Appointment Cards */}
                          <div className="grid grid-cols-1 gap-4">
                            {isLoadingAppointments ? (
                              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                <span className="ml-3 text-gray-400">Loading appointments...</span>
                              </div>
                            ) : appointments.length > 0 ? (
                              appointments.map((appointment) => {
                                const startTime = new Date(appointment.startTime);
                                const endTime = new Date(appointment.endTime);
                                const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
                                const isPastAppointment = isPast(startTime);
                                
                                return (
                                  <div 
                                    key={appointment.id}
                                    className={`bg-gray-800 rounded-xl p-4 border ${isPastAppointment ? 'border-gray-700' : 'border-blue-700'} flex items-center`}
                                  >
                                    <div className={`h-12 w-12 rounded-full ${isPastAppointment ? 'bg-gray-700' : 'bg-blue-900'} flex items-center justify-center mr-4`}>
                                      <span className="text-xl">✂️</span>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-white">{appointment.service.name}</h4>
                                      <p className="text-sm text-gray-400">
                                        {isPastAppointment ? 'Completed: ' : ''}
                                        {format(startTime, 'EEE, MMM d')} at {format(startTime, 'h:mm a')} • {duration} min
                                        {appointment.business?.name && ` • ${appointment.business.name}`}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      {!isPastAppointment && (
                                        <>
                                          <button className="p-2 text-gray-400 hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                          </button>
                                          <button className="p-2 text-gray-400 hover:text-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center text-center">
                                <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                                  <span className="text-xl">📅</span>
                                </div>
                                <h4 className="font-medium text-white">No appointments found</h4>
                                <p className="text-sm text-gray-400 mt-1">Book your next visit with your favorite barber</p>
                                <Link href="/barbers" className="mt-3 text-sm font-medium text-gray-200 bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600">
                                  Find Barbers
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Services Tab */}
                      {activeTab === 'services' && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-white">Popular Services</h3>
                          
                          {/* Services Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isLoadingServices ? (
                              <div className="col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                <span className="ml-3 text-gray-400">Loading services...</span>
                              </div>
                            ) : services.length > 0 ? (
                              services.map((service) => {
                                // Select emoji based on service name
                                let emoji = '💇‍♂️';
                                if (service.name.toLowerCase().includes('beard')) emoji = '🧔';
                                if (service.name.toLowerCase().includes('color')) emoji = '🎨';
                                if (service.name.toLowerCase().includes('shave')) emoji = '🪒';
                                
                                return (
                                  <div key={service.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-colors">
                                    <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center mb-3">
                                      <span className="text-lg">{emoji}</span>
                                    </div>
                                    <h4 className="font-medium text-white">{service.name}</h4>
                                    <p className="text-sm text-gray-400 mt-1">{service.description || 'Professional service'}</p>
                                    <div className="flex justify-between items-center mt-3">
                                      <span className="font-semibold text-blue-400">${service.price.toFixed(2)}</span>
                                      <span className="text-xs text-gray-500">{service.duration} min</span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center text-center">
                                <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                                  <span className="text-xl">✂️</span>
                                </div>
                                <h4 className="font-medium text-white">No services found</h4>
                                <p className="text-sm text-gray-400 mt-1">Browse our catalog for available services</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-center mt-4">
                            <Link href="/services" className="text-sm font-medium text-gray-200 bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600">
                              View All Services
                            </Link>
                          </div>
                        </div>
                      )}
                      
                      {/* Account Tab */}
                      {activeTab === 'account' && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-white">Account Information</h3>
                          
                          {isLoadingAccount ? (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                              <span className="ml-3 text-gray-400">Loading account details...</span>
                            </div>
                          ) : userAccount ? (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                              <div className="flex items-center mb-6">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4 border-2 border-gray-600 shadow">
                                  <span className="text-2xl">{userAccount.role === "ADMIN" ? '👑' : userAccount.role === "BUSINESS_OWNER" ? '💼' : userAccount.role === "WORKER" ? '✂️' : '👤'}</span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white">{userAccount.name || "User"}</h4>
                                  <p className="text-sm text-gray-400">{userAccount.email}</p>
                                  <p className="text-xs text-gray-500 mt-1">Role: {userAccount.role?.toLowerCase().replace("_", " ")}</p>
                                  <p className="text-xs text-gray-500">Member since: {new Date(userAccount.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                {/* Business Information */}
                                {(userAccount.business || userAccount.managedBusiness) && (
                                  <div className="space-y-2 border-t border-gray-700 pt-4">
                                    <h5 className="text-sm font-medium text-gray-400">Your Business</h5>
                                    <div className="bg-gray-700 rounded-lg p-3">
                                      <p className="font-medium text-white">{userAccount.managedBusiness?.name || userAccount.business?.name}</p>
                                      {(userAccount.managedBusiness?.description || userAccount.business?.description) && (
                                        <p className="text-xs text-gray-400 mt-1">{userAccount.managedBusiness?.description || userAccount.business?.description}</p>
                                      )}
                                      {(userAccount.managedBusiness?.address || userAccount.business?.address) && (
                                        <p className="text-xs text-gray-400 mt-1">{userAccount.managedBusiness?.address || userAccount.business?.address}</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Client Businesses */}
                                {userAccount.clientBusinesses && userAccount.clientBusinesses.length > 0 && (
                                  <div className="space-y-2 border-t border-gray-700 pt-4">
                                    <h5 className="text-sm font-medium text-gray-400">Businesses You Visit</h5>
                                    <div className="space-y-2">
                                      {userAccount.clientBusinesses.map((clientBusiness) => (
                                        <div key={clientBusiness.id} className="bg-gray-700 rounded-lg p-3">
                                          <p className="font-medium text-white">{clientBusiness.business.name}</p>
                                          {clientBusiness.business.address && (
                                            <p className="text-xs text-gray-400 mt-1">{clientBusiness.business.address}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Dashboard Links */}
                                <div className="space-y-2 border-t border-gray-700 pt-4">
                                  <h5 className="text-sm font-medium text-gray-400">Your Dashboards</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {userAccount.role === "ADMIN" && (
                                      <Link href="/admin" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                                        Admin Dashboard
                                      </Link>
                                    )}
                                    
                                    {(userAccount.role === "ADMIN" || userAccount.role === "BUSINESS_OWNER") && (
                                      <Link href="/business" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                                        Business Dashboard
                                      </Link>
                                    )}
                                    
                                    {(userAccount.role === "ADMIN" || userAccount.role === "BUSINESS_OWNER" || userAccount.role === "WORKER") && (
                                      <Link href="/worker" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                                        Worker Dashboard
                                      </Link>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Account Settings */}
                                <div className="border-t border-gray-700 pt-4">
                                  <h5 className="text-sm font-medium text-gray-400 mb-2">Account Settings</h5>
                                  <div className="space-y-2">
                                    <Link href="#" className="text-sm text-gray-400 hover:text-white flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      Edit Profile
                                    </Link>
                                    <Link href="#" className="text-sm text-gray-400 hover:text-white flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                      Change Password
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center text-center">
                              <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                                <span className="text-xl">⚠️</span>
                              </div>
                              <h4 className="font-medium text-white">Account information unavailable</h4>
                              <p className="text-sm text-gray-400 mt-1">There was a problem loading your account details</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-10 text-center">
                      <div className="h-20 w-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">👋</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Welcome to TrimSlots</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Sign in to book appointments, view your schedule, and manage your barber experience.  
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                          href="/auth/signin" 
                          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500 transition-all"
                        >
                          Sign In
                        </Link>
                        <Link 
                          href="/auth/signup" 
                          className="rounded-lg bg-gray-700 px-6 py-3 text-sm font-semibold text-gray-200 shadow border border-gray-600 hover:bg-gray-600 transition-all"
                        >
                          Create Account
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
