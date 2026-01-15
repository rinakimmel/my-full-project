import { useEffect } from 'react';

function Notification({ message, type = 'info', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);


    return (
        <div className={`notification ${type}`}>
            {message}
            <button onClick={onClose} style={{marginLeft: '1rem', padding: '0.25rem 0.5rem'}}>×</button>
        </div>
    );
}

export default Notification;
