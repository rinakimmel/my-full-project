import { useState } from "react";
import GenericItem from './GenericItem';
import CommentsList from "./CommentsList";

function PostItem({ post, isPostOwner, deletePost, updatePost, currentUserEmail }) {
    const [showContent, setShowContent] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const handleSelection = () => {
        setShowContent(prev => {
            const newValue = !prev;
            if (!newValue) setShowComments(false);
            return newValue;
        });
    };

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
        <div>
            <p>ID: {post.id}</p>
            <h3>{post.title}</h3>
            
            <button onClick={handleSelection}>
                {showContent ? 'הסתר פרטים' : 'הצג פרטים'}
            </button>

            {showContent && (
                <>
                    <p>{post.body}</p>
                    
                    <GenericItem
                        item={post}
                        onDelete={deletePost}
                        onUpdate={(id, data) => updatePost(id, { title: data.title, body: data.body })}
                        canEdit={isPostOwner}
                        renderView={() => null}
                        renderEdit={renderEdit}
                    />
                    
                    <button onClick={() => setShowComments(prev => !prev)}>
                        {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
                    </button>

                    {showComments && (
                        <div>
                            <CommentsList postId={post.id} currentUserEmail={currentUserEmail} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default PostItem;