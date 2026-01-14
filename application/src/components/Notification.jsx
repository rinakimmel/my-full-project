import { useEffect } from 'react';

function Notification({ message, type = 'info', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);


    return (
        <div>
            {message}
        </div>
    );
}

export default Notification;
