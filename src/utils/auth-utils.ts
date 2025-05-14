
import { User, ActivityLogEntry, OTPData } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

// Mock users data
export const productionUsers: User[] = [
  { email: 'it22317094@my.sliit.lk', name: 'Hanthanapitiya', role: 'admin' },
  { email: 'dinupahanthanapitiya@gmail.com', name: 'Dinupa', role: 'cashier' },
  { email: 'darkatomhacker@gmail.com', name: 'Atom', role: 'kitchen' },
];

// Fallback users - demo accounts mapped to production users
export const fallbackUsers: User[] = [
  { email: 'admin@posguard.com', name: 'Admin User', role: 'admin' },
  { email: 'cashier@posguard.com', name: 'John Cashier', role: 'cashier' },
  { email: 'kitchen@posguard.com', name: 'Kitchen Staff', role: 'kitchen' }
];

// Combined users list for internal use
export const allUsers = [...productionUsers, ...fallbackUsers];

// Fallback mapping from production to demo accounts
export const fallbackMapping: Record<string, string> = {
  'it22317094@my.sliit.lk': 'admin@posguard.com',
  'dinupahanthanapitiya@gmail.com': 'cashier@posguard.com',
  'darkatomhacker@gmail.com': 'kitchen@posguard.com'
};

// Feature flag for fallback mode - in production, this could come from a config service
export const enableFallbackMode = true;

// Mock function to simulate password checking - in a real app, this would use Firebase Auth
export const verifyCredentials = (email: string, password?: string): boolean => {
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

// Mock function to log user activity - in a real app, this would save to Firebase
export const logUserActivity = (email: string, action: string, details: string): void => {
  const activities: ActivityLogEntry[] = JSON.parse(localStorage.getItem('posguard_activities') || '[]');
  
  activities.push({
    timestamp: new Date().toISOString(),
    email,
    action,
    details
  });
  
  localStorage.setItem('posguard_activities', JSON.stringify(activities));
  console.log(`Activity logged: ${action} - ${details}`);
};

// Generate and save OTP to localStorage
export const generateAndSaveOTP = (email: string): OTPData => {
  const otpData: OTPData = {
    email,
    code: '123456', // In a real app, this would be generated on the server
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes from now
    verified: false
  };
  
  localStorage.setItem('posguard_pending_otp', JSON.stringify(otpData));
  return otpData;
};

// Get stored OTP data
export const getStoredOTP = (): OTPData | null => {
  const storedOTP = localStorage.getItem('posguard_pending_otp');
  return storedOTP ? JSON.parse(storedOTP) : null;
};
