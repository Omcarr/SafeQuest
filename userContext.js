import {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Context
const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [userData, setUserData] = useState(null);

  // Load userData from AsyncStorage on initial render
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('userData');
        if (savedUser) {
          setUserData(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to load userData:', error);
      }
    };

    loadUserData();
  }, []);

  // Save userData to AsyncStorage whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        if (userData) {
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } else {
          await AsyncStorage.removeItem('userData');
        }
      } catch (error) {
        console.error('Failed to save userData:', error);
      }
    };

    saveUserData();
  }, [userData]);

  return (
    <UserContext.Provider value={{userData, setUserData}}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook for easy access
export const useUser = () => useContext(UserContext);
