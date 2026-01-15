import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
import DynamicForm from './DynamicForm';
import Notification from './Notification';
import { useAuth } from './AuthContext';

function LogIn() {
    const navigate = useNavigate();
    const { getItems } = useApi("users");
    const { login } = useAuth();
    const [notification, setNotification] = useState(null);

    const fields = [
        { name: "userName", placeholder: "user name", required: true },
        { name: "password", placeholder: "password", type: "password", required: true }
    ];

    const handleSubmit = async (formData) => {
        try {
            const foundUsers = await getItems({ username: formData.userName });
            if (foundUsers.length === 0) {
                setNotification({ message: 'משתמש לא נמצא', type: 'error' });
                return;
            }
            if (foundUsers[0]?.website === formData.password) {
                const userId = foundUsers[0].id;
                const { website, ...userWithoutPassword } = foundUsers[0];
                login(userWithoutPassword);
                setNotification({ 
                    message: 'התחברת בהצלחה!', 
                    type: 'success',
                    onClose: () => navigate(`/home/users/${userId}`)
                });
            } else {
                setNotification({ message: 'סיסמה שגויה', type: 'error' });
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                setNotification({ message: 'השרת לא זמין - בדוק שהשרת פועל', type: 'error' });
            } else {
                setNotification({ message: 'שגיאה בחיבור לשרת', type: 'error' });
            }
        }
    };

    return (
        <div className="auth-container">
            {notification && <Notification message={notification.message} type={notification.type} onClose={notification.onClose || (() => setNotification(null))} />}
            <h2>התחברות</h2>
            <DynamicForm
                fields={fields}
                onSubmit={handleSubmit}
                submitButtonText="Log In"
            />
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Link to="/register">📝 הרשמה</Link>
            </div>
        </div>
    );
}
export default LogIn;