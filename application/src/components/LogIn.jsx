import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
import DynamicForm from './DynamicForm';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

function LogIn() {
    const navigate = useNavigate();
    const { getItems } = useApi("users");
    const { login } = useAuth();
    const { showNotification } = useNotification();

    const fields = [
        { name: "username", placeholder: "user name", required: true },
        { name: "password", placeholder: "password", type: "password", required: true }
    ];

    const handleSubmit = async (formData) => {
        const result = await getItems({ username: formData.username });
        if (!result.success || !result.data || result.data.length === 0) {
            showNotification('משתמש לא נמצא', 'error');
            return;
        }
        const foundUser = result.data[0];
        if (foundUser?.website === formData.password) {
            const userId = foundUser.id;
            const { website, ...userWithoutPassword } = foundUser;
            login(userWithoutPassword);
            showNotification('התחברת בהצלחה!', 'success');
            setTimeout(() => navigate(`/home/users/${userId}`), 1500);
        } else {
            showNotification('סיסמה שגויה', 'error');
        }
    };

    return (
        <div className="auth-container">
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