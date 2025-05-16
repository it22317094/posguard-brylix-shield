import { OTPData } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { logUserActivity, generateAndSaveOTP, getStoredOTP } from '@/utils/auth-utils';

/**
 * Send OTP to user email
 */
export const sendOTP = async (email: string, password?: string): Promise<boolean> => {
  // Imported from auth-utils, moving the function call to maintain the same behavior
  // while keeping the code organized
  const verifyCredentials = (email: string, password?: string): boolean => {
    // This function is imported from auth-utils.ts
    // Keeping the import reference to maintain the same behavior
    const { verifyCredentials } = require('@/utils/auth-utils');
    return verifyCredentials(email, password);
  };
  
  // Verify credentials
  if (!verifyCredentials(email, password)) {
    return false;
  }

  // Check if this is a production user email
  // Importing directly to maintain the same behavior
  const { productionUsers, enableFallbackMode } = require('@/utils/auth-utils');
  const isProductionUser = productionUsers.some((user) => user.email === email);
  
  try {
    // Simulate an API call to send OTP
    console.log(`OTP sent to ${email}`);
    
    // Generate and save OTP
    generateAndSaveOTP(email);
    
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

/**
 * Verify OTP entered by user
 */
export const verifyOTP = async (email: string, otp: string): Promise<import('@/types/auth').User | null> => {
  // Import required utilities and constants
  const { productionUsers, fallbackUsers, allUsers, fallbackMapping, enableFallbackMode } = require('@/utils/auth-utils');

  // Check if this is a production user email and fallback is enabled
  const isProductionUser = productionUsers.some(user => user.email === email);
  
  // Get stored OTP data
  const otpData = getStoredOTP();
  if (!otpData && !enableFallbackMode) {
    toast({
      title: "Verification failed",
      description: "No pending verification found. Please request a new OTP.",
      variant: "destructive"
    });
    return null;
  }

  let loginSuccessful = false;
  let userToLogin = undefined;
  
  // Try normal OTP verification
  if (otpData) {
    // Check if OTP is for the correct email
    if (otpData.email !== email) {
      toast({
        title: "Verification failed",
        description: "Email address doesn't match verification request.",
        variant: "destructive"
      });
      return null;
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
        return null;
      }
    } else if (otpData.verified) {
      // Check if OTP has been verified already
      if (!isProductionUser || !enableFallbackMode) {
        toast({
          title: "Verification failed",
          description: "This code has already been used. Please request a new code.",
          variant: "destructive"
        });
        return null;
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
      return null;
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
    // Import and use local storage service
    const { saveUserToStorage } = require('./local-storage');
    
    // Log successful login
    logUserActivity(userToLogin.email, 'login', `${userToLogin.name} logged in`);
    
    toast({
      title: "Verification successful",
      description: "You have been logged in successfully.",
    });
    
    // Save user to localStorage
    saveUserToStorage(userToLogin);
    
    return userToLogin;
  }

  // If we got here, all verification methods failed
  toast({
    title: "Verification failed",
    description: "Please check your verification code and try again.",
    variant: "destructive"
  });
  return null;
};
