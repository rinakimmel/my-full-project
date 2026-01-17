import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useApi from '../useApi';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import DynamicForm from './DynamicForm';
import { useAuth } from './AuthContext';

function PostsList() {
    const { userId } = useParams();
    const { user } = useAuth();
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showMyPosts, setShowMyPosts] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [postsPerPage] = useState(10);
    const [showAddPostForm, setShowAddPostForm] = useState(false);
    const { data: posts, error, getItems, addItem } = useApi("posts");

    const handleAdd = async (data) => {
        const result = await addItem({ ...data, userId: parseInt(userId) });
        setShowAddPostForm(false);
        if (result?.success) {
            setNotification({ message: 'פוסט נוסף בהצלחה', type: 'success' });
        } else {
            setNotification({ message: 'שגיאה בהוספת פוסט', type: 'error' });
        }
    };

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
        setCurrentPage(0);
    }, [showMyPosts, searchBy, searchValue, getItems]);

    useEffect(() => {
        if (error) {
            setNotification({ message: 'שגיאה בטעינת הנתונים', type: 'error' });
        }
    }, [error])

    const startIndex = currentPage * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const searchOptions = [
        { value: 'id', label: 'חיפוש לפי ID' },
        { value: 'title', label: 'חיפוש לפי כותרת' }
    ];

    return (
        <div className="container">

            <h2>פוסטים</h2>

            <div className="toolbar">
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
                <SearchFilter
                    searchOptions={searchOptions}
                    searchBy={searchBy}
                    setSearchBy={setSearchBy}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />
                <button onClick={() => setShowAddPostForm(!showAddPostForm)}>➕ פוסט חדש</button>
            </div>

            {showAddPostForm && (
                <div className="card">
                    <DynamicForm
                        fields={[{ name: 'title', placeholder: 'post title', required: true }, { name: 'body', placeholder: 'post body', required: true }]}
                        onSubmit={handleAdd}
                    />
                </div>
            )}

            <div className="list">
                {currentPosts.map(post => {
                    const isPostOwner = post.userId === user?.id;
                    return (
                        <div key={post.id} className="card">
                            <Link to={`/home/users/${userId}/posts/${post.id}`}
                                state={{ post, isPostOwner, currentUserEmail: user?.email }}>
                                <p>ID: {post.id}</p>
                                <strong>{post.title}</strong>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}

export default PostsList;