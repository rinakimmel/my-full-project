import GenericItem from './GenericItem';

function TodoItem({ todo, onDelete, onUpdate }) {
    const renderView = (item) => (
        <>
            <p>ID: {item.id}</p>
            <span>{item.title}</span>
            <label>
                <input type="checkbox" checked={item.completed} readOnly />
                {item.completed ? 'completed' : 'not completed'}
            </label>
        </>
    );

    const renderEdit = (editData, setEditData) => (
        <>
            <input 
                type='text' 
                placeholder='update title' 
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
            <label>
                <input 
                    type="checkbox" 
                    checked={editData.completed}
                    onChange={(e) => setEditData({ ...editData, completed: e.target.checked })}
                />
                completed
            </label>
        </>
    );

    return (
        <div style={{
                border: '1px solid black',
                margin: '10px',
                padding: '10px',
            }}>
        <GenericItem
            item={todo}
            onDelete={onDelete}
            onUpdate={onUpdate}
            renderView={renderView}
            renderEdit={renderEdit}
            
        />
        </div>
    );
}

export default TodoItem;