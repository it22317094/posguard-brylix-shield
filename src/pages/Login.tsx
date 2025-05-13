
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await sendOTP(email);
      if (success) {
        navigate("/verify", { state: { email } });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="bg-posguard-primary p-4 rounded-full mb-4">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center">POSGuard</h1>
          <p className="text-gray-500 text-center mt-2">Brylix POS Security Companion</p>
        </div>

        <Card className="animate-fade-in animation-delay-100 shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email address to receive a verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex items-center border rounded-md overflow-hidden bg-white">
                  <div className="pl-3 pr-1">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              onClick={handleSubmit} 
              disabled={!email || isSubmitting} 
              className="w-full bg-posguard-primary hover:bg-posguard-secondary"
            >
              {isSubmitting ? "Sending..." : "Send Verification Code"}
            </Button>
            
            <div className="text-xs text-center mt-4 text-gray-500">
              For demo: admin@posguard.com, cashier@posguard.com, kitchen@posguard.com<br/>
              OTP: 123456
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
