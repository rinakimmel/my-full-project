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
        <div>
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