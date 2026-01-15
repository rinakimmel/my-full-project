import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApi from '../useApi';
import TodoItem from './TodoItem';
import SortDropdown from './SortDropdown';
import SearchFilter from './SearchFilter';
import Notification from './Notification';
import DynamicForm from './DynamicForm';
function TodosList() {
    const { userId } = useParams();
    const [sortBy, setSortBy] = useState('');
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [notification, setNotification] = useState(null);
    const [showAddTodoForm, setShowAddTodoForm] = useState(false);
    const { data: todos, getItems, deleteItem, updateItem, addItem } = useApi("todos");

    useEffect(() => {
        const params = {
            userId: userId
        };
        if (sortBy && sortBy !== 'id') {
            params._sort = sortBy;
            params._order = 'asc';
        }
        if (searchBy && searchValue) {
            params[searchBy] = searchValue;
        }
        getItems(params);
    }, [userId, sortBy, searchBy, searchValue, getItems]);

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

    const handleDelete = async (id) => {
        return await deleteItem(id);
    };

    const handleUpdate = async (id, data) => {
        return await updateItem(id, data);
    };

    const handleAdd = async (data) => {
        const result = await addItem({ ...data, userId: parseInt(userId) });
        setShowAddTodoForm(false);
        if (result?.success) {
            setNotification({ message: 'משימה נוספה בהצלחה', type: 'success' });
        } else {
            setNotification({ message: 'שגיאה בהוספת משימה', type: 'error' });
        }
    };

    return (
        <div className="container">
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            <div className="toolbar">
                <SortDropdown sortOptions={sortOptions} sortBy={sortBy} setSortBy={setSortBy} />
                <SearchFilter
                    searchOptions={searchOptions}
                    searchBy={searchBy}
                    setSearchBy={setSearchBy}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                />
                <button onClick={() => setShowAddTodoForm(!showAddTodoForm)}>➕ new todo</button>
            </div>
            {showAddTodoForm && (
                <div className="card">
                    <DynamicForm
                        fields={[{ name: 'title',placeholder: 'title', required: true }]}
                        onSubmit={handleAdd}
                    />
                </div>
            )}
            <div className="list">
                {todos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
            </div>
        </div>
    );
}
export default TodosList;