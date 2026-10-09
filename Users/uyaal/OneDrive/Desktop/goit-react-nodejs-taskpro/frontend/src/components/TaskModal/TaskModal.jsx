import { useEffect, useState } from 'react';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import './TaskModal.css';

const labelColors = ['blue', 'pink', 'green', 'gray'];

const TaskModal = ({
  mode = 'add',
  columnId,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [labelColor, setLabelColor] = useState(initialData?.labelColor || 'gray');
  const [deadline, setDeadline] = useState(initialData?.deadline ? new Date(initialData.deadline) : new Date());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    if (!description.trim()) nextErrors.description = 'Description is required';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        id: initialData?.id,
        title: title.trim(),
        description: description.trim(),
        labelColor,
        deadline: deadline instanceof Date ? deadline.toISOString() : deadline,
        columnId,
      });
    } catch {
      setErrors({ submit: 'Card could not be saved. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="task-modal"
        aria-label={mode === 'add' ? 'Add card' : 'Edit card'}
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        noValidate
      >
        <button className="task-modal-close" type="button" aria-label="Close modal" onClick={onClose}>
          <svg width="18" height="18" aria-hidden="true">
            <use href="/symbol-defs.svg#icon-close" />
          </svg>
        </button>

        <h2>{mode === 'add' ? 'Add card' : 'Edit card'}</h2>

        <div className="task-modal-field">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          {errors.title && <span className="task-modal-error">{errors.title}</span>}
        </div>

        <div className="task-modal-field">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {errors.description && <span className="task-modal-error">{errors.description}</span>}
        </div>

        <div className="label-color-section">
          <span className="task-modal-label">Label color</span>
          <div className="color-options">
            {labelColors.map((color) => (
              <button
                key={color}
                className={`color-dot ${color} ${labelColor === color ? 'selected' : ''}`}
                type="button"
                aria-label={`${color} priority`}
                aria-pressed={labelColor === color}
                onClick={() => setLabelColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="deadline-section">
          <span className="task-modal-label">Deadline</span>
          <CustomDatePicker
            selectedDate={deadline}
            onChange={(date) => setDeadline(date)}
            placeholder="Select a date"
          />
        </div>

        {errors.submit && <span className="task-modal-error task-modal-submit-error">{errors.submit}</span>}

        <button type="submit" className="task-modal-submit" disabled={isSubmitting}>
          <span className="plus-icon" aria-hidden="true">
            <svg width="14" height="14">
              <use href="/symbol-defs.svg#icon-plus" />
            </svg>
          </span>
          {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add' : 'Edit'}
        </button>
      </form>
    </div>
  );
};

export default TaskModal;
