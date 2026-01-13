import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../useApi';
import PostItem from './PostItem';

function Posts() {
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem(userId) || '{}');
    const currentUserEmail = currentUser.email;
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showMyPosts, setShowMyPosts] = useState(true); 

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
    }, [showMyPosts, searchBy, searchValue, getItems]);

    return (
        <div>
            <h2>פוסטים</h2>
            
            <div >
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

            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="">בחר קריטריון חיפוש</option>
                <option value="id">חיפוש לפי ID</option>
                <option value="title">חיפוש לפי כותרת</option>
            </select>

            {searchBy && (
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="הכנס ערך לחיפוש"
                />
            )}

            <div className="posts-list">
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
            </div>
        </div>
    );
}

export default Posts;