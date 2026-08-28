import React, { createContext, useContext, useEffect, useState } from 'react';
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
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePlatformSettings: (settings: Partial<Pick<UserProfileDoc, 'themePreference' | 'accessLevel' | 'reducedMotion' | 'telemetryStreamActive' | 'ethicalReviewNotification' | 'sabbathModeActive' | 'highContrast'>>) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updatePlatformSettings: async () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      throw err;
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
    <AuthContext.Provider value={{ currentUser, userProfile, loading, signInWithGoogle, signOut, updatePlatformSettings, error }}>
      {children}
    </AuthContext.Provider>
  );
};

