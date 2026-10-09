import { useState } from "react";
import Header from "../components/Header/Header.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
// import MainDashboard from "../components/MainDashboard/MainDashboard.jsx";
import ScreensPage from "./ScreensPage.jsx";
import { BoardWorkspaceProvider } from "../components/BoardWorkspace/BoardWorkspaceContext.jsx";
import "./HomePage.css";

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <BoardWorkspaceProvider>
      <div className="taskpro-layout">
        <Sidebar
          isMenuOpen={isMenuOpen}
          onCloseMenu={() => setIsMenuOpen(false)}
        />

        <div className="taskpro-content">
          <Header onBurgerClick={() => setIsMenuOpen(true)} />

          <ScreensPage />
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </BoardWorkspaceProvider>
  );
}

export default HomePage;
