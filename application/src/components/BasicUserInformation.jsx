/**
 * BasicUserInformation
 * Macro: שלב ראשון בהרשמה — בוחר שם משתמש וסיסמה.
 * Props:
 *  - onSubmit(formData)
 * State: מנוהל ב־DynamicForm
 */
import DynamicForm from './DynamicForm';

function BasicUserInformation({ onSubmit }) {
    const fields = [
        { name: "username", placeholder: "Username", required: true },
        { name: "password", placeholder: "Password", type: "password", required: true },
        { name: "verifyPassword", placeholder: "Verify Password", type: "password", required: true }
    ];

    return (
        <DynamicForm 
            fields={fields}
            onSubmit={onSubmit}
            submitButtonText="Next"
        />
    );
}

export default BasicUserInformation;