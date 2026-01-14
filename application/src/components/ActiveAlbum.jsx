import GenericItem from "./GenericItem";
import useApi from "../useApi";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import PhotosList from "./PhotosList";
function ActiveAlbum() {
    const { album: album } = location.state || {};
    const { deleteItem, updateItem } = useApi("albums")

    const { userId } = useParams();

    // const renderView = (item) => (
    //     <>
    //         <div>ID: {item.id}</div>
    //         <Link to={`/home/users/${userId}/albums/${item.id}`}>
    //             <strong>{item.title}</strong>
    //         </Link>
    //     </>
    // );
    const renderView = () => (
        <>

        </>
    );
    const renderEdit = (editData, setEditData) => (
        <input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        />
    );
    return (
        <>

            <div style={{
                border: '1px solid black',
                margin: '10px',
                padding: '10px',
            }}>
                <Link to={`/home/users/${userId}/albums`}>← Back to Albums</Link>
                <GenericItem
                    item={album}
                    onDelete={deleteItem}
                    onUpdate={(id, data) => updateItem(id, { title: data.title })}
                    //canEdit={isOwner}
                    renderView={renderView}
                    renderEdit={renderEdit}
                />
                <PhotosList />
            </div>

        </>
    )

}
export default ActiveAlbum;