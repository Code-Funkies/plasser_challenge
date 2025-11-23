import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface MaintenanceData {
    series_data: Array<{ x: number; y: number }>;
    annotations: Array<{ month: number; cost: number; label: string }>;
    avg_risk_factor: number;
    total_points: number;
}

interface AIReport {
    report: string;
    recommendations: string[];
}

const PdfViewer = () => {
    const [data, setData] = useState<MaintenanceData | null>(null);
    const [aiReport, setAiReport] = useState<AIReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
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

                // Fetch AI-generated report
                await fetchAIReport(apiData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchAIReport = async (maintenanceData: MaintenanceData) => {
        try {
            setAiLoading(true);
            const response = await fetch('http://localhost:8000/api/generate-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    maintenance_data: maintenanceData
                })
            });

            if (!response.ok) {
                throw new Error('Error generating AI report');
            }

            const reportData: AIReport = await response.json();
            setAiReport(reportData);
        } catch (err) {
            console.error('AI Report generation failed:', err);
            // Don't fail the whole component if AI report fails
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-10">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        {/* Outer spinning ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 animate-ping"></div>
                        {/* Middle spinning ring */}
                        <div className="relative rounded-full border-8 border-t-neutral-900 border-r-neutral-600 border-b-neutral-300 border-l-neutral-900 w-24 h-24 animate-spin"></div>
                        {/* Inner pulsing circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-neutral-700 rounded-full animate-pulse opacity-50"></div>
                        </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                        <p className="text-2xl font-bold text-neutral-900 animate-pulse">
                            Thinking...
                        </p>
                        <p className="text-gray-600 animate-pulse">
                            Loading maintenance data
                        </p>
                    </div>

                    {/* Animated dots */}
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-neutral-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-neutral-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-neutral-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
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
                
                {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-6">
                        <div className="relative">
                            {/* Outer spinning ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-neutral-200 animate-ping"></div>
                            {/* Middle spinning ring */}
                            <div className="relative rounded-full border-8 border-t-neutral-900 border-r-neutral-600 border-b-neutral-300 border-l-neutral-900 w-24 h-24 animate-spin"></div>
                            {/* Inner pulsing circle */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-neutral-700 rounded-full animate-pulse opacity-50"></div>
                            </div>
                        </div>
                        
                        <div className="text-center space-y-2">
                            <p className="text-2xl font-bold text-neutral-900 animate-pulse">
                                Thinking...
                            </p>
                            <p className="text-gray-600 animate-pulse">
                                Analyzing maintenance data and generating insights
                            </p>
                        </div>

                        {/* Animated dots */}
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-neutral-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-3 h-3 bg-neutral-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-3 h-3 bg-neutral-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                ) : aiReport ? (
                    <div className="bg-gradient-to-r from-gray-50 to-neutral-100 border-l-4 border-neutral-900 p-6 rounded-r-lg shadow-md">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                            AI-Generated Analysis
                        </h3>
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg mb-6">
                            {aiReport.report}
                        </div>
                        {aiReport.recommendations.length > 0 && (
                            <div className="bg-white bg-opacity-60 rounded-lg p-4 backdrop-blur">
                                <h4 className="font-bold text-neutral-900 mb-3 text-xl">Key Recommendations:</h4>
                                <ul className="space-y-2">
                                    {aiReport.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="text-neutral-800 font-bold mt-1">•</span>
                                            <span className="text-gray-700 flex-1">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : null}
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