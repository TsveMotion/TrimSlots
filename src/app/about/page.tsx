"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Former barber with 15 years of experience who saw the need for better booking systems.",
      image: "/team/alex.jpg",
      initial: "AJ"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Tech innovator with a passion for creating user-friendly solutions for traditional industries.",
      image: "/team/sarah.jpg",
      initial: "SC"
    },
    {
      name: "Marcus Williams",
      role: "Head of Partnerships",
      bio: "Building relationships with barbers and businesses across the country.",
      image: "/team/marcus.jpg",
      initial: "MW"
    },
    {
      name: "Priya Patel",
      role: "Lead Designer",
      bio: "Creating beautiful, intuitive interfaces that barbers and clients love to use.",
      image: "/team/priya.jpg",
      initial: "PP"
    }
  ];
  
  const milestones = [
    { year: "2023", title: "The Idea", description: "TrimSlots concept was born from frustration with outdated booking systems." },
    { year: "2024", title: "Development", description: "Our team built and tested the platform with local barbers." },
    { year: "2025", title: "Launch", description: "TrimSlots officially launched to barbers and clients nationwide." },
    { year: "2025", title: "Growth", description: "Expanding our team and features to serve more businesses." }
  ];

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
              Our Story
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              We're revolutionizing how people connect with barbers, making booking simple and efficient for everyone.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>
      
      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-400 rounded-full opacity-20"></div>
              
              <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-3xl font-bold mb-6 text-blue-200">Our Mission</h2>
                <p className="text-blue-100 mb-6">
                  TrimSlots was founded in 2025 with a simple mission: to revolutionize how people book barber appointments. 
                  We noticed that despite the digital transformation in many industries, barbershops were still relying on 
                  outdated booking systems or phone calls.
                </p>
                <p className="text-blue-100 mb-6">
                  We're on a mission to streamline the barber booking experience for everyone involved. For customers, 
                  that means easy, instant bookings with their favorite barbers. For barbers and shop owners, it means 
                  efficient scheduling, reduced no-shows, and better business management.
                </p>
                <Link href="/barbers" className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
                  Find a Barber
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Values Cards */}
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2">Simplicity</h3>
                <p className="text-blue-100/80">We believe in making technology that's easy for everyone to use.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2">Reliability</h3>
                <p className="text-blue-100/80">Our platform is built to be dependable for both businesses and customers.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2">Innovation</h3>
                <p className="text-blue-100/80">We're constantly improving and adding new features to enhance the experience.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2">Community</h3>
                <p className="text-blue-100/80">We support local barbers and help them grow their businesses.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
              Meet Our Team
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              The passionate people behind TrimSlots working to transform the barber booking experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 relative">
                  {member.image ? (
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-3xl font-bold text-white">
                        {member.initial}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-200 mb-1">{member.name}</h3>
                  <p className="text-blue-300 mb-4">{member.role}</p>
                  <p className="text-blue-100/80">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Timeline Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
              Our Journey
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500/30"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                    <span className="text-blue-300 font-semibold">{milestone.year}</span>
                    <h3 className="text-xl font-bold text-blue-200 mb-2">{milestone.title}</h3>
                    <p className="text-blue-100/80">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 border-4 border-blue-900 z-10 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                </div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative p-12 text-center">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
              
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Barber Experience?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join TrimSlots today and discover a better way to book and manage barber appointments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/barbers" className="px-8 py-3 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-white/20">
                  Find a Barber
                </Link>
                <Link href="/auth/signup" className="px-8 py-3 rounded-full bg-blue-800 text-white font-semibold hover:bg-blue-900 transition-all duration-300 shadow-lg border border-blue-500">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
