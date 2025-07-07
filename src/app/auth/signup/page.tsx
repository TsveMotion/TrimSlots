"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { Navigation } from "@/components/Navigation";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.CLIENT);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to sign in page after successful registration
      router.push("/auth/signin?registered=true");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during registration");
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      
      <div className="flex min-h-screen flex-col items-center justify-center py-32 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
        
        <div className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 relative z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-blue-100">
            Create your account
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto my-4 rounded-full"></div>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full rounded-lg border-0 py-2.5 px-4 text-white bg-white/10 backdrop-blur-sm border-white/20 placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-lg border-0 py-2.5 px-4 text-white bg-white/10 backdrop-blur-sm border-white/20 placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-lg border-0 py-2.5 px-4 text-white bg-white/10 backdrop-blur-sm border-white/20 placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-lg border-0 py-2.5 px-4 text-white bg-white/10 backdrop-blur-sm border-white/20 placeholder:text-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-blue-200 mb-1">
                I am a
              </label>
              <select
                id="role"
                name="role"
                className="relative block w-full rounded-lg border-0 py-2.5 px-4 text-white bg-white/10 backdrop-blur-sm border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2386b7fe%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.7rem top 50%", backgroundSize: "0.65rem auto" }}
              >
                <option value={Role.CLIENT} className="bg-blue-900 text-white">Client</option>
                <option value={Role.BUSINESS_OWNER} className="bg-blue-900 text-white">Business Owner</option>
                <option value={Role.WORKER} className="bg-blue-900 text-white">Worker</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 py-3 px-4 text-base font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:bg-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : "Sign up"}
            </button>
          </div>
          
          <div className="text-sm text-center mt-6">
            <Link href="/auth/signin" className="font-medium text-blue-300 hover:text-blue-200 transition-colors">
              Already have an account? <span className="underline">Sign in</span>
            </Link>
          </div>
        </form>
        </div>
      </div>
    </main>
  );
}
