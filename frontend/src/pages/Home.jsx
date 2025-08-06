import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
            {/* Navigation Bar - Keeping existing code */}
            <div className="container mx-auto px-4">
                <header className="flex flex-wrap items-center justify-between py-4 mb-4 border-b">
                    <div className="flex items-center mb-2 md:mb-0">
                        <a href="/" className="flex items-center text-decoration-none">
                        <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                            <span className="ml-2 text-xl font-bold text-gray-800">CrowdScope</span>
                        </a>
                    </div>

                    {/* <nav className="hidden md:flex items-center justify-center flex-1">
                        <ul className="flex space-x-6">
                            <li><a href="#" className="text-blue-600 font-medium hover:text-blue-800">Home</a></li>
                            <li><a href="#features" className="text-gray-600 hover:text-blue-600">Features</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">Pricing</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">FAQs</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
                        </ul>
                    </nav> */}

                    {/* <div className="mt-4 md:mt-0">
                        <button type="button" className="px-4 py-2 mr-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">Login</button>
                        <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Sign-up</button>
                    </div> */}
                </header>
            </div>

            {/* Hero Section - Updated */}
            <div className="py-16 px-4 text-center bg-gradient-to-r from-indigo-100 via-white to-purple-100">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">CrowdScope</h1>
                <div className="max-w-3xl mx-auto">
                    <p className="text-lg text-gray-700 mb-8">
                        AI-powered insights for both businesses and consumers. Make smarter business decisions and 
                        find products that perfectly match your needs.
                    </p>
                </div>
            </div>

            {/* NEW: User Path Selection */}
            <div className="max-w-6xl mx-auto px-4 py-2 pb-20">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Proceed as...</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Business Path */}
                    <div 
                        onClick={() => navigate("/query")}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all group"
                    >
                        <div className="bg-blue-600 text-white p-6">
                            <h3 className="text-2xl font-bold mb-2">Business / Service Provider</h3>
                            <p>Gain CrowdScope and analyze competition</p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">Market trend analysis based on customer discussions</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">In-depth competitor analysis and benchmarking</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">Product improvement recommendations</span>
                                </li>
                            </ul>
                            <div className="text-center">
                                <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg group-hover:bg-blue-700 transition">
                                    Get Business Insights
                                    <svg className="inline-block ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Consumer Path */}
                    <div 
                        onClick={() => navigate("/query-consumer")}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-green-500 cursor-pointer transition-all group"
                    >
                        <div className="bg-green-600 text-white p-6">
                            <h3 className="text-2xl font-bold mb-2">Consumer / Shopper</h3>
                            <p>Make smarter purchasing decisions</p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">Detailed product analysis with pros and cons</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">Side-by-side product comparisons</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">Personalized product recommendations</span>
                                </li>
                            </ul>
                            <div className="text-center">
                                <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg group-hover:bg-green-700 transition">
                                    Shop Smarter
                                    <svg className="inline-block ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section - Updated to showcase both user types */}
            <div id="features" className="container mx-auto px-4 py-16 bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900 pb-4 border-b mb-12 text-center">
                    Solutions For Everyone
                </h2>

 {/* Business Features */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
    <div>
        <img src="business.png" alt="Business Solutions" className="rounded-lg shadow-lg" />
    </div>
    <div className="flex flex-col space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
            For Businesses & Product Teams
        </h2>
        <p className="text-gray-600 text-lg">
            Gain valuable insights to improve your products and services. Understand market trends, analyze competitors, and identify growth opportunities.
        </p>

        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start mb-2">
                    <div className="bg-green-100 text-green-600 rounded-full p-1 mr-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Market Trend Analysis</h4>
                        <p className="text-sm text-gray-600">Analyze customer conversations to identify evolving market trends and preferences.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start mb-2">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Competitor Benchmarking</h4>
                        <p className="text-sm text-gray-600">Get insights into competitor strategies, performance, and areas for differentiation.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start mb-2">
                    <div className="bg-yellow-100 text-yellow-600 rounded-full p-1 mr-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">Product Improvement</h4>
                        <p className="text-sm text-gray-600">Leverage feedback and analysis to improve product features and customer satisfaction.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* <div>
            <button 
                onClick={() => navigate("/business")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition mt-2">
                Explore Business Tools
            </button>
        </div> */}
    </div>
</div>

                {/* Consumer Features - Updated with more detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="order-2 md:order-1 flex flex-col space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            For Consumers & Shoppers
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Make smarter purchasing decisions with AI-powered product analysis. Find the perfect products based on your unique needs.
                        </p>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-start mb-2">
                                <div className="bg-green-100 text-green-600 rounded-full p-1 mr-2">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Product Analysis</h4>
                                    <p className="text-sm text-gray-600">Get detailed insights about specific products, including pros, cons, and value assessment.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-start mb-2">
                                <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Product Recommendations</h4>
                                    <p className="text-sm text-gray-600">Tell us your needs and we'll recommend the perfect products that match your requirements.</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* <div>
                            <button 
                                onClick={() => navigate("/consumer")}
                                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition mt-2">
                                Explore Consumer Tools
                            </button>
                        </div> */}
                    </div>
                    <div className="order-1 md:order-2">
                        <img src="/consumer.png" alt="Consumer Solutions" className="rounded-lg shadow-lg" />
                    </div>
                </div>

                {/* Feature Grid - Keep existing feature cards but reorganize for business/consumer clarity */}
                <h2 className="text-3xl font-bold text-gray-900 pb-4 border-b mb-12 text-center">
                    Powerful AI-Driven Features
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <h3 className="text-xl font-bold text-blue-700 mb-6 text-center">Business Features</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[ {
                                    icon: "🔍",
                                    title: "Sentiment Tracking",
                                    description: "Understand how people feel about products and companies."
                                },
                                {
                                    icon: "📊",
                                    title: "Competitor Analysis",
                                    description: "Analyze competitors' strengths and weaknesses."
                                    
                                },
                               
                                {
                                    icon: "🤖",
                                    title: "AI Recommendations",
                                    description: "Get personalized insights based on data analysis."
                                },
                                {
                                    icon: "👥",
                                    title: "Audience Insights",
                                    description: "Understand who is talking about your products."
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                                    <div className="text-3xl mb-3">{feature.icon}</div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-green-700 mb-6 text-center">Consumer Features</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: "📈",
                                    title: "Comparative Analysis",
                                    description: "Compare products and services side by side."
                                },
                                {
                                    icon: "💡",
                                    title: "Product Discovery",
                                    description: "Find products that match your specific requirements."
                                },
                                {
                                    icon: "⭐",
                                    title: "Value Assessment",
                                    description: "Determine if products are worth their price."
                                },
                                {
                                    icon: "📱",
                                    title: "Feature Analysis",
                                    description: "Deep dive into product features and capabilities."
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
                                    <div className="text-3xl mb-3">{feature.icon}</div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
{/* Updated CTA Section with dual paths */}
<div className="bg-blue-700 text-white py-16">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold mb-6">Ready to get data-driven insights?</h2>
    <p className="text-xl mb-8 max-w-2xl mx-auto">
      Whether you're a business looking to improve or a consumer making purchases, we've got you covered.
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={() => {
          navigate("/query");
          window.scrollTo(0, 0); // Scroll to the top
        }}
        className="px-8 py-3 bg-white text-blue-700 text-lg font-bold rounded-lg shadow-md hover:bg-gray-100 transition"
      >
        For Businesses
      </button>
      <button
        onClick={() => {
          navigate("/query-consumer");
          window.scrollTo(0, 0); // Scroll to the top
        }}
        className="px-8 py-3 bg-green-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-green-600 transition"
      >
        For Consumers
      </button>
    </div>
  </div>
</div>

{/* Footer */}
<footer className="bg-gray-800 text-gray-300 py-12">
  <div className="container mx-auto px-4">
    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
      <p>© {new Date().getFullYear()} CrowdScope. All rights reserved.</p>
    </div>
  </div>
</footer>
        </div>
    );
};

export default Home;