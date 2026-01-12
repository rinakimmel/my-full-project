import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApi from '../useApi';
function Posts() {

    const { userId } = useParams();
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showContent, setShowContent] = useState(false);
    const { data: posts, getItems, deleteItem, updateItem } = useApi("posts");
    // const showContent = () => {

    // }

    useEffect(() => {
        const params = {
            userId: userId,
        };
        if (searchBy && searchValue) {
            params[searchBy] = searchValue;
        }
        getItems(params);
    }, [userId, searchBy, searchValue, getItems]);

    return (
        <>

            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="">בחר קריטריון חיפוש</option>
                <option value="id">חיפוש לפי ID</option>
                <option value="title">חיפוש לפי כותרת</option>
            </select>

            {searchBy && <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="הכנס ערך לחיפוש"
            />
            }
            {posts.map(post => (
                <div key={post.id}>
                    <p>ID: {post.id}</p>
                    <span>{post.title}</span>
                    <button onClick={() => deleteItem(post.id)}>delete</button>
                    <button onClick={() => updateItem(post.id)}>update post</button>
                    <button onClick={() => setShowContent(true)}>choose</button>
                    {showContent && <p>{post.body}</p>}
                </div>
            ))}
        </>
    );
}
export default Posts;