"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Animated 404 Text */}
        <div className="relative mb-6 sm:mb-16 pt-4 sm:pt-0">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="text-[12rem] sm:text-[20rem] font-black text-white leading-none select-none animate-pulse">
              404
            </div>
          </div>
          
          <div className="relative z-10 text-center">
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 animate-gradient-x">
              404
            </h1>
            <p className="mt-2 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Page Not Found
            </p>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-blue-200 px-4">
              Looks like you've ventured into uncharted territory
            </p>
          </div>
        </div>

        {/* Animated Barber Elements */}
        <div className="relative h-56 sm:h-64 mb-6 sm:mb-8 overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800">
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated scissors */}
            <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-16 sm:w-16 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
            </div>

            {/* Animated comb */}
            <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 animate-float-delayed">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-16 sm:w-16 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 5h16v2H4zM4 9h16v2H4zM4 13h16v2H4zM4 17h16v2H4z" />
              </svg>
            </div>

            {/* Animated razor */}
            <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 animate-float-slow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10h20V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6z" />
              </svg>
            </div>

            {/* Animated hair dryer */}
            <div className="absolute right-1/3 bottom-1/4 transform rotate-45 animate-float-fast">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-14 sm:w-14 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 9c0-4.97-4.03-9-9-9-3.14 0-5.76 1.14-7.24 3.37A8.98 8.98 0 0 0 4 9c0 4.97 4.03 9 9 9 3.14 0 5.76-1.14 7.24-3.37A8.98 8.98 0 0 0 22 9zM4 19h16v2H4z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
              We couldn't find the page you're looking for
            </h2>
            <p className="text-sm sm:text-base text-blue-200 max-w-md">
              The link might be broken, or the page may have been removed or renamed.
            </p>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-8 px-2">
          <Link 
            href="/" 
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm sm:text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Return Home
          </Link>
          
          <Link 
            href="/services" 
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 text-blue-300 text-sm sm:text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Browse Services
          </Link>
          
          <Link 
            href="/contact" 
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 text-blue-300 text-sm sm:text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Contact Us
          </Link>
        </div>
      </div>


    </div>
  );
}
