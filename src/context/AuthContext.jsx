import { createContext, /*useContext*/ useEffect, useState } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { auth } from '../utils/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// **Define PropTypes for children**
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

//export function useAuth() {
  //return useContext(AuthContext);
//}