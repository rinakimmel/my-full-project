import { useState } from 'react';
import GenericItem from './GenericItem';

function PhotoItem({ photo, deleteItem, updateItem }) {
    const [imageError, setImageError] = useState(false);

    const handleDelete = (id) => {
        deleteItem(id);
    };

    const renderView = (item, defaultRender) => (
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
            {defaultRender(item)}
        </>
    );

    return (
        <GenericItem
            item={photo}
            onDelete={handleDelete}
            onUpdate={(id, data) => updateItem(id, { title: data.title })}
            renderView={renderView}
            editableFields={['title']}
        />
    );
}

export default PhotoItem;