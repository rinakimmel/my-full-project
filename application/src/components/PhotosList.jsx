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
    const [totalPhotos, setTotalPhotos] = useState(0);

    const { data: photos, error, getItems, deleteItem, updateItem, addItem } = useApi("photos");

    // שימוש ב-useEffect אחד בלבד!
    useEffect(() => {
        const loadPhotos = async () => {
            const result = await getItems({ 
                albumId: albumId,
                _page: currentPage + 1,
                _limit: photosPerPage
            });
            
            if (result?.success) {
                // עדכון המספר הכולל שמגיע מה-useApi החדש
                if (result.total !== undefined) {
                    setTotalPhotos(result.total);
                }
            }
        };
        loadPhotos();
        // הסרנו את getItems מהתלויות למניעת לופ אינסופי
    }, [albumId, currentPage, photosPerPage]);

    useEffect(() => {
        if (error) {
            setNotification({ message: 'שגיאה בטעינת נתונים', type: 'error' });
        }
    }, [error]);

    const totalPages = Math.ceil(totalPhotos / photosPerPage);

    const handleAddPhoto = async (formData) => {
        const result = await addItem({ ...formData, albumId: parseInt(albumId) });
        setShowAddForm(false);
        if (result?.success) {
            setNotification({ message: 'תמונה נוספה בהצלחה', type: 'success' });
            
            // רענון הרשימה כדי לראות את השינוי ולעדכן את הספירה
            const refresh = await getItems({ 
                albumId: albumId,
                _page: currentPage + 1,
                _limit: photosPerPage
            });
            if (refresh?.total) setTotalPhotos(refresh.total);
            
        } else {
            setNotification({ message: 'שגיאה בהוספת תמונה', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteItem(id);
        if (result.success) {
            // עדכון הספירה ידנית כדי לחסוך קריאה, או קריאה מחדש לשרת
            setTotalPhotos(prev => Math.max(0, prev - 1));
            
            // בדיקה אם מחקנו את התמונה האחרונה בעמוד
            if (photos.length === 1 && currentPage > 0) {
                 setCurrentPage(prev => prev - 1);
            } else {
                 // רענון העמוד הנוכחי
                 getItems({ 
                    albumId: albumId,
                    _page: currentPage + 1,
                    _limit: photosPerPage
                });
            }
        }
        return result;
    };

    const handleUpdate = async (id, data) => {
        return await updateItem(id, data);
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

            {photos.length === 0 && !error && <p>No photos to show</p>}

            {totalPages > 0 && (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
export default PhotosList;