import { useEffect } from "react";
import { useParams, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
function Home() {
    const { userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const isHomePage = location.pathname === `/home/users/${userId}`;

    // useEffect(() => {
    //     if (!user) {
    //         navigate('/login', { replace: true });
    //     }
    // }, [user, navigate]);

    return (
        <div className="container">
            <div className="header">
                <h2>
                    <Link to={`/home/users/${userId}`}>בית</Link>
                </h2>
                <div className="user-info">
                    <div>שם משתמש: {user?.username || 'אין נתוני משתמש'}</div>
                    <div>מזהה משתמש: {userId}</div>
                </div>
                <nav className="nav">
                    <Link to="albums"> Albums</Link>
                    <Link to="posts"> Posts</Link>
                    <Link to="todos"> Todos</Link>
                    <Link to="info"> Info</Link>
                    <Link to="logout"> Logout</Link>
                </nav>
            </div>
            {isHomePage && (
                <div className="home-content">
                    <h3>ברוכים הבאים, {user?.username}!</h3>
                    <p>זהו עמוד הבית שלך. כאן תוכל לנהל את המשימות, הפוסטים והאלבומים שלך.</p>
                    <p>בחר אחת מהאפשרויות בתפריט למעלה כדי להתחיל.</p>
                </div>
            )}
            <Outlet />
        </div>
    )
}
export default Home;