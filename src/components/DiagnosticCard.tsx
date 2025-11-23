import React from 'react';

interface DiagnosticCardProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * DiagnosticCard - simple reusable card wrapper for charts
 */
const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h4 className="text-xs font-semibold text-gray-700">{title}</h4>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-md w-full overflow-hidden">
        {children ?? <div className="text-gray-400 text-xs">Chart placeholder</div>}
      </div>
    </div>
  );
};

export default DiagnosticCard;
