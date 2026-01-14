/**
 * AdditionalUserInformation
 * Macro: שלב שני בהרשמה, אוסף שדות נוספים (כתובת, חברה וכו').
 * Props:
 *  - onSubmit(formData): callback לקבלת ערכי השדות בסיום.
 * State: אין (הטופס מנוהל ב־DynamicForm).
 */
import React from 'react';
import DynamicForm from './DynamicForm';

function AdditionalUserInformation({ onSubmit }) {
    const fields = [
        { name: "name", placeholder: "Name", required: true },
        { name: "email", placeholder: "Email", type: "email", required: true },
        { name: "street", placeholder: "Street", required: true },
        { name: "suite", placeholder: "Suite" },
        { name: "city", placeholder: "City", required: true },
        { name: "zipcode", placeholder: "Zipcode" },
        { name: "lat", placeholder: "Latitude" },
        { name: "lng", placeholder: "Longitude" },
        { name: "phone", placeholder: "Phone", required: true },
        { name: "companyName", placeholder: "Company Name" },
        { name: "companyCatchPhrase", placeholder: "Company Catch Phrase" },
        { name: "companyBs", placeholder: "Company BS" }
    ];

    return (
        <DynamicForm 
            fields={fields}
            onSubmit={onSubmit}
            submitButtonText="Register"
        />
    );
}

export default AdditionalUserInformation;