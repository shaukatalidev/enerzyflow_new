'use client';

import { useState } from 'react';

interface UserProfile {
  name?: string;
  contactNo?: string;
  email?: string;
  designation?: string;
  brandCompanyName?: string;
  businessAddress?: string;
  profilePhoto?: string;
  labelName?: string;
  logo?: string;
  role?: 'user' | 'plant' | 'printing';
}

interface ProfileCompletionProps {
  onProfileComplete: (profile: UserProfile) => void;
  userProfile: UserProfile;
}

export default function ProfileCompletion({ onProfileComplete, userProfile }: ProfileCompletionProps) {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if all required fields are filled
      const requiredFields = ['name', 'contactNo', 'email', 'designation', 'brandCompanyName', 'businessAddress'];
      const isComplete = requiredFields.every(field => formData[field as keyof UserProfile]);
      
      if (isComplete) {
        onProfileComplete(formData);
      } else {
        alert('Please fill in all required fields');
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">Complete Your Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Upload your photo</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
            <input
              type="text"
              placeholder="Enter your name here"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact No. *</label>
            <input
              type="tel"
              placeholder="Enter your contact no."
              value={formData.contactNo || ''}
              onChange={(e) => handleInputChange('contactNo', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              placeholder="Enter your email here"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
            <input
              type="text"
              placeholder="Enter your Designation here"
              value={formData.designation || ''}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand/Company Name *</label>
            <input
              type="text"
              placeholder="Enter your Brand name"
              value={formData.brandCompanyName || ''}
              onChange={(e) => handleInputChange('brandCompanyName', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
            <textarea
              placeholder="Enter your Business Address"
              value={formData.businessAddress || ''}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
              required
            />
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Label Name</label>
            <input
              type="text"
              placeholder="Enter label name"
              value={formData.labelName || ''}
              onChange={(e) => handleInputChange('labelName', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? 'Completing Profile...' : 'Complete Profile'}
        </button>
      </div>
    </div>
  );
}
