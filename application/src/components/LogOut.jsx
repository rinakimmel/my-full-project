import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';
import { useAuth } from './AuthContext';
function LogOut() {
    const navigate = useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { userId } = useParams();
    const { logout } = useAuth();
    const handleLogout = () => {
        try {
            logout();
            setShowSuccessMessage(true);
        } catch (error) {
            console.error('Error during logout:', error);
            setShowSuccessMessage(true);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (showSuccessMessage) {
        return (
            <Notification 
                message="יצאת מהמערכת בהצלחה!"
                type="success"
                onClose={() => navigate('/login', { replace: true })}
            />
        );
    }

    return (
        <ConfirmDialog 
            message="האם ברצונך להתנתק?"
            onConfirm={handleLogout}
            onCancel={handleCancel}
        />
    );
}
           
export default LogOut;