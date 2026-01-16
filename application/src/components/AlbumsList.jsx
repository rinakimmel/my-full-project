import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useApi from "../useApi";
import SearchFilter from './SearchFilter';
import DynamicForm from './DynamicForm';
import Notification from './Notification';
import ConfirmDialog from './ConfirmDialog';

function AlbumsList() {
    const { userId } = useParams();
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [notification, setNotification] = useState(null);
    const [deleteAlbumId, setDeleteAlbumId] = useState(null);
    const { data: albums, error, getItems, deleteItem, updateItem, addItem } = useApi("albums");

    useEffect(() => {
        const params = { userId };

        if (searchBy && searchValue) {
            params[searchBy] = searchValue;
        }
        getItems(params);

    }, [userId, searchBy, searchValue, getItems,]);

    useEffect(() => {
        if (error) {
            setNotification({ message: 'שגיאה בטעינת הנתונים', type: 'error' });
        }
    }, [error])

    const handleCreateAlbum = async (formData) => {
        await addItem({
            title: formData.title,
            userId: parseInt(userId)
        });
        setShowCreateForm(false);
        setNotification({ message: 'אלבום נוצר בהצלחה', type: 'success' });
    };

    const handleDeleteClick = (e, albumId) => {
        e.preventDefault();
        setDeleteAlbumId(albumId);
    };

    // const confirmDelete = () => {
    //     deleteItem(deleteAlbumId);
    //     setDeleteAlbumId(null);
    //     //setNotification({ message: 'אלבום נמחק בהצלחה', type: 'success' });
    //     if (!error){
    //         setNotification({ message: 'אלבום נמחק בהצלחה', type: 'success' });
    //      } else {
    //         setNotification({ message: 'שגיאה במחיקת האלבום', type: 'error' });
    //      }
    // };
    const confirmDelete = async () => {
        const result = await deleteItem(deleteAlbumId);
        setDeleteAlbumId(null);
        if (result?.success) {
            setNotification({ message: 'אלבום נמחק בהצלחה', type: 'success' });
        } else {
            setNotification({ message: 'שגיאה במחיקת האלבום', type: 'error' });
        }
    };


    const searchOptions = [
        { value: 'id', label: 'חיפוש לפי ID' },
        { value: 'title', label: 'חיפוש לפי כותרת' }
    ];

    const createFields = [
        { name: 'title', placeholder: 'Album Title', type: 'text' }
    ];

    return (
        <div className="container">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            {deleteAlbumId && (
                <ConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteAlbumId(null)}
                />
            )}
            <h2>Albums</h2>

            <div className="toolbar">
                <button onClick={() => setShowCreateForm(!showCreateForm)}>
                    {showCreateForm ? '❌ Cancel' : '➕ Create New Album'}
                </button>
                <SearchFilter
                    searchOptions={searchOptions}
                    searchBy={searchBy}
                    setSearchBy={setSearchBy}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />
            </div>

            {showCreateForm && (
                <div className="card">
                    <DynamicForm
                        fields={createFields}
                        onSubmit={handleCreateAlbum}
                        submitButtonText="Create Album"
                    />
                </div>
            )}

            <div className="list">
                {albums.map(album => (
                    <div key={album.id} className="card">
                        <Link
                            to={`/home/users/${userId}/albums/${album.id}/photos`}
                            state={album}
                        >
                            <div>
                                <p>id: {album.id}</p>
                                <p>{album.title}</p>
                            </div>
                        </Link>
                        <button onClick={(e) => handleDeleteClick(e, album.id)} style={{ marginTop: '0.5rem' }}>🗑️ מחק אלבום</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default AlbumsList;