import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';

function LogOut() {
    const navigate = useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { userId } = useParams();
    const handleLogout = () => {
        localStorage.removeItem(userId);
        setShowSuccessMessage(true);
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (showSuccessMessage) {
        return (
            <Notification 
                message="יצאת מהמערכת בהצלחה!"
                type="success"
                onClose={() => navigate('/login')}
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