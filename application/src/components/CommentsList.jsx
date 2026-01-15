import { useEffect, useState } from 'react';
import useApi from '../useApi';
import CommentItem from './CommentItem';
import DynamicForm from './DynamicForm';
import Notification from './Notification';
import { useLocation, useParams, useOutletContext } from 'react-router-dom';
import { useAuth } from './AuthContext';

function CommentsList({ postId: propPostId }) {
    const { data: comments,error, getItems, deleteItem, updateItem, addItem } = useApi("comments");
    const { user } = useAuth();
    const params = useParams();
    const outletContext = useOutletContext() || {};
    const [showAddForm, setShowAddForm] = useState(false);
    const [notification, setNotification] = useState(null);

    const postId = propPostId || outletContext.postId || params.postId;

    useEffect(() => {
        if (postId) {
            getItems({ postId: parseInt(postId) });
        }
    }, [postId, getItems]);
    useEffect(() => {
        if (error) {
            setNotification({ message: 'שגיאה בטעינת הנתונים', type: 'error' });
        }
    }, [error])
    const handleAddComment = (formData) => {
        if (!user?.email) {
            setNotification({ message: 'אנא התחבר כדי לשלוח תגובה', type: 'error' });
            return;
        }
        addItem({
            name: user.name || 'Anonymous',
            email: user.email,
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
                    {!user && <p>עליך להיכנס כדי לשלוח תגובות.</p>}
                </div>
            )}

            {comments && comments.length > 0 ? (
                comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        error={error}
                        onDelete={deleteItem}
                        onUpdate={updateItem}

                        currentUserEmail={user?.email}
                    />
                ))
            ) : (
                <p>אין תגובות לפוסט זה</p>
            )}
        </div>
    );
}

export default CommentsList;