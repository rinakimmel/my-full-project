import { useParams, Link, Outlet } from "react-router-dom";
function Home() {
    const {userId} = useParams();
    const userDetails = JSON.parse(localStorage.getItem(userId));
    const resource ="albums";
    return (
        <>
            <h2>home</h2>
            <div>user name: {userDetails?.username || 'No user data'}</div>
            <div>user id: {userId}</div>
            <nav>
                <Link to={resource}> albums  </Link>
                <Link to="posts"> posts  </Link>
                <Link to="todos"> todos  </Link>
                <Link to="info">info  </Link>
                <Link to="logout">logout  </Link>
            </nav>
            <Outlet />
        </>
    )
}
export default Home;          
