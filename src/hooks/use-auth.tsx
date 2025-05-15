
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';

// This is a wrapper hook that can be extended with additional functionality
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
