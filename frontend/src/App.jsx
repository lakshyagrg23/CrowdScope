import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import QueryPage from "./pages/QueryPage";
import ResultsPage from "./pages/ResultsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/query" element={<QueryPage />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </Router>
    );
}

export default App;



// import React, { useState } from "react";
// import axios from "axios";

// const App = () => {
//     const [industry, setIndustry] = useState("travel");
//     const [query, setQuery] = useState("");
//     const [insights, setInsights] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const industries = ["travel", "education", "video games", "electronics"];

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         setInsights(null);

//         try {
//             const response = await axios.post("http://localhost:5000/analyze", { industry, query });
//             setInsights(response.data.insights);
//         } catch (err) {
//             setError("Failed to fetch insights. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
//             <h1 className="text-2xl font-bold mb-4">Market Insights Platform</h1>
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//                 <label className="block mb-2 font-medium">Select Industry:</label>
//                 <select 
//                     className="w-full p-2 border rounded mb-4" 
//                     value={industry} 
//                     onChange={(e) => setIndustry(e.target.value)}
//                 >
//                     {industries.map((ind) => (
//                         <option key={ind} value={ind}>{ind}</option>
//                     ))}
//                 </select>

//                 <label className="block mb-2 font-medium">Enter Query:</label>
//                 <input 
//                     type="text" 
//                     className="w-full p-2 border rounded mb-4" 
//                     placeholder="Product, service, or destination"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     required
//                 />

//                 <button 
//                     type="submit" 
//                     className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
//                     disabled={loading}
//                 >
//                     {loading ? "Analyzing..." : "Get Insights"}
//                 </button>
//             </form>

//             {error && <p className="text-red-500 mt-4">{error}</p>}

//             {insights && (
//                 <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
//                     <h2 className="text-xl font-semibold mb-2">Insights</h2>
//                     <div className="border-t pt-4">
//                         <h3 className="font-medium">Overview:</h3>
//                         <p>{insights.overview}</p>
//                     </div>
//                     <div className="border-t pt-4">
//                         <h3 className="font-medium">Positives:</h3>
//                         <p>{insights.positives}</p>
//                     </div>
//                     <div className="border-t pt-4">
//                         <h3 className="font-medium">Shortcomings:</h3>
//                         <p>{insights.shortcomings}</p>
//                     </div>
//                     <div className="border-t pt-4">
//                         <h3 className="font-medium">Advice & Suggestions:</h3>
//                         <p>{insights.suggestions}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default App;