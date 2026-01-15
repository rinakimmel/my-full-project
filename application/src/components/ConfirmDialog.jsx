function ConfirmDialog({ message = "האם אתה בטוח שברצונך למחוק?", onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{message}</p>
                <div className="form-actions">
                    <button onClick={onConfirm} className="primary">✔️ כן</button>
                    <button onClick={onCancel}>❌ לא</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
