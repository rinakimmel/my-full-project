import { useState } from 'react';
import GenericItem from './GenericItem';

function CommentItem({ comment, error, onDelete, onUpdate, currentUserEmail }) {
    const isOwner = comment.email === currentUserEmail;
    const renderView = (item) => (
        <>
            <p><strong>{item.email}</strong> כתב:</p>
            <p>{item.body}</p>
        </>
    );
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