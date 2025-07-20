"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-blue-900/95 backdrop-blur-sm shadow-lg' : 'bg-blue-950/80 backdrop-blur-sm'}`}>
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        {/* Mobile-friendly background blur overlay */}
        <div className={`absolute inset-0 bg-blue-950/80 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - left aligned */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-[180px] flex items-center">
                <Image 
                  src="/TrimSlots.png" 
                  alt="TrimSlots Logo" 
                  width={512} 
                  height={240} 
                  className="object-contain" 
                  style={{ maxHeight: '40px' }}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Navigation links - centered */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-grow">
              <Link 
                href="/about" 
                className={`text-base font-medium ${isActive('/about') ? 'text-white font-semibold border-b-2 border-blue-400' : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-400'} transition-colors duration-300 py-1`}
              >
                About
              </Link>
              <Link 
                href="/barbers" 
                className={`text-base font-medium ${isActive('/barbers') ? 'text-white font-semibold border-b-2 border-blue-400' : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-400'} transition-colors duration-300 py-1`}
              >
                Barbers
              </Link>
              <Link 
                href="/contact" 
                className={`text-base font-medium ${isActive('/contact') ? 'text-white font-semibold border-b-2 border-blue-400' : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-400'} transition-colors duration-300 py-1`}
              >
                Contact
              </Link>
              <Link 
                href="/faq" 
                className={`text-base font-medium ${isActive('/faq') ? 'text-white font-semibold border-b-2 border-blue-400' : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-400'} transition-colors duration-300 py-1`}
              >
                FAQ
              </Link>
            </div>
          
          {/* Right side - auth buttons */}
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-sm font-medium text-white bg-blue-800 px-3 py-1.5 rounded-md border border-blue-700 hover:bg-blue-700 transition-all duration-300 flex items-center"
                  >
                    {session?.user?.name || session?.user?.email}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ml-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div 
                    className={`absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg border border-gray-800 overflow-hidden z-50 transition-all duration-200 origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  >
                    <div className="py-1">
                      <Link 
                        href="/account/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 hover:text-white transition-all duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </div>
                      </Link>
                      {session?.user?.role === "BUSINESS_OWNER" || session?.user?.role === "ADMIN" ? (
                        <Link 
                          href="/barber" 
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 hover:text-white transition-all duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            My Barber Profile
                          </div>
                        </Link>
                      ) : null}
                      <Link 
                        href="/account/password" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 hover:text-white transition-all duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Change Password
                        </div>
                      </Link>
                      <div className="border-t border-gray-800 mt-1 pt-1">
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            signOut({ callbackUrl: "/" });
                          }} 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-700 hover:text-white transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="rounded-md bg-blue-800 px-4 py-1.5 text-sm font-medium text-white shadow-sm border border-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile logo - only visible on small screens */}
          <div className="flex items-center md:hidden mr-auto">
            <Link href="/" className="flex items-center">
              <div className="relative h-14 w-[150px]">
                <Image 
                  src="/TrimSlots.png" 
                  alt="TrimSlots Logo" 
                  width={512} 
                  height={240} 
                  className="object-contain" 
                  style={{ maxHeight: '32px' }}
                  priority
                />
              </div>
            </Link>
          </div>
          
          {/* Mobile menu button - only visible on small screens */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-blue-200 hover:bg-blue-800 hover:text-white transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="bg-blue-900/95 backdrop-blur-sm shadow-lg rounded-b-lg mx-2 mt-1 overflow-hidden">
            <div className="space-y-1 p-4">
              <Link 
                href="/about" 
                className={`block px-3 py-2 text-base font-medium rounded-lg ${isActive('/about') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'} transition-colors duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/barbers" 
                className={`block px-3 py-2 text-base font-medium rounded-lg ${isActive('/barbers') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'} transition-colors duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                Barbers
              </Link>
              <Link 
                href="/contact" 
                className={`block px-3 py-2 text-base font-medium rounded-lg ${isActive('/contact') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'} transition-colors duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/faq" 
                className={`block px-3 py-2 text-base font-medium rounded-lg ${isActive('/faq') ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'} transition-colors duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
            </div>
            
            <div className="border-t border-blue-700 p-4">
              {session ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white bg-blue-800 px-3 py-1.5 rounded-md inline-block">
                    {session?.user?.name || session?.user?.email}
                  </p>
                  <div className="flex flex-col space-y-1">
                    <Link href="/account/profile" 
                      className="rounded-md bg-gray-800 px-3 py-1.5 text-left text-sm text-gray-300 flex items-center hover:bg-gray-700 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    {session?.user?.role === "BUSINESS_OWNER" || session?.user?.role === "ADMIN" ? (
                      <Link href="/barber" 
                        className="rounded-md bg-gray-800 px-3 py-1.5 text-left text-sm text-gray-300 flex items-center hover:bg-gray-700 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        My Barber Profile
                      </Link>
                    ) : null}
                    <Link href="/account/password" 
                      className="rounded-md bg-gray-800 px-3 py-1.5 text-left text-sm text-gray-300 flex items-center hover:bg-gray-700 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsMenuOpen(false);
                    }}
                    className="block w-full rounded-md bg-blue-800 px-4 py-1.5 text-center text-sm font-medium text-white shadow-sm border border-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/signin"
                    className="block w-full rounded-md bg-blue-800 px-4 py-1.5 text-center text-sm font-medium text-white shadow-sm border border-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full rounded-md bg-blue-600 px-4 py-1.5 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-500 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
