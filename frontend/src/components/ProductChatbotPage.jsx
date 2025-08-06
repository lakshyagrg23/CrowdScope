import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductChatbotPage = () => {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    
    // Chat state
    const [messages, setMessages] = useState([
        {
            type: "bot",
            content: "Hi there! I'm your personal shopping assistant. I'll help you find the perfect product based on your needs.",
            options: ["Let's get started!"]
        }
    ]);
    
    // User input
    const [userInput, setUserInput] = useState("");
    const [inputDisabled, setInputDisabled] = useState(false);
    
    // Collected data
    const [category, setCategory] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [preferences, setPreferences] = useState([]);
    const [needsDescription, setNeedsDescription] = useState("");
    
    // Chat flow stage
    const [stage, setStage] = useState("intro");
    
    // Predefined product categories from ConsumerPage
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

    // Price range options
    const priceRangeOptions = [
        { label: "Budget (Under $100)", value: "budget" },
        { label: "Mid-range ($100-$300)", value: "mid-range" },
        { label: "Premium ($300-$700)", value: "premium" },
        { label: "Luxury (Over $700)", value: "luxury" }
    ];

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Handle option selection or text input
    const handleSendMessage = (selectedOption = null) => {
        let message = selectedOption || userInput;
        if (!message.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { type: "user", content: message }]);
        
        // Clear input field and disable while processing
        setUserInput("");
        setInputDisabled(true);
        
        // Process the message based on current stage
        setTimeout(() => {
            processUserResponse(message);
        }, 500);
    };

    // Process user's response and move to the next stage
    const processUserResponse = (message) => {
        switch(stage) {
            case "intro":
                // Ask about product category after intro
                setStage("category");
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: "What type of product are you looking for today?",
                        options: productCategories
                    }
                ]);
                break;
                
            case "category":
                // Save category and ask about budget
                setCategory(message);
                setStage("budget");
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: `Great! Let's find you a ${message}. What's your budget range?`,
                        options: priceRangeOptions.map(option => option.label)
                    }
                ]);
                break;
                
            case "budget":
                // Save budget and ask about specific needs
                const selectedRange = priceRangeOptions.find(range => range.label === message);
                setPriceRange(selectedRange ? selectedRange.value : message);
                setStage("needs");
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: "Could you tell me more about your specific needs or preferences? For example, what features are most important to you?"
                    }
                ]);
                break;
                
            case "needs":
                // Save needs description and ask about most important factor
                setNeedsDescription(message);
                setStage("priorities");
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: "What's the most important factor for you when choosing a product?",
                        options: ["Performance", "Price", "Durability", "Design", "Brand reputation"]
                    }
                ]);
                break;
                
            case "priorities":
                // Save priority and ask about usage
                setPreferences(prev => [...prev, { factor: "priority", value: message }]);
                setStage("usage");
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: "How do you plan to use this product most often?",
                    }
                ]);
                break;
                
            case "usage":
                // Save usage information and ask about dealbreakers
                setPreferences(prev => [...prev, { factor: "usage", value: message }]);
                setStage("dealbreakers");
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: "Are there any specific features that would be dealbreakers for you?"
                    }
                ]);
                break;
                
            case "dealbreakers":
                // Save dealbreakers and confirm
                setPreferences(prev => [...prev, { factor: "dealbreakers", value: message }]);
                setStage("confirmation");
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: `Thanks for all the information! I'm going to search for the perfect ${category} for you based on what you've told me. Is there anything else you want to add before I start?`,
                        options: ["No, find recommendations", "Yes, I have more to add"]
                    }
                ]);
                break;
                
            case "confirmation":
                if (message === "No, find recommendations") {
                    // Get recommendations
                    setStage("searching");
                    setMessages(prev => [
                        ...prev, 
                        {
                            type: "bot",
                            content: "Searching for the best recommendations based on your preferences..."
                        }
                    ]);
                    fetchRecommendations();
                } else {
                    // Let the user add more information
                    setStage("additional");
                    setMessages(prev => [
                        ...prev, 
                        {
                            type: "bot",
                            content: "Please share any additional information that might help me find the perfect product for you."
                        }
                    ]);
                }
                break;
                
            case "additional":
                // Add information to needs description and search
                setNeedsDescription(prev => prev + " " + message);
                setStage("searching");
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: "Thanks for the additional info! Searching for the best recommendations now..."
                    }
                ]);
                fetchRecommendations();
                break;
                
            default:
                // Generic response for any other stage
                setMessages(prev => [
                    ...prev, 
                    {
                        type: "bot",
                        content: "I'm not sure how to respond to that. Let's continue with our product search."
                    }
                ]);
        }
        
        setInputDisabled(false);
    };

    // Fetch product recommendations
    const fetchRecommendations = async () => {
        try {
            // Combine collected information into enriched needs description
            const enrichedDescription = `${needsDescription} 
                Most important factor: ${preferences.find(p => p.factor === "priority")?.value || "Not specified"}. 
                Usage: ${preferences.find(p => p.factor === "usage")?.value || "Not specified"}. 
                Dealbreakers: ${preferences.find(p => p.factor === "dealbreakers")?.value || "None"}`;
            
            const response = await axios.post("http://localhost:5000/recommend-products", { 
                needsDescription: enrichedDescription,
                category,
                priceRange
            });
            
            // Show recommendations
            setStage("recommendations");
            setMessages(prev => [
                ...prev, 
                {
                    type: "bot",
                    content: "Based on your preferences, here are my top 5 recommendations:",
                    recommendations: response.data.recommendations.recommendedProducts
                },
                {
                    type: "bot",
                    content: response.data.recommendations.recommendationSummary
                },
                {
                    type: "bot",
                    content: "Would you like me to help you with something else?",
                    options: ["Start over", "Go back to Consumer Tools", "No, thanks"]
                }
            ]);
            
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setMessages(prev => [
                ...prev, 
                {
                    type: "bot",
                    content: "I'm sorry, I encountered an error while searching for recommendations. Would you like to try again?",
                    options: ["Yes, try again", "No, go back"]
                }
            ]);
            setStage("error");
        }
        
        setInputDisabled(false);
    };

    // Handle error recovery
    const handleErrorResponse = (option) => {
        if (option === "Yes, try again") {
            fetchRecommendations();
        } else {
            navigate("/consumer");
        }
    };

    // Handle final response
    const handleFinalResponse = (option) => {
        if (option === "Start over") {
            // Reset and start over
            setCategory("");
            setPriceRange("");
            setPreferences([]);
            setNeedsDescription("");
            setStage("intro");
            setMessages([
                {
                    type: "bot",
                    content: "Hi there! I'm your personal shopping assistant. I'll help you find the perfect product based on your needs.",
                    options: ["Let's get started!"]
                }
            ]);
        } else if (option === "Go back to Consumer Tools") {
            navigate("/consumer");
        } else {
            // Thank the user and end
            setMessages(prev => [
                ...prev, 
                {
                    type: "bot",
                    content: "Thank you for using our product recommendation service! Have a great day."
                }
            ]);
            setStage("end");
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
                                <Link to="/" className="flex items-center">
                                    <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                    <span className="ml-2 text-xl font-bold text-gray-900">Market Insights</span>
                                </Link>
                            </div>
                        </div>
                        <nav className="hidden md:flex space-x-6">
                            <Link to="/" className="text-gray-600 hover:text-green-600 px-3 py-2 font-medium">
                                Home
                            </Link>
                            <Link to="/consumer" className="text-green-600 hover:text-green-700 px-3 py-2 font-medium border-b-2 border-green-600">
                                Consumer Tools
                            </Link>
                            <Link to="/query" className="text-gray-600 hover:text-green-600 px-3 py-2 font-medium">
                                Business Tools
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col">
                <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col">
                    <div className="flex-grow flex flex-col">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex-grow flex flex-col">
                            {/* Chat Header */}
                            <div className="bg-green-600 text-white px-6 py-4">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Product Recommendation Assistant
                                </h2>
                            </div>
                            
                            {/* Messages Container */}
                            <div className="flex-grow p-4 overflow-y-auto" style={{maxHeight: "60vh"}}>
                                <div className="space-y-4">
                                    {messages.map((message, index) => (
                                        <div key={index}>
                                            {/* Message Bubble */}
                                            <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                                                {/* Bot Avatar for bot messages */}
                                                {message.type === "bot" && (
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white mr-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 01-.659 1.591L9.5 14.5M15 3.185a24.341 24.341 0 01-4.5 0M5 14.5l6.67 6.672a2.25 2.25 0 001.591.659h.518a2.25 2.25 0 001.591-.659L21 14.5M5 14.5h14" />
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                {/* Message Content */}
                                                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                                    message.type === "user" 
                                                    ? "bg-green-600 text-white" 
                                                    : "bg-gray-100 text-gray-800"
                                                }`}>
                                                    <p>{message.content}</p>
                                                    
                                                    {/* Product Recommendations Display */}
                                                    {message.recommendations && (
                                                        <div className="mt-4 space-y-4">
                                                            {message.recommendations.map((product, idx) => (
                                                                <div key={idx} className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                                                                    <div className="flex justify-between">
                                                                        <h4 className="font-semibold text-green-800">{product.name}</h4>
                                                                        <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{product.estimatedPrice}</span>
                                                                    </div>
                                                                    <p className="text-sm mt-1 text-gray-700">{product.whyRecommended}</p>
                                                                    <div className="mt-2">
                                                                        <span className="text-sm text-gray-500">Best for: </span>
                                                                        <span className="text-sm font-medium">{product.bestFor}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* User Avatar for user messages */}
                                                {message.type === "user" && (
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white ml-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Options Buttons */}
                                            {message.options && (
                                                <div className="ml-10 mt-2 flex flex-wrap gap-2">
                                                    {message.options.map((option, optIndex) => (
                                                        <button
                                                            key={optIndex}
                                                            onClick={() => {
                                                                if (stage === "error") {
                                                                    handleErrorResponse(option);
                                                                } else if (stage === "recommendations") {
                                                                    handleFinalResponse(option);
                                                                } else {
                                                                    handleSendMessage(option);
                                                                }
                                                            }}
                                                            className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                            
                            {/* Input Area */}
                            {stage !== "end" && stage !== "searching" && (
                                <div className="border-t border-gray-200 p-4">
                                    <div className="flex">
                                        <input
                                            type="text"
                                            className="flex-grow rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 p-2"
                                            placeholder="Type your message..."
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && !inputDisabled && handleSendMessage()}
                                            disabled={inputDisabled || messages[messages.length - 1]?.options}
                                        />
                                        <button
                                            className="bg-green-600 text-white rounded-r-lg px-4 py-2 font-medium hover:bg-green-700 transition disabled:bg-gray-400"
                                            onClick={() => handleSendMessage()}
                                            disabled={inputDisabled || !userInput.trim() || messages[messages.length - 1]?.options}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {messages[messages.length - 1]?.options 
                                            ? "Click on one of the options above or type your own response" 
                                            : "Press Enter to send your message"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => navigate("/consumer")}
                            className="text-green-600 hover:text-green-800 font-medium flex items-center"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Consumer Tools
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductChatbotPage;