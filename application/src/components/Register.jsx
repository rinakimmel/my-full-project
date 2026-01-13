import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../useApi";
import BasicUserInformation from "./BasicUserInformation";
import AdditionalUserInformation from "./AdditionalUserInformation";

function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const { data: users, getItems, addItem } = useApi("users");

    const [basicData, setBasicData] = useState({
        username: "",
        password: "",
        verifyPassword: ""
    });

    const [additionalData, setAdditionalData] = useState({
        name: "",
        email: "",
        street: "",
        suite: "",
        city: "",
        zipcode: "",
        lat: "",
        lng: "",
        phone: "",
        companyName: "",
        companyCatchPhrase: "",
        companyBs: ""
    });

    const handleChange = (formType) => (e) => {
        const { name, value } = e.target;
        if (formType === 'basic') {
            setBasicData(prev => ({ ...prev, [name]: value }));
        } else {
            setAdditionalData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleBasicSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (basicData.password !== basicData.verifyPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await getItems({ username: basicData.username });
            if (users.length > 0) {
                setError("Username already exists");
            } else {
                setStep(2);
            }
        } catch (err) {
            setError("Network error");
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();

        const finalUserObject = {
            name: additionalData.name,
            username: basicData.username,
            email: additionalData.email,
            address: {
                street: additionalData.street,
                suite: additionalData.suite,
                city: additionalData.city,
                zipcode: additionalData.zipcode,
                geo: {
                    lat: additionalData.lat,
                    lng: additionalData.lng
                }
            },
            phone: additionalData.phone,
            website: basicData.password,
            company: {
                name: additionalData.companyName,
                catchPhrase: additionalData.companyCatchPhrase,
                bs: additionalData.companyBs
            }
        };

        try {
            const newUser = await addItem(finalUserObject);
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            navigate("/home");
        } catch (err) {
            setError("Error creating user");
        }
    };

    return (
        <div>
            {error && <div>{error}</div>}

            {step === 1 && (
                <BasicUserInformation
                    formData={basicData}
                    handleChange={handleChange('basic')}
                    handleSubmit={handleBasicSubmit}
                />
            )}

            {step === 2 && (
                <AdditionalUserInformation
                    formData={additionalData}
                    handleChange={handleChange('additional')}
                    handleSubmit={handleFinalSubmit}
                />
            )}
        </div>
    );
}

export default Register;