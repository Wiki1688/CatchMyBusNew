import React, { useState } from 'react';

interface NameModalProps {
  currentName?: string;
  onSaveName: (name: string) => void;
  onCancel?: () => void;
}

export const NameModal: React.FC<NameModalProps> = ({ currentName = '', onSaveName, onCancel }) => {
  const [inputName, setInputName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (trimmed) {
      onSaveName(trimmed);
    }
  };

  return (
    <div className="modal-overlay" id="name-modal-overlay">
      <div className="modal-card" id="name-modal-card">
        <h2 className="modal-title">Welcome to Catch My Bus!</h2>
        <p className="modal-desc">What is your first name?</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            id="first-name-input"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="e.g. Mei Ling"
            autoFocus
            required
            autoComplete="given-name"
          />
          <button type="submit" className="modal-btn" id="save-name-btn">
            Continue
          </button>
          {onCancel && currentName && (
            <button
              type="button"
              className="name-change-btn"
              style={{ display: 'block', margin: '12px auto 0' }}
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
