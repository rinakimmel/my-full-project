/**
 * AlbumItem
 * Macro: הצגה ועריכה של פריט אלבום יחיד באמצעות GenericItem.
 * Props:
 *  - album: אובייקט אלבום
 *  - deleteItem(id): מחיקת פריט
 *  - updateItem(id,data): עדכון פריט
 *  - isOwner: האם המשתמש הנוכחי בעל האלבום
 */
import { Link, useParams } from 'react-router-dom';
import GenericItem from './GenericItem';

function AlbumItem({ album, deleteItem, updateItem, isOwner }) {
    const { userId } = useParams();

    const renderView = (item) => (
        <>
            <div>ID: {item.id}</div>
            <Link to={`/home/users/${userId}/albums/${item.id}`}>
                <strong>{item.title}</strong>
            </Link>
        </>
    );

    const renderEdit = (editData, setEditData) => (
        <input 
            value={editData.title} 
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        />
    );

    return (
        <div style={{
                border: '1px solid black',
                margin: '10px',
                padding: '10px',
            }}>
            <GenericItem
                item={album}
                onDelete={deleteItem}
                onUpdate={(id, data) => updateItem(id, { title: data.title })}
                canEdit={isOwner}
                renderView={renderView}
                renderEdit={renderEdit}
            />
        </div>
    );
}

export default AlbumItem;