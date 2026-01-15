import { useAuth } from './AuthContext';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
import BasicUserInformation from "./BasicUserInformation";
import AdditionalUserInformation from "./AdditionalUserInformation";
import Notification from "./Notification";

function Register() {
    const navigate = useNavigate();
    const {login } = useAuth();
    const [step, setStep] = useState(1);
    const [notification, setNotification] = useState(null);
    const [basicData, setBasicData] = useState(null);
    const { getItems, addItem } = useApi("users");

    const handleBasicSubmit = async (formData) => {
        if (formData.password !== formData.verifyPassword) {
            setNotification({ message: "Passwords do not match", type: "error" });
            return;
        }

        const foundUsers = await getItems({ username: formData.username });
        if (foundUsers.length > 0) {
            setNotification({ message: "Username already exists", type: "error" });
        } else {
            setBasicData(formData);
            setNotification({ message: "שלב ראשון הושלם בהצלחה", type:"success" });
            setStep(2);
        }
    };

    const handleFinalSubmit = async (formData) => {
        const finalUserObject = {
            name: formData.name,
            username: basicData.username,
            email: formData.email,
            address: {
                street: formData.street,
                suite: formData.suite,
                city: formData.city,
                zipcode: formData.zipcode,
                geo: {
                    lat: formData.lat,
                    lng: formData.lng
                }
            },
            phone: formData.phone,
            website: basicData.password,
            company: {
                name: formData.companyName,
                catchPhrase: formData.companyCatchPhrase,
                bs: formData.companyBs
            }
        };

        const newUser = await addItem(finalUserObject);
        const { website, ...userWithoutPassword } = newUser;
        login(userWithoutPassword);
        setNotification({ message: "נרשמת בהצלחה!", type: "success" });
        setTimeout(() => navigate(`/home/users/${newUser.id}`), 1500);
    };

    return (
        <div className="auth-container">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <h2>הרשמה</h2>
            {step === 1 && <BasicUserInformation onSubmit={handleBasicSubmit} />}
            {step === 2 && <AdditionalUserInformation onSubmit={handleFinalSubmit} />}

            <div style={{marginTop: '1rem', textAlign: 'center'}}>
                <Link to="/login">🔑 התחברות</Link>
            </div>
        </div>
    );
}

export default Register;