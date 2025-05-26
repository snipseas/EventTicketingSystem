import React from 'react';

const Modal = ({ open, onClose, children }) => {
    if (!open) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;