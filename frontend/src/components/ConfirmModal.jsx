import React from "react";

function ConfirmModal({ open, onConfirm, onCancel, message }) {

    if (!open) return null;

    return (
        <div className="modalOverlay">
            <div className="modalBox">
                <p>{message}</p>

                <div className="modalBtns">
                    <button onClick={onCancel}>
                        Cancel
                    </button>

                    <button onClick={onConfirm} className="danger">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
