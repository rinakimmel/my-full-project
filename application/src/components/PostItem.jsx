import { useState } from "react";
import CommentsList from "./CommentsList";

function PostItem({ post, isPostOwner, deletePost, updatePost, currentUserEmail }) {
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

    const handleSelection = () => {
        // [cite: 65] בחירה והצגה באופן מודגש
        setShowContent(prev => {
            const newValue = !prev;
            if (!newValue) {
                setShowComments(false);
                setEditingPost(null);
            }
            return newValue;
        });
    };

    return (
        <div style={{ 
            border: '1px solid black', 
            margin: '10px', 
            padding: '10px',
            backgroundColor: showContent ? '#f0f0f0' : 'white' // הדגשה כשנבחר
        }}>
            <p>ID: {post.id}</p>
            <h3>{post.title}</h3>
            
            <button onClick={handleSelection}>
                {showContent ? 'הסתר פרטים' : 'הצג פרטים'}
            </button>

            {/* כפתורי מחיקה/עריכה רק לבעל הפוסט */}
            {isPostOwner && showContent && (
                <>
                    <button onClick={() => deletePost(post.id)}>מחק פוסט</button>
                    <button onClick={() => setEditingPost(post)}>ערוך פוסט</button>
                </>
            )}

            {/* תוכן הפוסט מוצג רק לאחר בחירה */}
            {showContent && (
                <>
                    <p>{post.body}</p>
                    
                    {/* כפתור תגובות - זמין לכולם [cite: 66] */}
                    <button onClick={() => setShowComments(prev => !prev)}>
                        {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
                    </button>
                </>
            )}

            {/* טופס עריכת פוסט */}
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
                    <button onClick={saveUpdate}>שמור שינויים</button>
                    <button onClick={() => setEditingPost(null)}>ביטול</button>
                </div>
            )}

            {/* רשימת התגובות */}
            {showComments && (
                <div style={{ marginTop: '20px', paddingRight: '20px' }}>
                    <CommentsList postId={post.id} currentUserEmail={currentUserEmail} />
                </div>
            )}
        </div>
    );
}

export default PostItem;