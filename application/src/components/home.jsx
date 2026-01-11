import { useParams, Link, Outlet } from "react-router-dom";
function Home() {
    const {userId} = useParams();
    const userDetails = JSON.parse(localStorage.getItem(userId));
    return (
        <>
            <h2>home</h2>
              <div>user name: {userDetails?.username || 'No user data'}</div>
            <div>user id: {userId}</div>
            <nav>
                <Link to={"albums"}
                state={{from:"albums"}}>albums  </Link>
                <Link to="photos"
                state={{from:"photos"}}>photos  </Link>
                <Link to="todos"
                state={{from:"todos"}}>todos  </Link>
                <Link to="info">info  </Link>
                <Link to="logout">logout  </Link>
            </nav>
            <Outlet />
        </>
    )
}
export default Home;          
