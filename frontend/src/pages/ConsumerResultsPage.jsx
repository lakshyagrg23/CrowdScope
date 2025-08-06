import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ConsumerResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { analysisType, productName, compareProduct, enableComparison } = location.state || {};
    
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productName && analysisType === "product") {
            navigate("/query-consumer");
            return;
        }

        const fetchAnalysis = async () => {
            try {
                const response = await axios.post("http://localhost:5000/analyze-product", { 
                    productName,
                    compareProduct: enableComparison ? compareProduct : null
                });
                setAnalysis(response.data.analysis);
            } catch (err) {
                setError("Failed to fetch product analysis. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [productName, compareProduct, enableComparison, navigate, analysisType]);

    // Helper function to render rating stars
    const renderStars = (rating) => {
        const stars = [];
        const numericRating = parseInt(rating) || 0;
        
        for (let i = 1; i <= 10; i++) {
            if (i <= numericRating) {
                stars.push(
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            }
        }
        
        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-2 text-lg font-medium">{rating}/10</span>
            </div>
        );
    };

    // Render single product analysis
    const renderSingleProductAnalysis = () => {
        return (
            <div className="space-y-8">
                {/* Overview */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">Product Overview</h2>
                    <p className="text-gray-700 leading-relaxed">{analysis.overview}</p>
                </div>
                
                {/* Pros and Cons - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pros - Left side */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 h-full">
                        <h2 className="text-xl font-semibold mb-3 text-green-800">Pros</h2>
                        <ul className="space-y-2">
                            {Array.isArray(analysis.pros) ? 
                                analysis.pros.map((pro, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{pro}</span>
                                    </li>
                                )) : 
                                <li className="text-gray-700">{analysis.pros}</li>
                            }
                        </ul>
                    </div>
                    
                    {/* Cons - Right side */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 h-full">
                        <h2 className="text-xl font-semibold mb-3 text-red-800">Cons</h2>
                        <ul className="space-y-2">
                            {Array.isArray(analysis.cons) ? 
                                analysis.cons.map((con, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>{con}</span>
                                    </li>
                                )) : 
                                <li className="text-gray-700">{analysis.cons}</li>
                            }
                        </ul>
                    </div>
                </div>

                {/* Value and Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md h-full">
                        <h2 className="text-xl font-semibold mb-3 text-gray-900">Value for Money</h2>
                        <p className="text-gray-700 mb-4">{analysis.valueForMoney}</p>
                        <div className="mt-2">
                            <h3 className="font-medium text-gray-800 mb-1">Rating:</h3>
                            {renderStars(analysis.valueRating)}
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md h-full">
                        <h2 className="text-xl font-semibold mb-3 text-gray-900">Ideal For</h2>
                        <ul className="space-y-2">
                            {Array.isArray(analysis.idealFor) ? 
                                analysis.idealFor.map((user, index) => (
                                    <li key={index} className="flex items-center">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{user}</span>
                                    </li>
                                )) : 
                                <li className="text-gray-700">{analysis.idealFor}</li>
                            }
                        </ul>
                    </div>
                </div>
                
                {/* Alternatives */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-3 text-gray-900">Alternative Options</h2>
                    <ul className="space-y-2">
                        {Array.isArray(analysis.alternatives) ? 
                            analysis.alternatives.map((alt, index) => (
                                <li key={index} className="flex items-center">
                                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                                    </svg>
                                    <span>{alt}</span>
                                </li>
                            )) : 
                            <li className="text-gray-700">{analysis.alternatives}</li>
                        }
                    </ul>
                </div>
                
                {/* Verdict */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">Final Verdict</h2>
                    <p className="text-gray-700 leading-relaxed">{analysis.verdict}</p>
                </div>
            </div>
        );
    };

    // Render comparison analysis
    const renderComparisonAnalysis = () => {
        return (
            <div className="space-y-8">
                {/* Overview */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">Comparison Overview</h2>
                    <p className="text-gray-700 leading-relaxed">{analysis.overview}</p>
                </div>
                
                {/* Product Comparison Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Feature Comparison</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{productName}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{compareProduct}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analysis.comparisonTable && Array.isArray(analysis.comparisonTable) ? 
                                    analysis.comparisonTable.map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.feature}</td>
                                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.product1}</td>
                                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.product2}</td>
                                        </tr>
                                    )) : 
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="3">No comparison data available</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Products Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Product */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-green-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">{productName}</h2>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {/* Value Rating */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Value Rating</h3>
                                {renderStars(analysis.productAnalysis?.valueRating)}
                            </div>
                            
                            {/* Pros */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Pros</h3>
                                <ul className="space-y-2">
                                    {Array.isArray(analysis.productAnalysis?.pros) ? 
                                        analysis.productAnalysis.pros.map((pro, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{pro}</span>
                                            </li>
                                        )) : 
                                        <li>No pros information available</li>
                                    }
                                </ul>
                            </div>
                            
                            {/* Cons */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Cons</h3>
                                <ul className="space-y-2">
                                    {Array.isArray(analysis.productAnalysis?.cons) ? 
                                        analysis.productAnalysis.cons.map((con, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span>{con}</span>
                                            </li>
                                        )) : 
                                        <li>No cons information available</li>
                                    }
                                </ul>
                            </div>
                            
                            {/* Ideal For */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Ideal For</h3>
                                <ul className="space-y-2">
                                    {Array.isArray(analysis.productAnalysis?.idealFor) ? 
                                        analysis.productAnalysis.idealFor.map((user, index) => (
                                            <li key={index} className="flex items-center">
                                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{user}</span>
                                            </li>
                                        )) : 
                                        <li>No ideal user information available</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Second Product */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">{compareProduct}</h2>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {/* Value Rating */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Value Rating</h3>
                                {renderStars(analysis.competitorAnalysis?.valueRating)}
                            </div>
                            
                            {/* Pros */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Pros</h3>
                                <ul className="space-y-2">
                                    {Array.isArray(analysis.competitorAnalysis?.pros) ? 
                                        analysis.competitorAnalysis.pros.map((pro, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{pro}</span>
                                            </li>
                                        )) : 
                                        <li>No pros information available</li>
                                    }
                                </ul>
                            </div>
                            
                            {/* Cons */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Cons</h3>
                                <ul className="space-y-2">
                                    {Array.isArray(analysis.competitorAnalysis?.cons) ? 
                                        analysis.competitorAnalysis.cons.map((con, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span>{con}</span>
                                            </li>
                                        )) : 
                                        <li>No cons information available</li>
                                    }
                                </ul>
                            </div>
                            
                            {/* Ideal For */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Ideal For</h3>
                                <ul className="space-y-2">
                                    {Array.isArray(analysis.competitorAnalysis?.idealFor) ? 
                                        analysis.competitorAnalysis.idealFor.map((user, index) => (
                                            <li key={index} className="flex items-center">
                                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{user}</span>
                                            </li>
                                        )) : 
                                        <li>No ideal user information available</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Final Verdict */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">Final Verdict</h2>
                    <p className="text-gray-700 leading-relaxed">{analysis.verdict}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header with breadcrumb */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex items-center text-lg text-gray-600">
                            <Link to="/" className="hover:text-green-600">Home</Link>
                            <span className="mx-2">›</span>
                            <Link to="/query-consumer" className="hover:text-green-600">Consumer Tools</Link>
                            <span className="mx-2">›</span>
                            <span className="font-medium text-green-600">Product Analysis</span>
                        </div>
                        
                        <Link to="/query-consumer" className="mt-3 sm:mt-0 text-green-600 hover:text-green-800 font-medium flex items-center">
                            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Tools
                        </Link>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Title section */}
                    <div className="mb-8">
                        {enableComparison ? (
                            <h1 className="text-3xl font-bold text-gray-900">
                                {productName} vs {compareProduct} Comparison
                            </h1>
                        ) : (
                            <h1 className="text-3xl font-bold text-gray-900">
                                {productName} Analysis
                            </h1>
                        )}
                        
                        <p className="mt-2 text-gray-600">
                            {enableComparison 
                                ? "Side-by-side comparison with detailed analysis based on real customer experiences" 
                                : "Comprehensive analysis based on real customer experiences and discussions"
                            }
                        </p>
                    </div>
                    
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <p className="mt-4 text-lg">Analyzing product data...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6">
                            <p className="font-medium text-lg">{error}</p>
                            <p className="mt-2">We couldn't retrieve the product analysis. Please try again or choose another product.</p>
                            <button 
                                onClick={() => navigate("/query-consumer")} 
                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    
                    {analysis && !loading && !error && (
                        enableComparison ? renderComparisonAnalysis() : renderSingleProductAnalysis()
                    )}
                    
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                        <button 
                            onClick={() => navigate("/query-consumer")} 
                            className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition shadow-md"
                        >
                            Analyze Another Product
                        </button>
                        
                        {!enableComparison && analysis && (
                            <button 
                                onClick={() => navigate("/query-consumer", { 
                                    state: { 
                                        initialProduct: productName, 
                                        enableComparison: true 
                                    } 
                                })} 
                                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-md"
                            >
                                Compare With Another Product
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConsumerResultsPage;