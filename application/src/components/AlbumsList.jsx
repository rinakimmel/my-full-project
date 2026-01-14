import { useEffect, useState } from "react";
import AlbumItem from "./AlbumItem";
import { useParams } from "react-router-dom";
import useApi from "../useApi";
import SearchFilter from './SearchFilter';
import DynamicForm from './DynamicForm';

function AlbumsList(){
    const { userId } = useParams();
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { data: albums, getItems, deleteItem, updateItem, addItem } = useApi("albums");

    useEffect(() => {
        const params = { userId: userId };

        if (searchBy && searchValue) {
            params[searchBy] = searchValue;
        }
        getItems(params);
    }, [userId, searchBy, searchValue, getItems]);

    const handleCreateAlbum = async (formData) => {
        await addItem({
            title: formData.title,
            userId: parseInt(userId)
        });
        setShowCreateForm(false);
    };

    const searchOptions = [
        { value: 'id', label: 'חיפוש לפי ID' },
        { value: 'title', label: 'חיפוש לפי כותרת' }
    ];

    const createFields = [
        { name: 'title', placeholder: 'Album Title', type: 'text' }
    ];

    return (
        <div>
            <h2>Albums</h2>
            
            <button onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Cancel' : 'Create New Album'}
            </button>

            {showCreateForm && (
                <DynamicForm 
                    fields={createFields}
                    onSubmit={handleCreateAlbum}
                    submitButtonText="Create Album"
                />
            )}

            <SearchFilter 
                searchOptions={searchOptions}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />

            <div className="albums-list">
                {albums.map(album => (
                    <AlbumItem 
                        key={album.id} 
                        album={album} 
                        deleteItem={deleteItem} 
                        updateItem={updateItem}
                        isOwner={album.userId === parseInt(userId)}
                    />
                ))}
            </div>
        </div>
    )
}
export default AlbumsList;