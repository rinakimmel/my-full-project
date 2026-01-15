import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('Error loading user from localStorage:', error);
            localStorage.removeItem(USER_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (userData) => {
        try {
            setUser(userData);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user to localStorage:', error);
        }
    };

    const logout = () => {
        try {
            setUser(null);
            localStorage.removeItem(USER_STORAGE_KEY);
        } catch (error) {
            console.error('Error removing user from localStorage:', error);
        }
    };

    const value = {
        user,
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};