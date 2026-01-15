import { useState } from 'react';
import GenericItem from './GenericItem';

<<<<<<< HEAD
function CommentItem({ comment, error, onDelete, onUpdate, currentUserEmail }) {
    const [notification, setNotification] = useState(null);
=======
function CommentItem({ comment, onDelete, onUpdate, currentUserEmail }) {
>>>>>>> e89ff6f6d0b91cdd16eb65ee0c8e73f8feeed502
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
<<<<<<< HEAD
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <GenericItem
                item={comment}
                error={error}
                onDelete={handleDelete}
                onUpdate={(id, data) => handleUpdate(id, { body: data.body })}
                canEdit={isOwner}
                renderView={renderView}
                editableFields={['body']}
            />
        </>
=======
        <GenericItem
            item={comment}
            onDelete={handleDelete}
            onUpdate={(id, data) => handleUpdate(id, { body: data.body })}
            canEdit={isOwner}
            renderView={renderView}
            editableFields={['body']}
        />
>>>>>>> e89ff6f6d0b91cdd16eb65ee0c8e73f8feeed502
    );
}

export default CommentItem;