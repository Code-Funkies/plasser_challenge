import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface MaintenanceData {
    series_data: Array<{ x: number; y: number }>;
    annotations: Array<{ month: number; cost: number; label: string }>;
    avg_risk_factor: number;
    total_points: number;
}

const PdfViewer = () => {
    const [data, setData] = useState<MaintenanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/maintenance-windows', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        critical_points: [0.2, 0.3, 0.25, 0.4, 0.5]
                    })
                });

                if (!response.ok) {
                    throw new Error('Error loading data');
                }

                const apiData: MaintenanceData = await response.json();
                setData(apiData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-10">
                <div className="text-gray-500">Loading report data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full p-10">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    // Calculate dates from current time + delta months
    const currentDate = new Date();
    const seriesWithDates = data.series_data.map(point => {
        const futureDate = new Date(currentDate);
        futureDate.setMonth(currentDate.getMonth() + point.x);
        return {
            x: futureDate.getTime(), // Convert to timestamp
            y: point.y
        };
    });

    const annotationsWithDates = data.annotations.map(point => {
        const futureDate = new Date(currentDate);
        futureDate.setMonth(currentDate.getMonth() + point.month);
        return {
            ...point,
            timestamp: futureDate.getTime(),
            dateString: futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
    });

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            fontFamily: 'Helvetica, Arial, sans-serif',
        },
        colors: ['#008FFB'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100]
            }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            type: 'datetime',
            title: { text: 'Predicted Maintenance Date' },
            labels: {
                format: 'MMM yyyy',
                datetimeUTC: false
            }
        },
        yaxis: {
            title: { text: 'Projected Cost ($)' },
            labels: {
                formatter: (value) => {
                    return "$" + value.toFixed(0);
                }
            }
        },
        annotations: {
            xaxis: annotationsWithDates.map(point => ({
                x: point.timestamp,
                strokeDashArray: 0,
                borderColor: '#FEB019',
                label: {
                    borderColor: '#FEB019',
                    style: {
                        color: '#fff',
                        background: '#FEB019',
                    },
                    text: point.dateString,
                }
            })),
            points: annotationsWithDates.map(point => ({
                x: point.timestamp,
                y: point.cost,
                marker: {
                    size: 8,
                    fillColor: '#fff',
                    strokeColor: 'red',
                    radius: 2,
                },
                label: {
                    borderColor: '#FF4560',
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: '#FF4560',
                    },
                    text: `Min: $${point.cost.toFixed(0)}`,
                }
            }))
        }
    };

    const series = [{
        name: "Projected Cost",
        data: seriesWithDates
    }];

    return (
        <div className="flex flex-col bg-gray-100 p-6 rounded shadow w-full h-full overflow-y-auto">
            {/* Report text section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Predictive Maintenance Report
                </h1>
                
                <div className="space-y-4 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Executive Summary
                        </h2>
                        <p className="leading-relaxed">
                            This report presents a cost projection analysis for preventive maintenance 
                            based on {data.total_points} identified critical points. The average risk 
                            factor calculated is {(data.avg_risk_factor * 100).toFixed(1)}%.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Optimal Maintenance Windows
                        </h2>
                        <p className="leading-relaxed">
                            {data.annotations.length} optimal maintenance windows have been identified 
                            where projected costs reach their minimum values. Performing maintenance 
                            during these windows can result in significant savings.
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {data.annotations.map((annotation, idx) => {
                                const futureDate = new Date();
                                futureDate.setMonth(futureDate.getMonth() + annotation.month);
                                const dateStr = futureDate.toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                });
                                return (
                                    <li key={idx}>
                                        <strong>{dateStr}:</strong> Minimum cost of ${annotation.cost.toFixed(2)}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Recommendations
                        </h2>
                        <p className="leading-relaxed">
                            It is recommended to schedule maintenance interventions during the identified 
                            windows to optimize costs and minimize operational impact. The analysis projects 
                            costs over a {Math.max(...data.series_data.map(d => d.x)).toFixed(1)} month horizon.
                        </p>
                    </section>
                </div>
            </div>

            {/* Chart section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Maintenance Cost Projection
                </h2>
                <Chart 
                    options={options} 
                    series={series} 
                    type="area" 
                    height={350} 
                />
            </div>
        </div>
    );
};

export default PdfViewer;