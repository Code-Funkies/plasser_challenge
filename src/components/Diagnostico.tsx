import React from 'react';
import GraphCard from './GraphCard';

/**
 * Diagnostico - layout parent for 4 diagnostic charts
 * The component currently renders 4 placeholders (GraphCard)
 * arranged responsively. Each card will host a chart in the future.
 */
const Diagnostico: React.FC = () => {
  return (
    <section className="h-full w-full overflow-hidden">
      <div className="w-full h-full flex flex-col">
        {/* 2 columns x 2 rows by default, collapse to 1 column on small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full w-full grid-rows-2 auto-rows-fr overflow-hidden">
          <GraphCard title="Chart A">
            {/* Placeholder: replace with real chart component */}
            <svg width="100%" height="100" viewBox="0 0 200 100" className="mx-auto">
              <rect x="0" y="40" width="30" height="60" fill="#111827" opacity="0.08" />
              <rect x="40" y="20" width="30" height="80" fill="#111827" opacity="0.12" />
              <rect x="80" y="50" width="30" height="50" fill="#111827" opacity="0.2" />
              <rect x="120" y="10" width="30" height="90" fill="#111827" opacity="0.16" />
            </svg>
          </GraphCard>

          <GraphCard title="Chart B">
            <div className="w-full h-full flex items-center justify-center text-gray-400">Chart placeholder</div>
          </GraphCard>

          <GraphCard title="Chart C">
            <div className="w-full h-full flex items-center justify-center text-gray-400">Chart placeholder</div>
          </GraphCard>

          <GraphCard title="Chart D">
            <div className="w-full h-full flex items-center justify-center text-gray-400">Chart placeholder</div>
          </GraphCard>
        </div>
      </div>
    </section>
  );
};

export default Diagnostico;
