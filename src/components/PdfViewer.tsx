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

interface PdfViewerProps {
    pdfUrl?: string;
    onTicketApproved?: (ticketId: string) => void;
}

const PdfViewer = ({ onTicketApproved }: PdfViewerProps) => {
    const [data, setData] = useState<MaintenanceData | null>(null);
    const [aiReport, setAiReport] = useState<AIReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [approvedTicket, setApprovedTicket] = useState<string | null>(null);

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

    const handleApproveReport = () => {
        const ticketId = `MT-${Date.now().toString().slice(-8)}`;
        setApprovedTicket(ticketId);
        setShowModal(true);
        if (onTicketApproved) {
            onTicketApproved(ticketId);
        }
    };

    const closeModal = () => {
        setShowModal(false);
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
        <>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-in">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Maintenance Approved!</h2>
                            <p className="text-gray-600 text-center mb-4">
                                The maintenance order has been successfully approved
                            </p>
                            <div className="bg-gray-100 rounded-lg p-4 mb-6 w-full">
                                <p className="text-sm text-gray-600 mb-1">Ticket ID:</p>
                                <p className="text-xl font-mono font-bold text-neutral-900">{approvedTicket}</p>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-700 transition-colors font-semibold w-full"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
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
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
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

            {/* Approve Button */}
            {aiReport && !approvedTicket && (
                <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center">
                    <button 
                        onClick={handleApproveReport}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Approve and Send Maintenance Order
                    </button>
                </div>
            )}

            {approvedTicket && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-600 p-6 rounded-r-lg shadow-sm">
                    <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Maintenance Order Approved</h3>
                            <p className="text-gray-700">Ticket ID: <span className="font-mono font-bold">{approvedTicket}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default PdfViewer;