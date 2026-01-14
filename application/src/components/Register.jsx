import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../useApi";
import BasicUserInformation from "./BasicUserInformation";
import AdditionalUserInformation from "./AdditionalUserInformation";

function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [basicData, setBasicData] = useState(null);
    const { getItems, addItem } = useApi("users");

    const handleBasicSubmit = async (formData) => {
        setError("");

        if (formData.password !== formData.verifyPassword) {
            setError("Passwords do not match");
            return;
        }

        const foundUsers = await getItems({ username: formData.username });
        if (foundUsers.length > 0) {
            setError("Username already exists");
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
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        navigate("/home");
    };

    return (
        <div>
            {error && <div>{error}</div>}

            {step === 1 && <BasicUserInformation onSubmit={handleBasicSubmit} />}
            {step === 2 && <AdditionalUserInformation onSubmit={handleFinalSubmit} />}
            
            <Link to="/login">login</Link>
        </div>
    );
}

export default Register;