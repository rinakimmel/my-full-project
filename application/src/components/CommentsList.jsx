// import { useEffect,useState } from 'react';
// import useApi from '../useApi'
// import CommentItem from './CommentItem';
// function CommentsList({ postId, currentUserEmail = "user@example.com" }) {
//     const { data: comments, getItems, deleteItem, updateItem ,addItem} = useApi("comments");
//     const [newCommentForm, setNewCommentForm] = useState(false);    
//     useEffect(() => {
//         const params = {
//             postId: postId,
//         };
//         console.log('Fetching comments for postId:', postId);
//         getItems(params);
//     }, [postId, getItems]);

//     return (
//         <div>
//             <h3>Comments:</h3>
//             <button onClick={() => setNewCommentForm(!newCommentForm)}>add comment</button>
//             {newCommentForm && (
//                 <div>
//                     <textarea placeholder='Comment body'></textarea>
//                     <button onClick={addItem({name, email: currentUserEmail, postId:postId, body})}>Submit Comment</button>
//                 </div>
//             )}
//             {comments && comments.length > 0 ? (
//                 comments.map(comment => (
//                     <CommentItem 
//                         key={comment.id} 
//                         comment={comment} 
//                         onDelete={deleteItem}
//                         onUpdate={updateItem}
//                         currentUserEmail={currentUserEmail}
//                     />
//                 ))
//             ) : (
//                 <p>No comments found</p>
//             )}
//         </div>
//     );
// }
// export default CommentsList;

import { useEffect, useState } from 'react';
import useApi from '../useApi';
import CommentItem from './CommentItem';

function CommentsList({ postId, currentUserEmail = "user@example.com" }) {
    const { data: comments, getItems, deleteItem, updateItem, addItem } = useApi("comments");
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCommentBody, setNewCommentBody] = useState("");

    useEffect(() => {
        console.log('Fetching comments for postId:', postId);
        getItems({ postId: parseInt(postId) });
    }, [postId, getItems]);

    const handleAddComment = () => {
        if (!newCommentBody) return;
        
        const newComment = {
            name: "My Comment",
            email: currentUserEmail,
            postId: parseInt(postId),
            body: newCommentBody
        };
        
        addItem(newComment);
        setNewCommentBody(""); // ניקוי שדה
        setShowAddForm(false); // סגירת הטופס
    };

    return (
        <div>
            <h4>תגובות:</h4>
            <button onClick={() => setShowAddForm(!showAddForm)}>הוסף תגובה חדשה</button>
            
            {showAddForm && (
                <div>
                    <textarea 
                        placeholder='תוכן התגובה...' 
                        value={newCommentBody}
                        onChange={(e) => setNewCommentBody(e.target.value)}
                    />
                    <br />
                    <button onClick={handleAddComment}>שלח תגובה</button>
                </div>
            )}

            {comments && comments.length > 0 ? (
                comments.map(comment => (
                    <CommentItem 
                        key={comment.id} 
                        comment={comment} 
                        onDelete={deleteItem}
                        onUpdate={updateItem}
                        currentUserEmail={currentUserEmail}
                    />
                ))
            ) : (
                <p>אין תגובות לפוסט זה</p>
            )}
        </div>
    );
}

export default CommentsList;