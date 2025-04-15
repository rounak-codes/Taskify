import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Signup Function
  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return updateProfile(userCredential.user, { displayName })
          .then(() => {
            // Create user document in Firestore
            return setDoc(doc(db, 'users', userCredential.user.uid), {
              email,
              displayName,
              createdAt: new Date().toISOString(),
            })
              .then(() => userCredential.user);
          });
      });
  }

  // Login Function
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout Function
  async function logout() {
    await signOut(auth);
  }

  // Password Reset Function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Google SignIn Function
  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // Update User Profile Function
  async function updateUserProfile(user, data) {
    if (data.displayName) {
      await updateProfile(user, { displayName: data.displayName });
    }
    
    // Update user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await setDoc(userRef, { ...userDoc.data(), ...data }, { merge: true });
    } else {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        ...data,
        createdAt: new Date().toISOString(),
      });
    }
    
    return user;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false); // Stop loading once the authentication state is set
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    googleSignIn,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children} {/* Display loading state if needed */}
    </AuthContext.Provider>
  );
}
