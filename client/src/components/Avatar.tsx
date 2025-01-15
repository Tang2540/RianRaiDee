import { useAuth } from "../utils/Auth/useAuth"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Avatar = () => {

    const {user,setUser, checkAuthStatus} = useAuth();
    const navigate = useNavigate()

   const handleLogout = async () => {
        try {
          await axios.post('http://localhost:3000/auth/logout');
          checkAuthStatus()
          setUser(null);
          navigate('/')
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

  return (
    <>
    <div className="dropdown dropdown-hover dropdown-bottom">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full" data-test="navbar-profile-img"><img
            alt={user?._id}
            src={"http://localhost:3000/images/"+user?.picture}/>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li>
          <Link to={`/profile/${user?._id}`}>
            Profile
          </Link>
        </li>
        <li><Link to={'/setting'}>Settings</Link></li>
        <li onClick={handleLogout}><a>Logout</a></li>
      </ul>
    </div>
    <div data-test="navbar-profile-name">{user?.display_name}</div>
    </>
  )
}

export default Avatar