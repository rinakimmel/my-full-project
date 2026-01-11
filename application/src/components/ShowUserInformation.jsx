import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ShowUserInformation() {
    const { userId } = useParams();
    // 1. שימוש ב-State כדי לשמור את הנתונים
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(false);

    // 2. שימוש ב-useEffect כדי לבצע את הקריאה הכבדה רק כשה-userId משתנה
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
    }, [userId]); // התלות ב-userId מבטיחה שהקוד ירוץ רק כצריך

    if (error) return <div>Error loading user data</div>;
    if (!userDetails) return <div>No user data available</div>;

    return (
        <div className="user-info">
            <h2>User Information</h2>
            
            <div className="basic-info">
                <h3>Basic Information</h3>
                {/* עדיין משתמשים ב-?. כי ייתכן ששדות מסוימים חסרים בתוך האובייקט */}
                <p><strong>Name:</strong> {userDetails?.name}</p>
                <p><strong>Username:</strong> {userDetails?.username}</p>
                <p><strong>Email:</strong> {userDetails?.email}</p>
                <p><strong>Phone:</strong> {userDetails?.phone}</p>
                <p><strong>Website:</strong> {userDetails?.website}</p>
            </div>

            <div className="address-info">
                <h3>Address</h3>
                <p><strong>Street:</strong> {userDetails?.address?.street}</p>
                <p><strong>Suite:</strong> {userDetails?.address?.suite}</p>
                <p><strong>City:</strong> {userDetails?.address?.city}</p>
                <p><strong>Zipcode:</strong> {userDetails?.address?.zipcode}</p>
                <p><strong>Coordinates:</strong> {userDetails?.address?.geo?.lat}, {userDetails?.address?.geo?.lng}</p>
            </div>

            <div className="company-info">
                <h3>Company</h3>
                <p><strong>Name:</strong> {userDetails?.company?.name}</p>
                <p><strong>Catch Phrase:</strong> {userDetails?.company?.catchPhrase}</p>
                <p><strong>BS:</strong> {userDetails?.company?.bs}</p>
            </div>
        </div>
    );
}

export default ShowUserInformation;