
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import { AuthProvider } from './AuthProvider';
import type { User, UserRole } from '@/types/auth';

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider };
export type { User, UserRole };
