import GenericItem from './GenericItem';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';
import { useState } from 'react';

function TodoItem({ todo,error, onDelete, onUpdate }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleDelete = (id) => {
       
       // setShowConfirm(true);
    };

    const confirmDelete = async () => {
        const result = await onDelete(todo.id);
        // setShowConfirm(false);
        // if (result?.success) {
        //     setNotification({ message: 'משימה נמחקה בהצלחה', type: 'success' });
        // } else {
        //     setNotification({ message: 'שגיאה במחיקת המשימה', type: 'error' });
        // }
    };
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
            {/* {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />} */}
            {/* {showConfirm && (
                <ConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )} */}
            <GenericItem
                item={todo}
                error={error}
                //onDelete={handleDelete}
                onDelete={onDelete}
                onUpdate={onUpdate}
                renderView={renderView}
                renderEdit={renderEdit}
                editableFields={['title']}
            />
        </>
    );
}

export default TodoItem;