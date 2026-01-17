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
        { name: "username", placeholder: "user name", required: true },
        { name: "password", placeholder: "password", type: "password", required: true }
    ];

    const handleSubmit = async (formData) => {
        const result = await getItems({ username: formData.username });
        if (!result.success || !result.data || result.data.length === 0) {
            setNotification({ message: 'משתמש לא נמצא', type: 'error' });
            return;
        }
        const foundUser = result.data[0];
        if (foundUser?.website === formData.password) {
            const userId = foundUser.id;
            const { website, ...userWithoutPassword } = foundUser;
            login(userWithoutPassword);
            setNotification({
                message: 'התחברת בהצלחה!',
                type: 'success',
                onClose: () => navigate(`/home/users/${userId}`)
            });
        } else {
            setNotification({ message: 'סיסמה שגויה', type: 'error' });
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