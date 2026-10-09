import { useState } from "react";
import { useParams } from "react-router-dom";
import "./HeaderDashboard.css";

export default function HeaderDashboard() {
  const { boardName } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="header-dashboard">
      <h2 className="board-title">
        {boardName ? decodeURIComponent(boardName) : "Dashboard"}
      </h2>

      <button
        className="filters-btn"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 6H20M7 12H17M10 18H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <span>Filters</span>
      </button>

      {isFilterOpen && (
        <div className="filters-modal">
          <p>Filters Modal</p>
        </div>
      )}
    </div>
  );
}