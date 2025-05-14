
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define user roles
export type UserRole = 'admin' | 'cashier' | 'kitchen';

// Define the user type
export interface User {
  email: string;
  name: string;
  role: UserRole;
}

// Define the auth context type
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  sendOTP: (email: string, password?: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Mock users - in a real app, this would come from Firebase
  const mockUsers: User[] = [
    { email: 'it22317094@my.sliit.lk', name: 'Hanthanapitiya', role: 'admin' },
    { email: 'dinupahanthanapitiya@gmail.com', name: 'Dinupa', role: 'cashier' },
    { email: 'darkatomhacker@gmail.com', name: 'Atom', role: 'kitchen' },
    { email: 'admin@posguard.com', name: 'Admin User', role: 'admin' },
    { email: 'cashier@posguard.com', name: 'John Cashier', role: 'cashier' },
    { email: 'kitchen@posguard.com', name: 'Kitchen Staff', role: 'kitchen' }
  ];

  // Check if user is saved in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('posguard_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage');
        localStorage.removeItem('posguard_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock function to simulate password checking - in a real app, this would use Firebase Auth
  const verifyCredentials = (email: string, password?: string): boolean => {
    // Check if email exists in our mock users
    const user = mockUsers.find(user => user.email === email);
    
    if (!user) {
      toast({
        title: "User not found",
        description: "Please check your email address and try again.",
        variant: "destructive"
      });
      return false;
    }
    
    // For demo purposes, we'll accept any password or no password
    // In a real app, we would check the password against Firebase Auth
    if (password && password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  // Mock function to send OTP - in a real app, this would call Firebase function
  const sendOTP = async (email: string, password?: string): Promise<boolean> => {
    // First verify credentials
    if (!verifyCredentials(email, password)) {
      return false;
    }

    // Mock OTP sending - in a real app this would trigger a Firebase function
    console.log(`OTP sent to ${email}`);
    
    // Mock saving OTP to "Firebase"
    localStorage.setItem('posguard_pending_otp', JSON.stringify({
      email,
      code: '123456', // In a real app, this would be generated on the server
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes from now
      verified: false
    }));
    
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${email}`,
    });
    
    return true;
  };

  // Mock function to verify OTP - in a real app, this would call Firebase function
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    // Get stored OTP data
    const storedOTP = localStorage.getItem('posguard_pending_otp');
    if (!storedOTP) {
      toast({
        title: "Verification failed",
        description: "No pending verification found. Please request a new OTP.",
        variant: "destructive"
      });
      return false;
    }

    const otpData = JSON.parse(storedOTP);
    
    // Check if OTP is for the correct email
    if (otpData.email !== email) {
      toast({
        title: "Verification failed",
        description: "Email address doesn't match verification request.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(otpData.expiresAt);
    
    if (now > expiresAt) {
      toast({
        title: "Verification failed",
        description: "Verification code has expired. Please request a new code.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if OTP has been verified already
    if (otpData.verified) {
      toast({
        title: "Verification failed",
        description: "This code has already been used. Please request a new code.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if OTP matches
    if (otpData.code !== otp) {
      toast({
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
      return false;
    }
    
    // Mark OTP as verified
    otpData.verified = true;
    localStorage.setItem('posguard_pending_otp', JSON.stringify(otpData));
    
    // Find user with matching email
    const user = mockUsers.find(user => user.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('posguard_user', JSON.stringify(user));
      
      // Log successful login
      logUserActivity(user.email, 'login', `${user.name} logged in`);
      
      toast({
        title: "Verification successful",
        description: "You have been logged in successfully.",
      });
      return true;
    }

    return false;
  };

  // Mock function to log user activity - in a real app, this would save to Firebase
  const logUserActivity = (email: string, action: string, details: string) => {
    const activities = JSON.parse(localStorage.getItem('posguard_activities') || '[]');
    
    activities.push({
      timestamp: new Date().toISOString(),
      email,
      action,
      details
    });
    
    localStorage.setItem('posguard_activities', JSON.stringify(activities));
  };

  // Logout function
  const logout = () => {
    if (currentUser) {
      logUserActivity(currentUser.email, 'logout', `${currentUser.name} logged out`);
    }
    
    setCurrentUser(null);
    localStorage.removeItem('posguard_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const value = {
    currentUser,
    isLoading,
    sendOTP,
    verifyOTP,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
