import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApi from '../useApi';
import GenericList from './GenericList';
import SortDropdown from './SortDropdown';
import DynamicForm from './DynamicForm';

function TodosList() {
    const { userId } = useParams();
    const [sortBy, setSortBy] = useState('');
    const [showAddTodoForm, setShowAddTodoForm] = useState(false);
    const { data: todos, error, getItems, deleteItem, updateItem, addItem } = useApi("todos");

    useEffect(() => {
        const params = { userId };
        if (sortBy && sortBy !== 'id') {
            params._sort = sortBy;
            params._order = 'asc';
        }
        getItems(params);
    }, [userId, sortBy, getItems]);

    const renderTodoView = (item, defaultRender) => (
        <>
            <div>
                <p>ID: {item.id}</p>
                <p>{item.title}</p>
            </div>
            <label>
                <input type="checkbox" checked={item.completed || false} disabled />
                {item.completed ? 'completed' : 'not completed'}
            </label>
        </>
    );

    const renderTodoEdit = (editData, setEditData, defaultRender) => (
        <>
            {defaultRender(editData, setEditData)}
            <label>
                <input
                    type="checkbox"
                    checked={editData.completed || false}
                    onChange={(e) => setEditData({ ...editData, completed: e.target.checked })}
                />
                {editData.completed ? 'completed' : 'not completed'}
            </label>
        </>
    );

    const handleDelete = async (id) => {
        return await deleteItem(id);
    };

    const handleUpdate = async (id, data) => {
        return await updateItem(id, data);
    };

    const handleAdd = async (data) => {
        await addItem({ ...data, userId: parseInt(userId) });
        setShowAddTodoForm(false);
    };

    const sortOptions = [
        { value: 'id', label: 'ID' },
        { value: 'title', label: 'Title' },
        { value: 'completed', label: 'Status' }
    ];

    const searchOptions = [
        { value: 'id', label: 'חיפוש לפי ID' },
        { value: 'title', label: 'חיפוש לפי כותרת' },
        { value: 'completed', label: 'חיפוש לפי מצב ביצוע' }
    ];
    return (
        <GenericList
            title="Todos"
            items={todos}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAddClick={() => setShowAddTodoForm(!showAddTodoForm)}
            searchOptions={searchOptions}
            useGenericItem={true}
            itemName="משימה"
            renderView={renderTodoView}
            renderEdit={renderTodoEdit}
        >
            <SortDropdown sortOptions={sortOptions} sortBy={sortBy} setSortBy={setSortBy} />
            {showAddTodoForm && (
                <div className="card">
                    <DynamicForm
                        fields={[{ name: 'title', placeholder: 'title', required: true }]}
                        onSubmit={handleAdd}
                    />
                </div>
            )}
        </GenericList>
    );
}
export default TodosList;