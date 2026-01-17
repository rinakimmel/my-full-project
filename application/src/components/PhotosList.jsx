import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useApi from '../useApi';
import GenericList from './GenericList';
import DynamicForm from './DynamicForm';

function PhotosList() {
    const { albumId } = useParams();
    const location = useLocation();
    const { album } = location.state || {};
    
    const [showAddForm, setShowAddForm] = useState(false);
    const { data: photos, error, getItems, deleteItem, updateItem, addItem } = useApi("photos");

    useEffect(() => {
        getItems({ albumId });
    }, [albumId, getItems]);

    const handleAddPhoto = async (formData) => {
        await addItem({ ...formData, albumId: parseInt(albumId) });
        setShowAddForm(false);
    };

    const handleDelete = async (id) => {
        return await deleteItem(id);
    };

    const handleUpdate = async (id, data) => {
        return await updateItem(id, data);
    };

    return (
        <GenericList
            title={`Album: ${album?.title || 'Loading...'}`}
            items={photos}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAddClick={() => setShowAddForm(!showAddForm)}
            itemsPerPage={6}
            useGrid={true}
            useGenericItem={true}
            itemName="תמונה"
        >
            {showAddForm && (
                <div className="card">
                    <DynamicForm 
                        fields={[
                            { name: 'title', placeholder: 'Photo Title', type: 'text' },
                            { name: 'url', placeholder: 'Photo URL', type: 'url' }
                        ]}
                        onSubmit={handleAddPhoto}
                        submitButtonText="Add Photo"
                    />
                </div>
            )}
        </GenericList>
    );
}
export default PhotosList;