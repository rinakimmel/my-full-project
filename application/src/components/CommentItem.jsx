import { useState } from 'react';
import GenericItem from './GenericItem';

function CommentItem({ comment, onDelete, onUpdate, currentUserEmail }) {
    const isOwner = comment.email === currentUserEmail;

    const handleDelete = async (id) => {
        await onDelete(id);
    };

    const handleUpdate = async (id, data) => {
        await onUpdate(id, data);
    };

    const renderView = (item) => (
        <>
            <p><strong>{item.email}</strong> כתב:</p>
            <p>{item.body}</p>
        </>
    );

    return (
        <GenericItem
            item={comment}
            onDelete={handleDelete}
            onUpdate={(id, data) => handleUpdate(id, { body: data.body })}
            canEdit={isOwner}
            renderView={renderView}
            editableFields={['body']}
        />
    );
}

export default CommentItem;