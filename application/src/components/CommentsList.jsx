import { useEffect, useState } from 'react';
import useApi from '../useApi';
import CommentItem from './CommentItem';
import DynamicForm from './DynamicForm';
import Notification from './Notification';
import { useLocation, useParams, useOutletContext } from 'react-router-dom';

function CommentsList({ postId: propPostId, currentUserEmail: propCurrentUserEmail }) {
    const { data: comments, getItems, deleteItem, updateItem, addItem } = useApi("comments");
    const location = useLocation();
    const params = useParams();
    const outletContext = useOutletContext() || {};
    const [showAddForm, setShowAddForm] = useState(false);
    const [notification, setNotification] = useState(null);

    const postId = propPostId || outletContext.postId || params.postId;
    const currentUserEmail = propCurrentUserEmail || outletContext.currentUserEmail;

    useEffect(() => {
        console.log('Fetching comments for postId:', postId);
        getItems({ postId: parseInt(postId) });
    }, [postId, getItems]);

    const storedUser = JSON.parse(localStorage.getItem(params.userId) || '{}');
    const effectiveEmail = currentUserEmail || location.state?.currentUserEmail || storedUser.email;

    const handleAddComment = (formData) => {
        if (!effectiveEmail) {
            setNotification({ message: 'אנא התחבר כדי לשלוח תגובה', type: 'error' });
            return;
        }
        addItem({
            name: storedUser.name || 'Anonymous',
            email: effectiveEmail,
            postId: parseInt(postId),
            body: formData.body
        });
        setShowAddForm(false);
        setNotification({ message: 'תגובה נוספה בהצלחה', type: 'success' });
    };

    return (
        <div>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <h4>תגובות:</h4>
            <button onClick={() => setShowAddForm(!showAddForm)}>הוסף תגובה חדשה</button>

            {showAddForm && (
                <div>
                    <DynamicForm
                        fields={[{ name: 'body', placeholder: 'תוכן התגובה...', type: 'text' }]}
                        onSubmit={handleAddComment}
                        submitButtonText="שלח תגובה"
                    />
                    {!effectiveEmail && <p>עליך להיכנס כדי לשלוח תגובות.</p>}
                </div>
            )}

            {comments && comments.length > 0 ? (
                comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onDelete={deleteItem}
                        onUpdate={updateItem}
                        currentUserEmail={effectiveEmail}
                    />
                ))
            ) : (
                <p>אין תגובות לפוסט זה</p>
            )}
        </div>
    );
}

export default CommentsList;