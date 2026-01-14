import { useState } from 'react';
import GenericItem from './GenericItem';

function PhotoItem({ photo, deleteItem, updateItem }) {
    const [imageError, setImageError] = useState(false);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this photo?')) {
            deleteItem(id);
        }
    };

    const renderView = (item) => (
        <>
            {imageError ? (
                <div>Image failed to load</div>
            ) : (
                <img 
                    src={item.thumbnailUrl || item.url} 
                    alt={item.title}
                    onError={() => setImageError(true)}
                />
            )}
            <h4>{item.title}</h4>
            <p>ID: {item.id}</p>
        </>
    );

    const renderEdit = (editData, setEditData) => (
        <input 
            value={editData.title} 
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        />
    );

    return (
        <GenericItem
            item={photo}
            onDelete={handleDelete}
            onUpdate={(id, data) => updateItem(id, { title: data.title })}
            renderView={renderView}
            renderEdit={renderEdit}
        />
    );
}

export default PhotoItem;