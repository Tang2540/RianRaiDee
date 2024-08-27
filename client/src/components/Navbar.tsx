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
            WildlifeSpots
          </Link>
          </div>

          <div className='flex-none'>
            {!user?
            <Link to="/auth" className='button-pink'>Log in</Link>
            :
            <Avatar/>
            }     
          </div>
      </div>
    </nav>
  );
}

export default Navbar

//<div className="navbar bg-base-100">
//  <div className="flex-1">
//    <a className="btn btn-ghost text-xl">daisyUI</a>
//  </div>
//  <div className="flex-none">
//    <ul className="menu menu-horizontal px-1">
//      <li><a>Link</a></li>
//      <li>
//        <details>
//          <summary>Parent</summary>
//          <ul className="bg-base-100 rounded-t-none p-2">
//            <li><a>Link 1</a></li>
//            <li><a>Link 2</a></li>
//          </ul>
//        </details>
//      </li>
//    </ul>
//  </div>
//</div>
