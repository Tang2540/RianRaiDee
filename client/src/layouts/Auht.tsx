import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth/useAuth";
import axios from "axios";

axios.defaults.withCredentials = true;

function Auth() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [selectedOption, setSelectedOption] = useState("login");

  const { user, setUser, checkAuthStatus } = useAuth();

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/register", {
        displayName,
        email,
        password,
      });
      console.log(response);
      navigate(0);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || 'An error occurred during registration';
        setError(errorMessage);
      }
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      setUsername("");
      setPassword("");
      console.log(response);
      checkAuthStatus();
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/logout");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Added: Handle Google Sign-In
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user._id}</h1>
          <h1>{user.username}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col">
          {error&&(
            <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          )}
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
              <div className="card-body">
                {selectedOption==="login"?(
                  <h2 className="card-title">LOG IN</h2>
                ):(<h2 className="card-title">SIGN UP</h2>)}
                <div className="join grid grid-cols-2">
                  <button
                    className={`join-item btn btn-outline ${
                      selectedOption === "login" ? "btn-active" : ""
                    }`}
                    onClick={() => {
                      setSelectedOption("login");
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className={`join-item btn btn-outline ${
                      selectedOption === "signup" ? "btn-active" : ""
                    }`}
                    onClick={() => setSelectedOption("signup")}
                  >
                    Sign Up
                  </button>
                </div>

                { selectedOption === "login" ?
                 ( <>
                    <form onSubmit={handleLogin}>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Email"
                          className="input input-bordered"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }}
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          className="input input-bordered"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="label">
                          <a
                            href="#"
                            className="label-text-alt link link-hover"
                          >
                            Forgot password?
                          </a>
                        </label>
                      </div>
                      <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">
                          Login
                        </button>
                      </div>
                    </form>
                    <div className="divider">OR</div>
                    <button
                      onClick={handleGoogleSignIn}
                      className="btn btn-primary"
                    >
                      Sign in with Google
                    </button>
                  </>) :
                  ( <>
                    <form onSubmit={handleRegister}>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Email"
                          className="input input-bordered"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">ชื่อที่ต้องการให้ผู้อื่นเห็น</span>
                        </label>
                        <input
                          type="text"
                          placeholder="เช่น นิรนาม, ไข่ไก่, หมาแก่"
                          className="input input-bordered"
                          value={displayName}
                          onChange={(e) => {
                            setDisplayName(e.target.value);
                          }}
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          className="input input-bordered"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="label">
                          <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm password"
                          className="input input-bordered"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">
                          Create an account
                        </button>
                      </div>
                    </form>
                    <div className="divider">OR</div>
                    <button
                      onClick={handleGoogleSignIn}
                      className="btn btn-primary"
                    >
                      Sign up with Google
                    </button>
                  </>)
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;
