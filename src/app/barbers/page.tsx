"use client";

import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";
import { Business } from "@prisma/client";

type Worker = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type BusinessWithWorkers = Business & {
  workers: Worker[];
};

export default function BarbersPage() {
  const [businessesWithWorkers, setBusinessesWithWorkers] = useState<BusinessWithWorkers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusinessesAndWorkers = async () => {
      try {
        // Fetch all businesses
        const businessesResponse = await fetch('/api/public/businesses');
        if (!businessesResponse.ok) {
          throw new Error('Failed to fetch businesses');
        }
        const businessesData = await businessesResponse.json();
        const businesses = businessesData.businesses;
        
        // For each business, fetch its workers
        const businessesWithWorkersPromises = businesses.map(async (business: Business) => {
          try {
            const workersResponse = await fetch(`/api/public/businesses/${business.id}/workers`);
            if (!workersResponse.ok) {
              return { ...business, workers: [] };
            }
            const workers = await workersResponse.json();
            return { ...business, workers };
          } catch (error) {
            console.error(`Error fetching workers for business ${business.id}:`, error);
            return { ...business, workers: [] };
          }
        });
        
        const results = await Promise.all(businessesWithWorkersPromises);
        setBusinessesWithWorkers(results);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load barbers. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchBusinessesAndWorkers();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
              Find Your Perfect Barber
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Browse our network of professional barbers and barbershops, and book your next appointment with ease.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>
      
      {/* Businesses Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="max-w-lg mx-auto bg-red-500/20 backdrop-blur-lg p-6 rounded-xl border border-red-500/30 text-center">
              <p className="text-white">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : businessesWithWorkers.length === 0 ? (
            <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 text-center">
              <h3 className="text-2xl font-semibold text-blue-200 mb-4">No Barbers Found</h3>
              <p className="text-blue-100 mb-6">
                There are currently no barbers registered on our platform. Check back soon as we're adding new professionals regularly!
              </p>
              <Link href="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors">
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessesWithWorkers.map((business) => (
                <div 
                  key={business.id} 
                  className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 relative">
                    {/* Placeholder for business image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-white/30">
                        {business.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-200 mb-2">{business.name}</h3>
                    <p className="text-blue-100/80 mb-4 line-clamp-2">
                      {business.description || "Professional barber services."}
                    </p>
                    <div className="flex items-center text-blue-300 mb-4">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-sm">{business.address || "Location available upon booking"}</span>
                    </div>
                    
                    {/* Display barbers/workers for this business */}
                    <div className="mt-4 mb-6">
                      <h4 className="text-lg font-medium text-blue-200 mb-3">Available Barbers:</h4>
                      {business.workers && business.workers.length > 0 ? (
                        <div className="space-y-3">
                          {business.workers.map((worker) => (
                            <div key={worker.id} className="flex items-center p-2 bg-blue-800/30 rounded-lg">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                                {worker.name?.substring(0, 2).toUpperCase() || 'BA'}
                              </div>
                              <div className="ml-3">
                                <p className="text-blue-100 font-medium">{worker.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-blue-300/70 text-sm italic">No barbers available at this time.</p>
                      )}
                    </div>
                    
                    <Link 
                      href={`/barbers/${business.id}`}
                      className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-center rounded-lg transition-colors duration-300"
                    >
                      View Services & Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative p-12 text-center">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
              
              <h2 className="text-3xl font-bold text-white mb-6">Are You a Barber?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our platform to reach more clients, manage your bookings efficiently, and grow your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="px-8 py-3 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-white/20">
                  Register Your Business
                </Link>
                <Link href="/contact" className="px-8 py-3 rounded-full bg-blue-800 text-white font-semibold hover:bg-blue-900 transition-all duration-300 shadow-lg border border-blue-500">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
