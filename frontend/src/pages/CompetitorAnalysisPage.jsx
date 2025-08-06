import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CompetitorAnalysisPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { industry, product, competitor, autoDetect } = location.state || {};
    
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!product || !competitor) {
            navigate("/");
            return;
        }

        const fetchCompetitorAnalysis = async () => {
            try {
                const response = await axios.post("http://localhost:5000/competitor-analysis", { 
                    industry, 
                    product,
                    competitor,
                    autoDetect
                });
                setAnalysis(response.data.analysis);
            } catch (err) {
                console.error("Error fetching competitor analysis:", err);
                setError("Failed to fetch competitor analysis. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitorAnalysis();
    }, [industry, product, competitor, autoDetect, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Competitor Analysis</h1>
                
                <div className="mb-6">
                    <div className="bg-white p-5 rounded-lg shadow-md mb-4">
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                            <div>
                                <span className="text-gray-600 font-medium">Your Product: </span>
                                <span className="font-semibold">{product}</span>
                            </div>
                            <div>
                                <span className="text-gray-600 font-medium">Competitor: </span>
                                <span className="font-semibold">{competitor}</span>
                            </div>
                            {!autoDetect && industry && (
                                <div>
                                    <span className="text-gray-600 font-medium">Industry: </span>
                                    <span className="font-semibold">{industry}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-lg">Analyzing competitor data...</p>
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

                {analysis && (
                    <div className="space-y-6 mb-8">
                        {/* Comparison Overview */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h2 className="text-xl font-semibold mb-3 text-blue-800">Comparison Overview</h2>
                            <p className="text-gray-700 leading-relaxed">{analysis.overview}</p>
                        </div>
                        
                        {/* Product Comparison Table */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-500">
                            <h2 className="text-xl font-semibold mb-4 text-teal-800">Side-by-Side Comparison</h2>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                                Feature
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider w-1/3">
                                                {product}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider w-1/3">
                                                {competitor}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {analysis.comparisonTable && analysis.comparisonTable.map((row, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {row.feature}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {row.yourProduct}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {row.competitor}
                                                </td>
                                            </tr>
                                        ))}
                                        
                                        {/* Fallback if comparisonTable is not available */}
                                        {!analysis.comparisonTable && (
                                            <>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        Pricing
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        Based on market feedback
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        Based on market feedback
                                                    </td>
                                                </tr>
                                                <tr className="bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        User Experience
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        Based on gathered insights
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        Based on gathered insights
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        Features
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        Based on product information
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        Based on product information
                                                    </td>
                                                </tr>
                                                <tr className="bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        Market Perception
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        Based on discussions
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">
                                                        Based on discussions
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {/* Competitor's Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 h-full">
                                <h2 className="text-xl font-semibold mb-3 text-green-800">Competitor's Strengths</h2>
                                <p className="text-gray-700 leading-relaxed">{analysis.strengths}</p>
                            </div>
                            
                            {/* Weaknesses */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500 h-full">
                                <h2 className="text-xl font-semibold mb-3 text-amber-800">Competitor's Weaknesses</h2>
                                <p className="text-gray-700 leading-relaxed">{analysis.weaknesses}</p>
                            </div>
                        </div>
                        
                        {/* Market Perception */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                            <h2 className="text-xl font-semibold mb-3 text-indigo-800">Market Perception</h2>
                            <p className="text-gray-700 leading-relaxed">{analysis.perception}</p>
                        </div>
                        
                        {/* Strategic Recommendations */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                            <h2 className="text-xl font-semibold mb-3 text-purple-800">Strategic Recommendations</h2>
                            <p className="text-gray-700 leading-relaxed">{analysis.recommendations}</p>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-center mt-8 gap-4">
                    <button 
                        onClick={() => navigate("/query")} 
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-md"
                    >
                        New Analysis
                    </button>
                    
                    <button 
                        onClick={() => navigate(-1)} 
                        className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition shadow-md"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompetitorAnalysisPage;