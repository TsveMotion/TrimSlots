"use client";

import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import Image from "next/image";

// Theme presets for barber profile customization
const themePresets = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    profileBgColor: '#0f172a',
    profileTextColor: '#f8fafc',
    profileAccentColor: '#3b82f6',
    profileFontFamily: 'Inter, system-ui, sans-serif',
    thumbnail: '/themes/modern-dark.png'
  },
  {
    id: 'classic-barber',
    name: 'Classic Barber',
    profileBgColor: '#1c1917',
    profileTextColor: '#e7e5e4',
    profileAccentColor: '#b45309',
    profileFontFamily: '"Playfair Display", serif',
    thumbnail: '/themes/classic-barber.png'
  },
  {
    id: 'clean-light',
    name: 'Clean Light',
    profileBgColor: '#f9fafb',
    profileTextColor: '#1f2937',
    profileAccentColor: '#2563eb',
    profileFontFamily: '"Roboto", sans-serif',
    thumbnail: '/themes/clean-light.png'
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    profileBgColor: '#18181b',
    profileTextColor: '#fafafa',
    profileAccentColor: '#ca8a04',
    profileFontFamily: '"Montserrat", sans-serif',
    thumbnail: '/themes/luxury-gold.png'
  },
  {
    id: 'natural-green',
    name: 'Natural Green',
    profileBgColor: '#f5f5f4',
    profileTextColor: '#1c1917',
    profileAccentColor: '#15803d',
    profileFontFamily: '"Merriweather", serif',
    thumbnail: '/themes/natural-green.png'
  },
  {
    id: 'custom',
    name: 'Custom Theme',
    profileBgColor: '',
    profileTextColor: '',
    profileAccentColor: '',
    profileFontFamily: '',
    thumbnail: '/themes/custom.png'
  }
];
import Link from "next/link";

interface BusinessSettings {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  openingHours: string | null;
  // Profile customization fields
  profileTheme: string | null; // Selected theme name
  profileBgColor: string | null;
  profileTextColor: string | null;
  profileAccentColor: string | null;
  profileHeaderBgImage: string | null;
  profileBgImage: string | null;
  profileCustomCss: string | null;
  profileFontFamily: string | null;
}

