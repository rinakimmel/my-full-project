function AdditionalUserInformation({ formData, handleChange, handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            
            <input name="street" placeholder="Street" value={formData.street} onChange={handleChange} />
            <input name="suite" placeholder="Suite" value={formData.suite} onChange={handleChange} />
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            <input name="zipcode" placeholder="Zipcode" value={formData.zipcode} onChange={handleChange} />
            <input name="lat" placeholder="Latitude" value={formData.lat} onChange={handleChange} />
            <input name="lng" placeholder="Longitude" value={formData.lng} onChange={handleChange} />

            <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} />
            <input name="companyCatchPhrase" placeholder="Catch Phrase" value={formData.companyCatchPhrase} onChange={handleChange} />
            <input name="companyBs" placeholder="BS" value={formData.companyBs} onChange={handleChange} />

            <button type="submit">Finish</button>
        </form>
    );
}

export default AdditionalUserInformation;