"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import CallToActionSection from "@/components/homepage/CallToActionSection";
import FooterSection from "@/components/homepage/FooterSection";

/**
 * Homepage component for TrimSlots barber booking application
 * Integrates modular components for different sections of the homepage
 */
export default function Home() {
  return (
    <main className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-700 min-h-screen text-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToActionSection />
      <FooterSection />
    </main>
  );
}
