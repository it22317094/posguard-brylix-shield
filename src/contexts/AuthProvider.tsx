
import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { AuthContext } from './auth-context';
import { 
  getStoredUser, 
  sendOTP as sendOTPService,
  verifyOTP as verifyOTPService,
  logout as logoutService
} from '@/services/auth';
import { toast } from "@/hooks/use-toast";

// Inactivity timeout in milliseconds (1 minute)
const INACTIVITY_TIMEOUT = 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [inactivityTimer, setInactivityTimer] = useState<number | null>(null);

  // Check if user is saved in localStorage on mount
  useEffect(() => {
    const savedUser = getStoredUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // Reset inactivity timer when there's user activity
  const resetInactivityTimer = useCallback(() => {
    if (currentUser) {
      setLastActivity(Date.now());
      
      // Clear existing timer if any
      if (inactivityTimer) {
        window.clearTimeout(inactivityTimer);
      }
      
      // Set new timer
      const timerId = window.setTimeout(() => {
        // Only logout if the user is still logged in and has been inactive
        if (currentUser && Date.now() - lastActivity >= INACTIVITY_TIMEOUT) {
          handleLogout();
          toast({
            title: "Auto-Logout",
            description: "You have been logged out due to inactivity",
          });
        }
      }, INACTIVITY_TIMEOUT);
      
      setInactivityTimer(Number(timerId));
    }
  }, [currentUser, inactivityTimer]);

  // Set up activity listeners - FIX: Added proper dependencies to prevent infinite loop
  useEffect(() => {
    if (currentUser) {
      // Define the events to track for activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      // Create activity handler
      const activityHandler = () => resetInactivityTimer();
      
      // Add event listeners
      events.forEach(event => {
        window.addEventListener(event, activityHandler, true);
      });
      
      // Initial timer setup
      resetInactivityTimer();
      
      // Clean up event listeners and timer on unmount
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, activityHandler, true);
        });
        
        if (inactivityTimer) {
          window.clearTimeout(inactivityTimer);
        }
      };
    }
  }, [currentUser, resetInactivityTimer]);

  // Send OTP function
  const handleSendOTP = async (email: string, password?: string): Promise<boolean> => {
    return sendOTPService(email, password);
  };

  // Verify OTP function
  const handleVerifyOTP = async (email: string, otp: string): Promise<boolean> => {
    const user = await verifyOTPService(email, otp);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // Logout function
  const handleLogout = () => {
    if (currentUser) {
      logoutService(currentUser);
    }
    setCurrentUser(null);
    
    // Clear inactivity timer on logout
    if (inactivityTimer) {
      window.clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
  };

  // Auth context value
  const value: AuthContextType = {
    currentUser,
    isLoading,
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    logout: handleLogout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
