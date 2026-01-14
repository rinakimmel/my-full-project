/**
 * GenericItem
 * Macro: מעטפת לשימוש חוזר שמנהלת מצב עריכה מקומי של פריט וביצוע שמירה/ביטול/מחיקה.
 * Props:
 *  - item: האובייקט שמוצג/נערך (מכיל id)
 *  - onDelete(id), onUpdate(id,data)
 *  - renderView(item): פונקציית רינדור לתצוגה
 *  - renderEdit(editData,setEditData): פונקציית רינדור לעריכה
 *  - canEdit: האם להראות כפתורי עריכה/מחיקה
 * State:
 *  - isEditing, editData (עותק מקומי של item)
 */
import { useState } from 'react';

function GenericItem({ 
    item, 
    onDelete, 
    onUpdate, 
    renderView, 
    renderEdit, 
    canEdit = true 
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(item);

    const handleSave = () => {
        onUpdate(editData.id, editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(item);
        setIsEditing(false);
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    {renderEdit(editData, setEditData)}
                    <button onClick={handleSave}>שמור</button>
                    <button onClick={handleCancel}>ביטול</button>
                </div>
            ) : (
                <div>
                    {renderView(item)}
                    {canEdit && (
                        <div>
                            <button onClick={() => setIsEditing(true)}>ערוך</button>
                            <button onClick={() => onDelete(item.id)}>מחק</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default GenericItem;
