import { useEffect, useState } from 'react';
import useApi from '../useApi';
import GenericList from './GenericList';
import DynamicForm from './DynamicForm';
import { useLocation, useParams, useOutletContext } from 'react-router-dom';
import { useAuth } from './AuthContext';

function CommentsList({ postId: propPostId }) {
    const { data: comments, error, getItems, deleteItem, updateItem, addItem } = useApi("comments");
    const { user } = useAuth();
    const params = useParams();
    const outletContext = useOutletContext() || {};
    const [showAddForm, setShowAddForm] = useState(false);

    const postId = propPostId || outletContext.postId || params.postId;

    useEffect(() => {
        if (postId) {
            getItems({ postId: parseInt(postId) });
        }
    }, [postId, getItems]);

    const handleAddComment = async (formData) => {
        if (!user?.email) {
            return;
        }
        await addItem({
            name: user.name || 'Anonymous',
            email: user.email,
            postId: parseInt(postId),
            body: formData.body
        });
        setShowAddForm(false);
    };

    return (
        <GenericList
            title="תגובות"
            items={comments.map(comment => ({
                ...comment,
                canEdit: comment.email === user?.email
            }))}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onAddClick={() => setShowAddForm(!showAddForm)}
            useGenericItem={true}
            itemName="תגובה"
        >
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
        </GenericList>
    );
}

export default CommentsList;