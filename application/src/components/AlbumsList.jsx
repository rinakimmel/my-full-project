import { useEffect, useState } from "react";
import AlbumItem from "./AlbumItem";
import { useParams,Link } from "react-router-dom";
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
                    <Link
                        key={album.id}
                        to={`/home/users/${userId}/albums/${album.id}/photos`}
                        state={album}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div style={{
                            border: '1px solid black',
                            margin: '10px',
                            padding: '10px',
                            cursor: 'pointer'
                        }}>
                            <p>id: {album.id}</p>
                            <p>{album.title}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
export default AlbumsList;