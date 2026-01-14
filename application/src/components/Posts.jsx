/**
 * Posts
 * Macro: מנהל רשימת פוסטים של משתמש, עם אפשרות להצגה של 'הפוסטים שלי' או 'פוסטים של אחרים', חיפוש ועדכון/מחיקה.
 * Props/State:
 *  - משתמש ב־useParams() לקבלת userId
 *  - searchBy, searchValue, showMyPosts
 * Side-effects:
 *  - קורא ל־useApi('posts').getItems בהתאם לפרמטרים
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../useApi';
import PostItem from './PostItem';
import SearchFilter from './SearchFilter';

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