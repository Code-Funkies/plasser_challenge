import React from "react";

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  colorClass?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  colorClass = "text-blue-600",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h4 className="text-xs font-semibold text-gray-700">{label}</h4>
      </div>
      <div
        className={`text-5xl font-bold ${colorClass} leading-none py-5 bg-gray-50`}
      >
        {value}
      </div>
    </div>
  );
};
