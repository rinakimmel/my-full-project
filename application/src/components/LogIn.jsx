import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
import DynamicForm from './DynamicForm';

function LogIn() {
    const navigate = useNavigate();
    const { getItems } = useApi("users");

    const fields = [
        { name: "userName", placeholder: "user name", required: true },
        { name: "password", placeholder: "password", type: "password", required: true }
    ];

    const handleSubmit = async (formData) => {
        const foundUsers = await getItems({ username: formData.userName });
        if (foundUsers.length === 0) {
            alert("User not found");
            return;
        }
        if (foundUsers[0].website === formData.password) {
            const userId = foundUsers[0].id;
            localStorage.setItem(userId, JSON.stringify(foundUsers[0]));
            navigate(`/home/users/${userId}`);
        } else {
            alert("password is wrong");
        }
    };

    return (
        <>
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