import GenericItem from './GenericItem';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';
import { useState } from 'react';

function TodoItem({ todo, onDelete, onUpdate }) {
    const renderView = (item, defaultRender) => (
        <>
            <p>ID: {item.id}</p>
            {defaultRender(item)}
            <label>
                <input type="checkbox" checked={item.completed||false} disabled />
                {item.completed ? 'completed' : 'not completed'}
            </label>
        </>
    );

    const renderEdit = (editData, setEditData, defaultRender) => (
        <>
            {defaultRender(editData, setEditData)}
            <label>
                <input
                    type="checkbox"
                    checked={editData.completed||false}
                    onChange={(e) => setEditData({ ...editData, completed: e.target.checked })}
                />
                {editData.completed ? 'completed' : 'not completed'}
            </label>
        </>
    );

    return (
        <>
            <GenericItem
            item={todo}
            onDelete={onDelete}
            onUpdate={onUpdate}
            renderView={renderView}
            renderEdit={renderEdit}
            editableFields={['title']}
            deleteSuccessMsg="משימה נמחקה בהצלחה"
            updateSuccessMsg="משימה עודכנה בהצלחה"
        />
        </>
    );
}

export default TodoItem;