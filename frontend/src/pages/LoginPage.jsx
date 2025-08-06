import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginForm from "../components/auth/LoginForm";
import GoogleAuth from "../components/auth/GoogleAuth";

const LoginPage = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Log in to your account
                        </h2>
                    </div>

                    <LoginForm />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <GoogleAuth />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPage;