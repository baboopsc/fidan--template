import { useEffect, useRef, useState } from "react";
import "./Header.css";
import EditProfileModal from "../EditProfileModal/EditProfileModal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { getAvatarUrl } from "../../utils/avatar.js";
import { useBoardWorkspace } from "../BoardWorkspace/useBoardWorkspace.js";

const themes = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "violet", label: "Violet" },
];

const THEME_STORAGE_KEY = "taskpro_theme";

const getSavedTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return themes.some((item) => item.id === savedTheme) ? savedTheme : "dark";
};

export default function Header({ onBurgerClick }) {
  const [theme, setTheme] = useState(getSavedTheme);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const themeRef = useRef(null);
  const profileRef = useRef(null);
  const { user } = useAuth();
  const { activeBoard } = useBoardWorkspace();

  const displayName = user?.name || "User";
  const avatarUrl = getAvatarUrl(user);

  const handleOpenEditProfile = () => {
    setIsEditProfileOpen(true);
    setShowProfile(false);
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    document.body.setAttribute("data-theme", value);
    localStorage.setItem(THEME_STORAGE_KEY, value);
    setIsThemeOpen(false);
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!isThemeOpen) return;

    const handleDocumentClick = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsThemeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isThemeOpen]);

  useEffect(() => {
    if (!showProfile) return;

    const handleDocumentClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showProfile]);

  return (
    <header className="header">
      <button className="burger-btn" type="button" onClick={onBurgerClick} aria-label="Open menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="header-left">
        {activeBoard?.title && (
          <p className="header-board-title" title={activeBoard.title}>
            {activeBoard.title}
          </p>
        )}
      </div>

      <div className="header-right">
        <div className="theme-switcher" ref={themeRef}>
          <button
            className={`theme-trigger ${isThemeOpen ? "is-open" : ""}`}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isThemeOpen}
            onClick={() => setIsThemeOpen((current) => !current)}
          >
            <span>Theme</span>
            <svg className="theme-chevron" width="16" height="16" aria-hidden="true">
              <use href="/symbol-defs.svg#icon-chevron-down" />
            </svg>
          </button>

          {isThemeOpen && (
            <div className="theme-menu" role="listbox" aria-label="Theme">
              {themes.map((item) => (
                <button
                  key={item.id}
                  className={`theme-option ${item.id === theme ? "is-selected" : ""}`}
                  type="button"
                  role="option"
                  aria-selected={item.id === theme}
                  onClick={() => handleThemeChange(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="profile-menu" ref={profileRef}>
          <button
            className="user-info"
            type="button"
            aria-haspopup="menu"
            aria-expanded={showProfile}
            onClick={() => setShowProfile(!showProfile)}
          >
            <span>{displayName}</span>

            <img src={avatarUrl} alt={displayName} />
          </button>

          {showProfile && (
            <div className="profile-dropdown" role="menu">
              <button
                type="button"
                className="profile-dropdown-item"
                role="menuitem"
                onClick={handleOpenEditProfile}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditProfileOpen && (
        <EditProfileModal onClose={() => setIsEditProfileOpen(false)} />
      )}
    </header>
  );
}
