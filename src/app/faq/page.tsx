"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

export default function FaqPage() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    {
      question: "How do I book an appointment?",
      answer: "Booking an appointment is easy! Simply create an account, browse available barbers, select your preferred service and time slot, and confirm your booking. You'll receive an email confirmation with all the details.",
      category: "Booking",
      isOpen: false
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule your appointment up to 24 hours before your scheduled time without any penalty. Simply log in to your account, go to 'My Appointments', and select the appointment you wish to modify.",
      category: "Booking",
      isOpen: false
    },
    {
      question: "How early should I arrive for my appointment?",
      answer: "We recommend arriving 5-10 minutes before your scheduled appointment time to ensure a smooth check-in process.",
      category: "Appointments",
      isOpen: false
    },
    {
      question: "Do you offer gift cards?",
      answer: "Yes! Gift cards are available for purchase online or at any of our partner locations. They make perfect gifts for any occasion and can be redeemed for any service.",
      category: "Payments",
      isOpen: false
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital wallets including Apple Pay and Google Pay. Some locations may also accept cash payments directly at the shop.",
      category: "Payments",
      isOpen: false
    },
    {
      question: "Is there a fee for no-shows?",
      answer: "Yes, we have a no-show policy to ensure fair scheduling for all customers and barbers. If you miss your appointment without canceling at least 24 hours in advance, a fee equivalent to 50% of your service cost may be charged to your account.",
      category: "Policies",
      isOpen: false
    },
    {
      question: "How do I become a barber on TrimSlots?",
      answer: "We're always looking for talented barbers to join our platform! To apply, go to the 'Join as a Barber' section in your account settings or contact us directly through our website. We'll guide you through the verification process.",
      category: "For Barbers",
      isOpen: false
    },
    {
      question: "Can I list my barbershop on TrimSlots?",
      answer: "Absolutely! TrimSlots is designed for both individual barbers and full barbershops. To register your business, create a Business Owner account and follow the steps to add your shop details, services, and staff members.",
      category: "For Businesses",
      isOpen: false
    },
    {
      question: "What commission does TrimSlots take?",
      answer: "TrimSlots charges a small commission of 5% per booking. We also offer premium subscription plans for businesses with additional features and reduced commission rates.",
      category: "For Businesses",
      isOpen: false
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. All personal information is encrypted and stored securely in accordance with data protection regulations. We never share your information with third parties without your explicit consent.",
      category: "Privacy",
      isOpen: false
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqItems.map(item => item.category)))];

  const toggleFaq = (index: number) => {
    setFaqItems(faqItems.map((item, i) => {
      if (i === index) {
        return { ...item, isOpen: !item.isOpen };
      }
      return item;
    }));
  };

  const filteredFaqs = activeCategory === "All" 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
              Frequently Asked Questions
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Find answers to the most common questions about TrimSlots and our barber booking services.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>
      
      <section className="relative py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-sm text-blue-100 hover:bg-blue-500/20 border border-blue-300/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm bg-white/10 rounded-xl shadow-lg border border-blue-300/20 overflow-hidden transition-all duration-300 hover:shadow-blue-500/10"
              >
                <button
                  onClick={() => toggleFaq(faqItems.indexOf(faq))}
                  className="flex justify-between items-center w-full p-5 text-left"
                >
                  <span className="text-lg font-medium text-blue-100">{faq.question}</span>
                  <span className={`transform transition-transform duration-300 ${faq.isOpen ? 'rotate-180' : ''}`}>
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                <div 
                  className={`px-5 pb-5 transition-all duration-300 ${
                    faq.isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="text-blue-200">{faq.answer}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300 border border-blue-500/30">
                      {faq.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Still Have Questions */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-blue-200 mb-4">Still Have Questions?</h2>
            <p className="text-blue-300 mb-6">
              Can't find the answer you're looking for? Please reach out to our customer support team.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-blue-500 transition-all duration-300 hover:shadow-blue-500/25"
            >
              Contact Us
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
