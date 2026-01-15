import { useState } from 'react';
import GenericItem from './GenericItem';
import Notification from './Notification';

function CommentItem({ comment, onDelete, onUpdate, currentUserEmail }) {
    const [notification, setNotification] = useState(null);
    const isOwner = comment.email === currentUserEmail;

    const handleDelete = async (id) => {
        await onDelete(id);
        // setNotification({ message: 'תגובה נמחקה בהצלחה', type: 'success' });
    };

    const handleUpdate = async (id, data) => {
        const result = await onUpdate(id, data);
        return result;
        // await onUpdate(id, data);
        // setNotification({ message: 'תגובה עודכנה בהצלחה', type: 'success' });
    };

    const renderView = (item) => (
        <>
            <p><strong>{item.email}</strong> כתב:</p>
            <p>{item.body}</p>
        </>
    );

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <GenericItem
                item={comment}
                onDelete={handleDelete}
                onUpdate={(id, data) => handleUpdate(id, { body: data.body })}
                canEdit={isOwner}
                renderView={renderView}
                editableFields={['body']}
            />
        </>
    );
}

export default CommentItem;