
// import { useParams } from 'react-router-dom';
// import { useState } from 'react';
// import useApi from '../useApi';

// function Todos() {
//     const { userId } = useParams();
//     const [sortBy, setSortBy] = useState('id');
//     const [searchBy, setSearchBy] = useState('');
//     const [searchValue, setSearchValue] = useState('');
//     const [url, setUrl] = useState(`http://localhost:3000/todos?userId=${userId}&_sort=${sortBy}&${searchBy}=${searchValue}`);
//     const [method, setMethod] = useState("get");
//     //const {responseData, getData, deleteData } = useApi(`http://localhost:3000/todos?userId=${userId}&_sort=${sortBy}&${searchBy}=${searchValue}`);

//     const responseData = useApi(method, url);
//     const deleteData = (id) => {
//         setUrl(`http://localhost:3000/todos/${id}`);
//         setMethod("delete");
//         setTimeout(() => {
//             setUrl(`http://localhost:3000/todos?userId=${userId}&_sort=${sortBy}&${searchBy}=${searchValue}`);
//             setMethod("get");
//         }, 100);
//     };

//     return (
//         <>
//             <h2>Todos Component</h2>
//             <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//                 <option value="id">מיון לפי ID</option>
//                 <option value="title">מיון לפי כותרת</option>
//                 <option value="completed">מיון לפי ביצוע</option>
//             </select>

//             <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
//                 <option value="">בחר קריטריון חיפוש</option>
//                 <option value="id">חיפוש לפי ID</option>
//                 <option value="title">חיפוש לפי כותרת</option>
//                 <option value="completed">חיפוש לפי מצב ביצוע</option>
//             </select>

//             <input
//                 type="text"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 placeholder="הכנס ערך לחיפוש"
//             />

//             {responseData && responseData.map(todo => (
//                 <div key={todo.id}>
//                     <p>ID: {todo.id}</p>
//                     <h3>{todo.title}</h3>
//                     <label>
//                         <input type="checkbox" checked={todo.completed} readOnly />
//                         {todo.completed ? 'הושלם' : 'לא הושלם'}
//                     </label>
//                     <button onClick={() => { deleteData(todo.id) }}>delete todo</button>
//                 </div>
//             ))}
//         </>
//     )
// }

// export default Todos;
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApi from '../useApi';

function Todos() {
    const { userId } = useParams();
    const [sortBy, setSortBy] = useState('id');
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const { data: todos, getItems, deleteItem,updateItem } = useApi("todos");
    const saveUpdate = () => {
        console.log(editingTodo)
        updateItem(editingTodo.id, {
            title: editingTodo.title,
            completed: editingTodo.completed
        });
        setEditingTodo(null);
    };

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

    return (
        <>
            <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="id">ID</option>
                <option value="title">Title</option>
                <option value="completed">Status</option>
            </select>

            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="">בחר קריטריון חיפוש</option>
                <option value="id">חיפוש לפי ID</option>
                <option value="title">חיפוש לפי כותרת</option>
                <option value="completed">חיפוש לפי מצב ביצוע</option>
            </select>

            {searchBy && < input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="הכנס ערך לחיפוש"
            />}


            {editingTodo && <div>
                <input type='text' placeholder='update title' value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}></input>
                <label>
                    <input type="checkbox" checked={editingTodo.completed}
                        onChange={(e) => setEditingTodo({ ...editingTodo, completed: e.target.checked })} />
                    completed
                </label>
                <button onClick={() => saveUpdate()}>save updating</button>
            </div>}


            {todos.map(todo => (
                <div key={todo.id}>
                    <p>ID: {todo.id}</p>
                    <span>{todo.title}</span>
                    <label>
                        <input type="checkbox" checked={todo.completed} readOnly />
                        {todo.completed ? 'completed' : 'not completed'}
                    </label>
                    <button onClick={() => deleteItem(todo.id)}>delete</button>
                    <button onClick={() => setEditingTodo(todo)}>update todo</button>

                </div>
            ))}
        </>
    );
}
export default Todos;