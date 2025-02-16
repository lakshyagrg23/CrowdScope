import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const QueryPage = () => {
    const [industry, setIndustry] = useState("travel");
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const industries = ["travel", "education", "video games", "electronics"];

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/results", { state: { industry, query } });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Enter Your Query</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <label className="block mb-2 font-medium">Select Industry:</label>
                <select 
                    className="w-full p-2 border rounded mb-4" 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)}
                >
                    {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                    ))}
                </select>

                <label className="block mb-2 font-medium">Enter Query:</label>
                <input 
                    type="text" 
                    className="w-full p-2 border rounded mb-4" 
                    placeholder="Product, service, or topic"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                />

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                    Get Insights
                </button>
            </form>
        </div>
    );
};

export default QueryPage;
