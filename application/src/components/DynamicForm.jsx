/**
 * DynamicForm
 * Macro: טופס דינמי כללי שמייצר שדות על פי תיאור ומחזיר את הערכים ב־onSubmit.
 * Props:
 *  - fields: [{ name, placeholder, type, required }]
 *  - onSubmit(formData)
 *  - submitButtonText: טקסט לכפתור השליחה
 * State:
 *  - formData: אובייקט ערכים לשדות
 * Notes:
 *  - מאתחל כל שדה למחרוזת ריקה; אפס בסיסי לאחר שליחה.
 */
import { useState } from 'react';

function DynamicForm({ fields, onSubmit, submitButtonText }) {
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    };

    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field) => (
                <input
                    key={field.name}
                    name={field.name}
                    type={field.type || "text"} 
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={!!field.required} 
                />
            ))}
            <button type="submit">{submitButtonText || "Submit"}</button>
        </form>
    );
}

export default DynamicForm;