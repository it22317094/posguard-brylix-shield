
import React, { useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { AuthContext } from './auth-context';
import { 
  getStoredUser, 
  sendOTP as sendOTPService,
  verifyOTP as verifyOTPService,
  logout as logoutService
} from '@/services/auth-service';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is saved in localStorage on mount
  useEffect(() => {
    const savedUser = getStoredUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // Send OTP function
  const sendOTP = async (email: string, password?: string): Promise<boolean> => {
    return sendOTPService(email, password);
  };

  // Verify OTP function
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    const user = await verifyOTPService(email, otp);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    logoutService(currentUser);
    setCurrentUser(null);
  };

  // Auth context value
  const value: AuthContextType = {
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
