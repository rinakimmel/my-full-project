import { useState } from 'react';
import GenericItem from './GenericItem';

function CommentItem({ comment, error, onDelete, onUpdate, currentUserEmail }) {
    const isOwner = comment.email === currentUserEmail;

    // const handleDelete = async (id) => {
    //     await onDelete(id);

    //     // setNotification({ message: 'תגובה נמחקה בהצלחה', type: 'success' });
    // };

    //const handleUpdate = async (id, data) => {
    //     const result = await onUpdate(id, data);
    //     return result;
    //     // await onUpdate(id, data);
    //     // setNotification({ message: 'תגובה עודכנה בהצלחה', type: 'success' });
    // };

    const renderView = (item) => (
        <>
            <p><strong>{item.email}</strong> כתב:</p>
            <p>{item.body}</p>
        </>
    );


    // (
    //  <>
    /* {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <GenericItem
                item={comment}
                error={error}
                onDelete={handleDelete}
                onUpdate={(id, data) => handleUpdate(id, { body: data.body })}
                canEdit={isOwner}
                renderView={renderView}
                editableFields={['body']}
            />
        </> */

    return (
    <GenericItem
        item={comment}
        onDelete={onDelete}
        onUpdate={(id, data) => onUpdate(id, { body: data.body })}
        canEdit={isOwner}
        renderView={renderView}
        editableFields={['body']}
        deleteSuccessMsg="תגובה נמחקה בהצלחה"
        updateSuccessMsg="תגובה עודכנה בהצלחה"
    />
    );
}

export default CommentItem;