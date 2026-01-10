function BasicUserInformation({ formData, handleChange, handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
            <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input
                name="verifyPassword"
                type="password"
                placeholder="Verify Password"
                value={formData.verifyPassword}
                onChange={handleChange}
                required
            />
            <button type="submit">Next</button>
        </form>
    );
}

export default BasicUserInformation;