import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
import DynamicForm from './DynamicForm';
import Notification from './Notification';

function LogIn() {
    const navigate = useNavigate();
    const { getItems } = useApi("users");
    const [notification, setNotification] = useState(null);

    const fields = [
        { name: "userName", placeholder: "user name", required: true },
        { name: "password", placeholder: "password", type: "password", required: true }
    ];

    const handleSubmit = async (formData) => {
        const foundUsers = await getItems({ username: formData.userName });
        if (foundUsers.length === 0) {
            setNotification({ message: 'User not found', type: 'error' });
            return;
        }
        if (foundUsers[0].website === formData.password) {
            const userId = foundUsers[0].id;
            const { website, ...userWithoutPassword } = foundUsers[0];
            localStorage.setItem(userId, JSON.stringify(userWithoutPassword));
            navigate(`/home/users/${userId}`);
        } else {
            setNotification({ message: 'password is wrong', type: 'error' });
        }
    };

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <DynamicForm
                fields={fields}
                onSubmit={handleSubmit}
                submitButtonText="Log In"
            />
            <Link to="/register">register</Link>
        </>
    );
}
export default LogIn;