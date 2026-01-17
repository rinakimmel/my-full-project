import { useState, useEffect } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { useNotification } from './NotificationContext';

function GenericItem({
    item,
    onDelete,
    onUpdate,
    renderView,
    renderEdit,
    canEdit = item.canEdit !== undefined ? item.canEdit : true,
    editableFields = ['title'],
    displayFields = ['title'],
    itemName = 'פריט'
}) {
    const { showNotification } = useNotification();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(item);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setEditData(item);
    }, [item]);

    const confirmDelete = async () => {
        const result = await onDelete(item.id);
        setShowConfirm(false);
        if (result?.success) {
            showNotification(`${itemName} נמחק בהצלחה`, 'success');
        } else {
            showNotification(result?.error || `שגיאה במחיקת ${itemName}`, 'error');
        }
    }

    const handleDelete = () => {
        setShowConfirm(true);
    };

    const handleSave = async () => {
        const result = await onUpdate(editData.id, editData);
        setIsEditing(false);
        if (result?.success) {
            showNotification(`${itemName} עודכן בהצלחה`, 'success');
        } else {
            showNotification(result?.error || `שגיאה בעדכון ${itemName}`, 'error');
        }
    };

    const handleCancel = () => {
        setEditData(item);
        setIsEditing(false);
    };

    const defaultRenderView = (item) => (
        <div>
            {displayFields.map(field => (
                <div key={field}>
                    <strong>{field}:</strong> {item[field]}
                </div>
            ))}
        </div>
    );

    const defaultRenderEdit = (editData, setEditData) => (
        <div>
            {editableFields.map(field => (
                <input
                    key={field}
                    placeholder={field}
                    value={editData[field] || ''}
                    onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                />
            ))}
        </div>
    );

    const finalRenderView = renderView || defaultRenderView;
    const finalRenderEdit = renderEdit || defaultRenderEdit;

    return (
        <div className="card">
            {showConfirm && (
                <ConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            {isEditing ? (
                <div>
                    {renderEdit ? renderEdit(editData, setEditData, defaultRenderEdit) : finalRenderEdit(editData, setEditData)}
                    <div className="form-actions">
                        <button onClick={handleSave} className="primary">💾 שמור</button>
                        <button onClick={handleCancel}>❌ ביטול</button>
                    </div>
                </div>
            ) : (
                <div>
                    {renderView ? renderView(item, defaultRenderView) : finalRenderView(item)}
                    {canEdit && (
                        <div className="form-actions">
                            <button onClick={() => setIsEditing(true)}>✏️ ערוך</button>
                            <button onClick={handleDelete}>🗑️ מחק</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}

export default GenericItem;