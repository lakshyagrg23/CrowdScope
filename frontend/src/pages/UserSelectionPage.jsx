import React from "react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <a href="/" className="flex items-center">
                                    <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                    <span className="ml-2 text-xl font-bold text-gray-900">Market Insights</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">I am a...</h1>
                        <p className="text-lg text-gray-600">
                            Choose your profile to customize your experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Business Card */}
                        <div 
                            onClick={() => navigate("/query")}
                            className="bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Business</h2>
                                <p className="text-gray-600 mb-6">
                                    I want to analyze market trends and gather insights for my products or services
                                </p>
                                <ul className="text-left space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Market analysis</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Competitor insights</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Business growth recommendations</span>
                                    </li>
                                </ul>
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                    Select
                                </button>
                            </div>
                        </div>

                        {/* Consumer Card */}
                        <div 
                            onClick={() => navigate("/consumer")}
                            className="bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-green-500 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Consumer</h2>
                                <p className="text-gray-600 mb-6">
                                    I want to find the best products and make informed purchasing decisions
                                </p>
                                <ul className="text-left space-y-2 mb-6">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Product analysis and reviews</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Side-by-side product comparisons</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Personalized product recommendations</span>
                                    </li>
                                </ul>
                                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">
                                    Select
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto bg-white border-t py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500">© {new Date().getFullYear()} Market Insights Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default GetStarted;