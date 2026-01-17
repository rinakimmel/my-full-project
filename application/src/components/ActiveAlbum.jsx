import { useState } from 'react';
import GenericItem from "./GenericItem";
import useApi from "../useApi";
import { useParams, useLocation, Link } from "react-router-dom";
import PhotosList from "./PhotosList";
import Notification from './Notification';

function ActiveAlbum() {
    const location = useLocation();
    const { error, deleteItem, updateItem } = useApi("albums")
    const { userId } = useParams();
    const [notification, setNotification] = useState(null);
    const { album: initiaAlbum } = location.state || {};
    const [album, setAlbum] = useState(initiaAlbum);
    
    const handleDelete = async (id) => {
        await deleteItem(id);
        setNotification({ message: 'אלבום נמחק בהצלחה', type: 'success' });
    };

    const handleUpdate = async (id, data) => {
        await updateItem(id, data);
        setNotification({ message: 'אלבום עודכן בהצלחה', type: 'success' });
    };
    
    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div>
                <Link to={`/home/users/${userId}/albums`}>← Back to Albums</Link>
                <GenericItem
                    item={album}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    canEdit={true}
                />
                <PhotosList albumId={album?.id} album={album} />
            </div>
        </>
    )
}
export default ActiveAlbum;