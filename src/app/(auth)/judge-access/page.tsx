// app/judge-access/page.jsx
'use client';

import { useState, Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { BaseButton } from "@/components/ui/BaseButton";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail } from "lucide-react";

function JudgeAccessContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/judges/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send access link");
      }
      
      setSuccess("Access link sent! Please check your email inbox (and spam folder).");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Judge Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-neutral-600">
          Enter your email address below to receive a secure login link. This link will give you immediate access to the judging interface.
        </p>
        
        <form onSubmit={handleSendMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your judge email"
              required
            />
          </div>
          
          {success && (
            <div className="bg-success-50 text-success-700 p-3 rounded-md text-sm">
              {success}
            </div>
          )}
          
          {error && (
            <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-3">
          <BaseButton
            type="button"
            variant="outline"
            onClick={() => window.location.href = "/login"}
            className="flex-1"
          >
            Regular Login
          </BaseButton>
          <BaseButton
            type="submit"
            onClick={handleSendMagicLink}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send Login Link
              </>
            )}
          </BaseButton>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function JudgeAccessPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-neutral-50">
      <Suspense fallback={<div>Loading...</div>}>
        <JudgeAccessContent />
      </Suspense>
    </div>
  );
}