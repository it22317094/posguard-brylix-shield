
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { User, UserRole } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

// Create user profile in Firestore after authentication
const createUserProfile = async (uid: string, userData: { name: string, email: string, role: UserRole }): Promise<void> => {
  try {
    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error creating user profile:", error);
    throw new Error(`Failed to create user profile: ${error.message}`);
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole
      };
    }
    return null;
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Register a new user
export const registerUser = async (email: string, password: string, name: string, role: UserRole = 'cashier'): Promise<User | null> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user profile in Firestore
    await createUserProfile(user.uid, { name, email, role });
    
    toast({
      title: "Registration successful",
      description: "Please verify your email to complete the process",
    });
    
    return { name, email, role };
  } catch (error: any) {
    console.error("Registration error:", error);
    toast({
      title: "Registration failed",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<boolean> => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast({
      title: "Password reset email sent",
      description: "Check your email to reset your password",
    });
    return true;
  } catch (error: any) {
    console.error("Password reset error:", error);
    toast({
      title: "Password reset failed",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Get user profile from Firestore
    const userProfile = await getUserProfile(user.uid);
    
    if (userProfile) {
      toast({
        title: "Login successful",
        description: `Welcome back, ${userProfile.name}`,
      });
      return userProfile;
    }
    
    return null;
  } catch (error: any) {
    console.error("Login error:", error);
    toast({
      title: "Login failed",
      description: error.message,
      variant: "destructive"
    });
    return null;
  }
};

// Sign out current user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    toast({
      title: "Logout failed",
      description: error.message,
      variant: "destructive"
    });
  }
};

// Change user password
export const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("User not authenticated");
    }
    
    // Re-authenticate the user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update the password
    await updatePassword(user, newPassword);
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });
    
    return true;
  } catch (error: any) {
    console.error("Password change error:", error);
    toast({
      title: "Password change failed",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
};
