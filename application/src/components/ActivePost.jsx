import { useState } from "react";
import { Link, useLocation, useParams, Outlet } from "react-router-dom";
import GenericItem from "./GenericItem";
import useApi from "../useApi";
import Notification from './Notification';

function ActivePost() {
    const { userId, postId } = useParams();
    const { deletePost, updateItem } = useApi("posts");
    const location = useLocation();
 const { post: initialPost, isPostOwner, currentUserEmail } = location.state || {};
    const [post, setPost] = useState(initialPost);
    const [notification, setNotification] = useState(null);

    const handleDelete = async (id) => {
        await deletePost(id);
        setNotification({ message: 'פוסט נמחק בהצלחה', type: 'success' });
    };

    const handleUpdate = async (id, data) => {
        await updateItem(id, data);
        setPost({ ...post, ...data });
        setNotification({ message: 'פוסט עודכן בהצלחה', type: 'success' });
    };

    return (
        <>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <Link to={`/home/users/${userId}/posts`}>← חזרה לרשימת הפוסטים</Link>
            <GenericItem
                item={post}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                canEdit={isPostOwner}
                editableFields={['title', 'body']}
                deleteMessage="האם אתה בטוח שברצונך למחוק פוסט זה?"
                renderView={(item) => (
                    <div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                    </div>
                )}
            />

            {location.pathname.endsWith('/comments') ? (
                <Link to={`/home/users/${userId}/posts/${postId}`}
                    state={{ post, isPostOwner, currentUserEmail }}>
                    <button>הסתר תגובות</button>
                </Link>
            ) : (
                <Link to="comments"
                    state={{ post, isPostOwner, currentUserEmail }}>
                    <button>הצג תגובות</button>
                </Link>
            )}
            <Outlet context={{ postId, currentUserEmail }} />
        </>
    )
}
export default ActivePost;