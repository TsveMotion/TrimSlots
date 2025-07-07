"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      name: "Classic Haircut",
      description: "Traditional haircut with clippers and scissors, includes styling.",
      duration: "30 min",
      price: "$25",
      icon: "✂️"
    },
    {
      id: 2,
      name: "Beard Trim",
      description: "Precise beard shaping and trimming for a clean, defined look.",
      duration: "20 min",
      price: "$15",
      icon: "🧔"
    },
    {
      id: 3,
      name: "Hot Towel Shave",
      description: "Luxurious straight razor shave with hot towel treatment.",
      duration: "45 min",
      price: "$35",
      icon: "🪒"
    },
    {
      id: 4,
      name: "Hair & Beard Combo",
      description: "Complete package with haircut and beard trim.",
      duration: "50 min",
      price: "$40",
      icon: "👨"
    },
    {
      id: 5,
      name: "Kids Haircut",
      description: "Gentle haircut for children under 12.",
      duration: "25 min",
      price: "$20",
      icon: "👦"
    },
    {
      id: 6,
      name: "Hair Coloring",
      description: "Professional hair coloring and styling.",
      duration: "90 min",
      price: "$60+",
      icon: "🎨"
    }
  ];

  return (
    <main className="bg-gradient-to-br from-yellow-400 via-yellow-50 to-white min-h-screen">
      <Navigation />
      
      <div className="relative isolate px-6 py-24 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#fde68a_1px,transparent_1px)] bg-[length:20px_20px] opacity-30" />
        
        <div className="mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold tracking-tight text-center text-gray-900 sm:text-6xl mb-12 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-800">
            Our Services
          </h1>
          
          <p className="text-xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
            We offer a range of professional barber services to keep you looking your best.
            Book your appointment today and experience the TrimSlots difference.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="backdrop-blur-sm bg-white/30 p-6 rounded-2xl shadow-xl border border-yellow-100 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-yellow-800 font-semibold text-lg">{service.price}</span>
                    <span className="text-gray-500 text-sm ml-2">({service.duration})</span>
                  </div>
                  <Link href="/auth/signin" className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-yellow-600 transition-all duration-300">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Special Packages</h2>
            <div className="backdrop-blur-sm bg-yellow-500/80 p-8 rounded-2xl shadow-xl border border-yellow-400 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-2">VIP Experience</h3>
              <p className="text-white/90 mb-4">
                Enjoy our premium package including haircut, beard trim, hot towel treatment, 
                facial massage, and complimentary beverage.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-2xl">$75</span>
                <span className="text-white/90">(90 min)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
