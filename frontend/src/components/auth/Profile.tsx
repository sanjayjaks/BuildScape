import React, { useState } from 'react';
import { User, Shield, Edit3, Save, X, Check, Building, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const success = await updateUserProfile({ name: displayName });
      if (success) {
        setIsEditingName(false);
        setSuccess('Profile updated successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'text-green-600 bg-green-50 border-green-200';
      case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <Check className="w-4 h-4" />;
      case 'Rejected': return <X className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}
      {/* Profile Information */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="w-6 h-6 mr-3 text-blue-500" />
          Profile Information
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Display Name</h3>
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">{displayName}</p>
              )}
            </div>
            {!isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-3 text-green-500" />
          Security Settings
        </h2>

        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Account Security</h3>
                <p className="text-sm text-gray-600">Your account is protected with a strong password</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Provider Verification */}
      {user.role === 'serviceProvider' && (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Building className="w-6 h-6 mr-3 text-blue-500" />
            Service Provider Verification
          </h2>

          <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl ${getStatusColor(user.verificationStatus || 'Pending')}`}>
            {getStatusIcon(user.verificationStatus || 'Pending')}
            <span className="font-medium">
              Status: {user.verificationStatus || 'Pending'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;