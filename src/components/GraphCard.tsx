import React from 'react';

interface GraphCardProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * GraphCard - simple reusable card wrapper for charts and graphs
 */
const GraphCard: React.FC<GraphCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h4 className="text-xs font-semibold text-gray-700">{title}</h4>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-md w-full overflow-hidden">
        {children ?? <div className="text-gray-400 text-xs">Chart placeholder</div>}
      </div>
    </div>
  );
};

export default GraphCard;
