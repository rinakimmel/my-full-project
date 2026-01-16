import { useState } from 'react';
import GenericItem from './GenericItem';

function PhotoItem({ photo, deleteItem, updateItem }) {
    const [imageError, setImageError] = useState(false);

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
    const handleUpdate = async (id, data) => {
        return await updateItem(id, { title: data.title });
    };


    return (
        <>
            <GenericItem
                item={photo}
                onDelete={deleteItem}
                onUpdate={handleUpdate}
                renderView={renderView}
                editableFields={['title']}
                deleteSuccessMsg="תמונה נמחקה בהצלחה"
                updateSuccessMsg="תמונה עודכנה בהצלחה"
            />
        </>
    );
}

export default PhotoItem;