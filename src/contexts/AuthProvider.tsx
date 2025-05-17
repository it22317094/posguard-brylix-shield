import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { AuthContext } from './auth-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { getUserProfile, signOutUser } from '@/services/auth/firebase-service';
import { toast } from "@/hooks/use-toast";

// Inactivity timeout in milliseconds (1 minute)
const INACTIVITY_TIMEOUT = 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [inactivityTimer, setInactivityTimer] = useState<number | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        setCurrentUser(userProfile);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
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

  // Firebase login methods
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await import('@/services/auth/firebase-service').then(module => 
        module.signInWithEmail(email, password)
      );
      setIsLoading(false);
      return !!result;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const handleLogout = () => {
    signOutUser().then(() => {
      setCurrentUser(null);
      
      // Clear inactivity timer on logout
      if (inactivityTimer) {
        window.clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
    });
  };

  // Auth context value with Firebase methods
  const value: AuthContextType = {
    currentUser,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!currentUser,
    // Keep these for backward compatibility but implement them with Firebase
    sendOTP: async (email: string) => {
      // For backward compatibility, we'll use this to trigger password reset
      const result = await import('@/services/auth/firebase-service').then(module => 
        module.sendPasswordReset(email)
      );
      return result;
    },
    verifyOTP: async (email: string, otp: string) => {
      // This is a placeholder - in Firebase we would use signInWithEmailAndPassword instead
      console.warn("verifyOTP is deprecated with Firebase implementation");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
