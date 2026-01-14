import { useState } from "react";
import { useLocation } from "react-router-dom";
import CommentsList from "./CommentsList";
function ActivePost() {
    const location = useLocation();
    const { post, isPostOwner,currentUserEmail } = location.state || {};
    const [showContent, setShowContent] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [showComments, setShowComments] = useState(false);

    const saveUpdate = () => {
        updatePost(editingPost.id, {
            title: editingPost.title,
            body: editingPost.body
        });
        setEditingPost(null);
    };
    return (
        <>
            {isPostOwner && (<>
                  <button onClick={() => deletePost(post.id)}>מחק פוסט</button>
                < button onClick={() => setEditingPost(post)}>ערוך פוסט</button ></>)}
            {/* תוכן הפוסט מוצג רק לאחר בחירה */}
            {
              
                    <>
                        <p>{post.body}</p>

                        {/* כפתור תגובות - זמין לכולם [cite: 66] */}
                        <button onClick={() => setShowComments(prev => !prev)}>
                            {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
                        </button>
                    </>
                
            }

            {/* טופס עריכת פוסט */}
            {
                editingPost && (
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
                        <button onClick={saveUpdate}>שמור שינויים</button>
                        <button onClick={() => setEditingPost(null)}>ביטול</button>
                    </div>
                )
            }

            {/* רשימת התגובות */}
            {
                showComments && (
                    <div style={{ marginTop: '20px', paddingRight: '20px' }}>
                        <CommentsList postId={post.id} currentUserEmail={currentUserEmail} />
                        {/* <Link to={`/home/users/${userId}posts/${post.id}`}>
                            <strong>{post.title}</strong></Link> */}
                    </div>
                )
            }

        </>
    )
}
export default ActivePost;