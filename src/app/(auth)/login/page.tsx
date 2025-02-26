"use client";

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold">Sign in to your account</h2>
        <p className="mt-2 text-gray-600">Access the contest judging system</p>
      </div>
      
      <LoginForm />
    </>
  );
}