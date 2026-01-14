import { useParams, Link, Outlet } from "react-router-dom";
function Home() {
    const { userId } = useParams();
    const userDetails = JSON.parse(localStorage.getItem(userId));

    return (
        <>
            <h2>בית</h2>
            <div>שם משתמש: {userDetails?.username || 'אין נתוני משתמש'}</div>
            <div>מזהה משתמש: {userId}</div>
            <nav>
                <Link to="albums">Albums</Link> |
                <Link to="posts">Posts</Link> |
                <Link to="todos">Todos</Link> |
                <Link to="info">Info</Link> |
                <Link to="logout">Logout</Link>
            </nav>
            <Outlet />
        </>
    )
}
export default Home;