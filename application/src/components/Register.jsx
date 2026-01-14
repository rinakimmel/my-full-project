import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
import BasicUserInformation from "./BasicUserInformation";
import AdditionalUserInformation from "./AdditionalUserInformation";
import Notification from "./Notification";

function Register() {
    const navigate = useNavigate();
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
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
        navigate("/home");
    };

    return (
        <div>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            {step === 1 && <BasicUserInformation onSubmit={handleBasicSubmit} />}
            {step === 2 && <AdditionalUserInformation onSubmit={handleFinalSubmit} />}

            <Link to="/login">login</Link>
        </div>
    );
}

export default Register;