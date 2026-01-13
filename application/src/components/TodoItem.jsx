import React from 'react';
import { useState } from 'react';

function TodoItem({ id,todo, onDelete, onUpdate }) {
    const [editingTodo, setEditingTodo] = useState(null);

    const saveUpdate = () => {
        onUpdate(editingTodo.id, {
            title: editingTodo.title,
            completed: editingTodo.completed
        });
        setEditingTodo(null);
    };

    return (
        <>
            {editingTodo && <div>
                <input type='text' placeholder='update title' value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}></input>
                <label>
                    <input type="checkbox" checked={editingTodo.completed}
                        onChange={(e) => setEditingTodo({ ...editingTodo, completed: e.target.checked })} />
                    completed
                </label>
                <button onClick={saveUpdate}>save updating</button>
            </div>}

            <div key={todo.id}>
                <p>ID: {todo.id}</p>
                <span>{todo.title}</span>
                <label>
                    <input type="checkbox" checked={todo.completed} readOnly />
                    {todo.completed ? 'completed' : 'not completed'}
                </label>
                <button onClick={() => onDelete(todo.id)}>delete</button>
                <button onClick={() => setEditingTodo(todo)}>update todo</button>
            </div>
        </>
    )
}
export default TodoItem;