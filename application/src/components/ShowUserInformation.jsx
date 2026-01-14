import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * ShowUserInformation
 * Macro: קורא נתוני משתמש מתוך localStorage לפי userId ומציג שדות חשובים (address, company).
 * State:
 *  - userDetails: האובייקט של המשתמש
 *  - error: דגל שגיאה בפענוח JSON
 */
function ShowUserInformation() {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const userData = localStorage.getItem(userId);
        
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                setUserDetails(parsedData);
            } catch (e) {
                console.error("Data parsing error", e);
                setError(true);
            }
        } else {
            setUserDetails(null);
        }
    }, [userId]);

    const InfoField = ({ label, value }) => value ? <p><strong>{label}:</strong> {value}</p> : null;

    if (error) return <div>Error loading user data</div>;
    if (!userDetails) return <div>No user data available</div>;

    return (
        <div className="user-info">
            <h2>User Information</h2>
            
            <div className="basic-info">
                <h3>Basic Information</h3>
                <InfoField label="Name" value={userDetails.name} />
                <InfoField label="Username" value={userDetails.username} />
                <InfoField label="Email" value={userDetails.email} />
                <InfoField label="Phone" value={userDetails.phone} />
            </div>

            <div className="address-info">
                <h3>Address</h3>
                <InfoField label="Street" value={userDetails.address?.street} />
                <InfoField label="Suite" value={userDetails.address?.suite} />
                <InfoField label="City" value={userDetails.address?.city} />
                <InfoField label="Zipcode" value={userDetails.address?.zipcode} />
                <InfoField label="Coordinates" value={userDetails.address?.geo && `${userDetails.address.geo.lat}, ${userDetails.address.geo.lng}`} />
            </div>

            <div className="company-info">
                <h3>Company</h3>
                <InfoField label="Name" value={userDetails.company?.name} />
                <InfoField label="Catch Phrase" value={userDetails.company?.catchPhrase} />
                <InfoField label="BS" value={userDetails.company?.bs} />
            </div>
        </div>
    );
}

export default ShowUserInformation;