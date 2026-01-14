/**
 * Todos
 * Macro: מציג רשימת מטלות למשתמש עם אפשרויות מיון וחיפוש.
 * State:
 *  - sortBy, searchBy, searchValue
 * Side-effects:
 *  - useEffect מפעיל useApi('todos').getItems עם פרמטרים של userId/_sort
 */
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApi from '../useApi';
import TodoItem from './TodoItem';
import SortDropdown from './SortDropdown';
import SearchFilter from './SearchFilter';

function Todos() {
    const { userId } = useParams();
    const [sortBy, setSortBy] = useState('id');
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const { data: todos, getItems, deleteItem,updateItem ,addItem} = useApi("todos");

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

    return (
        <>
            <SortDropdown sortOptions={sortOptions} sortBy={sortBy} setSortBy={setSortBy} />
            <SearchFilter 
                searchOptions={searchOptions}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />

            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} onDelete={deleteItem} onUpdate={updateItem} />
            ))}
        </>
    );
}
export default Todos;