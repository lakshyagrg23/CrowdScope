import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ConsumerPage = () => {
    const [analysisType, setAnalysisType] = useState("product");
    const [productName, setProductName] = useState("");
    const [compareProduct, setCompareProduct] = useState("");
    const [needsDescription, setNeedsDescription] = useState("");
    const [category, setCategory] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [enableComparison, setEnableComparison] = useState(false);
    
    const navigate = useNavigate();

    // Sample product categories
    const productCategories = [
        "Smartphones",
        "Laptops",
        "Headphones",
        "TVs",
        "Home Appliances",
        "Gaming Consoles",
        "Cameras",
        "Smartwatches",
        "Home Audio",
        "Fitness Equipment",
        "Kitchen Appliances",
        "Power Tools",
        "Other"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (analysisType === "product") {
            navigate("/consumer-results", { 
                state: { 
                    analysisType: "product",
                    productName,
                    compareProduct: enableComparison ? compareProduct : null,
                    enableComparison
                } 
            });
        } else {
            navigate("/product-recommendation", {
                state: {
                    analysisType: "recommendation",
                    needsDescription,
                    category,
                    priceRange
                }
            });
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
                                    <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                    <span className="ml-2 text-xl font-bold text-gray-900">CrowdScope</span>
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
                        {/* <div>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
                                Sign In
                            </button>
                        </div> */}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Smarter Shopping Decisions
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-xl text-gray-600 sm:text-2xl sm:max-w-3xl">
                        Get AI-powered product insights and personalized recommendations based on actual customer experiences.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Analysis Type Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Product Analysis Card */}
                        <div 
                            onClick={() => setAnalysisType("product")}
                            className={`bg-white rounded-lg shadow-md border-2 p-6 cursor-pointer transition duration-200 ${
                                analysisType === "product" ? "border-green-500 ring-2 ring-green-200" : "border-transparent hover:border-gray-200"
                            }`}
                        >
                            <div className="flex items-start">
                                <div className={`rounded-full p-3 ${
                                    analysisType === "product" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                                }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-semibold text-gray-900">Product Analysis</h3>
                                    <p className="mt-1 text-gray-600">
                                        Get a comprehensive analysis of a specific product including pros, cons, and value assessment. Compare it with alternatives.
                                    </p>
                                    <ul className="mt-4 space-y-2">
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Detailed pros and cons analysis</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Value-for-money assessment</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Side-by-side product comparison</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Product Recommendation Card */}
                        <div 
                            onClick={() => setAnalysisType("recommendation")}
                            className={`bg-white rounded-lg shadow-md border-2 p-6 cursor-pointer transition duration-200 ${
                                analysisType === "recommendation" ? "border-green-500 ring-2 ring-green-200" : "border-transparent hover:border-gray-200"
                            }`}
                        >
                            <div className="flex items-start">
                                <div className={`rounded-full p-3 ${
                                    analysisType === "recommendation" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                                }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-semibold text-gray-900">Product Recommendations</h3>
                                    <p className="mt-1 text-gray-600">
                                        Describe your needs and preferences, and we'll recommend the best products that match your requirements.
                                    </p>
                                    <ul className="mt-4 space-y-2">
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Personalized product suggestions</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Smart needs-based filtering</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Top 5 best-fit product recommendations</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {analysisType === "product" ? "Product Analysis" : "Product Recommendation"} Form
                        </h2>
                        
                        <form onSubmit={handleSubmit}>
                            {analysisType === "product" ? (
                                /* Product Analysis Form */
                                <>
                                    <div className="mb-6">
                                        <label className="block mb-2 font-semibold text-lg text-gray-800">
                                            Which product would you like to analyze?
                                        </label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                            placeholder="Enter a specific product name (e.g., 'Apple AirPods Pro', 'Sony WH-1000XM4')"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center mb-4">
                                            <input
                                                id="enable-comparison"
                                                type="checkbox"
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                checked={enableComparison}
                                                onChange={() => setEnableComparison(!enableComparison)}
                                            />
                                            <label htmlFor="enable-comparison" className="ml-2 font-medium text-gray-700">
                                                Compare with another product
                                            </label>
                                        </div>

                                        {enableComparison && (
                                            <div className="ml-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <label className="block mb-2 font-medium text-gray-800">
                                                    Enter product to compare against:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="Enter a similar product (e.g., 'Samsung Galaxy Buds Pro')"
                                                    value={compareProduct}
                                                    onChange={(e) => setCompareProduct(e.target.value)}
                                                    required={enableComparison}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Product Recommendation Form */
                                <>
                                    <div className="mb-6">
                                        <label className="block mb-2 font-semibold text-lg text-gray-800">
                                            What are you looking for?
                                        </label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px]"
                                            placeholder="Describe what you're looking for, your needs, and any specific requirements (e.g., 'I need noise-cancelling headphones for air travel that are comfortable for long periods')"
                                            value={needsDescription}
                                            onChange={(e) => setNeedsDescription(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block mb-2 font-medium text-gray-800">
                                                Product Category:
                                            </label>
                                            <select
                                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {productCategories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium text-gray-800">
                                                Price Range:
                                            </label>
                                            <select
                                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                value={priceRange}
                                                onChange={(e) => setPriceRange(e.target.value)}
                                                required
                                            >
                                                <option value="">Select a price range</option>
                                                <option value="budget">Budget</option>
                                                <option value="mid-range">Mid-range</option>
                                                <option value="premium">Premium</option>
                                                <option value="luxury">Luxury</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            <button 
                                type="submit" 
                                className="w-full bg-green-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 text-lg shadow-md"
                            >
                                {analysisType === "product" 
                                    ? enableComparison 
                                        ? "Compare Products" 
                                        : "Get Product Analysis" 
                                    : "Get Product Recommendations"
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
                                Our platform analyzes thousands of customer reviews and discussions to provide you with accurate, unbiased product insights.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Data Collection</h3>
                                <p className="text-gray-600">
                                    We gather data from reviews, forums, and social media to understand real customer experiences.
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
                                <p className="text-gray-600">
                                    Our AI analyzes the data to identify patterns, trends, pros, cons, and overall sentiment.
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Personalized Reports</h3>
                                <p className="text-gray-600">
                                    Get comprehensive analysis and recommendations tailored to your specific needs or product inquiries.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                                Thousands of shoppers are making smarter buying decisions with our AI-powered insights.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <div className="text-yellow-400 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    "The product analysis helped me choose between two laptops I was considering. The detailed pros and cons breakdown saved me from making a costly mistake."
                                </p>
                                <p className="font-medium">Sarah T., Designer</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <div className="text-yellow-400 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    "I described what I needed in a smartphone and the recommendation tool suggested options I hadn't even considered. Found the perfect phone for my needs!"
                                </p>
                                <p className="font-medium">Michael R., Teacher</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <div className="text-yellow-400 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    "The value-for-money insights convinced me to spend a bit more on a product that will last much longer. In the long run, it saved me money!"
                                </p>
                                <p className="font-medium">Jennifer L., Accountant</p>
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
                                AI-powered product analysis for smarter consumer decisions.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Consumer Tools</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Product Analysis</a></li>
                                <li><a href="#" className="hover:text-white transition">Product Recommendations</a></li>
                                <li><a href="#" className="hover:text-white transition">Compare Products</a></li>
                                <li><a href="#" className="hover:text-white transition">Buying Guides</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
                                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Help & Support</a></li>
                                <li><a href="#" className="hover:text-white transition">Feedback</a></li>
                                <li><a href="#" className="hover:text-white transition">Partnerships</a></li>
                                <li><a href="#" className="hover:text-white transition">Media Inquiries</a></li>
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
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ConsumerPage;