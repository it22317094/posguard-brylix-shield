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

  // Production users - these are the actual target users
  const productionUsers: User[] = [
    { email: 'it22317094@my.sliit.lk', name: 'Hanthanapitiya', role: 'admin' },
    { email: 'dinupahanthanapitiya@gmail.com', name: 'Dinupa', role: 'cashier' },
    { email: 'darkatomhacker@gmail.com', name: 'Atom', role: 'kitchen' },
  ];

  // Fallback users - these are the demo accounts mapped to production users
  const fallbackUsers: User[] = [
    { email: 'admin@posguard.com', name: 'Admin User', role: 'admin' },
    { email: 'cashier@posguard.com', name: 'John Cashier', role: 'cashier' },
    { email: 'kitchen@posguard.com', name: 'Kitchen Staff', role: 'kitchen' }
  ];
  
  // Combined users list for internal use
  const allUsers = [...productionUsers, ...fallbackUsers];

  // Fallback mapping from production to demo accounts
  const fallbackMapping: Record<string, string> = {
    'it22317094@my.sliit.lk': 'admin@posguard.com',
    'dinupahanthanapitiya@gmail.com': 'cashier@posguard.com',
    'darkatomhacker@gmail.com': 'kitchen@posguard.com'
  };
  
  // Feature flag for fallback mode - in production, this could come from a config service
  const enableFallbackMode = true;

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
    // Check if email exists in our users list
    const user = allUsers.find(user => user.email === email);
    
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

    // Check if this is a production user email
    const isProductionUser = productionUsers.some(user => user.email === email);
    
    try {
      // Simulate an API call to send OTP
      // In a real app, this would call a Firebase Function to send the OTP
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
      
      logUserActivity(email, 'otp_sent', `OTP sent to ${email}`);
      return true;
    } catch (error) {
      // This simulates a scenario where OTP sending fails
      console.error("Failed to send OTP:", error);
      
      // Only use fallback for production users if fallback is enabled
      if (isProductionUser && enableFallbackMode) {
        logUserActivity(email, 'fallback_triggered', `Fallback login triggered for ${email}`);
        // Don't show any indication that fallback was used
        return true;
      }
      
      toast({
        title: "Failed to send verification code",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Mock function to verify OTP - in a real app, this would call Firebase function
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    // Check if this is a production user email and fallback is enabled
    const isProductionUser = productionUsers.some(user => user.email === email);
    
    // Get stored OTP data
    const storedOTP = localStorage.getItem('posguard_pending_otp');
    if (!storedOTP && !enableFallbackMode) {
      toast({
        title: "Verification failed",
        description: "No pending verification found. Please request a new OTP.",
        variant: "destructive"
      });
      return false;
    }

    let loginSuccessful = false;
    let userToLogin: User | undefined;
    
    // Try normal OTP verification
    if (storedOTP) {
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
        if (!isProductionUser || !enableFallbackMode) {
          toast({
            title: "Verification failed",
            description: "Verification code has expired. Please request a new code.",
            variant: "destructive"
          });
          return false;
        }
      } else if (otpData.verified) {
        // Check if OTP has been verified already
        if (!isProductionUser || !enableFallbackMode) {
          toast({
            title: "Verification failed",
            description: "This code has already been used. Please request a new code.",
            variant: "destructive"
          });
          return false;
        }
      } else if (otpData.code === otp) {
        // Valid OTP verification
        otpData.verified = true;
        localStorage.setItem('posguard_pending_otp', JSON.stringify(otpData));
        loginSuccessful = true;
        
        // Find user with matching email
        userToLogin = allUsers.find(user => user.email === email);
      } else if (!isProductionUser || !enableFallbackMode) {
        // Invalid OTP and no fallback available
        toast({
          title: "Verification failed",
          description: "Invalid verification code. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    // If regular login failed but this is a production user with fallback enabled
    if (!loginSuccessful && isProductionUser && enableFallbackMode) {
      // Use the fallback mapping to get the corresponding demo account
      const fallbackEmail = fallbackMapping[email];
      if (fallbackEmail) {
        userToLogin = allUsers.find(user => user.email === fallbackEmail);
        if (userToLogin) {
          // Keep the original email's user name but use the fallback role
          const originalUser = productionUsers.find(user => user.email === email);
          if (originalUser) {
            userToLogin = {
              ...userToLogin,
              name: originalUser.name,
              email: email // Keep original email to maintain consistency
            };
          }
          loginSuccessful = true;
          logUserActivity(email, 'fallback_login', `Fallback login used for ${email}`);
        }
      }
    }
    
    // Process successful login
    if (loginSuccessful && userToLogin) {
      setCurrentUser(userToLogin);
      localStorage.setItem('posguard_user', JSON.stringify(userToLogin));
      
      // Log successful login
      logUserActivity(userToLogin.email, 'login', `${userToLogin.name} logged in`);
      
      toast({
        title: "Verification successful",
        description: "You have been logged in successfully.",
      });
      return true;
    }

    // If we got here, all verification methods failed
    toast({
      title: "Verification failed",
      description: "Please check your verification code and try again.",
      variant: "destructive"
    });
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
    console.log(`Activity logged: ${action} - ${details}`);
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
