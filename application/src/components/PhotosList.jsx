import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useApi from '../useApi';
import PhotoItem from './PhotoItem';

function PhotosList() {
    const { userId, albumId } = useParams();
    const [currentPage, setCurrentPage] = useState(0);
    const [photosPerPage] = useState(6);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPhotoData, setNewPhotoData] = useState({ title: '', url: '' });

    const { data: photos, getItems, deleteItem, updateItem, addItem } = useApi("photos");
    const { data: albums, getItems: getAlbums } = useApi("albums");

    const currentAlbum = albums.find(album => album.id === albumId);
    const isOwner = parseInt(userId) === currentAlbum?.userId;

    useEffect(() => {
        getItems({ albumId: albumId });
        getAlbums({ id: albumId });
    }, [albumId, getItems, getAlbums]);

    const startIndex = currentPage * photosPerPage;
    const endIndex = startIndex + photosPerPage;
    const currentPhotos = photos.slice(startIndex, endIndex);
    const totalPages = Math.ceil(photos.length / photosPerPage);

    const handleAddPhoto = async () => {
        if (newPhotoData.title.trim() && newPhotoData.url.trim()) {
            await addItem({
                ...newPhotoData,
                albumId: parseInt(albumId)
            });
            setNewPhotoData({ title: '', url: '' });
            setShowAddForm(false);
        }
    };

    const loadSamplePhotos = async () => {
        const samplePhotos = [
            { title: 'Sample Photo 1', url: 'https://picsum.photos/300/200?random=1', albumId: parseInt(albumId) },
            { title: 'Sample Photo 2', url: 'https://picsum.photos/300/200?random=2', albumId: parseInt(albumId) },
            { title: 'Sample Photo 3', url: 'https://picsum.photos/300/200?random=3', albumId: parseInt(albumId) }
        ];

        for (const photo of samplePhotos) {
            await addItem(photo);
        }
    };

    return (
        <div>
            <Link to={`/home/users/${userId}/albums`}>← Back to Albums</Link>

            <h2>Album: {currentAlbum?.title || 'Loading...'}</h2>

            {isOwner && (
                <div>
                    <button onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? 'Cancel' : 'Add Photo'}
                    </button>

                    {showAddForm && (
                        <div style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
                            <input
                                type="text"
                                placeholder="Photo Title"
                                value={newPhotoData.title}
                                onChange={(e) => setNewPhotoData({ ...newPhotoData, title: e.target.value })}
                            />
                            <input
                                type="url"
                                placeholder="Photo URL"
                                value={newPhotoData.url}
                                onChange={(e) => setNewPhotoData({ ...newPhotoData, url: e.target.value })}
                            />
                            <button onClick={handleAddPhoto}>Add Photo</button>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                {currentPhotos.map(photo => (
                    <PhotoItem
                        key={photo.id}
                        photo={photo}
                        deleteItem={deleteItem}
                        updateItem={updateItem}
                        isOwner={isOwner}
                    />
                ))}
            </div>

            {photos.length === 0 && <p>No photos in this album</p>}

            {totalPages > 1 && (
                <div style={{ margin: '20px 0', textAlign: 'center' }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                    >
                        הקודם
                    </button>

                    <span style={{ margin: '0 15px' }}>
                        עמוד {currentPage + 1} מתוך {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        הבא
                    </button>
                </div>
            )}
        </div>
    );
}

export default PhotosList;