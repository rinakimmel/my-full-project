import { useState, useEffect } from 'react';
import { useParams, Outlet, useLocation ,Link} from 'react-router-dom';
import useApi from '../useApi';
import PostItem from './PostItem';
import SearchFilter from './SearchFilter';
import DynamicForm from './DynamicForm';

function Posts() {
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem(userId) || '{}');
    const currentUserEmail = currentUser.email;
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showMyPosts, setShowMyPosts] = useState(true);

    const { data: posts, getItems, deleteItem, updateItem, addItem } = useApi("posts");
    const [showAddPostForm, setShowAddPostForm] = useState(false);
    useEffect(() => {
        const params = {};

        if (showMyPosts) {
            params.userId = userId;
        } else {
            params.userId_ne = userId;
        }

        if (searchBy && searchValue) {
            params[searchBy] = searchValue;
        }

        getItems(params);
    }, [showMyPosts, searchBy, searchValue, getItems]);

    const searchOptions = [
        { value: 'id', label: 'חיפוש לפי ID' },
        { value: 'title', label: 'חיפוש לפי כותרת' }
    ];

    return (
        <div>
            <h2>פוסטים</h2>

            <div>
                <button
                    onClick={() => setShowMyPosts(true)}
                    disabled={showMyPosts}
                >
                    הפוסטים שלי
                </button>
                <button
                    onClick={() => setShowMyPosts(false)}
                    disabled={!showMyPosts}
                >
                    פוסטים של אחרים
                </button>
            </div>

            <SearchFilter
                searchOptions={searchOptions}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />

            <div>
                <button onClick={() => setShowAddPostForm(prev => !prev)}>
                    {showAddPostForm ? 'Cancel' : 'Add Post'}
                </button>

                {showAddPostForm && (
                    <DynamicForm
                        fields={[
                            { name: 'title', placeholder: 'Title', type: 'text', required: true },
                            { name: 'body', placeholder: 'Body', type: 'text', required: true }
                        ]}
                        onSubmit={async (formData) => {
                            await addItem({ ...formData, userId: parseInt(userId) });
                            setShowAddPostForm(false);
                        }}
                        submitButtonText="Add Post"
                    />
                )}
            </div>

            {/* <div className="posts-list">
                {posts.map(post => (
                    <PostItem 
                        key={post.id} 
                        post={post} 
                        isPostOwner={post.userId === parseInt(userId)}
                        deletePost={deleteItem} 
                        updatePost={updateItem}
                        currentUserEmail={currentUserEmail}
                    />
                ))}
            </div> */}
            {/* <div className="posts-list">
                {posts.map(post => 
                    (
                    <>
                    <p>id: {post.id}</p>
                    <p>{post.body}</p>
                    </>
                ))}
            </div> */}
            <div className="posts-list">
                {posts.map(post => (
                    <Link
                        key={post.id}
                        to={`/home/users/${userId}/posts/${post.id}`}
                        state={{ post, isPostOwner: post.userId === parseInt(userId), currentUserEmail }}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div style={{
                            border: '1px solid black',
                            margin: '10px',
                            padding: '10px',
                            cursor: 'pointer'
                        }}>
                            <p>id: {post.id}</p>
                            <p>{post.body}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <Outlet />
        </div>
    );
}

export default Posts;