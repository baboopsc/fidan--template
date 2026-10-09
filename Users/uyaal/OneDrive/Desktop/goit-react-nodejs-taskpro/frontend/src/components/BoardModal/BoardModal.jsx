import { useEffect, useRef, useState } from 'react';
import BoardIcon from '../BoardIcon/BoardIcon.jsx';
import {
  boardBackgroundOptions,
  boardIconOptions,
  customBackgroundEffects,
  getCustomColorBackground,
} from '../BoardWorkspace/boardWorkspaceData.js';
import './BoardModal.css';

function BoardModal({ mode, board, onClose, onCreate, onUpdate }) {
  const [title, setTitle] = useState(board?.title || '');
  const [iconId, setIconId] = useState(board?.iconId || boardIconOptions[0].id);
  const [backgroundId, setBackgroundId] = useState(
    board?.backgroundId || boardBackgroundOptions[0].id,
  );
  const [customBackgroundColor, setCustomBackgroundColor] = useState(
    board?.customBackgroundColor || '#bedbb0',
  );
  const [customBackgroundEffect, setCustomBackgroundEffect] = useState(
    board?.customBackgroundEffect || customBackgroundEffects[0].id,
  );
  const [customBackgroundImage, setCustomBackgroundImage] = useState(
    board?.customBackgroundImage || '',
  );
  const colorInputRef = useRef(null);

  const isEditMode = mode === 'edit';
  const trimmedTitle = title.trim();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCustomBackgroundImage(URL.createObjectURL(file));
    setBackgroundId('custom-image');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!trimmedTitle) return;

    const payload = {
      title: trimmedTitle,
      iconId,
      backgroundId,
      customBackgroundColor,
      customBackgroundEffect,
      customBackgroundImage,
    };

    if (isEditMode && board) {
      onUpdate({ ...payload, id: board.id });
      return;
    }

    onCreate(payload);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="board-modal"
        aria-label={isEditMode ? 'Edit board' : 'New board'}
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close-button" type="button" aria-label="Close modal" onClick={onClose}>
          <svg width="18" height="18" aria-hidden="true">
            <use href="/symbol-defs.svg#icon-close" />
          </svg>
        </button>

        <h2 className="board-modal-title">{isEditMode ? 'Edit board' : 'New board'}</h2>

        <label className="visually-hidden" htmlFor="board-title">
          Board title
        </label>
        <input
          id="board-title"
          className="board-modal-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          autoFocus
        />

        <fieldset className="board-modal-fieldset">
          <legend>Icons</legend>
          <div className="board-icon-picker">
            {boardIconOptions.map((option) => (
              <button
                className={`board-icon-option ${iconId === option.id ? 'is-selected' : ''}`}
                type="button"
                key={option.id}
                aria-label={option.label}
                aria-pressed={iconId === option.id}
                onClick={() => setIconId(option.id)}
              >
                <BoardIcon iconId={option.id} size={22} />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="board-modal-fieldset">
          <legend>Background</legend>
          <div className="board-background-picker">
            {boardBackgroundOptions.map((option) => (
              <button
                className={`board-background-option ${backgroundId === option.id ? 'is-selected' : ''}`}
                type="button"
                key={option.id}
                aria-label={option.label}
                aria-pressed={backgroundId === option.id}
                onClick={() => setBackgroundId(option.id)}
                style={{ background: option.preview }}
              />
            ))}
            <label
              className={`board-background-option board-background-upload ${
                backgroundId === 'custom-image' ? 'is-selected' : ''
              }`}
              aria-label="Upload custom background image"
              style={
                customBackgroundImage
                  ? { backgroundImage: `url("${customBackgroundImage}")` }
                  : undefined
              }
            >
              <svg width="18" height="18" aria-hidden="true">
                <use href="/symbol-defs.svg#icon-plus" />
              </svg>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
            <button
              className={`board-background-option board-background-color ${
                backgroundId === 'custom-color' ? 'is-selected' : ''
              }`}
              type="button"
              aria-label="Choose custom background color"
              onClick={() => {
                setBackgroundId('custom-color');
                colorInputRef.current?.click();
              }}
              style={{ background: getCustomColorBackground(customBackgroundColor, customBackgroundEffect) }}
            >
              <input
                ref={colorInputRef}
                type="color"
                value={customBackgroundColor}
                onChange={(event) => {
                  setCustomBackgroundColor(event.target.value);
                  setBackgroundId('custom-color');
                }}
              />
            </button>
          </div>

          {backgroundId === 'custom-color' && (
            <div className="background-effect-picker" aria-label="Background effects">
              {customBackgroundEffects.map((effect) => (
                <button
                  key={effect.id}
                  className={`background-effect-option ${
                    customBackgroundEffect === effect.id ? 'is-selected' : ''
                  }`}
                  type="button"
                  onClick={() => setCustomBackgroundEffect(effect.id)}
                >
                  {effect.label}
                </button>
              ))}
            </div>
          )}
        </fieldset>

        <button className="board-modal-submit" type="submit" disabled={!trimmedTitle}>
          <span className="submit-icon" aria-hidden="true">
            <svg width="16" height="16">
              <use href="/symbol-defs.svg#icon-plus" />
            </svg>
          </span>
          {isEditMode ? 'Edit' : 'Create'}
        </button>
      </form>
    </div>
  );
}

export default BoardModal;
