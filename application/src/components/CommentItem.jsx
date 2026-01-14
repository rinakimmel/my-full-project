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

/**
 * CommentItem
 * Macro: מציג תגובה בודדת; מאפשר עריכה/מחיקה אם המייל של הכותב תואם ל־currentUserEmail.
 * Props:
 *  - comment: { id, name, email, body }
 *  - onDelete(id), onUpdate(id,data)
 *  - currentUserEmail: מייל של המשתמש הנוכחי לבדיקת בעלות
 */
import GenericItem from './GenericItem';

function CommentItem({ comment, onDelete, onUpdate, currentUserEmail }) {
    const isOwner = comment.email === currentUserEmail;

    const renderView = (item) => (
        <>
            <p><strong>{item.email}</strong> כתב:</p>
            <p>{item.body}</p>
        </>
    );

    const renderEdit = (editData, setEditData) => (
        <textarea 
            value={editData.body}
            onChange={(e) => setEditData({ ...editData, body: e.target.value })}
        />
    );

    return (
        <GenericItem
            item={comment}
            onDelete={onDelete}
            onUpdate={(id, data) => onUpdate(id, { body: data.body })}
            canEdit={isOwner}
            renderView={renderView}
            renderEdit={renderEdit}
        />
    );
}

export default CommentItem;