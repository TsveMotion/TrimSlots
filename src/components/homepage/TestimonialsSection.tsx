"use client";

import React from "react";

export default function TestimonialsSection() {
  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-blue-800 to-blue-700 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-200 text-blue-800 mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What our customers are saying
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Don't just take our word for it — hear from our satisfied customers who love using TrimSlots.
          </p>
        </div>
        
        {/* Testimonial Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-blue-800 rounded-xl shadow-md p-6 border border-blue-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-medium mr-4">
                JD
              </div>
              <div>
                <h4 className="font-semibold text-white">James Davis</h4>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-blue-300 ml-2">• Verified Customer</span>
                </div>
              </div>
            </div>
            <h5 className="font-semibold text-white mb-2">
              "Never waiting again!"
            </h5>
            <p className="text-blue-200 text-sm">
              TrimSlots has completely changed how I book my haircuts. No more waiting in line or calling during business hours. I can book anytime, anywhere, and always get my preferred barber.
            </p>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-blue-800 rounded-xl shadow-md p-6 border border-blue-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium mr-4">
                KT
              </div>
              <div>
                <h4 className="font-semibold text-white">Kristina Thompson</h4>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-blue-300 ml-2">• Verified Customer</span>
                </div>
              </div>
            </div>
            <h5 className="font-semibold text-white mb-2">
              "Perfect for my busy schedule"
            </h5>
            <p className="text-blue-200 text-sm">
              As someone with a packed calendar, I love how easy it is to find available slots that work for me. The reminders are super helpful too - I haven't missed an appointment since I started using TrimSlots!
            </p>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-blue-800 rounded-xl shadow-md p-6 border border-blue-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-lg font-medium mr-4">
                MR
              </div>
              <div>
                <h4 className="font-semibold text-white">Michael Rodriguez</h4>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-xs text-blue-300 ml-2">• Verified Customer</span>
                </div>
              </div>
            </div>
            <h5 className="font-semibold text-white mb-2">
              "Great for discovering new barbers"
            </h5>
            <p className="text-blue-200 text-sm">
              I've found some amazing barbers through TrimSlots that I never would have discovered otherwise. The rating system and reviews helped me find someone who really understands my style.
            </p>
          </div>
        </div>
        
        {/* View More Link */}
        <div className="text-center mt-10">
          <a href="#" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
            View more testimonials
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
