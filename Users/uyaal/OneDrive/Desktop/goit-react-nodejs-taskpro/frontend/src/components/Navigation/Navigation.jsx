import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import { useBoardWorkspace } from '../BoardWorkspace/useBoardWorkspace.js';
import { getBoardAccentColor } from '../BoardWorkspace/boardWorkspaceData.js';
import BoardIcon from '../BoardIcon/BoardIcon.jsx';

export default function Navigation() {
  const { boards, activeBoardId, setActiveBoardId, openEditBoard, deleteBoard } = useBoardWorkspace();
  const navigationRef = useRef(null);
  const [hasMoreBoardsBelow, setHasMoreBoardsBelow] = useState(false);
  const [hasMoreBoardsAbove, setHasMoreBoardsAbove] = useState(false);

  useEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return undefined;

    const updateScrollHint = () => {
      const hasOverflow = navigation.scrollHeight > navigation.clientHeight + 1;
      const isBeforeEnd = navigation.scrollTop + navigation.clientHeight < navigation.scrollHeight - 2;
      const isAfterStart = navigation.scrollTop > 2;
      setHasMoreBoardsBelow(hasOverflow && isBeforeEnd);
      setHasMoreBoardsAbove(hasOverflow && isAfterStart);
    };

    updateScrollHint();
    navigation.addEventListener('scroll', updateScrollHint, { passive: true });
    window.addEventListener('resize', updateScrollHint);

    return () => {
      navigation.removeEventListener('scroll', updateScrollHint);
      window.removeEventListener('resize', updateScrollHint);
    };
  }, [boards.length]);

  return (
    <nav
      className={`navigation ${hasMoreBoardsBelow ? 'has-more-below' : ''}`}
      data-has-more-above={hasMoreBoardsAbove}
      aria-label="Boards"
      ref={navigationRef}
    >
      {boards.map((board) => (
        <NavLink
          key={board.id}
          to={`/home/${board.id}`}
          className={({ isActive }) => (isActive || activeBoardId === board.id ? 'board active' : 'board')}
          onClick={() => setActiveBoardId(board.id)}
        >
          <div className="board-left">
            <BoardIcon iconId={board.iconId} size={18} style={{ color: getBoardAccentColor(board) }} />

            <span className="board-title-text">{board.title}</span>
          </div>

          <div className="board-actions">
            <button
              type="button"
              aria-label={`Edit ${board.title}`}
              onClick={(event) => {
                event.preventDefault();
                openEditBoard(board);
              }}
            >
              <svg width="16" height="16" aria-hidden="true">
                <use href="/symbol-defs.svg#icon-pencil" />
              </svg>
            </button>

            <button
              type="button"
              aria-label={`Delete ${board.title}`}
              onClick={(event) => {
                event.preventDefault();
                deleteBoard(board.id);
              }}
            >
              <svg width="16" height="16" aria-hidden="true">
                <use href="/symbol-defs.svg#icon-trash" />
              </svg>
            </button>
          </div>
        </NavLink>
      ))}
    </nav>
  );
}
