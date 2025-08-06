// filepath: d:\Web Development\Hackathon\market-insights-platform\frontend\src\pages\SelectCompetitorPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SelectCompetitorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { industry, product, autoDetect } = location.state || {};
    
    const [competitors, setCompetitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCompetitor, setSelectedCompetitor] = useState('');

    useEffect(() => {
        if (!product) {
            navigate('/');
            return;
        }

        const fetchCompetitors = async () => {
            try {
                const response = await axios.post('http://localhost:5000/find-competitors', {
                    industry,
                    product,
                    autoDetect
                });
                
                setCompetitors(response.data.competitors);
                if (response.data.competitors.length > 0) {
                    setSelectedCompetitor(response.data.competitors[0]);
                }
            } catch (err) {
                console.error("Error fetching competitors:", err);
                setError('Failed to fetch competitors. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitors();
    }, [industry, product, autoDetect, navigate]);

    const handleCompetitorSelect = (competitor) => {
        setSelectedCompetitor(competitor);
    };

    const handleSubmit = () => {
        if (selectedCompetitor) {
            navigate('/competitor-analysis', {
                state: {
                    industry,
                    product,
                    competitor: selectedCompetitor,
                    autoDetect
                }
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="w-full max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Select Competitor</h1>
                
                <div className="mb-6">
                    <div className="bg-white p-5 rounded-lg shadow-md mb-4">
                        <span className="text-gray-600 font-medium">Your Product: </span>
                        <span className="font-semibold">{product}</span>
                        {!autoDetect && industry && (
                            <span className="ml-4">
                                <span className="text-gray-600 font-medium">Industry: </span>
                                <span className="font-semibold">{industry}</span>
                            </span>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-lg">Finding competitors...</p>
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

                {!loading && !error && competitors.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg mb-6">
                        <p>No competitors found. Please try a different product or specify manually.</p>
                        <button 
                            onClick={() => navigate("/query")} 
                            className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {!loading && competitors.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4">Select a competitor to analyze:</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            {competitors.map((competitor, index) => (
                                <div 
                                    key={index}
                                    onClick={() => handleCompetitorSelect(competitor)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedCompetitor === competitor 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="font-semibold">{competitor}</div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-center mt-6">
                            <button 
                                onClick={handleSubmit}
                                disabled={!selectedCompetitor}
                                className={`px-8 py-3 rounded-lg text-lg font-semibold shadow-md ${
                                    selectedCompetitor 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 transition'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Analyze vs. {selectedCompetitor}
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-center">
                    <button 
                        onClick={() => navigate("/query")} 
                        className="text-blue-600 hover:text-blue-800 transition font-semibold"
                    >
                        ← Back to Query Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectCompetitorPage;