import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useApi from "../useApi";
import GenericList from './GenericList';
import DynamicForm from './DynamicForm';

function AlbumsList() {
    const { userId } = useParams();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { data: albums, error, getItems, deleteItem, updateItem, addItem } = useApi("albums");

    useEffect(() => {
        getItems({ userId });
    }, [userId, getItems]);

    const handleCreateAlbum = async (formData) => {
        await addItem({
            title: formData.title,
            userId: parseInt(userId)
        });
        setShowCreateForm(false);
    };

    const handleUpdate = async (id, data) => {
        return await updateItem(id, data);
    };

    const handleDelete = async (id) => {
        return await deleteItem(id);
    };

    const renderAlbumView = (item, defaultRender) => (
        <>
            <Link to={`/home/users/${userId}/albums/${item.id}/photos`} state={{ album: item }}>
                <div>
                    <p>id: {item.id}</p>
                    <p>{item.title}</p>
                </div>
            </Link>
        </>
    );

    const searchOptions = [
        { value: 'id', label: 'חיפוש לפי ID' },
        { value: 'title', label: 'חיפוש לפי כותרת' }
    ];

    const createFields = [
        { name: 'title', placeholder: 'Album Title', type: 'text' }
    ];

    return (
        <GenericList
            title="Albums"
            items={albums}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAddClick={() => setShowCreateForm(!showCreateForm)}
            searchOptions={searchOptions}
            useGenericItem={true}
            itemName="אלבום"
            renderView={renderAlbumView}
        >
            {showCreateForm && (
                <div className="card">
                    <DynamicForm
                        fields={createFields}
                        onSubmit={handleCreateAlbum}
                        submitButtonText="Create Album"
                    />
                </div>
            )}
        </GenericList>
    )
}
export default AlbumsList;