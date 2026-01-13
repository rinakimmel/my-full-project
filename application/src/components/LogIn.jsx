import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
function LogIn() {
    const navigate = useNavigate();
    const { data: users, getItems } = useApi("users");
    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await getItems({ username: formData.userName });
            console.log("Searching for user:", formData.userName);
            console.log("response data", users);

            if (users.length === 0) {
                alert("User not found");
                return;
            }
            if (users[0].website === formData.password) {
                console.log('Login successful:', users);
                const userId = users[0].id
                localStorage.setItem(userId, JSON.stringify(users[0]));
                console.log(userId);
                navigate(`/home/users/${userId}`);
            }
            else {
                alert("password is wrong")
                setFormData(prev => ({
                    ...prev,
                    password: ""
                }));
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    name="userName"
                    placeholder="user name"
                    value={formData.userName}
                    onChange={handleChange}
                    required />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Log In</button>
            </form>
            <Link to="/register">register</Link>
        </>
    );
}
export default LogIn;