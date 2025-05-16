
import { User } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { logUserActivity } from '@/utils/auth-utils';
import { removeUserFromStorage } from './local-storage';

/**
 * Handle user logout
 */
export const logout = (user: User | null): void => {
  if (user) {
    logUserActivity(user.email, 'logout', `${user.name} logged out`);
  }
  
  removeUserFromStorage();
  
  toast({
    title: "Logged out",
    description: "You have been logged out successfully.",
  });
};
