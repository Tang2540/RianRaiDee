import { Link } from "react-router-dom";
import { useAuth } from '../utils/Auth/useAuth';
import Avatar from "./Avatar";

const Navbar = () => {

  const {user} = useAuth()

  return (
    <nav className="container mx-auto">
      <div className="navbar">
        <div className="flex-1">
          <Link to="/">
            RianRaiDee @TU-Rangsit
          </Link>
          </div>

          <div className='flex-none'>
            {!user?
            <Link to="/auth" className='btn' data-test="login-buttton">Log in</Link>
            :
            <Avatar/>
            }     
          </div>
      </div>
    </nav>
  );
}

export default Navbar
