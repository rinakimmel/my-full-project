import { useState } from 'react';
import GenericItem from './GenericItem';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';

function PhotoItem({ photo, deleteItem, updateItem }) {
    const [imageError, setImageError] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleDelete = (id) => {
        deleteItem(id);
        // setShowConfirm(true);
        // const result = await deleteItem(id);
        // return result;
    };

    const confirmDelete = () => {
        deleteItem(photo.id);
        // setShowConfirm(false);
        setNotification({ message: 'תמונה נמחקה בהצלחה', type: 'success' });
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
        <>
            {/* {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />} */}
            {/* {showConfirm && (
                <ConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )} */}
            <GenericItem
                item={photo}
                // onDelete={async (id) => {
                //     const result = await deleteItem(id);
                //     return result;
                // }}
                 onDelete={handleDelete}
                onUpdate={(id, data) => updateItem(id, { title: data.title })}
                renderView={renderView}
                editableFields={['title']}
            />
        </>
    );
}

export default PhotoItem;