import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome to CrowdScope - Gain Knowledge of Market Trends and Business Insights</h1>
            <p className="text-lg text-gray-700 text-center max-w-2xl mb-6">
                Our platform helps businesses analyze public sentiment and trends across different industries
                using AI-powered insights from Reddit discussions.
            </p>
            <button 
                onClick={() => navigate("/query")} 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
                Get Started
            </button>
        </div>
    );
};

export default Home;
