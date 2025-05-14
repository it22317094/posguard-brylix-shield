
// Define user roles
export type UserRole = 'admin' | 'cashier' | 'kitchen';

// Define the user type
export interface User {
  email: string;
  name: string;
  role: UserRole;
}

// Define the auth context type
export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  sendOTP: (email: string, password?: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// OTP data structure
export interface OTPData {
  email: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  verified: boolean;
}

// User activity log entry
export interface ActivityLogEntry {
  timestamp: string;
  email: string;
  action: string;
  details: string;
}
