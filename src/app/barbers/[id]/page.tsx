"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import StripeProvider from "@/components/StripeProvider";

interface Business {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BusinessSettings {
  id: string;
  businessId: string;
  profileBgColor: string | null;
  profileTextColor: string | null;
  profileAccentColor: string | null;
  profileHeaderBgImage: string | null;
  profileBgImage: string | null;
  profileCustomCss: string | null;
  profileFontFamily: string | null;
  profileTheme?: string | null; // Added theme property
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  businessId: string;
  createdAt: string;
}

interface Worker {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function BarberPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Business settings for customization
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [customStyles, setCustomStyles] = useState<React.CSSProperties>({});
  const [customCss, setCustomCss] = useState<string>("");
  
  // Steps for the progress bar
  const steps = [
    { id: 1, name: 'Service' },
    { id: 2, name: 'Barber' },
    { id: 3, name: 'Date' },
    { id: 4, name: 'Time' },
    { id: 5, name: 'Details' },
    { id: 6, name: 'Payment' },
  ];

  // Function to apply business settings to the page
  const applyBusinessSettings = (settings: BusinessSettings | null) => {
    if (!settings) return;
    
    const styles: React.CSSProperties = {};
    
    // Apply background color
    if (settings.profileBgColor) {
      styles.backgroundColor = settings.profileBgColor;
    }
    
    // Apply text color
    if (settings.profileTextColor) {
      styles.color = settings.profileTextColor;
    }
    
    // Apply font family
    if (settings.profileFontFamily) {
      styles.fontFamily = settings.profileFontFamily;
    }
    
    // Apply background image if available
    if (settings.profileBgImage) {
      styles.backgroundImage = `url(${settings.profileBgImage})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundAttachment = 'fixed';
    }
    
    // Set the custom styles
    setCustomStyles(styles);
    
    // Set custom CSS if available
    if (settings.profileCustomCss) {
      setCustomCss(settings.profileCustomCss);
    }
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch business details
        console.log(`Fetching business details for ID: ${id}`);
        const businessRes = await fetch(`/api/public/businesses/${id}`);
        if (!businessRes.ok) {
          console.error(`Failed to fetch business with ID: ${id}, status: ${businessRes.status}`);
          if (businessRes.status === 404) {
            throw new Error("Business not found. The ID may be incorrect or the business no longer exists.");
          } else {
            throw new Error("Failed to load business details");
          }
        }
        const businessData = await businessRes.json();
        setBusiness(businessData);
        console.log("Business data loaded:", businessData);

        // Fetch services
        const servicesRes = await fetch(`/api/public/businesses/${id}/services`);
        if (!servicesRes.ok) {
          console.warn(`Failed to fetch services for business ID: ${id}, status: ${servicesRes.status}`);
          // Don't throw error here, just log warning and continue
        } else {
          const servicesData = await servicesRes.json();
          setServices(servicesData);
          console.log("Services loaded:", servicesData.length);
        }

        // Fetch workers
        const workersRes = await fetch(`/api/public/businesses/${id}/workers`);
        if (!workersRes.ok) {
          console.warn(`Failed to fetch workers for business ID: ${id}, status: ${workersRes.status}`);
          // Don't throw error here, just log warning and continue
        } else {
          const workersData = await workersRes.json();
          setWorkers(workersData);
          console.log("Workers loaded:", workersData.length);
        }
        
        // Fetch business settings for customization
        const settingsRes = await fetch(`/api/public/businesses/${id}/settings`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          console.log("Business settings loaded:", settingsData);
          setBusinessSettings(settingsData);
          applyBusinessSettings(settingsData);
        } else {
          console.error("Failed to load business settings:", settingsRes.status);
        }

      } catch (err: any) {
        console.error("Error fetching business data:", err);
        setError(err.message || "Failed to load business information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusinessData();
    }
  }, [id]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingStep(2);
    window.scrollTo(0, 0);
  };

  const handleWorkerSelect = (worker: Worker) => {
    setSelectedWorker(worker);
    setBookingStep(3);
    window.scrollTo(0, 0);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setBookingStep(4);
    window.scrollTo(0, 0);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingStep(5);
    window.scrollTo(0, 0);
  };

  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setPaymentProcessing(true);
      
      // Create payment intent first
      const paymentRes = await fetch("/api/public/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedService?.price || 0,
          serviceId: selectedService?.id,
          workerId: selectedWorker?.id,
          businessId: business?.id,
          date: selectedDate,
          time: selectedTime,
          clientName: session?.user?.name || null,
          clientEmail: session?.user?.email || null,
        }),
      });

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json();
        console.error("Payment response error:", errorData);
        throw new Error(`Failed to create payment intent: ${errorData.error || paymentRes.statusText}`);
      }

      const paymentData = await paymentRes.json();
      console.log("Payment intent created successfully:", paymentData);
      
      if (!paymentData.clientSecret) {
        throw new Error("No client secret received from payment intent creation");
      }
      
      setClientSecret(paymentData.clientSecret);
      
      // Move to payment step
      setBookingStep(6);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error creating payment intent:", err);
      setError(`Failed to process payment: ${err instanceof Error ? err.message : 'Unknown error'}`); 
      setPaymentProcessing(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Create booking after successful payment
      const bookingRes = await fetch("/api/public/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: selectedService?.id,
          workerId: selectedWorker?.id,
          businessId: business?.id,
          date: selectedDate,
          time: selectedTime,
          clientId: session?.user?.id || null,
          clientName: session?.user?.name || null,
          clientEmail: session?.user?.email || null,
          paymentIntentId: paymentIntentId,
        }),
      });

      if (!bookingRes.ok) {
        throw new Error("Failed to create booking");
      }

      setPaymentSuccess(true);
      setBookingSuccess(true);
      setBookingStep(7);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error creating booking after payment:", err);
      setError("Payment successful but booking failed. Our team will contact you to resolve this.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Stripe payment form component
  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isStripeLoaded, setIsStripeLoaded] = useState(false);
    
    useEffect(() => {
      if (stripe && elements) {
        console.log("Stripe and elements are loaded");
        setIsStripeLoaded(true);
      }
    }, [stripe, elements]);
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet
        setError("Stripe is still loading. Please wait a moment and try again.");
        return;
      }
      
      setProcessing(true);
      setError(null);
      
      try {        
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.href,
          },
          redirect: 'if_required',
        });
        
        console.log("Payment confirmation result:", result);
        
        if (result.error) {
          console.error("Stripe payment error:", result.error);
          setError(result.error.message || 'An error occurred during payment');
          setProcessing(false);
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          console.log("Payment succeeded:", result.paymentIntent);
          // Payment successful
          handlePaymentSuccess(result.paymentIntent.id);
        }
      } catch (err) {
        console.error("Exception during payment confirmation:", err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setProcessing(false);
      }
    };
    
    if (!isStripeLoaded) {
      return (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading payment form...</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="bg-white p-4 border rounded-md shadow-sm">
          <PaymentElement id="payment-element" />
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !stripe}
          className="w-full mt-6 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Complete Payment</span>
            </>
          )}
        </button>
      </form>
    );
  }
  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1:
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="border rounded-lg p-6 cursor-pointer hover:shadow-lg transition duration-300 bg-white hover:border-blue-300"
                  onClick={() => handleServiceSelect(service)}
                >
                  <h3 className="font-bold text-xl mb-2">{service.name}</h3>
                  {service.description && <p className="text-gray-600 mb-4">{service.description}</p>}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{service.duration} min</span>
                    </div>
                    <span className="font-bold text-lg text-blue-600">${service.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Select a Barber</h2>
            <div className="mb-4">
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="font-bold text-lg">Selected Service:</h3>
                </div>
                <div className="mt-2 pl-7">
                  <p className="font-medium text-lg">{selectedService?.name}</p>
                  <div className="flex justify-between mt-1 text-sm text-gray-600">
                    <span>Duration: {selectedService?.duration} min</span>
                    <span className="font-bold text-blue-600">${selectedService?.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="border rounded-lg p-5 cursor-pointer hover:shadow-lg transition duration-300 bg-white hover:border-blue-300"
                  onClick={() => handleWorkerSelect(worker)}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                      {worker.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-lg">{worker.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-13">Professional Barber</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="hover:underline flex items-center" style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }}
                onClick={() => setBookingStep(1)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Services
              </button>
              
              <button
                className="text-white py-2 px-6 rounded-lg hover:opacity-90 transition flex items-center" style={buttonStyle}
                onClick={() => selectedWorker ? setBookingStep(3) : alert('Please select a barber to continue')}
              >
                Continue
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      case 3:
        // Generate next 7 days for date selection
        const dateOptions = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          return date.toISOString().split('T')[0];
        });

        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Select a Date</h2>
            <div className="mb-4">
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg mb-6">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 className="font-bold">Booking Summary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Service:</p>
                    <p className="font-medium">{selectedService?.name}</p>
                    <p className="text-sm text-blue-600 font-bold">${selectedService?.price.toFixed(2)} ({selectedService?.duration} min)</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Barber:</p>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-2 text-xs">
                        {selectedWorker?.name.charAt(0)}
                      </div>
                      <p className="font-medium">{selectedWorker?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {dateOptions.map((date) => {
                const displayDate = new Date(date);
                const dayName = displayDate.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = displayDate.getDate();
                const month = displayDate.toLocaleDateString('en-US', { month: 'short' });
                const isToday = new Date().toDateString() === displayDate.toDateString();
                
                return (
                  <div
                    key={date}
                    className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition text-center ${isToday ? 'border-blue-400 bg-blue-50' : 'bg-white hover:border-blue-300'}`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <div className={`font-bold ${isToday ? 'text-blue-600' : ''}`}>{dayName}</div>
                    <div className="text-2xl mt-1">{dayNum}</div>
                    <div className="text-sm text-gray-600 mt-1">{month}</div>
                    {isToday && <div className="text-xs mt-1 text-blue-600 font-semibold">Today</div>}
                  </div>
                );
              })}
            </div>
            <button
              className="mt-4 text-blue-600 hover:underline"
              onClick={() => setBookingStep(2)}
            >
              &larr; Back to Barbers
            </button>
          </div>
        );
      case 4:
        // Generate time slots from 9 AM to 5 PM
        const timeSlots = Array.from({ length: 16 }, (_, i) => {
          const hour = Math.floor(i / 2) + 9;
          const minute = (i % 2) * 30;
          return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        });

        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Select a Time</h2>
            <div className="mb-4">
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <h3 className="font-bold">Selected Service:</h3>
                <p>{selectedService?.name} - ${selectedService?.price.toFixed(2)} ({selectedService?.duration} min)</p>
                <h3 className="font-bold mt-2">Selected Barber:</h3>
                <p>{selectedWorker?.name}</p>
                <h3 className="font-bold mt-2">Selected Date:</h3>
                <p>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map((time) => {
                // Parse the time string to determine morning/afternoon/evening
                const hour = parseInt(time.split(':')[0], 10);
                let timeOfDay = 'Morning';
                let timeColor = 'bg-yellow-50 text-yellow-800 border-yellow-200';
                
                if (hour >= 12 && hour < 17) {
                  timeOfDay = 'Afternoon';
                  timeColor = 'bg-blue-50 text-blue-800 border-blue-200';
                } else if (hour >= 17) {
                  timeOfDay = 'Evening';
                  timeColor = 'bg-indigo-50 text-indigo-800 border-indigo-200';
                }
                
                // Format time for display (convert to 12-hour format)
                const displayHour = hour % 12 || 12;
                const minute = time.split(':')[1];
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayTime = `${displayHour}:${minute} ${ampm}`;
                
                return (
                  <div
                    key={time}
                    className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition text-center bg-white hover:border-blue-300`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    <div className="text-lg font-medium">{displayTime}</div>
                    <div className={`text-xs mt-1 rounded-full px-2 py-0.5 inline-block ${timeColor}`}>
                      {timeOfDay}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="hover:underline flex items-center" style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }}
                onClick={() => setBookingStep(3)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dates
              </button>
              
              <button
                className="text-white py-2 px-6 rounded-lg hover:opacity-90 transition flex items-center" style={buttonStyle}
                onClick={() => setBookingStep(5)}
              >
                Continue
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
              <h3 className="font-bold text-xl mb-4 flex items-center" style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }}>
                <svg className="w-6 h-6 mr-2" style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Booking Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg p-4" style={{ backgroundColor: businessSettings?.profileAccentColor ? `${businessSettings.profileAccentColor}10` : '#ebf5ff' }}>
                  <h4 className="font-semibold mb-3" style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }}>Service Details</h4>
                  <div className="mb-3 flex justify-between">
                    <span className="text-gray-600">Service:</span> 
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="mb-3 flex justify-between">
                    <span className="text-gray-600">Price:</span> 
                    <span className="font-bold" style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }}>${selectedService?.price.toFixed(2)}</span>
                  </div>
                  <div className="mb-3 flex justify-between">
                    <span className="text-gray-600">Duration:</span> 
                    <span className="font-medium">{selectedService?.duration} minutes</span>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">Appointment Details</h4>
                  <div className="mb-3 flex justify-between">
                    <span className="text-gray-600">Barber:</span> 
                    <span className="font-medium">{selectedWorker?.name}</span>
                  </div>
                  <div className="mb-3 flex justify-between">
                    <span className="text-gray-600">Date:</span> 
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="mb-3 flex justify-between">
                    <span className="text-gray-600">Time:</span> 
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-gray-600">Total:</span>
                </div>
                <div className="text-xl font-bold text-blue-700">
                  ${selectedService?.price.toFixed(2)}
                </div>
              </div>
            </div>
            
            <form onSubmit={handleBookingSubmit}>
              {!session && (
                <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customer-name">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="customer-name"
                          type="text"
                          className="w-full pl-10 p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John Smith"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customer-email">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <input
                          id="customer-email"
                          type="email"
                          className="w-full pl-10 p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="customer-phone">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        id="customer-phone"
                        type="tel"
                        className="w-full pl-10 p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-1 flex items-center">
                    <input
                      id="customer-save-info"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="customer-save-info" className="ml-2 block text-sm text-gray-600">
                      Save my information for future bookings
                    </label>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  className="border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
                  onClick={() => setBookingStep(4)}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        );
      case 6:
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Payment</h2>
            <div className="p-6 bg-gray-50 rounded-lg mb-6">
              <h3 className="font-bold text-xl mb-4">Booking Summary</h3>
              <div className="mb-3">
                <span className="font-bold">Service:</span> {selectedService?.name}
              </div>
              <div className="mb-3">
                <span className="font-bold">Price:</span> ${selectedService?.price.toFixed(2)}
              </div>
              <div className="mb-3">
                <span className="font-bold">Duration:</span> {selectedService?.duration} minutes
              </div>
              <div className="mb-3">
                <span className="font-bold">Barber:</span> {selectedWorker?.name}
              </div>
              <div className="mb-3">
                <span className="font-bold">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="mb-3">
                <span className="font-bold">Time:</span> {selectedTime}
              </div>
            </div>
            
            {clientSecret ? (
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-4">Complete Payment</h3>
                <StripeProvider options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#3b82f6',
                      colorBackground: '#ffffff',
                      borderRadius: '4px'
                    }
                  }
                }}>
                  <PaymentForm />
                </StripeProvider>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p>Preparing payment form...</p>
              </div>
            )}
            
            <button
              className="mt-4 text-blue-600 hover:underline"
              onClick={() => setBookingStep(5)}
              disabled={paymentProcessing}
            >
              &larr; Back to Booking Details
            </button>
          </div>
        );
      case 7:
        return (
          <div className="mt-8 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Payment Successful & Booking Confirmed!</h2>
              <p className="mb-4">
                Your appointment has been successfully booked and payment processed. We've sent a confirmation email with all the details.
              </p>
              <div className="p-4 bg-white rounded-lg mb-6">
                <h3 className="font-bold text-xl mb-4">Booking Summary</h3>
                <div className="mb-3">
                  <span className="font-bold">Service:</span> {selectedService?.name}
                </div>
                <div className="mb-3">
                  <span className="font-bold">Barber:</span> {selectedWorker?.name}
                </div>
                <div className="mb-3">
                  <span className="font-bold">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="mb-3">
                  <span className="font-bold">Time:</span> {selectedTime}
                </div>
              </div>
              <Link href={`/barbers/${id}`} className="text-blue-600 hover:underline">
                Return to {business?.name}
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && !business) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">{error}</h2>
            <p className="mt-2">
              <Link href="/" className="text-blue-600 hover:underline">
                Return to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Add custom CSS if provided
  const CustomCssBlock = () => {
    if (!customCss) return null;
    return <style dangerouslySetInnerHTML={{ __html: customCss }} />;
  };
  
  // Apply accent color to buttons and links
  const buttonStyle: React.CSSProperties = {
    backgroundColor: businessSettings?.profileAccentColor || '#3b82f6',
  };
  
  // Apply header background image if available
  const headerStyle: React.CSSProperties = {
    backgroundImage: businessSettings?.profileHeaderBgImage ? 
      `url(${businessSettings.profileHeaderBgImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: businessSettings?.profileBgColor || '#0f172a',
    color: businessSettings?.profileTextColor || '#f8fafc',
  };
  
  return (
    <div className="min-h-screen" style={customStyles}>
      <CustomCssBlock />
      <header className="shadow-sm" style={headerStyle}>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {business?.logo ? (
                <img
                  src={business.logo}
                  alt={`${business.name} logo`}
                  className="h-12 w-12 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                  {business?.name?.charAt(0) || "B"}
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {business?.name && business.name.includes('@') 
                  ? business.name.split('@')[0] + "'s Business" 
                  : business?.name}
              </h1>
            </div>
            <div>
              {session ? (
                <Link
                  href="/dashboard"
                  className="hover:underline"
                  style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hover:underline"
                  style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!bookingStep || bookingStep === 1 ? (
            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">About {business?.name}</h2>
                <p className="text-gray-600 mb-4">{business?.description || "No description available."}</p>
                
                {business?.address && (
                  <div className="mb-2">
                    <span className="font-medium">Address:</span> {business.address}
                  </div>
                )}
                
                {business?.phone && (
                  <div className="mb-2">
                    <span className="font-medium">Phone:</span> {business.phone}
                  </div>
                )}
                
                {business?.email && (
                  <div className="mb-2">
                    <span className="font-medium">Email:</span> {business.email}
                  </div>
                )}
                
                {business?.website && (
                  <div className="mb-2">
                    <span className="font-medium">Website:</span>{" "}
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: businessSettings?.profileAccentColor || '#3b82f6' }}>
                      {business.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Booking Progress Bar - Only show when in booking flow */}
          {bookingStep > 0 && bookingStep < 7 && (
            <div className="mb-8">
              <div className="relative flex items-center justify-between w-full">
                {/* Horizontal line that connects all steps */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                
                {steps.map((step, index) => (
                  <div key={step.id} className="relative flex flex-col items-center z-10">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${bookingStep >= step.id ? 'text-white' : 'bg-gray-200 text-gray-600'} border-2 ${bookingStep >= step.id ? '' : 'border-gray-200'}`}
                      style={bookingStep >= step.id ? { backgroundColor: businessSettings?.profileAccentColor || '#3b82f6', borderColor: businessSettings?.profileAccentColor || '#3b82f6' } : {}}
                    >
                      {bookingStep > step.id ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <p className={`mt-2 text-xs font-medium ${bookingStep >= step.id ? '' : 'text-gray-500'}`}
                      style={bookingStep >= step.id ? { color: businessSettings?.profileAccentColor || '#3b82f6' } : {}}
                    >
                      {step.name}
                    </p>
                    
                    {/* Colored progress line to the left of current step */}
                    {index > 0 && (
                      <div 
                        className={`absolute top-5 w-full h-0.5 -left-full z-0 ${bookingStep > step.id - 1 ? '' : 'bg-gray-200'}`}
                        style={bookingStep > step.id - 1 ? { backgroundColor: businessSettings?.profileAccentColor || '#3b82f6' } : {}} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {renderBookingStep()}
        </div>
      </main>

      <footer className="bg-white border-t fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 TrimSlots. All rights reserved.
          </p>
          
          {/* Style Information for Business Owners */}
          {session?.user?.role === Role.BUSINESS_OWNER && businessSettings && (
            <div className="mt-2 text-xs text-center">
              <details className="inline-block">
                <summary className="cursor-pointer hover:underline" style={{ color: businessSettings.profileAccentColor || '#3b82f6' }}>
                  View Style Information
                </summary>
                <div className="bg-white border rounded-md p-3 mt-2 text-left shadow-sm">
                  {/* Display theme information if available */}
                  {'profileTheme' in businessSettings && businessSettings.profileTheme && (
                    <p className="mb-2 font-medium" style={{ color: businessSettings.profileAccentColor || '#3b82f6' }}>
                      Theme: {businessSettings.profileTheme}
                    </p>
                  )}
                  <p className="mb-1"><span className="font-medium">Background:</span> {businessSettings.profileBgColor || 'Default'}</p>
                  <p className="mb-1"><span className="font-medium">Text:</span> {businessSettings.profileTextColor || 'Default'}</p>
                  <p className="mb-1"><span className="font-medium">Accent:</span> {businessSettings.profileAccentColor || 'Default'}</p>
                  <p className="mb-1"><span className="font-medium">Font:</span> {businessSettings.profileFontFamily || 'Default'}</p>
                  <p className="mt-2 text-xs">
                    <Link href="/business/settings" className="hover:underline" style={{ color: businessSettings.profileAccentColor || '#3b82f6' }}>
                      Edit Profile Styles
                    </Link>
                  </p>
                </div>
              </details>
            </div>
          )}
        </div>
      </footer>
      
      {/* Add padding at the bottom to prevent content from being hidden by the fixed footer */}
      <div className="pb-16"></div>
    </div>
  );
}
