{// import { useState } from "react";
// import CommentsList from "./CommentsList";
// import { Link, useParams } from "react-router-dom";

// function PostItem({ post, isPostOwner, deletePost, updatePost, currentUserEmail }) {
//     const { userId } = useParams();
//     const [showContent, setShowContent] = useState(false);
//     const [editingPost, setEditingPost] = useState(null);
//     const [showComments, setShowComments] = useState(false);

//     const saveUpdate = () => {
//         updatePost(editingPost.id, {
//             title: editingPost.title,
//             body: editingPost.body
//         });
//         setEditingPost(null);
//     };

//     const handleSelection = () => {
//         // [cite: 65] בחירה והצגה באופן מודגש
//         setShowContent(prev => {
//             const newValue = !prev;
//             if (!newValue) {
//                 setShowComments(false);
//                 setEditingPost(null);
//             }
//             return newValue;
//         });
//     };

//     return (
//         <div style={{
//             border: '1px solid black',
//             margin: '10px',
//             padding: '10px',
//             backgroundColor: showContent ? '#f0f0f0' : 'white' // הדגשה כשנבחר
//         }}>
//             <p>ID: {post.id}</p>
//             {/* <h3>{post.title}</h3> */}

//             {/* <button onClick={handleSelection}>
//                 {showContent ? 'הסתר פרטים' : 'הצג פרטים'}
//             </button> */}
//             <Link to={`/home/users/${userId}/posts/${post.id}`}>
//                 <strong onClick={handleSelection}>{post.title}</strong></Link>

//             {/* כפתורי מחיקה/עריכה רק לבעל הפוסט */}
//             {isPostOwner && (<button onClick={() => deletePost(post.id)}>מחק פוסט</button> )}

//             {isPostOwner && showContent && (             
//                     <button onClick={() => setEditingPost(post)}>ערוך פוסט</button>
//             )}
//             {/* תוכן הפוסט מוצג רק לאחר בחירה */}
//             {showContent && (
//                 <>
//                     <p>{post.body}</p>

//                     {/* כפתור תגובות - זמין לכולם [cite: 66] */}
//                     <button onClick={() => setShowComments(prev => !prev)}>
//                         {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
//                     </button>
//                 </>
//             )}

//             {/* טופס עריכת פוסט */}
//             {editingPost && (
//                 <div style={{ marginTop: '10px', borderTop: '1px dashed grey' }}>
//                     <h4>עריכת פוסט</h4>
//                     <input
//                         type='text'
//                         value={editingPost.title}
//                         onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
//                     />
//                     <textarea
//                         value={editingPost.body}
//                         onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
//                     />
//                     <button onClick={saveUpdate}>שמור שינויים</button>
//                     <button onClick={() => setEditingPost(null)}>ביטול</button>
//                 </div>
//             )}

//             {/* רשימת התגובות */}
//             {showComments && (
//                 <div style={{ marginTop: '20px', paddingRight: '20px' }}>
//                     {/* <CommentsList postId={post.id} currentUserEmail={currentUserEmail} /> */}
//                     <Link to={`/home/users/${userId}posts/${post.id}`}>
//                         <strong>{post.title}</strong></Link>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default PostItem;


// import { useState } from "react";
// import { Link, useParams } from "react-router-dom";

// function PostItem({ post, isPostOwner, deletePost, updatePost, currentUserEmail }) {
//     const { userId } = useParams();
//     return (
//         <>
//             <div style={{
//                 border: '1px solid black',
//                 margin: '10px',
//                 padding: '10px',
//             }}>
//                 <p>ID: {post.id}</p>
//                 <Link to={`/home/users/${userId}/posts/${post.id}`}
//                     state={{ post, isPostOwner, currentUserEmail }}>
//                     <strong >{post.title}</strong></Link>


//                 {isPostOwner && (<>
//                     <button onClick={() => deletePost(post.id)}>מחק פוסט</button>
//                     <button onClick={() => setEditingTitle(post)}>ערוך כותרת פוסט</button></>
//                 )}
//             </div>
//         </>

//     );
// }

// export default PostItem;
}
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function PostItem({ post, isPostOwner, deletePost, updatePost, currentUserEmail }) {
    const { userId } = useParams();
    const [editingTitle, setEditingTitle] = useState(null);

    const saveTitle = () => {
        updatePost(editingTitle.id, {
            title: editingTitle.title,
            body: editingTitle.body
        })
        setEditingTitle(null)
    }
   { // import GenericItem from './GenericItem';
    // import CommentsList from "./CommentsList";

    // function PostItem({ post, isPostOwner, deletePost, updatePost, currentUserEmail }) {
    //     const [showContent, setShowContent] = useState(false);
    //     const [showComments, setShowComments] = useState(false);

    //     const handleSelection = () => {
    //         setShowContent(prev => {
    //             const newValue = !prev;
    //             if (!newValue) setShowComments(false);
    //             return newValue;
    //         });
    //         setEditingTitle(null);
    //     };

    //     const renderEdit = (editData, setEditData) => (
    //         <div>
    //             <h4>עריכת פוסט</h4>
    //             <input 
    //                 type='text' 
    //                 value={editData.title}
    //                 onChange={(e) => setEditData({ ...editData, title: e.target.value })}
    //             />
    //             <textarea 
    //                 value={editData.body}
    //                 onChange={(e) => setEditData({ ...editData, body: e.target.value })}
    //             />
    //         </div>
    //     );
    }
    return (
        <>
            <>
                <div style={{
                    border: '1px solid black',
                    margin: '10px',
                    padding: '10px',
                }}>
                    <p>ID: {post.id}</p>

                    {!editingTitle ? (<>
                        <Link to={`/home/users/${userId}/posts/${post.id}`}
                            state={{ post, isPostOwner, currentUserEmail }}>
                            <strong>{post.title}</strong>
                        </Link>
                        {isPostOwner && (
                            <>
                                <button onClick={() => setEditingTitle(post)}>ערוך כותרת</button>
                            </>
                        )}
                    </>) : (<>
                        <input
                            type='text'
                            value={editingTitle.title}
                            onChange={(e) => setEditingTitle({ ...editingTitle, title: e.target.value })}
                            style={{ width: '100%', marginTop: '10px' }}
                        />
                        <button onClick={saveTitle}>שמור</button>
                        <button onClick={() => setEditingTitle(null)}>ביטול</button>
                    </>
                    )}
                    {isPostOwner && (<button onClick={() => deletePost(post.id)}>מחק פוסט</button>
                    )}
                </div>
            </>
            <>
            {/* // <div style={{
            //         border: '1px solid black',
            //         margin: '10px',
            //         padding: '10px',
            //     }}>
            //     <p>ID: {post.id}</p>
            //     <h3>{post.title}</h3>

            //     <button onClick={handleSelection}>
            //         {showContent ? 'הסתר פרטים' : 'הצג פרטים'}
            //     </button>

            //     {showContent && (
            //         <>
            //             <p>{post.body}</p>

            //             <GenericItem
            //                 item={post}
            //                 onDelete={deletePost}
            //                 onUpdate={(id, data) => updatePost(id, { title: data.title, body: data.body })}
            //                 canEdit={isPostOwner}
            //                 renderView={() => null}
            //                 renderEdit={renderEdit}
            //             />

            //             <button onClick={() => setShowComments(prev => !prev)}>
            //                 {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
            //             </button>

            //             {showComments && (
            //                 <div>
            //                     <CommentsList postId={post.id} currentUserEmail={currentUserEmail} />
            //                 </div>
            //             )}
            //         </>
            //     )}
            // </div> */}
            </>
        </>

    );
}

export default PostItem;