export default function BusinessSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [formData, setFormData] = useState<BusinessSettings>({} as BusinessSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('custom');
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Redirect if not authenticated or not a business owner or admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== Role.BUSINESS_OWNER && session?.user?.role !== Role.ADMIN) {
      router.push("/unauthorized");
    } else {
      fetchSettings();
    }
  }, [session, status, router]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch business settings');
      }
      const data = await response.json();
      setSettings(data);
      const savedTheme = data.profileTheme || 'custom';
      setSelectedTheme(savedTheme);
      setShowCustomOptions(savedTheme === 'custom');
      
      setFormData({
        id: data.id, // Include the id to fix TypeScript error
        name: data.name || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        description: data.description || "",
        openingHours: data.openingHours || "",
        // Profile customization fields
        profileTheme: data.profileTheme || null,
        profileBgColor: data.profileBgColor || "#0f172a", // Default dark blue
        profileTextColor: data.profileTextColor || "#f8fafc", // Default light text
        profileAccentColor: data.profileAccentColor || "#3b82f6", // Default blue accent
        profileHeaderBgImage: data.profileHeaderBgImage || "",
        profileBgImage: data.profileBgImage || "",
        profileCustomCss: data.profileCustomCss || "",
        profileFontFamily: data.profileFontFamily || "Inter, system-ui, sans-serif",
      });
    } catch (error) {
      console.error('Error fetching business settings:', error);
      setError('Failed to load business settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    setShowCustomOptions(themeId === 'custom');
    
    // Find the selected theme preset
    const selectedPreset = themePresets.find(theme => theme.id === themeId);
    
    if (selectedPreset) {
      // Update form data with the selected theme's properties
      setFormData(prev => ({
        ...prev,
        profileTheme: themeId === 'custom' ? null : selectedPreset.name,
        // Only update these values if not using custom theme
        ...(themeId !== 'custom' && {
          profileBgColor: selectedPreset.profileBgColor,
          profileTextColor: selectedPreset.profileTextColor,
          profileAccentColor: selectedPreset.profileAccentColor,
          profileFontFamily: selectedPreset.profileFontFamily,
        })
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/business/settings', {
        method: settings ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update business settings');
      }
      
      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccess('Business settings updated successfully!');
    } catch (error) {
      console.error('Error updating business settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to update business settings');
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated" || (session?.user?.role !== Role.BUSINESS_OWNER && session?.user?.role !== Role.ADMIN)) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      <Navigation />
      <div className="pt-24 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">Business Settings</h1>
            <p className="mt-1 text-sm text-blue-200">Manage your business information</p>
          </div>
          
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 rounded-md bg-red-900/30 border border-red-500/50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-green-900/30 border border-green-500/50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-200">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Form */}
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6 bg-blue-900/40 backdrop-blur-sm p-8 shadow-lg sm:rounded-lg border border-blue-500/30">
              <h2 className="text-xl font-bold mb-4 text-blue-200">Business Information</h2>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-1">Business Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-blue-100 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-blue-100 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-blue-100 mb-1">Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                />
              </div>
              
              <div>
                <label htmlFor="openingHours" className="block text-sm font-medium text-blue-100 mb-1">Opening Hours</label>
                <textarea
                  name="openingHours"
                  id="openingHours"
                  rows={3}
                  value={formData.openingHours || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Mon-Fri: 9am-5pm, Sat: 10am-4pm, Sun: Closed"
                  className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                />
              </div>
              
              <hr className="my-8 border-blue-500/30" />
                            <h2 className="text-xl font-semibold text-blue-100">Profile Customization</h2>
                <p className="mt-2 text-sm text-blue-300">
                  Choose a professional theme or customize your barber profile page.
                </p>
                
                {/* Theme Presets */}
                <div className="mt-4">
                  <h3 className="text-md font-medium text-blue-100 mb-3">Select a Theme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {themePresets.map((theme) => (
                      <div 
                        key={theme.id}
                        onClick={() => handleThemeSelect(theme.id)}
                        className={`border border-blue-400/30 rounded-lg p-3 cursor-pointer transition-all ${selectedTheme === theme.id ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg' : 'hover:shadow-md hover:border-blue-400/60'}`}
                      >
                        <div className="aspect-w-16 aspect-h-9 mb-2 bg-gray-100 rounded overflow-hidden">
                          {/* Placeholder for theme thumbnail - in production, use actual images */}
                          <div 
                            className="w-full h-full flex items-center justify-center" 
                            style={{
                              backgroundColor: theme.profileBgColor || '#ffffff',
                              color: theme.profileTextColor || '#000000',
                              fontFamily: theme.profileFontFamily || 'sans-serif'
                            }}
                          >
                            <div className="text-center p-2">
                              <div className="text-xs mb-1">Theme Preview</div>
                              <button 
                                className="px-2 py-1 text-xs text-white rounded" 
                                style={{ backgroundColor: theme.profileAccentColor || '#3b82f6' }}
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-center">{theme.name}</div>
                      </div>
                    ))}
                  </div>
                </div> 
              {/* Live Preview */}
              <div className="mb-8 border border-blue-400/30 rounded-lg overflow-hidden shadow-md">
                <h3 className="text-lg font-medium p-4 bg-blue-800/50 border-b border-blue-400/30 text-blue-100">Live Preview</h3>
                <div 
                  className="p-4 relative"
                  style={{
                    backgroundColor: formData.profileBgColor || '#0f172a',
                    color: formData.profileTextColor || '#f8fafc',
                    fontFamily: formData.profileFontFamily || 'Inter, system-ui, sans-serif',
                    backgroundImage: formData.profileBgImage ? `url(${formData.profileBgImage})` : 'none',
                    backgroundSize: formData.profileBgImage ? 'cover' : 'auto',
                    backgroundPosition: 'center',
                    minHeight: '200px',
                  }}
                >
                  {/* Header */}
                  <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: formData.profileAccentColor || '#3b82f6', opacity: 0.9 }}>
                    <h4 className="font-bold text-white">{formData.name || 'Your Business Name'}</h4>
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-4">
                    <p style={{ color: '#333' }}>{formData.description || 'Your business description will appear here.'}</p>
                  </div>
                  
                  {/* Button Example */}
                  <button 
                    className="px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: formData.profileAccentColor || '#3b82f6' }}
                  >
                    Sample Button
                  </button>
                  
                  {/* Custom CSS */}
                  {formData.profileCustomCss && (
                    <style dangerouslySetInnerHTML={{ __html: formData.profileCustomCss }} />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom styling options - only shown when Custom Theme is selected */}
              {selectedTheme === 'custom' && (
                <>
                  <div className="mb-6">
                    <label htmlFor="profileBgColor" className="block text-sm font-medium text-blue-200">
                      Background Color
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="color"
                        name="profileBgColor"
                        id="profileBgColor"
                        value={formData.profileBgColor || '#ffffff'}
                        onChange={handleInputChange}
                        className="h-10 w-12 rounded-l-md border-r-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        name="profileBgColor"
                        id="profileBgColorText"
                        value={formData.profileBgColor || ''}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm p-2.5"
                        placeholder="#ffffff or color name"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="profileTextColor" className="block text-sm font-medium text-blue-200">
                      Text Color
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="color"
                        name="profileTextColor"
                        id="profileTextColor"
                        value={formData.profileTextColor || '#000000'}
                        onChange={handleInputChange}
                        className="h-10 w-12 rounded-l-md border-r-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        name="profileTextColor"
                        id="profileTextColorText"
                        value={formData.profileTextColor || ''}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm p-2.5"
                        placeholder="#000000 or color name"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="profileAccentColor" className="block text-sm font-medium text-blue-200">
                      Accent Color (for buttons, links, etc.)
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="color"
                        name="profileAccentColor"
                        id="profileAccentColor"
                        value={formData.profileAccentColor || '#3b82f6'}
                        onChange={handleInputChange}
                        className="h-10 w-12 rounded-l-md border-r-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        name="profileAccentColor"
                        id="profileAccentColorText"
                        value={formData.profileAccentColor || ''}
                        onChange={handleInputChange}
                        className="block w-full flex-1 rounded-none rounded-r-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm p-2.5"
                        placeholder="#3b82f6 or color name"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="profileFontFamily" className="block text-sm font-medium text-blue-200">
                      Font Family
                    </label>
                    <select
                      name="profileFontFamily"
                      id="profileFontFamily"
                      value={formData.profileFontFamily || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                    >
                      <option value="">System Default</option>
                      <option value="'Inter', system-ui, sans-serif">Inter</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Playfair Display', serif">Playfair Display</option>
                      <option value="'Montserrat', sans-serif">Montserrat</option>
                      <option value="'Merriweather', serif">Merriweather</option>
                      <option value="'Lora', serif">Lora</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="profileHeaderBgImage" className="block text-sm font-medium text-blue-200">
                      Header Background Image URL
                    </label>
                    <input
                      type="text"
                      name="profileHeaderBgImage"
                      id="profileHeaderBgImage"
                      value={formData.profileHeaderBgImage || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="profileBgImage" className="block text-sm font-medium text-blue-200">
                      Page Background Image URL
                    </label>
                    <input
                      type="text"
                      name="profileBgImage"
                      id="profileBgImage"
                      value={formData.profileBgImage || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="profileCustomCss" className="block text-sm font-medium text-blue-200">
                      Custom CSS (Advanced)
                    </label>
                    <textarea
                      name="profileCustomCss"
                      id="profileCustomCss"
                      rows={5}
                      value={formData.profileCustomCss || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-blue-950/50 border-blue-700/50 text-white shadow-sm focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition-all duration-200 hover:border-blue-500 p-2.5"
                      placeholder=".barber-profile h1 { font-size: 2rem; }"
                    ></textarea>
                    <p className="mt-1 text-sm text-blue-300/70">For advanced users. Custom CSS will be applied to your profile page.</p>
                  </div>
                </>
              )}
              </div>
              
              <div className="pt-5">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={async () => {
                      // Save changes first to ensure preview shows latest updates
                      setIsSaving(true);
                      setError("");
                      setSuccess("");
                      
                      try {
                        const response = await fetch('/api/business/settings', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(formData),
                        });
                        
                        if (!response.ok) {
                          throw new Error('Failed to save settings');
                        }
                        
                        setSuccess("Settings saved successfully!");
                        
                        // Open the preview in a new tab
                        window.open(`/barbers/${settings?.id}`, '_blank');
                      } catch (error) {
                        console.error('Error saving settings:', error);
                        setError("Failed to save settings. Please try again.");
                      } finally {
                        setIsSaving(false);
                      }
                    }} 
                    className="text-sm hover:opacity-80 flex items-center"
                    style={{ color: formData.profileAccentColor || '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Preview Profile Page
                  </button>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-blue-400/30 py-3 px-8 text-sm font-medium text-white shadow-lg hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
                      style={{ backgroundColor: formData.profileAccentColor || '#3b82f6' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
