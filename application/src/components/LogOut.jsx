import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function LogOut() {
    const navigate = useNavigate();
    // משתנה כדי לדעת האם להציג את הודעת ההצלחה
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { userId } = useParams();
    const handleLogout = () => {
        // 1. הסרת המשתמש מה-Local Storage
        localStorage.removeItem(userId);

        // 2. הצגת ההודעה למשתמש
        setShowSuccessMessage(true);

        // 3. המתנה של 2 שניות (2000 מילי-שניות) לפני המעבר
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    // אם ההודעה צריכה להופיע, נציג רק אותה (או נוסיף אותה לדף)
    if (showSuccessMessage) {
        return (
            <div>
                יצאת מהמערכת בהצלחה! מעביר אותך להתחברות...
            </div>
        );
    }

    return (
        <div>
            <h3>האם ברצונך להתנתק?</h3>
            <p>לחיצה על כפתור ההתנתקות תוציא אותך מהמערכת.</p>

            <button onClick={handleCancel}>
                ביטול
            </button>

            <button onClick={handleLogout}>
                התנתקות
            </button>
        </div>
    );
}

export default LogOut;