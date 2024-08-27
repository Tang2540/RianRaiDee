import { useAuth } from "../utils/Auth/useAuth"
import { Link } from "react-router-dom";
import axios from "axios";

const Avatar = () => {

    const {user,setUser} = useAuth();

    const handleLogout = async () => {
        try {
          await axios.post('http://localhost:3000/logout');
          setUser(null);
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

  return (
    <>
    <div className="dropdown dropdown-hover dropdown-bottom">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
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
        <li><a>Settings</a></li>
        <li onClick={handleLogout}><a>Logout</a></li>
      </ul>
    </div>
    <div>{user?.username}</div>
    </>
  )
}

export default Avatar