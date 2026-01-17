import { useState } from "react";
import { Link, useLocation, useParams, Outlet, useNavigate } from "react-router-dom";
import GenericItem from "./GenericItem";
import useApi from "../useApi";
import Notification from './Notification';
import { useAuth } from './AuthContext';

function ActivePost() {

    const { userId, postId } = useParams();
    const { error, deleteItem, updateItem } = useApi("posts");
    const location = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { post: initialPost, currentUserEmail } = location.state || {};
    const [post, setPost] = useState(initialPost);
    const isPostOwner = post && user && parseInt(post.userId) === parseInt(user.id);
    const [notification, setNotification] = useState(null);

    const handleDelete = async (id) => {
        await deleteItem(id);
      //  setNotification({ message: 'פוסט נמחק בהצלחה', type: 'success' });
        navigate(`/home/users/${userId}/posts`);
    };

    const handleUpdate = async (id, data) => {
        return await updateItem(id, data);
        setPost({ ...post, ...data });
    };

    return (
        <div className="container">
            <Link to={`/home/users/${userId}/posts`}>← חזרה לרשימת הפוסטים</Link>
            <GenericItem
                item={post}
                error={error}
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
            <div style={{ marginTop: '1rem' }}>
                {location.pathname.endsWith('/comments') ? (
                    <Link to={`/home/users/${userId}/posts/${postId}`}
                        state={{ post, isPostOwner, currentUserEmail }}>
                        <button>🚫 הסתר תגובות</button>
                    </Link>
                ) : (
                    <Link to="comments"
                        state={{ post, isPostOwner, currentUserEmail }}>
                        <button>💬 הצג תגובות</button>
                    </Link>
                )}
            </div>
            <Outlet context={{ postId, currentUserEmail }} />
        </div>
    )
}
export default ActivePost;