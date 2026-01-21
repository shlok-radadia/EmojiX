import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Navbar() {
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    api
      .get("/auth/me")
      .then((res) => setUserId(res.data.id))
      .catch(() => setUserId(null));
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#121216] border-b border-[#26262d]">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="text-lg font-semibold tracking-wide text-indigo-400"
        >
          EmojiX
        </Link>

        {token && (
          <div className="flex items-center gap-6 text-sm">
            <NavItem to="/game">Game</NavItem>
            <NavItem to="/dex">Dex</NavItem>
            <NavItem to="/inventory/emojis">Emojis</NavItem>
            <NavItem to="/inventory/items">Items</NavItem>
            <NavItem to="/market">Market</NavItem>
            <NavItem to="/quests">Quests</NavItem>
            <NavItem to="/trade">Trade</NavItem>
            {userId && (
              <NavItem to={`/profile/${userId}/stats`}>Profile</NavItem>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-gray-400 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white transition"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `transition ${
          isActive ? "text-white font-medium" : "text-gray-400 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
