
import { User } from "@/types/auth";

/**
 * Check if user is saved in localStorage
 */
export const getStoredUser = (): User | null => {
  const savedUser = localStorage.getItem('posguard_user');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error('Failed to parse user from localStorage');
      localStorage.removeItem('posguard_user');
      return null;
    }
  }
  return null;
};

/**
 * Save user to localStorage
 */
export const saveUserToStorage = (user: User): void => {
  localStorage.setItem('posguard_user', JSON.stringify(user));
};

/**
 * Remove user from localStorage
 */
export const removeUserFromStorage = (): void => {
  localStorage.removeItem('posguard_user');
};
