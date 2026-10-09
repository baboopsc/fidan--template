import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

import LogoComponent from "../LogoComponent/LogoComponent.jsx";
import Navigation from "../Navigation/Navigation.jsx";
import NeedHelp from "../NeedHelp/NeedHelp.jsx";
import { logoutThunk } from "../../store/auth/authSlice.js";
import { useBoardWorkspace } from "../BoardWorkspace/useBoardWorkspace.js";

export default function Sidebar({ isMenuOpen, onCloseMenu }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openCreateBoard } = useBoardWorkspace();

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      navigate("/welcome", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className={`sidebar ${isMenuOpen ? "sidebar--open" : ""}`}>
      <button
        className="sidebar-close-btn"
        type="button"
        aria-label="Close menu"
        onClick={onCloseMenu}
      >
        <svg width="18" height="18" aria-hidden="true">
          <use href="/symbol-defs.svg#icon-close" />
        </svg>
      </button>

      <div className="sidebar-top">
        <LogoComponent />

        <div className="boards-section">
          <p className="boards-title">My boards</p>

          <button
            type="button"
            className="create-board-btn"
            onClick={openCreateBoard}
          >
            <span>
              Create a <br /> new board
            </span>
            <span className="create-board-icon" aria-hidden="true">
              <svg width="14" height="14">
                <use href="/symbol-defs.svg#icon-plus" />
              </svg>
            </span>
          </button>
        </div>

        <Navigation />
      </div>

      <div className="sidebar-bottom">
        <NeedHelp />
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          <svg className="logout-icon" width="32" height="32" aria-hidden="true">
            <use href="/symbol-defs.svg#icon-logout" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
