import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { industry, query } = location.state || {};
    
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!industry || !query) {
            navigate("/");
            return;
        }

        const fetchInsights = async () => {
            try {
                const response = await axios.post("http://localhost:5000/analyze", { industry, query });
                setInsights(response.data.insights);
            } catch (err) {
                setError("Failed to fetch insights. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [industry, query, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Analysis Results</h1>
            {loading && <p>Loading insights...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {insights && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                    <h2 className="text-xl font-semibold mb-2">Insights</h2>
                    <div className="border-t pt-4">
                        <h3 className="font-medium">Overview:</h3>
                        <p>{insights.overview}</p>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="font-medium">Positives:</h3>
                        <p>{insights.positives}</p>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="font-medium">Shortcomings:</h3>
                        <p>{insights.shortcomings}</p>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="font-medium">Advice & Suggestions:</h3>
                        <p>{insights.suggestions}</p>
                    </div>
                </div>
            )}

            <button 
                onClick={() => navigate("/query")} 
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
                Analyze Another Query
            </button>
        </div>
    );
};

export default ResultsPage;
