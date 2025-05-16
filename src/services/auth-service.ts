
/**
 * Main auth service facade that exposes the auth functionality to the application
 * This file serves as the API gateway to the auth services
 */

// Re-export all auth services from their respective modules
export { getStoredUser } from './auth/local-storage';
export { sendOTP, verifyOTP } from './auth/otp-service';
export { logout } from './auth/user-service';
