import { useEffect, useState } from 'react';
import './ColumnModal.css';

function ColumnModal({ mode, column, onClose, onCreate, onUpdate }) {
  const [title, setTitle] = useState(column?.title || '');

  const isEditMode = mode === 'edit';
  const trimmedTitle = title.trim();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!trimmedTitle) return;

    if (isEditMode && column) {
      onUpdate({ id: column.id, title: trimmedTitle });
      return;
    }

    onCreate({ title: trimmedTitle });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="column-modal"
        aria-label={isEditMode ? 'Edit column' : 'Add column'}
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close-button" type="button" aria-label="Close modal" onClick={onClose}>
          <svg width="18" height="18" aria-hidden="true">
            <use href="/symbol-defs.svg#icon-close" />
          </svg>
        </button>

        <h2 className="column-modal-title">{isEditMode ? 'Edit column' : 'Add column'}</h2>

        <label className="visually-hidden" htmlFor="column-title">
          Column title
        </label>
        <input
          id="column-title"
          className="column-modal-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          autoFocus
        />

        <button className="column-modal-submit" type="submit" disabled={!trimmedTitle}>
          <span className="submit-icon" aria-hidden="true">
            <svg width="16" height="16">
              <use href="/symbol-defs.svg#icon-plus" />
            </svg>
          </span>
          {isEditMode ? 'Edit' : 'Add'}
        </button>
      </form>
    </div>
  );
}

export default ColumnModal;
