import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            setError("");
            
            console.log("Google credential received", credentialResponse);
            
            const response = await axios.post(
                "http://localhost:5000/auth/google",
                { token: credentialResponse.credential },
                { withCredentials: true }
            );

            console.log("Google login successful:", response.data);
            navigate("/dashboard");
        } catch (err) {
            console.error("Google login failed:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        console.error("Google login error:", error);
        setError("Google authentication failed");
    };

    return (
        <div className="w-full flex flex-col items-center">
            {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
            )}
            
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                text="signin_with"
                shape="pill"
                disabled={loading}
            />
            
            {loading && (
                <div className="mt-2 text-sm text-gray-500">Authenticating...</div>
            )}
        </div>
    );
};

export default GoogleAuth;