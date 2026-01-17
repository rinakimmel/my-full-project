import { createContext, useState, useContext, useCallback } from 'react';
import Notification from './Notification'; // הקומפוננטה הקיימת שלך

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    // פונקציה שתהיה זמינה לכל האפליקציה
    const showNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {/* כאן ההודעה חיה, מעל כל האפליקציה */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};