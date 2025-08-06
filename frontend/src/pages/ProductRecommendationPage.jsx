// filepath: d:\Web Development\Hackathon\market-insights-platform\frontend\src\pages\ProductRecommendationPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ProductRecommendationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { needsDescription, category, priceRange } = location.state?.analysisType === "recommendation" ? location.state : {};
    
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!needsDescription || !category || !priceRange) {
            navigate("/consumer");
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const response = await axios.post("http://localhost:5000/recommend-products", { 
                    needsDescription, 
                    category,
                    priceRange
                });
                setRecommendations(response.data.recommendations);
            } catch (err) {
                setError("Failed to fetch product recommendations. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [needsDescription, category, priceRange, navigate]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header - You can reuse your existing header component */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link to="/" className="flex items-center">
                                    <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                    <span className="ml-2 text-xl font-bold text-gray-900">Market Insights</span>
                                </Link>
                            </div>
                        </div>
                        <nav className="flex space-x-6">
                            <Link to="/" className="text-gray-600 hover:text-green-600 px-3 py-2 font-medium">
                                Home
                            </Link>
                            <Link to="/consumer" className="text-green-600 hover:text-green-700 px-3 py-2 font-medium border-b-2 border-green-600">
                                Consumer Tools
                            </Link>
                            <Link to="/query" className="text-gray-600 hover:text-green-600 px-3 py-2 font-medium">
                                Business Tools
                            </Link>
                            <a href="#" className="text-gray-600 hover:text-green-600 px-3 py-2 font-medium">
                                How It Works
                            </a>
                        </nav>
                        <div>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Product Recommendations</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Based on your needs and requirements
                        </p>
                    </div>
                    
                    {/* User requirements summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Requirements</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Looking For</h3>
                                <p className="mt-1 text-gray-800">{category}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Price Range</h3>
                                <p className="mt-1 text-gray-800">{priceRange}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Specific Needs</h3>
                                <p className="mt-1 text-gray-800">{needsDescription?.length > 100 ? `${needsDescription.substring(0, 100)}...` : needsDescription}</p>
                            </div>
                        </div>
                    </div>
                    
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                            <p className="mt-4 text-lg text-gray-600">Finding the perfect products for you...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-8">
                            <h3 className="text-lg font-semibold mb-2">Error</h3>
                            <p>{error}</p>
                            <button 
                                onClick={() => navigate("/consumer")}
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    
                    {recommendations && (
                        <div className="space-y-8">
                            {/* Summary */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-green-800 mb-4">Recommendation Summary</h2>
                                <p className="text-gray-700">{recommendations.recommendationSummary}</p>
                            </div>
                            
                            {/* Recommended Products */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 5 Recommended Products</h2>
                                <div className="space-y-6">
                                    {recommendations.recommendedProducts?.map((product, index) => (
                                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    {product.estimatedPrice}
                                                </span>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-500">Key Features</h4>
                                                <ul className="mt-2 list-disc list-inside space-y-1">
                                                    {product.keyFeatures?.map((feature, i) => (
                                                        <li key={i} className="text-gray-700">{feature}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-500">Why We Recommend It</h4>
                                                <p className="mt-1 text-gray-700">{product.whyRecommended}</p>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-500">Best For</h4>
                                                <p className="mt-1 text-gray-700">{product.bestFor}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Additional Considerations */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                                <h2 className="text-xl font-semibold text-blue-800 mb-4">Additional Considerations</h2>
                                <p className="text-gray-700">{recommendations.additionalConsiderations}</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                                <button
                                    onClick={() => navigate("/consumer")}
                                    className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition"
                                >
                                    Refine My Requirements
                                </button>
                                <button
                                    onClick={() => {
                                        // You could implement a feature to save these recommendations
                                        // For now it just thanks the user
                                        alert("Thank you for using our recommendation service!");
                                    }}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                                >
                                    Save These Recommendations
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Footer - You can reuse your existing footer component */}
            {/* ... */}
        </div>
    );
};

export default ProductRecommendationPage;