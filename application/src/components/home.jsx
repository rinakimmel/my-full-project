import { useParams, Link, Outlet } from "react-router-dom";
function Home() {
    //const useId = useParams();
    const useId = 3;
    const userDetails = JSON.parse(localStorage.getItem("userId"));
    return (
        <>
            <div>home</div>
            {/* <div>{userDetails.userName}</div> */}
            <div>user id is: {useId}</div>
            <nav>
                <Link to="users/:useId/albums"
                state={{from:"albums"}}>albums  </Link>
                <Link to="users/:useId/photos"
                state={{from:"photos"}}>photos  </Link>
                <Link to="users/:useId/todos"
                state={{from:"todos"}}>todos  </Link>
                <Link to="info">info  </Link>
                <Link to="logout">logout  </Link>
            </nav>
            <Outlet />
        </>
    )
}
export default Home;