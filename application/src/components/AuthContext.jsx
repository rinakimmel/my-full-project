import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'user';

export const AuthProvider = ({ children }) => {
    // שינוי 1: קריאה מה-Storage ישירות באתחול
    // זה מבטיח שהמשתמש קיים בזיכרון כבר מהרגע הראשון
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Error parsing user from local storage:', error);
            return null;
        }
    });

    // אין צורך ב-isLoading בשביל המצב ההתחלתי, כי אנחנו טוענים מיד
    // (אפשר להשאיר אם את משתמשת בזה לדברים אחרים, אבל לרוב לא צריך כאן)

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
        logout
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