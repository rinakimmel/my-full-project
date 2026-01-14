import GenericItem from './GenericItem';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';
import { useState } from 'react';

function TodoItem({ todo, onDelete, onUpdate }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleDelete = (id) => {
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        onDelete(todo.id);
        setShowConfirm(false);
        setNotification({ message: 'משימה נמחקה בהצלחה', type: 'success' });
    };
    const renderView = (item, defaultRender) => (
        <>
            {defaultRender(item)}
            <label>
                <input type="checkbox" checked={item.completed} readOnly />
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
                    checked={editData.completed}
                    onChange={(e) => setEditData({ ...editData, completed: e.target.checked })}
                />
                completed
            </label>
        </>
    );

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            {showConfirm && (
                <ConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            <GenericItem
                item={todo}
                onDelete={handleDelete}
                onUpdate={onUpdate}
                renderView={renderView}
                renderEdit={renderEdit}
                editableFields={['title']}
            />
        </>
    );
}

export default TodoItem;