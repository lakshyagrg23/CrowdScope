import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { industry, query, autoDetect } = location.state || {};
    
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query || (!autoDetect && !industry)) {
            navigate("/");
            return;
        }

        const fetchInsights = async () => {
            try {
                const response = await axios.post("http://localhost:5000/analyze", { 
                    industry, 
                    query,
                    autoDetect
                });
                setInsights(response.data.insights);
            } catch (err) {
                setError("Failed to fetch insights. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [industry, query, autoDetect, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Market Analysis Results</h1>
                <div className="mb-4">
                    <span className="text-gray-600 font-medium">Query: </span>
                    <span className="font-semibold">{query}</span>
                    {!autoDetect && industry && (
                        <>
                            <span className="text-gray-600 font-medium ml-4">Industry: </span>
                            <span className="font-semibold">{industry}</span>
                        </>
                    )}
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-lg">Analyzing Reddit discussions...</p>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                        <p>{error}</p>
                        <button 
                            onClick={() => navigate("/query")} 
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {insights && (
                    <div className="space-y-6 mb-8">
                        {/* Overview - Full width box at the top */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h2 className="text-xl font-semibold mb-3 text-blue-800">Market Overview</h2>
                            <p className="text-gray-700 leading-relaxed">{insights.overview}</p>
                        </div>
                        
                        {/* Positives and Shortcomings - Side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Positives - Left side */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 h-full">
                                <h2 className="text-xl font-semibold mb-3 text-green-800">Positives</h2>
                                <p className="text-gray-700 leading-relaxed">{insights.positives}</p>
                            </div>
                            
                            {/* Shortcomings - Right side */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500 h-full">
                                <h2 className="text-xl font-semibold mb-3 text-amber-800">Shortcomings</h2>
                                <p className="text-gray-700 leading-relaxed">{insights.shortcomings}</p>
                            </div>
                        </div>
                        
                        {/* Suggestions - Full width box at the bottom */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                            <h2 className="text-xl font-semibold mb-3 text-purple-800">Recommendations & Insights</h2>
                            <p className="text-gray-700 leading-relaxed">{insights.suggestions}</p>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => navigate("/query")} 
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-md"
                    >
                        Analyze Another Query
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
