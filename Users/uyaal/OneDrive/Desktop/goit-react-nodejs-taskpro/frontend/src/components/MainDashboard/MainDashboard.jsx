import { useEffect, useRef, useState } from 'react';
import './MainDashboard.css';
import { useBoardWorkspace } from '../BoardWorkspace/useBoardWorkspace.js';
import {
  boardBackgroundOptions,
  getBoardDashboardStyle,
} from '../BoardWorkspace/boardWorkspaceData.js';
import TaskCard from '../TaskCard/TaskCard.jsx';

const filterOptions = [
  { id: 'gray', label: 'Without priority' },
  { id: 'blue', label: 'Low' },
  { id: 'pink', label: 'Medium' },
  { id: 'green', label: 'High' },
];

function MainDashboard() {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [activePriorityFilter, setActivePriorityFilter] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [dropTargetColumnId, setDropTargetColumnId] = useState(null);
    const filtersRef = useRef(null);
    const {
      activeBoard,
      openCreateColumn,
      openEditColumn,
      deleteColumn,
      openCreateTask,
      openEditTask,
      deleteTask,
      moveTask,
      updateBoardBackground,
    } = useBoardWorkspace();

    useEffect(() => {
      if (!isFiltersOpen) return;

      const handleDocumentClick = (event) => {
        if (filtersRef.current && !filtersRef.current.contains(event.target)) {
          setIsFiltersOpen(false);
        }
      };

      const handleEscape = (event) => {
        if (event.key === 'Escape') setIsFiltersOpen(false);
      };

      document.addEventListener('mousedown', handleDocumentClick);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleDocumentClick);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isFiltersOpen]);

    if (!activeBoard) {
      return (
        <main className="main-dashboard main-dashboard-empty">
          <p className="empty-dashboard-text">
            Before starting your project, it is essential <span>to create a board</span> to visualize
            and track all the necessary tasks and milestones. This board serves as a
            powerful tool to organize the workflow and ensure effective collaboration
            among team members.
          </p>
        </main>
      );
    }

    return (
      <main className="main-dashboard" style={getBoardDashboardStyle(activeBoard)}>
        <div className="dashboard-title-row">
          <div className="filters-wrapper" ref={filtersRef}>
            <button
              className="filters-button"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={isFiltersOpen}
              onClick={() => setIsFiltersOpen((current) => !current)}
            >
              <svg width="16" height="16" aria-hidden="true">
                <use href="/symbol-defs.svg#icon-filter" />
              </svg>
              Filters
            </button>

            {isFiltersOpen && (
              <div className="filters-popup" role="dialog" aria-label="Filters">
                <button
                  className="filters-close"
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setIsFiltersOpen(false)}
                >
                  <svg width="18" height="18" aria-hidden="true">
                    <use href="/symbol-defs.svg#icon-close" />
                  </svg>
                </button>

                <h2>Filters</h2>
                <div className="filters-divider" />

                <div className="filters-section-heading">
                  <h3>Background</h3>
                </div>

                <div className="filters-background-options" role="radiogroup" aria-label="Board background">
                  {boardBackgroundOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`filters-background-option ${
                        activeBoard.backgroundId === option.id ? 'is-selected' : ''
                      }`}
                      type="button"
                      role="radio"
                      aria-label={option.label}
                      aria-checked={activeBoard.backgroundId === option.id}
                      onClick={() =>
                        updateBoardBackground({
                          id: activeBoard.id,
                          backgroundId: option.id,
                          customBackgroundColor: undefined,
                          customBackgroundEffect: undefined,
                          customBackgroundImage: undefined,
                        })
                      }
                      style={{ background: option.preview }}
                    />
                  ))}
                </div>

                <div className="filters-divider" />

                <div className="filters-section-heading">
                  <h3>Label color</h3>
                  <button
                    type="button"
                    onClick={() => setActivePriorityFilter(null)}
                    disabled={!activePriorityFilter}
                  >
                    Show all
                  </button>
                </div>

                <div className="filters-options" role="radiogroup" aria-label="Label color">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`filters-option ${option.id} ${
                        activePriorityFilter === option.id ? 'is-selected' : ''
                      }`}
                      type="button"
                      role="radio"
                      aria-checked={activePriorityFilter === option.id}
                      onClick={() => setActivePriorityFilter(option.id)}
                    >
                      <span className="filters-option-dot" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="columns-scroll-area" aria-label={`${activeBoard.title} columns`}>
          <div className="columns-track">
            {activeBoard.columns.map((column) => (
              <section
                className={`task-column ${dropTargetColumnId === column.id ? 'is-drop-target' : ''}`}
                key={column.id}
                onDragOver={(event) => {
                  if (!draggedTask || draggedTask.sourceColumnId === column.id) return;
                  event.preventDefault();
                  setDropTargetColumnId(column.id);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setDropTargetColumnId(null);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggedTask && draggedTask.sourceColumnId !== column.id) {
                    moveTask(draggedTask.sourceColumnId, column.id, draggedTask.taskId);
                  }
                  setDraggedTask(null);
                  setDropTargetColumnId(null);
                }}
              >
                <header className="task-column-header">
                  <h2>{column.title}</h2>
                  <div className="task-column-actions">
                    <button
                      type="button"
                      aria-label={`Edit ${column.title}`}
                      onClick={() => openEditColumn(column)}
                    >
                      <svg width="16" height="16" aria-hidden="true">
                        <use href="/symbol-defs.svg#icon-pencil" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${column.title}`}
                      onClick={() => deleteColumn(column.id)}
                    >
                      <svg width="16" height="16" aria-hidden="true">
                        <use href="/symbol-defs.svg#icon-trash" />
                      </svg>
                    </button>
                  </div>
                </header>

                <div className="task-column-body">
                  <div className="task-card-list">
                    {column.cards
                      .filter((card) => !activePriorityFilter || card.labelColor === activePriorityFilter)
                      .map((card) => (
                      <TaskCard
                        key={card.id}
                        task={card}
                        onEdit={() => openEditTask(column.id, card)}
                        onDelete={(taskId) => deleteTask(column.id, taskId)}
                        moveTargets={activeBoard.columns.filter((targetColumn) => targetColumn.id !== column.id)}
                        onMoveColumn={(taskId, targetColumnId) => moveTask(column.id, targetColumnId, taskId)}
                        isDragging={draggedTask?.taskId === card.id}
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = 'move';
                          event.dataTransfer.setData('text/plain', card.id);
                          setDraggedTask({ sourceColumnId: column.id, taskId: card.id });
                        }}
                        onDragEnd={() => {
                          setDraggedTask(null);
                          setDropTargetColumnId(null);
                        }}
                      />
                    ))}
                  </div>

                  <button
                    className="add-card-button"
                    type="button"
                    onClick={() => openCreateTask(column.id)}
                  >
                    <span className="add-card-icon" aria-hidden="true">
                      <svg width="16" height="16">
                        <use href="/symbol-defs.svg#icon-plus" />
                      </svg>
                    </span>
                    Add another card
                  </button>
                </div>
              </section>
            ))}

            <button className="add-column-button" type="button" onClick={openCreateColumn}>
              <span className="add-column-icon" aria-hidden="true">
                <svg width="16" height="16">
                  <use href="/symbol-defs.svg#icon-plus" />
                </svg>
              </span>
              Add another column
            </button>
          </div>
        </div>
      </main>
  );
}

export default MainDashboard;
