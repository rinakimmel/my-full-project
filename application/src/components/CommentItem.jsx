// import { useState } from 'react';

// function CommentItem({ comment, onDelete, onUpdate, currentUserEmail }) {

//     const [editingComment, setEditingComment] = useState(null);
//     const isOwner = comment.email === currentUserEmail;
    
//         const saveUpdate = () => {
//             onUpdate(editingComment.id, {
//                 body: editingComment.body
//             });
//             setEditingComment(null);
//         };
//          return (
//         <>
//             {editingComment && <div>
//                 <textarea placeholder='update body' value={editingComment.body}
//                     onChange={(e) => setEditingComment({ ...editingComment, body: e.target.value })}></textarea>
//                 <button onClick={saveUpdate}>save updating</button>
//             </div>}

//             <div key={comment.id}>
//                 <p>ID: {comment.id}</p>
//                 <p>Name: {comment.name}</p>
//                 <p>Email: {comment.email}</p>
//                 <p>Body: {comment.body}</p>
//                 {isOwner && onDelete && <button onClick={() => onDelete(comment.id)}>delete</button>}
//                 {isOwner && <button onClick={() => setEditingComment(comment)}>update comment</button>}
//             </div>
//         </>
//     )
// }
// export default CommentItem;

import { useState } from 'react';

function CommentItem({ comment, onDelete, onUpdate, currentUserEmail }) {
    const [editingComment, setEditingComment] = useState(null);
    
    // בדיקת בעלות על התגובה
    const isOwner = comment.email === currentUserEmail;

    const saveUpdate = () => {
        onUpdate(editingComment.id, {
            body: editingComment.body
        });
        setEditingComment(null);
    };

    return (
        <div >
            {editingComment ? (
                <div>
                    <textarea 
                        value={editingComment.body}
                        onChange={(e) => setEditingComment({ ...editingComment, body: e.target.value })}
                    />
                    <button onClick={saveUpdate}>שמור</button>
                    <button onClick={() => setEditingComment(null)}>ביטול</button>
                </div>
            ) : (
                <div>
                    <p><strong>{comment.email}</strong> כתב:</p>
                    <p>{comment.body}</p>
                    
                    {/* כפתורים רק לבעל התגובה  */}
                    {isOwner && (
                        <div>
                            <button onClick={() => onDelete(comment.id)}>מחק תגובה</button>
                            <button onClick={() => setEditingComment(comment)}>ערוך תגובה</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentItem;