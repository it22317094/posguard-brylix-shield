
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, KeyRound } from "lucide-react";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const { verifyOTP, sendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await verifyOTP(email, otp);
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    await sendOTP(email);
    setTimeLeft(300);
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
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex items-center border rounded-md overflow-hidden bg-white">
                  <div className="pl-3 pr-1">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 6) {
                        setOtp(value);
                      }
                    }}
                    maxLength={6}
                    pattern="\d{6}"
                    required
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                
                <div className="text-center text-sm">
                  <p>
                    Code expires in: <span className={`font-medium ${timeLeft < 60 ? 'text-red-500' : ''}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              onClick={handleSubmit} 
              disabled={otp.length !== 6 || isSubmitting || timeLeft <= 0} 
              className="w-full bg-posguard-primary hover:bg-posguard-secondary"
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleResendOTP} 
              disabled={timeLeft > 240} 
              className="w-full"
            >
              Resend Code {timeLeft > 240 && `(${Math.floor((timeLeft - 240) / 60)}:${((timeLeft - 240) % 60).toString().padStart(2, '0')})`}
            </Button>
            
            <Button 
              variant="link" 
              onClick={() => navigate("/login")} 
              className="text-posguard-secondary"
            >
              Use a different email
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Verify;
