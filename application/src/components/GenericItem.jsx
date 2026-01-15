import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';

function GenericItem({ 
    item, 
    onDelete, 
    onUpdate, 
    renderView, 
    renderEdit, 
    canEdit = true,
    editableFields = ['title']
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(item);
    const [showConfirm, setShowConfirm] = useState(false);
    const [notification, setNotification] = useState(null);
    const handleDelete = () => {
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        onDelete(item.id);
        setShowConfirm(false);
    };

    const handleSave = () => {
        onUpdate(editData.id, editData);
        setIsEditing(false);
        setNotification({ message: 'נשמר בהצלחה', type: 'success' });
    };

    const handleCancel = () => {
        setEditData(item);
        setIsEditing(false);
    };

    const defaultRenderView = (item) => (
        <div>
            {editableFields.map(field => (
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
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
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