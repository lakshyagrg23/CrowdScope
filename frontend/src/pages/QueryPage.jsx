import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const QueryPage = () => {
    const [query, setQuery] = useState("");
    const [autoDetect, setAutoDetect] = useState(true);
    const [industry, setIndustry] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [otherIndustry, setOtherIndustry] = useState("");
    const [analysisType, setAnalysisType] = useState("market");
    const [competitor, setCompetitor] = useState("");
    const [autoFindCompetitors, setAutoFindCompetitors] = useState(true);
    
    // States for competitor fetching
    const [fetchingCompetitors, setFetchingCompetitors] = useState(false);
    const [competitors, setCompetitors] = useState([]);
    const [competitorError, setCompetitorError] = useState(null);
    
    const navigate = useNavigate();

    const industryCategories = {
        "Tech": ["Software Development", "Hardware", "AI & Machine Learning", "Cloud Computing", "Cybersecurity", "Other"],
        "Healthcare": ["Medical Devices", "Pharmaceuticals", "Healthcare Services", "Biotech", "Mental Health", "Other"],
        "Consumer Goods": ["Electronics", "Home Appliances", "Personal Care", "Toys & Games", "Other"],
        "Education": ["K-12", "Higher Education", "EdTech", "Professional Training", "Other"],
        "Finance": ["Banking", "Investments", "Insurance", "FinTech", "Cryptocurrency", "Other"],
        "Fashion": ["Apparel", "Footwear", "Accessories", "Luxury Goods"],
        "Food & Beverage": ["Restaurants", "Beverages", "Packaged Foods", "Grocery", "Other"],
        "Entertainment": ["Video Games", "Streaming Services", "Music", "Film & TV", "Sports", "Other"],
        "Automotive": ["Vehicles", "Auto Parts", "Electric Vehicles", "Mobility Services", "Other"],
        "Travel & Hospitality": ["Airlines", "Hotels", "Tourism", "Travel Tech", "Other"]
    };

    const fetchCompetitors = async () => {
        if (!query) return;
        
        setFetchingCompetitors(true);
        setCompetitorError(null);
        
        const selectedIndustry = autoDetect ? "" : 
                             (selectedCategory === "Other" ? otherIndustry : 
                             (industry || selectedCategory));
        
        try {
            const response = await axios.post('http://localhost:5000/find-competitors', {
                industry: selectedIndustry,
                product: query,
                autoDetect
            });
            
            setCompetitors(response.data.competitors);
            if (response.data.competitors.length > 0) {
                setCompetitor(response.data.competitors[0]);
            }
        } catch (err) {
            console.error("Error fetching competitors:", err);
            setCompetitorError('Failed to fetch competitors. Please try again or enter manually.');
        } finally {
            setFetchingCompetitors(false);
        }
    };

    // When analysis type changes, reset competitor-related fields
    useEffect(() => {
        setCompetitor("");
        setCompetitors([]);
        setCompetitorError(null);
        setAutoFindCompetitors(true);
    }, [analysisType]);

    // When autoFindCompetitors changes and is true, fetch competitors if we have a product name
    useEffect(() => {
        if (autoFindCompetitors && query && analysisType === "competitor") {
            fetchCompetitors();
        }
    }, [autoFindCompetitors, query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const selectedIndustry = autoDetect ? "" : 
                                (selectedCategory === "Other" ? otherIndustry : 
                                (industry || selectedCategory));
        
        if (analysisType === "market") {
            navigate("/results", { 
                state: { 
                    industry: selectedIndustry, 
                    query,
                    autoDetect 
                } 
            });
        } else {
            // For competitor analysis
            if (!competitor) {
                setCompetitorError("Please select or enter a competitor");
                return;
            }
            
            navigate("/competitor-analysis", {
                state: {
                    industry: selectedIndustry,
                    product: query,
                    competitor,
                    autoDetect
                }
            });
        }
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        if (category !== "Other") {
            setIndustry("");
        }
    };

    const handleIndustryChange = (e) => {
        setIndustry(e.target.value);
    };
    
    // Handle manual competitor input mode toggle
    const toggleCompetitorMode = () => {
        setAutoFindCompetitors(!autoFindCompetitors);
        setCompetitor("");
    };
    
    // Handle product query change
    const handleProductChange = (e) => {
        setQuery(e.target.value);
        // Clear competitors when product changes
        if (autoFindCompetitors) {
            setCompetitors([]);
            setCompetitor("");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {/* Logo */}
                                <Link to="/" className="flex items-center">
                                    <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                    <span className="ml-2 text-xl font-bold text-gray-900">CrowdScope</span>
                                </Link>
                            </div>
                        </div>
                        <nav className="flex space-x-6">
                                                    <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium">
                                                        Home
                                                    </Link>
                                                    <Link to="/query-consumer" className="text-gray-600 hover:text-blue-700 px-3 py-2 font-medium">
                                                        Consumer Tools
                                                    </Link>
                                                    <Link to="/query" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium border-b-2 border-blue-600">
                                                        Business Tools
                                                    </Link>
                                                    <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium">
                                                        How It Works
                                                    </a>
                                                </nav>
                        {/* <div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
                                Sign In
                            </button>
                        </div> */}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Data-Driven Market Intelligence
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-xl text-gray-600 sm:text-2xl sm:max-w-3xl">
                        Analyze products, services, and competitors with AI-powered insights from real customer discussions.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Analysis Type Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Market Analysis Card */}
                        <div 
                            onClick={() => setAnalysisType("market")}
                            className={`bg-white rounded-lg shadow-md border-2 p-6 cursor-pointer transition duration-200 ${
                                analysisType === "market" ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-gray-200"
                            }`}
                        >
                            <div className="flex items-start">
                                <div className={`rounded-full p-3 ${
                                    analysisType === "market" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-semibold text-gray-900">Market Analysis</h3>
                                    <p className="mt-1 text-gray-600">
                                        Understand how your product or service is perceived in the market. Get insights on strengths, weaknesses, and opportunities based on real customer feedback.
                                    </p>
                                    <ul className="mt-4 space-y-2">
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Sentiment analysis of customer discussions</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Identify product strengths and pain points</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Strategic recommendations for improvement</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Competitor Analysis Card */}
                        <div 
                            onClick={() => setAnalysisType("competitor")}
                            className={`bg-white rounded-lg shadow-md border-2 p-6 cursor-pointer transition duration-200 ${
                                analysisType === "competitor" ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-gray-200"
                            }`}
                        >
                            <div className="flex items-start">
                                <div className={`rounded-full p-3 ${
                                    analysisType === "competitor" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-semibold text-gray-900">Competitor Analysis</h3>
                                    <p className="mt-1 text-gray-600">
                                        Compare your product against specific competitors. Learn what makes them successful and where you can gain competitive advantage.
                                    </p>
                                    <ul className="mt-4 space-y-2">
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Side-by-side feature comparison</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Identify competitor strengths and weaknesses</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Competitive positioning recommendations</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {analysisType === "market" ? "Market Analysis" : "Competitor Analysis"} Form
                        </h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block mb-2 font-semibold text-lg text-gray-800">
                                    {analysisType === "market" 
                                        ? "What would you like to analyze?" 
                                        : "Enter your product/service name:"}
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder={analysisType === "market" 
                                        ? "Product, service, topic, or trend (e.g., 'electric scooters', 'meal kit delivery')" 
                                        : "Your product or service (e.g., 'Tesla Model 3', 'Spotify Premium')"
                                    }
                                    value={query}
                                    onChange={handleProductChange}
                                    required
                                />
                            </div>

                            {/* Competitor Input (only for competitor analysis) */}
                            {analysisType === "competitor" && (
                                <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="font-semibold text-lg text-gray-800">Competitor Selection</label>
                                        <div className="flex items-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={autoFindCompetitors}
                                                    onChange={toggleCompetitorMode}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-700">
                                                    Auto-find competitors
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {autoFindCompetitors ? (
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            {fetchingCompetitors && (
                                                <div className="flex items-center justify-center p-4">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                    <span className="ml-2 text-gray-600">Finding competitors...</span>
                                                </div>
                                            )}
                                            
                                            {competitorError && (
                                                <div className="text-red-600 mb-2 text-sm bg-red-50 p-3 rounded-lg">{competitorError}</div>
                                            )}
                                            
                                            {!fetchingCompetitors && competitors.length > 0 && (
                                                <div>
                                                    <label className="block mb-2 font-medium">Select a competitor:</label>
                                                    <select
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        value={competitor}
                                                        onChange={(e) => setCompetitor(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select competitor</option>
                                                        {competitors.map((comp, idx) => (
                                                            <option key={idx} value={comp}>{comp}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            
                                            {!fetchingCompetitors && query && competitors.length === 0 && !competitorError && (
                                                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                                                    <p className="text-gray-600 mb-2">No competitors found yet</p>
                                                    <button 
                                                        type="button"
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                        onClick={fetchCompetitors}
                                                    >
                                                        Find competitors
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <label className="block mb-2 font-medium">Specify competitor:</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                placeholder="Enter competitor name (e.g., 'Chevrolet Bolt', 'Apple Music')"
                                                value={competitor}
                                                onChange={(e) => setCompetitor(e.target.value)}
                                                required={analysisType === "competitor" && !autoFindCompetitors}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="font-semibold text-lg text-gray-800">Industry Classification</label>
                                    <div className="flex items-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={autoDetect}
                                                onChange={() => setAutoDetect(!autoDetect)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                Let AI auto-detect industry
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {!autoDetect && (
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block mb-1 font-medium">Category:</label>
                                                <select 
                                                    className="w-full p-2 border border-gray-300 rounded" 
                                                    value={selectedCategory}
                                                    onChange={handleCategoryChange}
                                                    required={!autoDetect}
                                                >
                                                    <option value="">Select a category</option>
                                                    {Object.keys(industryCategories).map((category) => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            {selectedCategory && selectedCategory !== "Other" && (
                                                <div>
                                                    <label className="block mb-1 font-medium">Specific Industry:</label>
                                                    <select
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                        value={industry}
                                                        onChange={handleIndustryChange}
                                                    >
                                                        <option value="">All {selectedCategory}</option>
                                                        {industryCategories[selectedCategory].map((ind) => (
                                                            <option key={ind} value={ind}>{ind}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {selectedCategory === "Other" && (
                                                <div>
                                                    <label className="block mb-1 font-medium">Specify Industry:</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                        placeholder="Enter industry name"
                                                        value={otherIndustry}
                                                        onChange={(e) => setOtherIndustry(e.target.value)}
                                                        required={selectedCategory === "Other"}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 text-lg shadow-md"
                            >
                                {analysisType === "market" 
                                    ? "Get Market Insights" 
                                    : "Get Competitor Analysis"
                                }
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* How It Works Section */}
                <div className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                                Our platform leverages AI to analyze real user discussions across social media and forums
                                to deliver actionable business insights.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Data Collection</h3>
                                <p className="text-gray-600">
                                    We collect relevant discussions from Reddit and other platforms about your product or competitors.
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
                                <p className="text-gray-600">
                                    Our advanced AI processes the data to identify patterns, sentiment, and key insights.
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Actionable Insights</h3>
                                <p className="text-gray-600">
                                    Receive detailed reports with strategic recommendations to improve your product and market position.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
                            <p className="text-gray-400">
                                AI-powered market intelligence platform for data-driven business decisions.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Features</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Market Analysis</a></li>
                                <li><a href="#" className="hover:text-white transition">Competitor Analysis</a></li>
                                <li><a href="#" className="hover:text-white transition">Brand Monitoring</a></li>
                                <li><a href="#" className="hover:text-white transition">Custom Reports</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition">Case Studies</a></li>
                                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Support</a></li>
                                <li><a href="#" className="hover:text-white transition">Sales</a></li>
                                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition">Press</a></li>
                            </ul>
                        </div>
                    </div> */}
                    <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400">© 2025 Market Insights Platform. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default QueryPage;