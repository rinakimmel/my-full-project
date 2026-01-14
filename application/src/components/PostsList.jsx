import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useApi from '../useApi';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import ConfirmDialog from './ConfirmDialog';
import Notification from './Notification';

function PostsList() {
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem(userId) || '{}');
    const currentUserEmail = currentUser.email;
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showMyPosts, setShowMyPosts] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [postsPerPage] = useState(10);
    const [deletePostId, setDeletePostId] = useState(null);
    const [notification, setNotification] = useState(null);

    const handleDeleteClick = (postId) => {
        setDeletePostId(postId);
    };

    const confirmDelete = () => {
        deleteItem(deletePostId);
        setDeletePostId(null);
        setNotification({ message: 'פוסט נמחק בהצלחה', type: 'success' });
    };

    const { data: posts, getItems, deleteItem, updateItem } = useApi("posts");
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

    const startIndex = currentPage * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const searchOptions = [
        { value: 'id', label: 'חיפוש לפי ID' },
        { value: 'title', label: 'חיפוש לפי כותרת' }
    ];

    return (
        <div>
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            {deletePostId && (
                <ConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletePostId(null)}
                />
            )}
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

            <div className="posts-list">
                {currentPosts.map(post => {
                    const isPostOwner = post.userId === parseInt(userId);
                    return (
                        <div key={post.id}>
                            <p>ID: {post.id}</p>
                            <Link to={`/home/users/${userId}/posts/${post.id}`}
                                state={{ post, isPostOwner, currentUserEmail }}>
                                <strong>{post.title}</strong>
                            </Link>
                            {isPostOwner && (
                                <button onClick={() => handleDeleteClick(post.id)}>מחק פוסט</button>
                            )}
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