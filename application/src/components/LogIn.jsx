import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
function LogIn() {
    const navigate = useNavigate();
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
            const response = await axios.get(`http://localhost:3000/users?username=${formData.userName}`);
            console.log("Searching for user:", formData.userName);
            console.log("response data", response.data);

            if (response.data.length === 0) {
                alert("User not found");
                return;
            }
            if (response.data[0].website === formData.password) {
                console.log('Login successful:', response.data);
                const userId=response.data[0].id
                localStorage.setItem(userId, JSON.stringify(response.data[0]));
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
            if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
                alert('Server is not running or connection failed');
            } else {
                console.error('Error during login:', error);
                alert('Login failed. Please try again.');
            }
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