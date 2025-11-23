interface ApprovedTicketsProps {
    ticketId: string | null;
}

const ApprovedTickets = ({ ticketId }: ApprovedTicketsProps) => {
    if (!ticketId) {
        return (
            <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="text-center text-sm">No approved tickets yet</p>
                <p className="text-center text-xs mt-2">Approve a maintenance report to see tickets here</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 h-full overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Approved Tickets
            </h3>
            
            <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900">Maintenance Order</h4>
                                <span className="inline-block bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                    Approved
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">Predictive maintenance intervention</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3 bg-white bg-opacity-50 rounded-lg p-4">
                        <div>
                            <p className="text-xs text-gray-600 mb-1 font-semibold">Ticket ID</p>
                            <p className="font-mono font-bold text-gray-900 text-sm">{ticketId}</p>
                        </div>
                        
                        <div className="border-t border-green-200 pt-3">
                            <p className="text-xs text-gray-600 mb-1 font-semibold">Approval Date</p>
                            <p className="text-sm text-gray-700">{new Date().toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                        
                        <div className="border-t border-green-200 pt-3">
                            <p className="text-xs text-gray-600 mb-1 font-semibold">Priority</p>
                            <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">
                                High
                            </span>
                        </div>
                        
                        <div className="border-t border-green-200 pt-3">
                            <p className="text-xs text-gray-600 mb-1 font-semibold">Type</p>
                            <p className="text-sm text-gray-700">Track Tamping</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovedTickets;
