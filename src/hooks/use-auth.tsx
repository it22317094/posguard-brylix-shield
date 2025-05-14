
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// This is a wrapper hook that can be extended with additional functionality
export const useAuth = () => {
  return useAuthContext();
};
