import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const NotificationContext = createContext(null);

function Notification({ message, type = 'info', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            {message}
            <button onClick={onClose} style={{marginLeft: '1rem', padding: '0.25rem 0.5rem'}}>×</button>
        </div>
    );
}

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'info', onClose) => {
        setNotification({ message, type, onClose });
    }, []);

    const closeNotification = useCallback(() => {
        if (notification?.onClose) {
            notification.onClose();
        }
        setNotification(null);
    }, [notification]);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
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