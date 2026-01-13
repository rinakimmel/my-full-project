import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function AlbumItem({ album, deleteItem, updateItem, isOwner }) {
    const { userId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(album.title);

    const handleUpdate = () => {
        updateItem(album.id, { title: editTitle });
        setIsEditing(false);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <div>ID: {album.id}</div>
            
            {isEditing ? (
                <div>
                    <input 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <Link to={`/home/users/${userId}/albums/${album.id}`}>
                        <strong>{album.title}</strong>
                    </Link>
                </div>
            )}
            
            {isOwner && (
                <div>
                    <button onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    <button onClick={() => deleteItem(album.id)}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default AlbumItem;