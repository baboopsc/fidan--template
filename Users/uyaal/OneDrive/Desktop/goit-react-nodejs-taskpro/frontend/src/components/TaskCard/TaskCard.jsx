import { useEffect, useRef, useState } from 'react';
import './TaskCard.css';

function formatDeadline(deadline) {
  if (!deadline) return '12/05/2023';

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;

  return new Intl.DateTimeFormat('en-GB').format(date);
}

function isDeadlineToday(deadline) {
  if (!deadline) return false;

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  return date.toDateString() === today.toDateString();
}

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onMoveColumn,
  moveTargets = [],
  isDragging = false,
  onDragStart,
  onDragEnd,
}) => {
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const moveMenuRef = useRef(null);
  const { title, description, labelColor, deadline } = task || {};

  // Öncelik etiketlerinin ekrandaki yazı karşılıkları
  const priorityLabels = {
    blue: 'Low',
    pink: 'Medium',
    green: 'High',
    gray: 'Without',
  };

  const showBell = isDeadlineToday(deadline);

  useEffect(() => {
    if (!isMoveOpen) return;

    const handleDocumentClick = (event) => {
      if (moveMenuRef.current && !moveMenuRef.current.contains(event.target)) {
        setIsMoveOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsMoveOpen(false);
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMoveOpen]);

  return (
    <div
      className={`task-card ${isDragging ? 'is-dragging' : ''}`}
      draggable={canDrag}
      onPointerDown={(event) => {
        const shouldSelectText = event.target.closest(
          '.card-selectable, .card-actions, button, a, input, textarea',
        );
        setCanDrag(!shouldSelectText);
      }}
      onPointerUp={() => setCanDrag(false)}
      onPointerCancel={() => setCanDrag(false)}
      onDragStart={onDragStart}
      onDragEnd={(event) => {
        setCanDrag(false);
        onDragEnd?.(event);
      }}
    >
      <div className={`card-label-line ${labelColor}`}></div>

      <div className="card-content">
        <div className="card-header">
          <h4 className="card-selectable">{title || 'Untitled Task'}</h4>
        </div>

        {/* Card Description */}
        <p className="card-description card-selectable">
          {description || 'No description provided.'}
        </p>

        {/* Card Footer */}
        <div className="card-footer">
          <div className="divider-line"></div>

          <div className="footer-bottom-row">
            <div className="footer-meta-info">
              <div className="meta-item">
                <span className="meta-label">Priority</span>
                <div className="priority-value-wrapper">
                  <span className={`priority-circle ${labelColor}`}></span>
                  <span className="priority-text card-selectable">
                    {priorityLabels[labelColor] || 'Without'}
                  </span>
                </div>
              </div>

              <div className="meta-item">
                <span className="meta-label">Deadline</span>
                <span className="meta-value card-selectable">{formatDeadline(deadline)}</span>
              </div>
            </div>

            <div
              className="card-actions"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {/* Zil İkonu/Koşullu  */}
              {showBell && (
                <div
                  className="bell-icon-wrapper"
                  style={{
                    color: '#bedbb0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Deadline Alert"
                >
                  <svg width="16" height="16" aria-hidden="true">
                    <use href="/symbol-defs.svg#icon-bell" />
                  </svg>
                </div>
              )}

              {/* Move Butonu */}
              <div className="move-action-wrapper" ref={moveMenuRef}>
                <button
                  className="action-btn move-btn"
                  type="button"
                  onClick={() => setIsMoveOpen((current) => !current)}
                  title="Move to column"
                >
                  <svg width="16" height="16" aria-hidden="true">
                    <use href="/symbol-defs.svg#icon-progress" />
                  </svg>
                </button>

                {isMoveOpen && (
                  <div className="move-popup" role="menu">
                    {moveTargets.map((column) => (
                      <button
                        key={column.id}
                        className="move-popup-item"
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onMoveColumn?.(task.id, column.id);
                          setIsMoveOpen(false);
                        }}
                      >
                        <span>{column.title}</span>
                        <svg width="18" height="18" aria-hidden="true">
                          <use href="/symbol-defs.svg#icon-progress" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Düzenleme/Kalem Butonu */}
              <button
                className="action-btn edit-btn"
                onClick={() => onEdit(task)}
                title="Edit task"
              >
                <svg width="16" height="16" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-pencil" />
                </svg>
              </button>

              {/* Silme/Çöp Kutusu Butonu */}
              <button
                className="action-btn delete-btn"
                onClick={() => onDelete(task.id)}
                title="Delete task"
              >
                <svg width="16" height="16" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-trash" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
