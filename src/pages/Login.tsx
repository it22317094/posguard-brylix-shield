
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, Lock, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive"
      });
      return;
    }

    try {
      const resetResult = await import('@/services/auth/firebase-service').then(module => 
        module.sendPasswordReset(email)
      );
      if (resetResult) {
        toast({
          title: "Password reset email sent",
          description: "Please check your inbox for instructions"
        });
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Please enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs p-0 h-auto text-posguard-primary"
                    onClick={handleForgotPassword}
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              onClick={handleSubmit} 
              disabled={!email || !password || isSubmitting} 
              className="w-full bg-posguard-primary hover:bg-posguard-secondary"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto text-posguard-primary text-sm"
                onClick={() => navigate("/register")}
              >
                Create an account
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
