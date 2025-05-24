import React, { memo } from 'react';

const LoadingProgress = memo(({ progress = 0 }) => {
  const roundedProgress = Math.round(progress);
  
  return (
    <div 
      className="w-full max-w-screen p-6"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={roundedProgress}
      aria-label="Φόρτωση δεδομένων"
    >
      <div className="text-left mb-4">
        <div className="text-lg font-medium text mb-2">
          Φόρτωση δεδομένων...
        </div>
        <div 
          className="text-sm text-gray-500"
          aria-live="polite"
        >
          {roundedProgress}%
        </div>
      </div>
      <div 
        className="w-full bg-gray-200 rounded-full h-2.5"
        aria-hidden="true"
      >
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});

export default LoadingProgress; 