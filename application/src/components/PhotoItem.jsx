import { useState } from 'react';

function PhotoItem({ photo, deleteItem, updateItem }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(photo.title);
    const [imageError, setImageError] = useState(false);

    const handleUpdate = () => {
        updateItem(photo.id, { title: editTitle });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this photo?')) {
            deleteItem(photo.id);
        }
    };

    return (
        <div >
            {/* <div >
                URL: {photo.url}<br/>
                Thumbnail: {photo.thumbnailUrl}
            </div> */}
            {imageError ? (
                <div >
                    Image failed to load
                </div>
            ) : (
                <img 
                    src={photo.thumbnailUrl || photo.url} 
                    alt={photo.title}
                    onError={() => setImageError(true)}
                />
            )}
            
            {isEditing ? (
                <div >
                    <input 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <h4 >{photo.title}</h4>
                    <p >ID: {photo.id}</p>
                </div>
            )}
            
            <div >
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
                <button 
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default PhotoItem;