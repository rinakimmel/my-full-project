import { useAuth } from './AuthContext';

function ShowUserInformation() {
    const { user } = useAuth();

    const InfoField = ({ label, value }) => value ? <p><strong>{label}:</strong> {value}</p> : null;

    if (!user) return <div>No user data available</div>;

    return (
        <div className="user-info">
            <h2>User Information</h2>

            <div className="basic-info">
                <h3>Basic Information</h3>
                <InfoField label="Name" value={user.name} />
                <InfoField label="Username" value={user.username} />
                <InfoField label="Email" value={user.email} />
                <InfoField label="Phone" value={user.phone} />
            </div>

            <div className="address-info">
                <h3>Address</h3>
                <InfoField label="Street" value={user.address?.street} />
                <InfoField label="Suite" value={user.address?.suite} />
                <InfoField label="City" value={user.address?.city} />
                <InfoField label="Zipcode" value={user.address?.zipcode} />
                <InfoField label="Coordinates" value={user.address?.geo && `${user.address.geo.lat}, ${user.address.geo.lng}`} />
            </div>

            <div className="company-info">
                <h3>Company</h3>
                <InfoField label="Name" value={user.company?.name} />
                <InfoField label="Catch Phrase" value={user.company?.catchPhrase} />
                <InfoField label="BS" value={user.company?.bs} />
            </div>
        </div>
    );
}

export default ShowUserInformation;