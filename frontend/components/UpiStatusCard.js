import { useState } from 'react';

export default function UpiStatusCard({ upiId, isVerified, onAddUpi }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xl">💳</span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {upiId ? `UPI ID: ${upiId}` : 'No UPI ID Linked'}
            </div>
            <div className="text-sm text-gray-600">
              {upiId ? 'Auto-tracking enabled' : 'Link your UPI ID for auto-tracking'}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {upiId ? (
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-700">Active</span>
            </div>
          ) : (
            <button
              onClick={onAddUpi}
              className="btn btn-primary text-sm"
            >
              Link UPI
            </button>
          )}
        </div>
      </div>
    </div>
  );
}