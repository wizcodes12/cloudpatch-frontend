import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';

const PDFDownloadButton = ({ error, solution, apiDetails, onDownload, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    try {
      const reportData = {
        timestamp: new Date().toISOString(),
        api_url: apiDetails.api_url,
        platform: apiDetails.platform || 'Unknown',
        error: {
          type: 'API Error',
          message: error.error || 'Unknown error',
          severity: 'HIGH',
          timestamp: new Date().toISOString()
        },
        solution: {
          description: solution?.solution || 'No solution available',
          suggested_fixes: []
        },
        additional_context: {
          environment: apiDetails.environment || 'Production',
          performance_metrics: apiDetails.performance_metrics || {},
          status_code: apiDetails.status_code || 500
        }
      };

      if (!reportData.api_url || !reportData.error.message) {
        throw new Error('Missing required data for PDF generation');
      }
      
      await onDownload(reportData);
    } catch (error) {
      console.error('Error initiating PDF download:', error);
      if (typeof window !== 'undefined' && window.showNotification) {
        window.showNotification(error.message || 'Failed to generate PDF report', 'error');
      }
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group
        absolute
        top-4
        right-4
        flex
        items-center
        gap-2
        px-4
        py-2
        bg-white
        border
        border-blue-200
        rounded-xl
        transition-all
        duration-300
        ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        ${isHovered ? 'transform -translate-y-1 shadow-lg' : 'shadow-md'}
        hover:border-transparent
        hover:bg-gradient-to-r
        hover:from-[#3a6ea5]
        hover:to-[#6ec3f4]
      `}
    >
      <span className={`
        transition-colors
        duration-300
        ${isHovered ? 'text-white' : 'text-[#3a6ea5]'}
        font-medium
        text-sm
      `}>
        {isLoading ? 'Generating Report...' : 'Download Report'}
      </span>

      {isLoading ? (
        <Loader className={`
          w-4
          h-4
          animate-spin
          ${isHovered ? 'text-white' : 'text-[#3a6ea5]'}
        `} />
      ) : (
        <Download className={`
          w-4
          h-4
          transition-all
          duration-300
          ${isHovered ? 'text-white transform translate-y-0' : 'text-[#3a6ea5]'}
          group-hover:transform
          group-hover:-translate-y-1
        `} />
      )}
    </button>
  );
};

export default PDFDownloadButton;