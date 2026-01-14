/**
 * ActivePost
 * Macro: מציג פוסט פעיל, מאפשר עריכה ומעבר לתגובות.
 * Props / Inputs:
 *  - location.state: { post, isPostOwner, currentUserEmail }
 * State:
 *  - post: העתק של הפוסט שמוצג/נערך
 *  - showContent: בקרה להצגה/הסתרה של תוכן (unused in current view)
 *  - editingPost: פרטי עריכה זמניים
 * Notes:
 *  - מסתמך על `location.state` — אם אין state יש לדאוג לטעון פוסט חיצוני.
 */
import { useState } from "react";
import { Link, useLocation, useParams, Outlet } from "react-router-dom";
import CommentsList from "./CommentsList";
import GenericItem from "./GenericItem";
import useApi from "../useApi";
function ActivePost() {
    const { userId, postId } = useParams();
    const { deletePost, updateItem } = useApi("posts");
    const location = useLocation();
    //const { post, isPostOwner, currentUserEmail } = location.state || {};
    const { post: initialPost, isPostOwner, currentUserEmail } = location.state || {};
    const [post, setPost] = useState(initialPost);
    const [showContent, setShowContent] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const renderEdit = (editData, setEditData) => (
        <div>
            <h4>עריכת פוסט</h4>
            <input
                type='text'
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
            <textarea
                value={editData.body}
                onChange={(e) => setEditData({ ...editData, body: e.target.value })}
            />
        </div>
    );

    return (
        <>
            <>
                {/* {isPostOwner && (<>
                <button onClick={() => deletePost(post.id)}>מחק פוסט</button>
                < button onClick={() => setEditingPost(post)}>ערוך פוסט</button ></>)}
            {
                } */}
            </>
            {isPostOwner && <GenericItem
                item={post}
                onDelete={deletePost}
                //onUpdate={(id, data) => updateItem(id, { title: data.title, body: data.body })}
                onUpdate={async (id, data) => {
                    await updateItem(id, data);
                    setPost({ ...post, ...data });
                }}
                canEdit={isPostOwner}
                // renderView={() => null}
                renderView={(item) => (
                    <div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                    </div>
                )}
                renderEdit={renderEdit}
            />}

            {editingPost && (
                <div style={{ marginTop: '10px', borderTop: '1px dashed grey' }}>
                    <h4>עריכת פוסט</h4>
                    <input
                        type='text'
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    />
                    <textarea
                        value={editingPost.body}
                        onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                    />
                </div>
            )}

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
            <Outlet />
        </>
    )
}
export default ActivePost;