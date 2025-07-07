"use client";

import Link from "next/link";
import React from "react";

export default function FeaturesSection() {
  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-blue-700 to-blue-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#90cdf4_1px,transparent_1px)] bg-[length:20px_20px] opacity-20" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-200 text-blue-800 mb-3">
            Features
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need for the perfect haircut
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Our platform connects you with the best barbers in your area, making booking and managing appointments effortless.
          </p>
        </div>
        
        {/* Feature Cards - Mobile Friendly Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-blue-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-700">
            <div className="p-5">
              <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Real-time Availability
              </h3>
              <p className="text-blue-200 text-sm">
                See available slots instantly and book with a single click. No more waiting for confirmation.
              </p>
            </div>
          </div>
          
          {/* Feature Card 2 */}
          <div className="bg-blue-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-700">
            <div className="p-5">
              <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Smart Reminders
              </h3>
              <p className="text-blue-200 text-sm">
                Never miss an appointment with automated reminders via email, SMS, or push notifications.
              </p>
            </div>
          </div>
          
          {/* Feature Card 3 */}
          <div className="bg-blue-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-700">
            <div className="p-5">
              <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Personalized Suggestions
              </h3>
              <p className="text-blue-200 text-sm">
                Get style suggestions and barber recommendations based on your preferences and history.
              </p>
            </div>
          </div>
          
          {/* Feature Card 4 */}
          <div className="bg-blue-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-700">
            <div className="p-5">
              <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Business Management
              </h3>
              <p className="text-blue-200 text-sm">
                Powerful tools for barbers and shop owners to manage staff, services, and client relationships.
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/barbers" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
            Find a Barber
          </Link>
          <Link href="/services" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-950 text-white font-medium border border-blue-700 hover:bg-blue-900 transition-colors">
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}
