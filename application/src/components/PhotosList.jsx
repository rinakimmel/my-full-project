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

    const { data: photos, getItems, deleteItem, updateItem, addItem } = useApi("photos");

    const loadPhotosFromServer = (page) => {
        getItems({ 
            albumId: albumId, 
            _page: page + 1,        
            _limit: photosPerPage,    
            _per_page: photosPerPage,  
            _sort: 'id',              
            _order: 'asc'
        });
    };

    useEffect(() => {
        loadPhotosFromServer(currentPage);
    }, [albumId, getItems, currentPage, photosPerPage]);


    const totalPages = photos.length < photosPerPage 
        ? currentPage + 1 
        : currentPage + 2;


    const handleAddPhoto = async (formData) => {
        await addItem({ ...formData, albumId: parseInt(albumId) });
        setShowAddForm(false);
        setNotification({ message: 'תמונה נוספה בהצלחה', type: 'success' });
        loadPhotosFromServer(currentPage);
    };

    const handleDelete = async (id) => {
        await deleteItem(id);
        setNotification({ message: 'תמונה נמחקה בהצלחה', type: 'success' });
        loadPhotosFromServer(currentPage);
    };

    const handleUpdate = async (id, data) => {
        await updateItem(id, data);
        setNotification({ message: 'תמונה עודכנה בהצלחה', type: 'success' });
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