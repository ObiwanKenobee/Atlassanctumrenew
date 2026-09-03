import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut 
} from 'firebase/auth';
import { auth, googleProvider, db as typedDb, UserProfileDoc } from '../lib/db';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfileDoc | null;
  loading: boolean;
  isSigningIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePlatformSettings: (settings: Partial<Pick<UserProfileDoc, 'themePreference' | 'accessLevel' | 'reducedMotion' | 'telemetryStreamActive' | 'ethicalReviewNotification' | 'sabbathModeActive' | 'highContrast'>>) => Promise<void>;
  error: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  isSigningIn: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updatePlatformSettings: async () => {},
  error: null,
  clearAuthError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSigningInRef = useRef(false);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        try {
          const userDocRef = doc(typedDb.instance, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          if (!userSnap.exists()) {
            const initialDoc: UserProfileDoc = {
              uid: user.uid,
              displayName: user.displayName || 'Atlas Researcher',
              email: user.email,
              photoURL: user.photoURL,
              role: 'Citizen Scientist & System Designer',
              accessLevel: 'researcher',
              themePreference: 'dark',
              reducedMotion: false,
              telemetryStreamActive: true,
              ethicalReviewNotification: true,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            };
            await setDoc(userDocRef, initialDoc);
            setUserProfile(initialDoc);
          } else {
            await setDoc(userDocRef, {
              lastLoginAt: serverTimestamp(),
            }, { merge: true });
            setUserProfile(userSnap.data() as UserProfileDoc);
          }

          // Real-time listener for user profile settings
          profileUnsubscribe = typedDb.userProfile.subscribeProfile(user.uid, (profile) => {
            if (profile) {
              setUserProfile(profile);
            }
          });
        } catch (err) {
          console.warn('Could not sync user profile to Firestore:', err);
        }
      } else {
        setUserProfile(null);
        if (profileUnsubscribe) {
          profileUnsubscribe();
          profileUnsubscribe = null;
        }
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  const updatePlatformSettings = async (
    settings: Partial<Pick<UserProfileDoc, 'themePreference' | 'accessLevel' | 'reducedMotion' | 'telemetryStreamActive' | 'ethicalReviewNotification'>>
  ) => {
    if (!currentUser) return;
    try {
      await typedDb.userProfile.updateSettings(currentUser.uid, settings);
      setUserProfile((prev) => (prev ? { ...prev, ...settings } : null));
    } catch (err: any) {
      console.error('Failed to update platform settings:', err);
      throw err;
    }
  };

  const clearAuthError = () => {
    setError(null);
  };

  const signInWithGoogle = async () => {
    // In-flight mutex guard to prevent duplicate concurrent popups
    if (isSigningInRef.current) {
      console.warn('[AuthContext] Sign-in already in progress, ignoring duplicate request');
      return;
    }

    isSigningInRef.current = true;
    setIsSigningIn(true);
    setError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || String(err || '');

      // Handle benign / expected popup flow cancellations
      if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
        console.info('[AuthContext] Sign-in popup closed by user');
      } else if (code === 'auth/cancelled-popup-request' || msg.includes('cancelled-popup-request')) {
        console.info('[AuthContext] Concurrent sign-in popup request cancelled');
      } else if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
        console.warn('[AuthContext] Sign-in popup blocked by browser');
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site and retry.');
      } else if (msg.includes('INTERNAL ASSERTION FAILED')) {
        console.warn('[AuthContext] Suppressed internal Firebase Auth assertion:', msg);
      } else {
        console.error('Sign-in error:', err);
        setError(msg || 'Failed to sign in with Google');
      }
    } finally {
      isSigningInRef.current = false;
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userProfile, 
      loading, 
      isSigningIn, 
      signInWithGoogle, 
      signOut, 
      updatePlatformSettings, 
      error,
      clearAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

