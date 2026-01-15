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
    const [sortBy, setSortBy] = useState('id');
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [notification, setNotification] = useState(null);
    const [showAddTodoForm, setShowAddTodoForm] = useState(false);
    const { data: todos, getItems, deleteItem, updateItem, addItem } = useApi("todos");

    useEffect(() => {
        const params = {
            userId: userId,
            _sort: sortBy
        };
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
        await deleteItem(id);
        setNotification({ message: 'משימה נמחקה בהצלחה', type: 'success' });
    };

    const handleUpdate = async (id, data) => {
        await updateItem(id, data);
        setNotification({ message: 'משימה עודכנה בהצלחה', type: 'success' });
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
                        onSubmit={(data) => {
                            addItem({ ...data, userId: parseInt(userId) });
                            setShowAddTodoForm(false);
                        }}
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