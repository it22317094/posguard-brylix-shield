
import { AuthContext } from './auth-context';
import { AuthProvider } from './AuthProvider';
import { useAuth } from '@/hooks/use-auth';

// Re-export for backward compatibility
export { AuthContext, AuthProvider, useAuth };
export type { User, UserRole } from '@/types/auth';
