import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useApi from '../useApi';
import PhotoItem from './PhotoItem';
import DynamicForm from './DynamicForm';
import Pagination from './Pagination';
import Notification from './Notification';

function PhotosList() {
    const { albumId } = useParams();
    const location = useLocation();
    const { album } = location.state || {};
    
    const [currentPage, setCurrentPage] = useState(0);
    const [photosPerPage] = useState(6); 
    const [showAddForm, setShowAddForm] = useState(false);
    const [notification, setNotification] = useState(null);

    const { data: photos, error, getItems, deleteItem, updateItem, addItem } = useApi("photos");

    useEffect(() => {
        getItems({ albumId: albumId });
    }, [albumId, getItems]);

    useEffect(() => {
        if (error) {
            setNotification({ message: 'שגיאה בטעינת נתונים', type: 'error' });
        }
    }, [error]);

    const startIndex = currentPage * photosPerPage;
    const endIndex = startIndex + photosPerPage;
    const currentPhotos = photos.slice(startIndex, endIndex);
    const totalPages = Math.ceil(photos.length / photosPerPage);

    const handleAddPhoto = async (formData) => {
        const result = await addItem({ ...formData, albumId: parseInt(albumId) });
        setShowAddForm(false);
        if (result?.success) {
            setNotification({ message: 'תמונה נוספה בהצלחה', type: 'success' });
        } else {
            setNotification({ message: 'שגיאה בהוספת תמונה', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        return await deleteItem(id);
    };

    const handleUpdate = async (id, data) => {
        return  await updateItem(id, data);
    };
 return (
        <div className="container">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
           
            <h2>Album: {album?.title || 'Loading...'}</h2>
            
            <div className="toolbar">
                <button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? '❌ Cancel' : '➕ Add Photo'}
                </button>
            </div>

            {showAddForm && (
                <div className="card">
                    <DynamicForm 
                        fields={[
                            { name: 'title', placeholder: 'Photo Title', type: 'text' },
                            { name: 'url', placeholder: 'Photo URL', type: 'url' }
                        ]}
                        onSubmit={handleAddPhoto}
                        submitButtonText="Add Photo"
                    />
                </div>
            )}

            <div className="grid">
                {photos.map(photo => (
                    photo && (
                        <PhotoItem
                            key={photo.id}
                            photo={photo}
                            error={error}
                            deleteItem={handleDelete}
                            updateItem={handleUpdate}
                        />
                    )
                ))}
            </div>

            {photos.length === 0 && <p>No photos to show</p>}

            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
export default PhotosList;