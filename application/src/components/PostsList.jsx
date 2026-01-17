import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useApi from '../useApi';
import GenericList from './GenericList';
import DynamicForm from './DynamicForm';
import { useAuth } from './AuthContext';

function PostsList() {
    const { userId } = useParams();
    const { user } = useAuth();
    const [showMyPosts, setShowMyPosts] = useState(true);
    const [showAddPostForm, setShowAddPostForm] = useState(false);
    const { data: posts, error, getItems, deleteItem, updateItem, addItem } = useApi("posts");

    const handleAdd = async (data) => {
        await addItem({ ...data, userId: parseInt(userId) });
        setShowAddPostForm(false);
    };

    const handleDelete = async (id) => {
        return await deleteItem(id);
    };

    const handleUpdate = async (id, data) => {
        return await updateItem(id, data);
    };

    useEffect(() => {
        const params = {};
        if (showMyPosts) {
            params.userId = userId;
        } else {
            params.userId_ne = userId;
        }
        getItems(params);
    }, [showMyPosts, getItems]);

    const renderPostView = (item, defaultRender) => {
        const isPostOwner = item.userId === user?.id;
        return (
            <>
                <Link to={`/home/users/${userId}/posts/${item.id}`}
                    state={{ post: item, isPostOwner, currentUserEmail: user?.email }}>
                    <div>
                        <p>ID: {item.id}</p>
                        <strong>{item.title}</strong>
                    </div>
                </Link>
            </>
        );
    };

    const searchOptions = [
        { value: 'id', label: 'חיפוש לפי ID' },
        { value: 'title', label: 'חיפוש לפי כותרת' }
    ];

    return (
        <GenericList
            title="פוסטים"
            items={posts}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAddClick={() => setShowAddPostForm(!showAddPostForm)}
            searchOptions={searchOptions}
            useGenericItem={true}
            itemName="פוסט"
            renderView={renderPostView}
        >
            <button
                onClick={() => setShowMyPosts(true)}
                disabled={showMyPosts}
                className={showMyPosts ? 'primary' : ''}
            >
                הפוסטים שלי
            </button>
            <button
                onClick={() => setShowMyPosts(false)}
                disabled={!showMyPosts}
                className={!showMyPosts ? 'primary' : ''}
            >
                פוסטים של אחרים
            </button>
            {showAddPostForm && (
                <div className="card">
                    <DynamicForm
                        fields={[{ name: 'title', placeholder: 'post title', required: true }, { name: 'body', placeholder: 'post body', required: true }]}
                        onSubmit={handleAdd}
                    />
                </div>
            )}
        </GenericList>
    );
}

export default PostsList;