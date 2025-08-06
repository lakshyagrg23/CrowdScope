import React from "react";
import { useNavigate } from "react-router-dom";

const Consumer = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <a href="/" className="flex items-center">
                                    <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                    <span className="ml-2 text-xl font-bold text-gray-900">Consumer Insights</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => navigate("/get-started")} className="text-gray-600 hover:text-green-600 mr-4">
                                Change User Type
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Perfect Products</h1>
                        <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                            Make smarter shopping decisions with AI-powered product insights
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How Would You Like To Proceed?</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose one of our consumer tools to get started
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Product Analysis Card */}
                    <div 
                        onClick={() => navigate("/product-analysis")}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-transparent hover:border-green-500 p-8 cursor-pointer transition-all"
                    >
                        <div className="text-center mb-4">
                            <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Product Analysis</h3>
                        </div>
                        <p className="text-center text-gray-600 mb-6">
                            Get detailed insights about a specific product, including pros, cons, and value for money.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 italic">
                                "I already know which product I'm interested in and want to see if it's worth buying."
                            </p>
                        </div>
                        <div className="text-center">
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
                                Start Analysis
                            </button>
                        </div>
                    </div>
                    
                    {/* Product Recommendation Card */}
                    <div 
                        onClick={() => navigate("/product-recommendation")}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl border-2 border-transparent hover:border-blue-500 p-8 cursor-pointer transition-all"
                    >
                        <div className="text-center mb-4">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Product Recommendations</h3>
                        </div>
                        <p className="text-center text-gray-600 mb-6">
                            Answer a few questions about your needs and get personalized product recommendations.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 italic">
                                "I know what I need but I'm not sure which products would be best for my specific requirements."
                            </p>
                        </div>
                        <div className="text-center">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                Get Recommendations
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials or Information */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Why Use Our Consumer Tools?</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-center mb-4">
                                <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Unbiased Analysis</h3>
                            <p className="text-gray-600 text-center">
                                Our AI analyzes thousands of real user experiences to give you objective insights.
                            </p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-center mb-4">
                                <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Save Time</h3>
                            <p className="text-gray-600 text-center">
                                Get instant insights instead of spending hours reading reviews and comparing products.
                            </p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="text-center mb-4">
                                <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Smart Shopping</h3>
                            <p className="text-gray-600 text-center">
                                Make confident purchasing decisions that give you the best value for your money.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="text-center md:text-left">
                            <p>© {new Date().getFullYear()} Market Insights Platform. All rights reserved.</p>
                        </div>
                        <div className="flex justify-center md:justify-end space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Consumer;