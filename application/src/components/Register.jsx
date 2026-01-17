import { useAuth } from './AuthContext';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
import BasicUserInformation from "./BasicUserInformation";
import AdditionalUserInformation from "./AdditionalUserInformation";
import { useNotification } from './NotificationContext';

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const { showNotification } = useNotification();
    const [basicData, setBasicData] = useState(null);
    const { getItems, addItem } = useApi("users");

    const handleBasicSubmit = async (formData) => {
        try {
            if (formData.password !== formData.verifyPassword) {
                showNotification("הסיסמאות לא זהות", "error");
                return;
            }

           
            const response = await getItems({ username: formData.username });
            if (!response.success) {
                showNotification("שגיאה בבדיקת שם משתמש", "error");
                return;
            }
            if (response.data.length > 0) {
                showNotification("שם משתמש כבר קיים", "error");
            } else {
                setBasicData(formData);
                showNotification("שלב ראשון הושלם בהצלחה", "success");
                setStep(2);
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                showNotification("השרת לא זמין - בדוק שהשרת פועל", "error");
            } else {
                showNotification("שגיאה בבדיקת שם משתמש", "error");
            }
        }
    };

    const handleFinalSubmit = async (formData) => {
        try {
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
            if (newUser && newUser.success !== false) {
                const { website, ...userWithoutPassword } = newUser;
                login(userWithoutPassword);
                showNotification("נרשמת בהצלחה!", "success");
                setTimeout(() => navigate(`/home/users/${newUser.id}`), 1500);
            } else {
                showNotification("שגיאה ברישום", "error");
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                showNotification("השרת לא זמין - בדוק שהשרת פועל", "error");
            } else {
                showNotification("שגיאה ברישום", "error");
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>הרשמה</h2>
            {step === 1 && <BasicUserInformation onSubmit={handleBasicSubmit} />}
            {step === 2 && <AdditionalUserInformation onSubmit={handleFinalSubmit} />}

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Link to="/login">🔑 התחברות</Link>
            </div>
        </div>
    );
}

export default Register;