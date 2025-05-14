
import { User, UserRole, AuthContextType } from '@/types/auth';

// Re-export the types we need
export type { User, UserRole, AuthContextType };

// Define additional types specific to the auth context implementation
export interface OTPContextData {
  email: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  verified: boolean;
}
