'use client';

interface UserProfile {
  name?: string;
  role?: 'user' | 'plant' | 'printing';
}

interface PrintDashboardProps {
  userProfile: UserProfile;
}

export default function PrintDashboard({ userProfile }: PrintDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Print Dashboard</h1>
        <p className="text-gray-600 mb-4">Welcome {userProfile.name}!</p>
        <p className="text-sm text-gray-500">Printing operations dashboard will be implemented here.</p>
      </div>
    </div>
  );
}
