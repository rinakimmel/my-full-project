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
        <form onSubmit={handleSubmit} className="form-group">
            {fields.map((field) => (
                <div key={field.name} className="form-group">
                    <input
                        name={field.name}
                        type={field.type || "text"} 
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={!!field.required} 
                    />
                </div>
            ))}
            <button type="submit" className="primary">{submitButtonText || "Submit"}</button>
        </form>
    );
}

export default DynamicForm;