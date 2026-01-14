function ConfirmDialog({ message = "האם אתה בטוח שברצונך למחוק?", onConfirm, onCancel }) {
    return (
        <div >
            <div>
                <p>{message}</p>
                <button onClick={onConfirm}>כן</button>
                <button  onClick={onCancel}>לא</button>
            </div>
        </div>
    );
}

export default ConfirmDialog;
