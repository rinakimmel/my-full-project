import { useEffect, useState } from "react";
import AlbumItem from "./AlbumItem";
import { useParams } from "react-router-dom";
import useApi from "../useApi";

function AlbumsList(){
    const { userId } = useParams();
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const { data: albums, getItems, deleteItem, updateItem, addItem } = useApi("albums");

    useEffect(() => {
        const params = { userId: userId };

        if (searchBy && searchValue) {
            params[searchBy] = searchValue;
        }
        getItems(params);
    }, [userId, searchBy, searchValue, getItems]);

    const handleCreateAlbum = async () => {
        if (newAlbumTitle.trim()) {
            await addItem({
                title: newAlbumTitle,
                userId: parseInt(userId)
            });
            setNewAlbumTitle('');
            setShowCreateForm(false);
        }
    };

    return (
        <div>
            <h2>Albums</h2>
            
            <button onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Cancel' : 'Create New Album'}
            </button>

            {showCreateForm && (
                <div>
                    <input
                        type="text"
                        value={newAlbumTitle}
                        onChange={(e) => setNewAlbumTitle(e.target.value)}
                        placeholder="Album Title"
                    />
                    <button onClick={handleCreateAlbum}>Create Album</button>
                </div>
            )}

            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="">בחר קריטריון חיפוש</option>
                <option value="id">חיפוש לפי ID</option>
                <option value="title">חיפוש לפי כותרת</option>
            </select>

            {searchBy && (
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="הכנס ערך לחיפוש"
                />
            )}

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