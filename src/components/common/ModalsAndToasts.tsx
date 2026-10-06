import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from './Icon';

export const ModalRoot: React.FC = () => {
  const { activeModal, closeModal } = useApp();

  if (!activeModal) return null;

  return (
    <div className="modal-root">
      <div className="modal-backdrop" onClick={closeModal}>
        <section
          className="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close icon-button"
            onClick={closeModal}
            aria-label="Close"
          >
            <Icon name="close" size={19} />
          </button>
          <div className="modal-icon">
            <Icon name="sparkles" size={22} />
          </div>
          <h2 id="modalTitle">{activeModal.title}</h2>
          {typeof activeModal.content === 'string' ? (
            <p>{activeModal.content}</p>
          ) : (
            activeModal.content
          )}
          <button
            className="button button-primary modal-done"
            onClick={closeModal}
          >
            Got it <Icon name="check" size={15} />
          </button>
        </section>
      </div>
    </div>
  );
};

export const ToastRoot: React.FC = () => {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div id="toast-root" className="toast-root">
      {toasts.map((toast: { id: string; message: string }) => (
        <div key={toast.id} className="toast toast-success">
          <Icon name="check" size={16} />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
