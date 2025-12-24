import { useState } from 'react';
import { useRouter } from 'next/router';
import ResponsiveLayout from '../components/ResponsiveLayout';

export default function AddUPI() {
  const router = useRouter();
  const [upiId, setUpiId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const upiProviders = [
    { name: 'Google Pay', handle: '@okaxis', logo: '🎯' },
    { name: 'PhonePe', handle: '@ybl', logo: '📱' },
    { name: 'Paytm', handle: '@paytm', logo: '💰' },
    { name: 'BHIM UPI', handle: '@upi', logo: '🇮🇳' },
    { name: 'Amazon Pay', handle: '@apl', logo: '📦' },
    { name: 'WhatsApp Pay', handle: '@wa', logo: '💬' }
  ];

  const validateUpiId = (upiId) => {
    // Basic UPI ID validation
    const upiRegex = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId) && upiId.length >= 3 && upiId.length <= 50;
  };

  const handleVerify = async () => {
    if (!validateUpiId(upiId)) {
      setVerificationStatus('error');
      setErrorMessage('Please enter a valid UPI ID (e.g., yourname@upi)');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);
    setErrorMessage('');

    try {
      // Simulate UPI verification API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock verification - in real app, this would call your backend
      const isValid = Math.random() > 0.3; // 70% success rate for demo

      if (isValid) {
        setVerificationStatus('success');
        // In real app, save to user profile
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } else {
        setVerificationStatus('error');
        setErrorMessage('UPI ID verification failed. Please check and try again.');
      }
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleProviderSelect = (handle) => {
    const currentPrefix = upiId.split('@')[0];
    setUpiId(`${currentPrefix}${handle}`);
    setShowSuggestions(false);
  };

  const handleInputChange = (value) => {
    setUpiId(value);
    setVerificationStatus(null);
    setErrorMessage('');
    setShowSuggestions(value.includes('@') && value.split('@')[1].length === 0);
  };

  return (
    <ResponsiveLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center lg:text-left">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add UPI ID</h2>
          <p className="text-gray-600">Connect your UPI ID for instant payments</p>
        </div>

        {/* Trust Badge */}
        <div className="card bg-gradient-to-r from-green-50 to-primary-50 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">Secure & Verified</div>
              <div className="text-sm text-gray-600">Your UPI ID is encrypted and safe</div>
            </div>
          </div>
        </div>

        {/* UPI Input Section */}
        <div className="card">
          <div className="space-y-4">
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                Your UPI ID
              </label>
              <div className="relative">
                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter your UPI ID (e.g., harsh@upi)"
                  className="input text-lg font-mono"
                  disabled={isVerifying}
                />
                {upiId && (
                  <button
                    onClick={() => setUpiId('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This is the UPI ID linked to your bank account
              </p>
            </div>

            {/* UPI Provider Suggestions */}
            {showSuggestions && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-3">Choose your UPI provider:</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {upiProviders.map((provider) => (
                    <button
                      key={provider.handle}
                      onClick={() => handleProviderSelect(provider.handle)}
                      className="flex items-center space-x-2 p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <span className="text-lg">{provider.logo}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                        <div className="text-xs text-gray-500">{provider.handle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Status */}
            {verificationStatus === 'success' && (
              <div className="alert alert-success">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800 font-medium">UPI ID Verified Successfully!</p>
                    <p className="text-sm text-green-700">Your UPI ID has been added to your account.</p>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="alert alert-error">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 font-medium">Verification Failed</p>
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Verify Button */}
            <div className="pt-4">
              <button
                onClick={handleVerify}
                disabled={isVerifying || !upiId.trim()}
                className="w-full btn btn-success disabled:opacity-50"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying UPI ID...
                  </div>
                ) : (
                  'Verify UPI ID'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to find your UPI ID?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">1</span>
              </div>
              <p>Open your UPI app (PhonePe, GPay, Paytm, etc.)</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">2</span>
              </div>
              <p>Go to Profile or Account settings</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary-600">3</span>
              </div>
              <p>Your UPI ID will be shown (e.g., yourname@upi)</p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-blue-900">Your Security Matters</div>
              <div className="text-sm text-blue-700 mt-1">
                We only verify your UPI ID and never store your banking credentials. All transactions remain secure.
              </div>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            onClick={() => router.push('/profile')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Skip for now →
          </button>
        </div>
      </div>
    </ResponsiveLayout>
  );
}